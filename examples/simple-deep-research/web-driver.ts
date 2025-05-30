import { Component } from '@astack/core';
import { chromium, Browser, Page, BrowserContext } from 'playwright';
import * as cheerio from 'cheerio';

/**
 * WebDriver 组件配置
 */
export interface WebDriverConfig {
  /**
   * 是否使用无头模式
   */
  headless?: boolean;

  /**
   * 超时时间（毫秒）
   */
  timeout?: number;

  /**
   * 浏览器类型，默认为谷歌浏览器
   */
  browser?: 'chromium' | 'firefox' | 'webkit';
}

/**
 * 搜索结果条目
 */
export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
}

/**
 * WebDriver 组件
 * 用于自动化网页浏览和数据提取
 */
export default class WebDriverComponent extends Component {
  private headless: boolean;
  private timeout: number;
  private browserType: 'chromium' | 'firefox' | 'webkit';
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  /**
   * 创建 WebDriver 组件
   */
  constructor(config: WebDriverConfig = {}) {
    super({});

    this.headless = config.headless ?? true;
    this.timeout = config.timeout ?? 10000;
    this.browserType = config.browser ?? 'chromium';

    // 初始化端口
    Component.Port.I('searchQuery').attach(this);
    Component.Port.I('url').attach(this);

    Component.Port.O('searchResults').attach(this);
    Component.Port.O('pageContent').attach(this);
  }

