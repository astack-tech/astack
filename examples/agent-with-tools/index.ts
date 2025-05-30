import { Pipeline, Component } from '@astack/core';
import { Agent, type AgentOutput } from '@astack/components';
import { createTool } from '@astack/tools';
import { Deepseek } from '@astack/integrations/model-provider';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Agent 与工具集成示例
 *
 * 这个示例展示了如何直接使用 Agent 组件与工具和模型提供者
 * 展示了两种运行模式：独立运行和流水线运行。
 */
async function main() {
  // 检查环境变量
  const apiKey = process.env.DEEPSEEK_API_KEY || '';
  if (!apiKey) {
    console.error('请设置 DEEPSEEK_API_KEY 环境变量');
    process.exit(1);
  }

  console.log('创建工具...');

  // 创建文件读取工具
  const readFileTool = createTool(
    'readFile',
    '读取指定路径的文件内容',
    async (args: Record<string, unknown>) => {
      const { filePath } = args as { filePath: string };
      console.log(`[文件读取工具] 读取文件: ${filePath}`);

      try {
        // 确保路径安全
        if (!filePath || filePath.includes('..')) {
          throw new Error('非法文件路径');
        }

        // 构建相对路径，限制在示例目录内
        const basePath = process.cwd();
        const fullPath = path.resolve(basePath, filePath);

        // 读取文件
        if (!fs.existsSync(fullPath)) {
          return `错误: 文件 ${filePath} 不存在`;
        }

        const content = fs.readFileSync(fullPath, 'utf-8');
        return content;
      } catch (error) {
        return `读取文件错误: ${error instanceof Error ? error.message : String(error)}`;
      }
    },
    {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: '需要读取的文件路径，相对于当前目录' },
      },
      required: ['filePath'],
    }
  );

  // 创建文件写入工具
  const writeFileTool = createTool(
    'writeFile',
    '将内容写入指定路径的文件',
    async (args: Record<string, unknown>) => {
      const { filePath, content } = args as { filePath: string; content: string };
      console.log(`[文件写入工具] 写入文件: ${filePath}`);

      try {
        // 确保路径安全
        if (!filePath || filePath.includes('..')) {
          throw new Error('非法文件路径');
        }

        // 构建相对路径，限制在示例目录内
        const basePath = process.cwd();
        const fullPath = path.resolve(basePath, filePath);

        // 确保目录存在
        const dir = path.dirname(fullPath);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // 写入文件
        fs.writeFileSync(fullPath, content, 'utf-8');
        return `成功写入文件 ${filePath}, 内容长度: ${content.length} 字符`;
      } catch (error) {
        return `写入文件错误: ${error instanceof Error ? error.message : String(error)}`;
      }
    },
    {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: '需要写入的文件路径，相对于当前目录' },
        content: { type: 'string', description: '需要写入的文件内容' },
      },
      required: ['filePath', 'content'],
    }
  );

  console.log('创建 Deepseek 模型提供者...');

  // 创建 Deepseek 模型提供者
  const deepseek = new Deepseek({
    apiKey,
    model: 'deepseek-chat',
    temperature: 0.7,
  });

  console.log('创建 Agent 组件...');

  // 创建 Agent 组件
  const agent = new Agent({
    // 模型提供者
    model: deepseek,

    // 工具列表
    tools: [readFileTool, writeFileTool],

    // 系统提示消息
    systemPrompt: `你是一个代码助手，能够帮助用户读取和修改文件。
当你需要使用工具时，请提供详细的工具调用参数。
文件路径总是相对于当前目录。`,

    // 开启详细日志
    verbose: true,

    // 最大迭代次数
    maxIterations: 5,
  });

  // 准备测试文件
  const testFilePath = './test-data.txt';
  fs.writeFileSync(
    testFilePath,
    '这是测试文件的原始内容\n包含多行文本\n可以用于测试文件操作工具',
    'utf-8'
  );

  const userRequest =
    '请先读取 test-data.txt 文件的内容，然后创建一个新的文件 output.txt，在其中写入原文件的内容，但将每行开头加上行号和时间戳。';
  console.log('用户请求:', userRequest);
  console.log('Agent 开始处理请求...');

  try {
    // 独立运行
    console.log('Agent 开始处理请求...');
    const result = await agent.run(userRequest);

    // 输出结果
    displayResult(result);

    // 创建结果处理组件
    class ResultHandler extends Component {
      constructor() {
        super({});
        // 添加输入端口
        Component.Port.I('in').attach(this);
      }

      /**
       * 实现流水线转换函数
       * @param $i 输入端口映射
       * @param $o 输出端口映射
       */
      _transform(
        $i: (portName: string) => { receive: (callback: (data: AgentOutput) => void) => void },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        $o: unknown
      ): void {
        $i('in').receive((result: AgentOutput) => {
          console.log('\n流水线处理结果:');
          displayResult(result);
        });
      }
    }

    console.log('\n===== 流水线运行模式 =====');
    console.log('流水线开始处理请求...');

    // 流水线运行前确保测试文件存在
    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(
        testFilePath,
        '这是测试文件的原始内容\n包含多行文本\n可以用于测试文件操作工具',
        'utf-8'
      );
    }

    // 创建流水线
    const pipeline = new Pipeline();

    // 添加组件
    pipeline.addComponent('agent', agent);
    pipeline.addComponent('resultHandler', new ResultHandler());

    // 连接组件
    pipeline.connect('agent.out', 'resultHandler.in');

    // 运行流水线
    await pipeline.run('agent.in', userRequest);
  } catch (error) {
    console.error('执行过程中出错:', error instanceof Error ? error.message : String(error));
  }
}

/**
 * 显示 Agent 输出结果
 */
function displayResult(result: AgentOutput): void {
  console.log('\n处理结果:');
  console.log('最终回复:', result.message);

  if (result.toolCalls && result.toolCalls.length > 0) {
    console.log('\n工具调用记录:');
    result.toolCalls.forEach((call, index) => {
      console.log(`${index + 1}. ${call.tool}(${JSON.stringify(call.args)})`);
      console.log(`   结果: ${JSON.stringify(call.result)}`);
    });
  }
}

// 运行主函数
main().catch(error => {
  console.error('程序执行错误:', error);
});
