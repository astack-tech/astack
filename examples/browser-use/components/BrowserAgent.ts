import { Component } from '@astack-tech/core';
import { Agent, AgentConfig, AgentInput } from '@astack-tech/components';
import { chromium, Browser, Page } from 'playwright';
import {
  annotateInteractiveElements,
  removeAnnotations,
  InteractiveElement,
} from '../utils/dom-annotator';
import { createTool } from '@astack-tech/tools';
import type { ModelProvider } from '@astack-tech/components';

// 定义组件配置类型
interface BrowserAgentConfig {
  modelProvider: ModelProvider;
}

function safeGetString(obj: Record<string, unknown>, key: string): string {
  const value = obj[key];
  if (typeof value !== 'string') {
    throw new Error(`Expected ${key} to be a string, but got ${typeof value}`);
  }
  return value;
}

/**
 * 浏览器代理组件 - 处理网页自动化任务
 * 遵循 AStack 的 "一切皆组件" 原则，支持零适配层设计
 */
export class BrowserAgent extends Component {
  private agent: Agent;
  private browser: Browser | null = null;
  private page: Page | null = null;

  // 浏览器状态缓存
  private browserState: {
    currentUrl: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    domSnapshot: { interactive: InteractiveElement[]; meta: any };
    lastAction?: string;
    lastError?: string;
  } = {
    currentUrl: 'about:blank',
    domSnapshot: { interactive: [], meta: {} },
  };