  /**
   * 初始化浏览器
   */
  private async initBrowser(): Promise<{ browser: Browser; context: BrowserContext; page: Page }> {
    if (!this.browser) {
      try {
        console.log(`尝试初始化 ${this.browserType} 浏览器...`);

        // 创建浏览器实例
        let browser;
        switch (this.browserType) {
          case 'firefox':
            browser = await chromium.launch({ headless: this.headless });
            break;
          case 'webkit':
            browser = await chromium.launch({ headless: this.headless });
            break;
          case 'chromium':
          default:
            browser = await chromium.launch({ headless: this.headless });
            break;
        }

        this.browser = browser;

        // 创建浏览器上下文
        const context = await this.browser.newContext({
          viewport: { width: 1280, height: 800 },
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
          // 允许 JavaScript
          javaScriptEnabled: true,
          // 设置超时选项
          timezoneId: 'Asia/Shanghai',
        });

        // 单独设置超时
        context.setDefaultTimeout(this.timeout);

        this.context = context;

        // 创建页面
        const page = await context.newPage();
        this.page = page;

        console.log('浏览器初始化成功！');

        return { browser, context, page };
      } catch (error) {
        console.error('初始化浏览器失败 :', error);
        throw new Error(`初始化浏览器失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }

    return {
      browser: this.browser,
      context: this.context!,
      page: this.page!,
    };
  }

  /**
   * 关闭浏览器
   */
  async close() {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }

    if (this.context) {
      await this.context.close();
      this.context = null;
    }

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * 组件独立运行方法
   * @param input 输入数据（可以是搜索关键词或 URL）
   * @returns 搜索结果或页面内容
   */
  async run(input: unknown): Promise<SearchResultItem[] | string> {
    // 判断输入是搜索关键词还是 URL
    if (typeof input === 'string') {
      if (input.startsWith('http')) {
        return this.fetchPageContent(input);
      } else {
        return this.searchBaidu(input);
      }
    }

    throw new Error('输入必须是字符串');
  }

  /**
   * 在流水线中运行组件
   * @param $i 输入端口映射函数
   * @param $o 输出端口映射函数
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform($i: any, $o: any) {
    console.log('初始化 WebDriver _transform 方法');
    // 确保 searchResults 端口存在
    if (!$o || typeof $o !== 'function' || !$o('searchResults')) {
      console.error('[WebDriver] searchResults 输出端口不可用');
    } else {
      console.log('[WebDriver] searchResults 输出端口可用');
    }

    // 处理搜索关键词输入
    $i('searchQuery').receive(async (searchTerm: string) => {
      console.log(`收到搜索关键词: ${searchTerm}`);
      try {
        const results = await this.searchBaidu(searchTerm);
        console.log(`[WebDriver] 准备发送 ${results.length} 条搜索结果`);

        // 检查结果格式
        console.log(
          `[WebDriver] 搜索结果类型: ${typeof results}, 是否数组: ${Array.isArray(results)}`
        );
        if (results.length > 0) {
          console.log(`[WebDriver] 第一条结果样本: ${JSON.stringify(results[0])}`);
        }

        try {
          // 确保发送的是有效的结果
          const validResults = results.map(item => ({
            title: item.title || '',
            url: item.url || '',
            snippet: item.snippet || '',
          }));

          console.log(`[WebDriver] 转换后的结果数量: ${validResults.length}`);

          // 第一种方式：直接尝试发送到 searchResults 端口
          console.log('[WebDriver] 尝试直接发送搜索结果 ...');
          try {
            // 检查端口可用性
            if (!$o || typeof $o !== 'function') {
              console.error('[WebDriver] 输出端口对象无效');
              return;
            }

            if (!$o('searchResults') || typeof $o('searchResults').send !== 'function') {
              console.error('[WebDriver] searchResults 端口无效或没有 send 方法');
              return;
            }

            console.log('[WebDriver] 尝试多次发送搜索结果，确保接收器准备就绪 ...');

            // 第一次发送
            $o('searchResults').send(validResults);
            console.log('[WebDriver] 搜索结果首次发送成功');

            // 使用延迟重试机制，确保 ContentAnalyzer 有足够时间准备订阅
            let retryCount = 0;
            const maxRetries = 3;
            const retryInterval = 500; // 毫秒

            const retryTimer = setInterval(() => {
              retryCount++;
              console.log(`[WebDriver] 重试发送搜索结果 #${retryCount}...`);
              $o('searchResults').send(validResults);

              if (retryCount >= maxRetries) {
                clearInterval(retryTimer);
                console.log('[WebDriver] 搜索结果发送完成，等待相关 URL 响应 ...');
              }
            }, retryInterval);
          } catch (sendError) {
            console.error('[WebDriver] 发送搜索结果时出错:', sendError);
          }
        } catch (error) {
          console.error('[WebDriver] 准备搜索结果时出错:', error);
        }
      } catch (error) {
        console.error('搜索处理出错:', error);
      }
    });

    // 处理 URL 输入
    const urlQueue: string[] = [];
    let isProcessingUrl = false;

    const processNextUrl = async () => {
      if (urlQueue.length === 0 || isProcessingUrl) return;

      isProcessingUrl = true;
      const url = urlQueue.shift()!;

      console.log(`处理 URL 请求: ${url}`);
      try {
        const content = await this.fetchPageContent(url);
        console.log(`成功抽取页面内容，长度: ${content.length} 字符`);

        // 创建一个包含 URL 和内容的对象发送
        const pageContentObj = {
          url,
          content,
        };

        $o('pageContent').send(pageContentObj);
        console.log(`页面内容已发送到 pageContent 端口，url=${url}`);
      } catch (error) {
        console.error(`抽取页面内容出错 (${url}):`, error);
      } finally {
        isProcessingUrl = false;
        // 处理队列中的下一个 URL
        setTimeout(processNextUrl, 100);
      }
    };

    $i('url').receive((url: string) => {
      console.log(`[WebDriver] 收到 URL 请求: ${url}, 类型: ${typeof url}`);

      if (!url || typeof url !== 'string') {
        console.error(`[WebDriver] 无效 URL: ${url}`);
        return;
      }

      // 确保 URL 是完整的
      let finalUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = `https://${url}`;
        console.log(`[WebDriver] 添加协议前缀后的 URL: ${finalUrl}`);
      }

      console.log(`[WebDriver] 将 URL 添加到队列: ${finalUrl}`);
      urlQueue.push(finalUrl);
      console.log(
        `[WebDriver] 当前队列长度: ${urlQueue.length}, 处理状态: ${isProcessingUrl ? '正在处理' : '空闲'}`
      );
      processNextUrl(); // 尝试处理队列
    });
    console.log('WebDriver _transform 方法设置完成');
  }

  /**
   * 在百度上搜索
   */
  private async searchBaidu(searchTerm: string): Promise<SearchResultItem[]> {
    const { page } = await this.initBrowser();
    try {
      console.log(`在百度搜索: ${searchTerm}`);

      // 访问百度
      await page.goto('https://www.baidu.com', { waitUntil: 'domcontentloaded' });

      // 输入搜索关键词
      await page.fill('#kw', searchTerm);

      // 点击搜索按钮
      await page.click('#su');

      // 等待搜索结果加载
      await page.waitForSelector('.result.c-container, .c-container', { timeout: this.timeout });

      // 等待一下，确保所有内容都加载完成
      await page.waitForTimeout(1000);

      // 获取页面源代码
      const pageSource = await page.content();

      // 使用 Cheerio 解析页面
      const $ = cheerio.load(pageSource);
      const results: SearchResultItem[] = [];

      // 提取搜索结果
      $('.result.c-container, .c-container').each((index, element) => {
        const titleEl = $(element).find('.t a, .c-title a, h3.c-title a');
        const urlEl = $(element).find('.c-showurl, a.c-showurl');
        let url = urlEl.text().trim();

        // 如果没有显示的 URL，尝试获取链接的 href 属性
        if (!url) {
          url = titleEl.attr('href') || '';
          // 处理百度的重定向链接
          if (
            url.startsWith('http:// www.baidu.com/link?') ||
            url.startsWith('https://www.baidu.com/link?')
          ) {
            // 实际使用时可能需要进一步处理这些链接
          }
        }

        const title = titleEl.text().trim();
        const snippet = $(element)
          .find('.c-abstract, .content-abstract, .c-abstract-content')
          .text()
          .trim();

        if (title && (url || snippet)) {
          results.push({
            title,
            url: url || '',
            snippet: snippet || '',
          });
        }
      });

      console.log(`找到 ${results.length} 条搜索结果`);
      return results;
    } catch (error) {
      console.error('搜索失败 :', error);
      throw error;
    }
  }

  /**
   * 获取网页内容
   */
  private async fetchPageContent(url: string): Promise<string> {
    // 验证 URL 格式
    if (!url || typeof url !== 'string') {
      console.error(`[WebDriver] URL 格式无效: ${url}`);
      return `[错误] URL 格式无效: ${url}`;
    }

    // 尝试验证 URL
    try {
      new URL(url);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      console.error(`[WebDriver] URL 解析失败: ${url}`);
      return `[错误] URL 解析失败: ${url}`;
    }

    try {
      // 初始化浏览器
      const { page } = await this.initBrowser();

      console.log(`[WebDriver] 开始获取页面内容: ${url}`);

      // 设置超时和异常处理
      const navigationPromise = page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: this.timeout,
      });

      // 等待页面加载
      await navigationPromise;
      await page.waitForSelector('body', { timeout: this.timeout });

      // 获取页面内容
      const html = await page.content();

      // 解析主要内容
      const $ = cheerio.load(html);

      // 移除无关内容
      $(
        'script, style, nav, footer, header, .header, .footer, .nav, .menu, .ad, .ads, .advertisement'
      ).remove();

      // 获取主要文本
      let content = $('body').text();

      // 清理文本
      content = content.replace(/\s+/g, ' ').trim();

      console.log(`[WebDriver] 页面内容获取成功: ${url}`);
      return content;
    } catch (error) {
      const errorMessage = `获取页面内容失败: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);
      // 返回错误信息而不是抛出异常，这样不会中断整个流程
      return `[错误] ${errorMessage}`;
    }
  }
}
