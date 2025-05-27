import { Pipeline, Component } from '@astack/core';
import { 
  Agent,
  type AgentOutput
} from '@astack/components';
import { 
  createTool
} from '@astack/tools';
import { 
  Deepseek
} from '@astack/integrations/model-provider';

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
  
  // 创建搜索工具
  const searchTool = createTool(
    'search',
    '搜索互联网上的信息',
    async (args: Record<string, any>) => {
      const { query } = args;
      console.log(`[搜索工具] 搜索查询: ${query}`);
      
      // 模拟搜索结果
      return [
        `搜索结果 1: 关于 "${query}" 的信息`,
        `搜索结果 2: 更多关于 "${query}" 的信息`,
        `搜索结果 3: "${query}" 的详细说明`
      ];
    },
    {
      type: 'object',
      properties: {
        query: { type: 'string', description: '搜索查询内容' }
      },
      required: ['query']
    }
  );
  
  // 创建计算器工具
  const calculatorTool = createTool(
    'calculator',
    '执行数学计算',
    async (args: Record<string, any>) => {
      const { expression } = args;
      console.log(`[计算器工具] 计算表达式: ${expression}`);
      
      // 安全检查
      if (!/^[\d\s\+\-\*\/\^\(\)\.]+$/.test(expression)) {
        throw new Error('非法表达式，只允许基本数学运算');
      }
      
      try {
        // 将 ^ 转换为 ** 进行幂运算
        const processedExpr = expression.replace(/\^/g, '**');
        // 使用 eval 计算结果
        const result = eval(processedExpr);
        return result;
      } catch (error: any) {
        throw new Error(`计算错误: ${error.message}`);
      }
    },
    {
      type: 'object',
      properties: {
        expression: { type: 'string', description: '数学表达式，如 "2 + 2" 或 "(3 + 4) * 5"' }
      },
      required: ['expression']
    }
  );
  
  console.log('创建 Deepseek 模型提供者...');
  
  // 创建 Deepseek 模型提供者
  const deepseek = new Deepseek({
    apiKey,
    model: 'deepseek-chat',
    temperature: 0.7,
    rawTools: [searchTool, calculatorTool]
  });

  console.log('创建 Agent 组件...');
  
  // 直接创建 Agent 组件，无需任何适配层
  const agent = new Agent({
    // 直接传入模型提供者
    model: deepseek,
    
    // 直接传入工具列表，无需适配
    tools: [searchTool, calculatorTool],
    
    // 系统提示消息
    systemPrompt: `你是一个智能助手，能够使用工具帮助用户解决问题。
当你需要使用工具时，请提供详细的工具调用参数。`,
    
    // 开启详细日志
    verbose: true,
    
    // 最大迭代次数
    maxIterations: 5
  });

  // 示例用户请求
  const userRequest = '搜索关于量子计算的信息，然后计算圆的面积，如果半径是5，使用圆周率π=3.14159';

  console.log('\n===== 独立运行模式 =====');
  console.log(`用户请求: ${userRequest}`);

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

      // 实现流水线转换函数
      _transform($i: any, $o: any): void {
        $i('in').receive((result: AgentOutput) => {
          console.log('\n流水线处理结果:');
          displayResult(result);
        });
      }
    }

    console.log('\n===== 流水线运行模式 =====');

    // 创建流水线
    const pipeline = new Pipeline();

    // 添加组件
    pipeline.addComponent('agent', agent);
    pipeline.addComponent('resultHandler', new ResultHandler());

    // 连接组件
    pipeline.connect('agent.out', 'resultHandler.in');

    // 运行流水线
    console.log('流水线开始处理请求...');
    await pipeline.run('agent.in', userRequest);

  } catch (error: any) {
    console.error('执行过程中出错:', error.message);
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