  // 存储端口引用，供工具函数使用
  private outputPorts: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stateUpdate?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result?: any;
  } = {};

  constructor({ modelProvider }: BrowserAgentConfig) {
    super({});
    // 组件端口定义
    Component.Port.I('task').attach(this); // 接收任务输入
    Component.Port.I('state').attach(this); // 接收来自 BrowserStateComponent 的状态更新
    Component.Port.I('stop').attach(this); // 接收停止信号
    Component.Port.O('result').attach(this); // 输出任务执行结果
    Component.Port.O('stateUpdate').attach(this); // 向 BrowserStateComponent 发送状态更新

    // 初始化 Agent
    this.agent = new Agent({
      model: modelProvider,
      systemPrompt: this.getSystemPrompt(),
      tools: this.getBrowserTools(),
      maxIterations: 50,
    } as AgentConfig);
  }

  /**
   * 清理浏览器资源的方法
   */
  private async closeBrowser(): Promise<void> {
    console.log('[BrowserAgent] 正在关闭浏览器资源...');
    try {
      if (this.page) {
        await this.page.close().catch(e => console.error('[BrowserAgent] 关闭页面出错:', e));
        this.page = null;
      }

      if (this.browser) {
        await this.browser.close().catch(e => console.error('[BrowserAgent] 关闭浏览器出错:', e));
        this.browser = null;
      }

      console.log('[BrowserAgent] 浏览器资源已成功清理');
    } catch (error) {
      console.error('[BrowserAgent] 清理浏览器资源时出错:', error);
    }
  }

  /**
   * 初始化浏览器的方法
   */
  private async initBrowser(): Promise<void> {
    try {
      if (this.browser && this.page) {
        console.log('[BrowserAgent] 浏览器已经初始化，无需重复初始化');
        return;
      }

      console.log('[BrowserAgent] 正在初始化浏览器...');

      // 启动浏览器，优先使用无头模式以提高兼容性
      this.browser = await chromium.launch({
        headless: false, // 开发调试时可以设为 false 以查看浏览器界面
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // 添加参数提高稳定性
      });

      console.log('[BrowserAgent] 浏览器启动成功');
      this.page = await this.browser.newPage();
      console.log('[BrowserAgent] 浏览器页面创建成功');

      // 设置一些基本的浏览器选项
      await this.page.setViewportSize({ width: 1280, height: 800 });
      await this.page.setDefaultTimeout(30000); // 30 秒超时

      // 导航到一个初始页面确保浏览器正常工作
      await this.page.goto('about:blank');
      console.log('[BrowserAgent] 浏览器初始化完成');
    } catch (error) {
      console.error(
        '[BrowserAgent] 初始化浏览器失败:',
        error instanceof Error ? error.message : String(error)
      );
      throw new Error('浏览器初始化失败');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform($i: any, $o: any) {
    // 保存端口引用，供工具函数使用
    this.outputPorts = {
      stateUpdate: $o('stateUpdate'),
      result: $o('result'),
    };

    // 接收浏览器状态组件的状态更新
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $i('state').receive((state: any) => {
      console.log('[BrowserAgent] 收到浏览器状态更新');
      if (state && typeof state === 'object') {
        const oldUrl = this.browserState.currentUrl;
        const oldDomSize = JSON.stringify(this.browserState.domSnapshot).length;

        // 更新本地缓存
        this.browserState = {
          ...this.browserState,
          ...state,
        };

        console.log(`[BrowserAgent] 状态更新详情:`);
        console.log(`  - URL: ${oldUrl} => ${state.currentUrl || 'N/A'}`);
        console.log(
          `  - DOM 快照: ${oldDomSize} => ${JSON.stringify(state.domSnapshot).length} 字符`
        );
        if (state.lastAction) console.log(`  - 最后动作: ${state.lastAction}`);
        if (state.lastError) console.log(`  - 错误: ${state.lastError}`);
      }
    });

    // 处理停止信号
    $i('stop').receive(async () => {
      console.log('[BrowserAgent] 收到停止信号，正在清理资源...');
      await this.closeBrowser();
      console.log('[BrowserAgent] 停止处理完成');
    });

    // 处理任务输入
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $i('task').receive(async (taskInput: any) => {
      try {
        // 确保任务输入是字符串格式
        const task =
          typeof taskInput === 'object' && taskInput.raw
            ? taskInput.raw // 如果是对象且有 raw 属性，使用 raw 字段的值
            : String(taskInput); // 否则尝试转换为字符串

        // 如果浏览器尚未初始化，先初始化
        if (!this.browser || !this.page) {
          console.log('[BrowserAgent] 浏览器未初始化，正在初始化...');
          await this.initBrowser();
          // 初始化后更新状态
          if (this.page) {
            await this.updateBrowserState();
          }
        }

        // 输出浏览器状态缓存的当前情况
        console.log(`[BrowserAgent] 当前本地缓存状态:`);
        console.log(`  - 缓存 URL: ${this.browserState.currentUrl || 'none'}`);
        console.log(
          `  - 缓存 DOM 快照: ${JSON.stringify(this.browserState.domSnapshot).length} 字符`
        );

        // 预处理任务所需的状态变量
        let currentUrl = this.browserState.currentUrl;
        let domSnapshot = this.browserState.domSnapshot;

        // 如果状态不完整，尝试实时获取
        let needRefresh = false;

        if (!currentUrl || currentUrl === 'about:blank') {
          if (this.page) {
            currentUrl = (await this.page.url()) || 'about:blank';
            console.log(`[BrowserAgent] 实时获取当前 URL: ${currentUrl}`);
            needRefresh = true;
          }
        }

        if (JSON.stringify(domSnapshot).length < 10) {
          // 如果 DOM 快照为空或很小
          if (this.page) {
            domSnapshot = await this.captureDomSnapshot();
            console.log(
              `[BrowserAgent] 实时获取 DOM 快照: ${JSON.stringify(domSnapshot).length} 字符`
            );
            needRefresh = true;
          }
        }

        // 如果需要刷新状态，则更新本地缓存
        if (needRefresh) {
          this.browserState.currentUrl = currentUrl;
          this.browserState.domSnapshot = domSnapshot;
          // 将新状态发送给状态组件
          $o('stateUpdate').send(this.browserState);
          console.log(`[BrowserAgent] 已刷新并发送状态更新`);
        }

        console.log(`[BrowserAgent] 执行任务，使用上下文:`);
        console.log(`  - URL: ${currentUrl}`);
        console.log(`  - DOM 快照: ${JSON.stringify(domSnapshot).length} 字符`);
        console.log(`  - 最后动作: ${this.browserState.lastAction || 'none'}`);
        console.log(`  - 最后错误: ${this.browserState.lastError || 'none'}`);

        // 确保使用最新的浏览器状态创建消息
        // 如果无法获取实时状态，使用本地缓存状态
        const metadata = {
          currentUrl: this.browserState.currentUrl,
          domSnapshot: this.browserState.domSnapshot,
          lastAction: this.browserState.lastAction,
          lastError: this.browserState.lastError,
        };

        console.log(`[BrowserAgent] 执行任务: ${task}`);
        console.log(`[BrowserAgent] 当前 URL: ${metadata.currentUrl}`);
        console.log(
          `[BrowserAgent] DOM 快照大小: ${JSON.stringify(metadata.domSnapshot).length} 字节`
        );

        // 重要：不要保存初始 input 对象的引用，每次都创建新的对象
        // 这样可以避免因为闭包缓存而使用旧的 metadata

        // 创建 Agent 输入
        const input: AgentInput = {
          messages: [
            {
              role: 'user',
              content: task,
              metadata, // 确保使用最新状态
            },
          ],
          // 同时保留 context 字段以兼容 Agent 的内部实现
          context: metadata,
        };

        // 调用 Agent
        try {
          // 注意：每次调用 agent.run 都会重置 Agent 的内部状态
          const result = await this.agent.run(input);

          // 任务完成后更新浏览器状态
          await this.updateBrowserState();

          // 将结果发送到输出端口
          $o('result').send({
            success: true,
            currentUrl,
            domSnapshot: JSON.stringify(domSnapshot), // 序列化为字符串以兼容原有接口
            interactiveElements: domSnapshot.interactive, // 新增字段，直接提供结构化数据
            pageMeta: domSnapshot.meta, // 新增字段，提供页面元数据
            lastAction: this.browserState.lastAction,
            ...result,
          });
        } catch (error) {
          console.error(`[BrowserAgent] 执行任务失败:`, error);
          $o('result').send({
            success: false,
            currentUrl,
            domSnapshot: JSON.stringify(domSnapshot), // 序列化为字符串以兼容原有接口
            interactiveElements: domSnapshot.interactive, // 新增字段
            pageMeta: domSnapshot.meta, // 新增字段
            lastAction: this.browserState.lastAction,
            lastError: error instanceof Error ? error.message : String(error),
          });
        }

        // 发送状态更新到 BrowserStateComponent
        $o('stateUpdate').send(this.browserState);
        console.log(`[BrowserAgent] 已发送状态更新`);
      } catch (error: unknown) {
        $o('result').send({ error: error instanceof Error ? error.message : String(error) });
      }
    });
  }

  /**
   * 捕获当前页面的交互元素和元数据
   * 这种方法比完整 DOM 快照更轻量级且信息更聚焦
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async captureDomSnapshot(): Promise<{ interactive: InteractiveElement[]; meta: any }> {
    try {
      if (!this.page) {
        console.warn('[BrowserAgent] 尝试捕获页面数据，但页面未初始化');
        return { interactive: [], meta: { title: '', url: '' } };
      }

      // 等待页面加载完成，提高捕获质量
      await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
        console.log('[BrowserAgent] 等待页面加载超时，继续捕获');
      });

      // 捕获页面基本元数据
      const meta = await this.page.evaluate(() => ({
        title: document.title,
        url: window.location.href,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        // 可选：捕获页面主要文本内容，限制大小
        mainText: document.body.innerText.substring(0, 1000),
      }));

      // 捕获交互元素
      console.log('[BrowserAgent] 捕获交互元素...');
      const interactiveElements = await annotateInteractiveElements(this.page);

      // 移除标注（避免对页面产生视觉干扰）
      await removeAnnotations(this.page);

      // 记录捕获信息以便调试
      console.log(`[BrowserAgent] 捕获了 ${interactiveElements.length} 个交互元素`);
      console.log(`[BrowserAgent] 页面标题: ${meta.title}`);

      return { interactive: interactiveElements, meta };
    } catch (error) {
      console.error('[BrowserAgent] 捕获页面数据失败:', error);
      return { interactive: [], meta: { error: String(error) } };
    }
  }

  /**
   * 更新浏览器状态到本地缓存
   * 注意：此方法只更新本地状态，不发送到状态组件
   * 发送状态更新需要在 _transform 中使用 $o 或在工具函数中使用 Component.Port
   */
  private async updateBrowserState(): Promise<void> {
    if (!this.page) {
      console.warn('[BrowserAgent] 尝试更新状态，但浏览器未初始化');
      return;
    }

    try {
      // 获取当前 URL 和 DOM 快照
      const currentUrl = await this.page.url();
      const domSnapshot = await this.captureDomSnapshot();

      // 构建状态更新
      const stateUpdate = {
        currentUrl,
        domSnapshot,
        lastAction: this.browserState.lastAction,
        lastError: this.browserState.lastError,
      };

      // 更新本地缓存
      this.browserState = stateUpdate;

      // 注意: 由于 _transform 中的 $o 范围限制，这里不直接发送状态更新
      // 状态更新将通过 Tool 的执行过程间接发送
      console.log(
        `[BrowserAgent] 更新浏览器状态: URL=${currentUrl}, DOM 快照=${JSON.stringify(domSnapshot).length} 字符`
      );
      // 由于我们在工具函数内进行状态更新发送，这里不需要处理 $o 的问题
    } catch (error) {
      console.error('[BrowserAgent] 更新状态失败:', error);
    }
  }

  // 浏览器操作工具集
  private getBrowserTools() {
    return [
      createTool(
        'navigate',
        'Navigate to a specific URL',
        async (args: Record<string, unknown>) => {
          if (!this.page) throw new Error('Browser not initialized');
          const url = safeGetString(args, 'url');

          // 记录动作
          this.browserState.lastAction = `导航到 ${url}`;
          this.browserState.lastError = '';
          console.log(`[BrowserAgent] 执行导航: ${url}`);

          try {
            // 再次检查 page 是否存在
            if (!this.page) throw new Error('Browser not initialized');
            await this.page.goto(url, { waitUntil: 'networkidle' });

            // 更新状态
            await this.updateBrowserState();

            // 记录当前工具作为最后一次操作
            this.browserState.lastAction = `导航到 ${url} (成功)`;

            // 通过保存的端口引用发送状态更新
            // 这将触发状态组件的广播，并最终返回到 BrowserAgent
            if (this.outputPorts && this.outputPorts.stateUpdate) {
              this.outputPorts.stateUpdate.send(this.browserState);
              console.log(`[BrowserAgent] 工具已发送状态更新`);
            } else {
              console.warn(`[BrowserAgent] 缺少 stateUpdate 端口引用，无法发送状态更新`);
            }

            return `Successfully navigated to ${url}`;
          } catch (error) {
            // 记录错误
            this.browserState.lastError = `导航失败: ${error instanceof Error ? error.message : String(error)}`;
            console.error(`[BrowserAgent] ${this.browserState.lastError}`);
            throw error;
          }
        },
        {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'The URL to navigate to',
            },
          },
          required: ['url'],
        }
      ),
      createTool(
        'click',
        'Click on an element identified by selector',
        async (args: Record<string, unknown>) => {
          if (!this.page) throw new Error('Browser not initialized');
          const selector = safeGetString(args, 'selector');

          try {
            // 确保 this.page 不为 null（虽然已经在函数开头检查过，但 TypeScript 仍然可能报错）
            const page = this.page;
            if (!page) throw new Error('Browser not initialized');

            // 记录动作
            this.browserState.lastAction = `点击元素 ${selector}`;
            this.browserState.lastError = '';
            console.log(`[BrowserAgent] 执行点击: ${selector}`);

            // Try as CSS selector
            await page.click(selector).catch(async () => {
              // Try as text content
              await page
                .getByText(selector)
                .click()
                .catch(async () => {
                  // Try as XPath
                  if (selector.startsWith('//')) {
                    await page.click(`xpath=${selector}`);
                  } else {
                    throw new Error(`Could not find element: ${selector}`);
                  }
                });
            });

            // 等待页面稳定并更新状态
            await page.waitForTimeout(500); // 等待 500ms 让页面响应
            await this.updateBrowserState();

            // 记录当前工具作为最后一次操作
            this.browserState.lastAction = `点击 ${selector} (成功)`;

            // 通过保存的端口引用发送状态更新
            if (this.outputPorts && this.outputPorts.stateUpdate) {
              this.outputPorts.stateUpdate.send(this.browserState);
              console.log(`[BrowserAgent] 工具已发送状态更新`);
            }

            return `Successfully clicked on ${selector}`;
          } catch (error: unknown) {
            throw new Error(
              `Failed to click: ${error instanceof Error ? error.message : String(error)}`
            );
          }
        },
        {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector, XPath or text content of the element',
            },
          },
          required: ['selector'],
        }
      ),
      createTool(
        'type',
        'Type text into an input field',
        async (args: Record<string, unknown>) => {
          if (!this.page) throw new Error('Browser not initialized');
          const selector = safeGetString(args, 'selector');
          const text = safeGetString(args, 'text');

          // 记录动作
          this.browserState.lastAction = `在 ${selector} 中输入文本`;
          this.browserState.lastError = '';
          console.log(`[BrowserAgent] 执行输入: 在 ${selector} 中输入 "${text}"`);

          try {
            await this.page.fill(selector, text);

            // 更新状态
            await this.updateBrowserState();

            // 记录当前工具作为最后一次操作
            this.browserState.lastAction = `在 ${selector} 中输入文本 (成功)`;

            // 通过保存的端口引用发送状态更新
            if (this.outputPorts && this.outputPorts.stateUpdate) {
              this.outputPorts.stateUpdate.send(this.browserState);
              console.log(`[BrowserAgent] 工具已发送状态更新`);
            }

            return `Successfully typed text into ${selector}`;
          } catch (error) {
            // 记录错误
            this.browserState.lastError = `输入失败: ${error instanceof Error ? error.message : String(error)}`;
            console.error(`[BrowserAgent] ${this.browserState.lastError}`);
            throw error;
          }
        },
        {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector of the input field',
            },
            text: {
              type: 'string',
              description: 'Text to type into the field',
            },
          },
          required: ['selector', 'text'],
        }
      ),
      createTool(
        'extract',
        'Extract data from the current page using a selector',
        async (args: Record<string, unknown>) => {
          if (!this.page) throw new Error('Browser not initialized');
          const selector = safeGetString(args, 'selector');

          // 记录动作
          this.browserState.lastAction = `提取 ${selector} 元素数据`;
          this.browserState.lastError = '';
          console.log(`[BrowserAgent] 执行数据提取: ${selector}`);

          try {
            const data = await this.page.$$eval(selector, (elements: Element[]) =>
              elements.map((el: Element) => ({
                text: el.textContent?.trim() || '',
                html: (el as HTMLElement).innerHTML,
                attributes: Object.fromEntries(
                  Array.from(el.attributes).map((attr: Attr) => [attr.name, attr.value])
                ),
              }))
            );

            console.log(`[BrowserAgent] 提取到 ${data.length} 个元素`);

            // 记录提取操作，不需要更新页面状态，但需要记录最后操作
            this.browserState.lastAction = `提取 ${selector} 元素数据`;

            // 通过保存的端口引用发送状态更新
            if (this.outputPorts && this.outputPorts.stateUpdate) {
              this.outputPorts.stateUpdate.send(this.browserState);
              console.log(`[BrowserAgent] 工具已发送状态更新`);
            }

            return JSON.stringify(data);
          } catch (error: unknown) {
            // 记录错误
            this.browserState.lastError = `数据提取失败: ${error instanceof Error ? error.message : String(error)}`;
            console.error(`[BrowserAgent] ${this.browserState.lastError}`);
            throw error;
          }
        },
        {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector of elements to extract',
            },
          },
          required: ['selector'],
        }
      ),
      createTool(
        'screenshot',
        'Take a screenshot of the current page',
        async () => {
          if (!this.page) throw new Error('Browser not initialized');

          // 记录动作
          this.browserState.lastAction = '截取页面截图';
          this.browserState.lastError = '';
          console.log('[BrowserAgent] 执行截图');

          try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const buffer = await this.page.screenshot({ path: './screenshot.png' });

            // 记录截图操作，不需要更新页面状态，但需要记录最后操作
            this.browserState.lastAction = '截取页面截图 (成功)';

            // 通过保存的端口引用发送状态更新
            if (this.outputPorts && this.outputPorts.stateUpdate) {
              this.outputPorts.stateUpdate.send(this.browserState);
              console.log(`[BrowserAgent] 工具已发送状态更新`);
            }

            return 'Screenshot taken and saved as screenshot.png';
          } catch (error) {
            // 记录错误
            this.browserState.lastError = `截图失败: ${error instanceof Error ? error.message : String(error)}`;
            console.error(`[BrowserAgent] ${this.browserState.lastError}`);
            throw error;
          }
        },
        {
          type: 'object',
          properties: {},
          required: [],
        }
      ),
      createTool(
        'press',
        'Press a key or key combination on the keyboard',
        async (args: Record<string, unknown>) => {
          if (!this.page) throw new Error('Browser not initialized');
          const key = safeGetString(args, 'key');

          // 记录动作
          this.browserState.lastAction = `按键 ${key}`;
          this.browserState.lastError = '';
          console.log(`[BrowserAgent] 执行按键: ${key}`);

          try {
            await this.page.keyboard.press(key);

            // 等待页面响应并更新状态
            await this.page.waitForTimeout(300);
            await this.updateBrowserState();

            // 更新操作状态
            this.browserState.lastAction = `按键 ${key} (成功)`;

            // 发送状态更新
            if (this.outputPorts && this.outputPorts.stateUpdate) {
              this.outputPorts.stateUpdate.send(this.browserState);
            }

            return `Successfully pressed key: ${key}`;
          } catch (error) {
            this.browserState.lastError = `按键失败: ${error instanceof Error ? error.message : String(error)}`;
            console.error(`[BrowserAgent] ${this.browserState.lastError}`);
            throw error;
          }
        },
        {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description:
                'Key or key combination to press (e.g., "Enter", "ArrowDown", "Control+c")',
            },
          },
          required: ['key'],
        }
      ),
      createTool(
        'hover',
        'Hover the mouse over an element',
        async (args: Record<string, unknown>) => {
          if (!this.page) throw new Error('Browser not initialized');
          const selector = safeGetString(args, 'selector');

          // 记录动作
          this.browserState.lastAction = `鼠标悬停在 ${selector} 上`;
          this.browserState.lastError = '';
          console.log(`[BrowserAgent] 执行鼠标悬停: ${selector}`);

          try {
            await this.page.hover(selector);

            // 等待页面响应并更新状态
            await this.page.waitForTimeout(300);
            await this.updateBrowserState();

            // 更新操作状态
            this.browserState.lastAction = `鼠标悬停在 ${selector} 上 (成功)`;

            // 发送状态更新
            if (this.outputPorts && this.outputPorts.stateUpdate) {
              this.outputPorts.stateUpdate.send(this.browserState);
            }

            return `Successfully hovered over: ${selector}`;
          } catch (error) {
            this.browserState.lastError = `鼠标悬停失败: ${error instanceof Error ? error.message : String(error)}`;
            console.error(`[BrowserAgent] ${this.browserState.lastError}`);
            throw error;
          }
        },
        {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector of the element to hover over',
            },
          },
          required: ['selector'],
        }
      ),
      createTool(
        'scroll',
        'Scroll the page vertically or to a specific element',
        async (args: Record<string, unknown>) => {
          if (!this.page) throw new Error('Browser not initialized');
          const selector = args.selector as string | undefined;
          const pixels = args.pixels as number | undefined;

          // 记录动作
          const actionDesc = selector ? `滚动到元素 ${selector}` : `滚动 ${pixels} 像素`;
          this.browserState.lastAction = actionDesc;
          this.browserState.lastError = '';
          console.log(`[BrowserAgent] 执行${actionDesc}`);

          try {
            if (selector) {
              // 滚动到指定元素
              await this.page.evaluate(sel => {
                const element = document.querySelector(sel);
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                else throw new Error(`Element not found: ${sel}`);
              }, selector);
            } else if (pixels !== undefined) {
              // 滚动指定像素
              await this.page.evaluate(px => {
                window.scrollBy({ top: px, behavior: 'smooth' });
              }, pixels);
            } else {
              throw new Error('Either selector or pixels must be provided');
            }

            // 等待页面响应并更新状态
            await this.page.waitForTimeout(500);
            await this.updateBrowserState();

            // 更新操作状态
            this.browserState.lastAction = `${actionDesc} (成功)`;

            // 发送状态更新
            if (this.outputPorts && this.outputPorts.stateUpdate) {
              this.outputPorts.stateUpdate.send(this.browserState);
            }

            return `Successfully scrolled ${selector ? 'to element: ' + selector : pixels + ' pixels'}`;
          } catch (error) {
            this.browserState.lastError = `滚动失败: ${error instanceof Error ? error.message : String(error)}`;
            console.error(`[BrowserAgent] ${this.browserState.lastError}`);
            throw error;
          }
        },
        {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector of the element to scroll to',
            },
            pixels: {
              type: 'number',
              description:
                'Number of pixels to scroll vertically (positive for down, negative for up)',
            },
          },
        }
      ),
      createTool(
        'selectOption',
        'Select an option from a dropdown menu',
        async (args: Record<string, unknown>) => {
          if (!this.page) throw new Error('Browser not initialized');
          const selector = safeGetString(args, 'selector');
          const value = args.value as string | undefined;
          const label = args.label as string | undefined;
          const index = args.index as number | undefined;

          if (!value && !label && index === undefined) {
            throw new Error('One of value, label, or index must be provided');
          }

          // 记录动作
          let actionDesc = `在 ${selector} 中选择选项`;
          if (value) actionDesc += ` (值=${value})`;
          if (label) actionDesc += ` (标签=${label})`;
          if (index !== undefined) actionDesc += ` (索引=${index})`;

          this.browserState.lastAction = actionDesc;
          this.browserState.lastError = '';
          console.log(`[BrowserAgent] ${actionDesc}`);

          try {
            // 执行选择操作
            if (value) {
              await this.page.selectOption(selector, { value });
            } else if (label) {
              await this.page.selectOption(selector, { label });
            } else if (index !== undefined) {
              await this.page.selectOption(selector, { index });
            }

            // 等待页面响应并更新状态
            await this.page.waitForTimeout(300);
            await this.updateBrowserState();

            // 更新操作状态
            this.browserState.lastAction = `${actionDesc} (成功)`;

            // 发送状态更新
            if (this.outputPorts && this.outputPorts.stateUpdate) {
              this.outputPorts.stateUpdate.send(this.browserState);
            }

            return `Successfully selected option in ${selector}`;
          } catch (error) {
            this.browserState.lastError = `选择选项失败: ${error instanceof Error ? error.message : String(error)}`;
            console.error(`[BrowserAgent] ${this.browserState.lastError}`);
            throw error;
          }
        },
        {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector of the select element',
            },
            value: {
              type: 'string',
              description: 'Value attribute of the option to select',
            },
            label: {
              type: 'string',
              description: 'Text content of the option to select',
            },
            index: {
              type: 'number',
              description: 'Index of the option to select (0-based)',
            },
          },
          required: ['selector'],
        }
      ),
      createTool(
        'waitForSelector',
        'Wait for an element to appear on the page',
        async (args: Record<string, unknown>) => {
          if (!this.page) throw new Error('Browser not initialized');
          const selector = safeGetString(args, 'selector');
          const timeout = (args.timeout as number) || 30000; // 默认 30 秒超时

          // 记录动作
          this.browserState.lastAction = `等待元素 ${selector} 出现`;
          this.browserState.lastError = '';
          console.log(`[BrowserAgent] 等待元素: ${selector}`);

          try {
            await this.page.waitForSelector(selector, { timeout });

            // 更新操作状态
            this.browserState.lastAction = `等待元素 ${selector} 出现 (成功)`;

            // 更新状态
            await this.updateBrowserState();

            // 发送状态更新
            if (this.outputPorts && this.outputPorts.stateUpdate) {
              this.outputPorts.stateUpdate.send(this.browserState);
            }

            return `Successfully waited for element: ${selector}`;
          } catch (error) {
            this.browserState.lastError = `等待元素失败: ${error instanceof Error ? error.message : String(error)}`;
            console.error(`[BrowserAgent] ${this.browserState.lastError}`);
            throw error;
          }
        },
        {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector of the element to wait for',
            },
            timeout: {
              type: 'number',
              description: 'Maximum time to wait in milliseconds (default: 30000)',
            },
          },
          required: ['selector'],
        }
      ),
      createTool(
        'annotateElements',
        'Analyze, highlight and return all interactive elements on the page',
        async (args: Record<string, unknown>) => {
          if (!this.page) throw new Error('Browser not initialized');
          // 显示标注模式状态 - 可选参数
          const showAnnotations = args.showAnnotations === false ? false : true;

          // 记录动作
          this.browserState.lastAction = '分析和标注页面交互元素';
          this.browserState.lastError = '';
          console.log(`[BrowserAgent] 执行元素分析与标注，显示标注: ${showAnnotations}`);

          try {
            // 使用 DOM 标注工具分析交互元素
            const interactiveElements = await annotateInteractiveElements(this.page);

            // 如果不需要显示标注，则移除它们
            if (!showAnnotations) {
              await removeAnnotations(this.page);
            }

            // 构建简洁的结构化结果
            const result = interactiveElements.map(el => ({
              id: el.id,
              tagName: el.tagName,
              type: el.type || el.tagName,
              text: el.text,
              interactionType: el.interactionType,
              rect: el.rect,
              xpath: el.xpath,
              cssSelector: el.cssSelector,
              visible: el.visible,
              enabled: el.enabled,
              // 只保留有值的属性
              ...(el.placeholder ? { placeholder: el.placeholder } : {}),
              ...(el.value ? { value: el.value } : {}),
              ...(el.name ? { name: el.name } : {}),
              ...(el.role ? { role: el.role } : {}),
            }));

            // 按类型分组的统计信息
            const stats = {
              total: result.length,
              byType: {} as Record<string, number>,
              byInteractionType: {} as Record<string, number>,
            };

            // 统计各类型元素
            result.forEach(el => {
              // 按元素类型统计
              if (!stats.byType[el.type]) stats.byType[el.type] = 0;
              stats.byType[el.type]++;

              // 按交互类型统计
              el.interactionType.forEach(type => {
                if (!stats.byInteractionType[type]) stats.byInteractionType[type] = 0;
                stats.byInteractionType[type]++;
              });
            });

            // 发送状态更新，包含交互元素分析结果
            this.browserState.lastAction = `分析并标注了 ${result.length} 个交互元素 (成功)`;
            if (this.outputPorts && this.outputPorts.stateUpdate) {
              this.outputPorts.stateUpdate.send(this.browserState);
            }

            // 返回结构化的元素信息和统计数据
            return {
              message: `Found ${result.length} interactive elements on the page`,
              elements: result,
              stats: stats,
              annotationsVisible: showAnnotations,
            };
          } catch (error) {
            this.browserState.lastError = `元素分析标注失败: ${error instanceof Error ? error.message : String(error)}`;
            console.error(`[BrowserAgent] ${this.browserState.lastError}`);
            throw error;
          }
        },
        {
          type: 'object',
          properties: {
            showAnnotations: {
              type: 'boolean',
              description: 'Whether to keep visual annotations visible on the page (default: true)',
            },
          },
          required: [],
        }
      ),
    ];
  }

  /**
   * 获取 Agent 系统提示词
   */
  private getSystemPrompt() {
    return `You are a browser automation assistant that helps users interact with web pages.

When presented with a task and current DOM state, you should:
1. Understand what the user wants to achieve on the webpage
2. Analyze the current DOM structure to identify relevant elements
3. Choose the appropriate browser tools to accomplish the task
4. Execute the tools in a logical sequence
5. Extract and format the requested information

Available tools:
- navigate(url): Load a new web page
- click(selector): Click on an element matching the selector or containing text
- type(selector, text): Type text into an input field
- extract(selector): Extract data from elements matching the selector
- screenshot(): Take a screenshot of the current page
- press(key): Press a key or key combination on the keyboard (e.g., "Enter", "ArrowDown", "Control+c")
- hover(selector): Hover the mouse over an element
- scroll(selector|pixels): Scroll to an element or by a specific number of pixels
- selectOption(selector, value|label|index): Select an option from a dropdown menu
- waitForSelector(selector, timeout): Wait for an element to appear on the page
- annotateElements(showAnnotations?): Analyze and visually highlight all interactive elements on the page, and return their structured details including position, xpath, and selectors

Element identification best practices:
1. Always start with annotateElements() when exploring a new page to identify all interactive elements
2. Use the returned element data (especially xpath and cssSelector) for precise targeting
3. Look for elements with appropriate interaction types (click, type, select) based on your task
4. Pay attention to the visual position (rect) of elements to understand page layout
5. Use the visual annotations to confirm the correct elements are being targeted

When analyzing the DOM, look for:
- Semantic elements and their hierarchy
- Form inputs and their labels
- Navigation elements
- Main content blocks
- Relevant data tables or structured information
- Interactive elements that may require hovering or keyboard input
- Dynamic content that may need waiting for appearance

Provide clear, step-by-step explanations of your actions and reasoning.`;
  }
}
