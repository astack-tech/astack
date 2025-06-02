import { Pipeline } from '@astack-tech/core';
import { TextSplitter } from '@astack-tech/components';

// 创建一个示例长文本
const sampleText = `
# 机器学习与人工智能简介

## 什么是机器学习？
机器学习是人工智能的一个子领域，它专注于开发能够从数据中学习并改进的算法。
这些算法不需要显式编程就能执行特定任务。

## 常见的机器学习类型
1. **监督学习**: 从标记的训练数据中学习
2. **非监督学习**: 从未标记的数据中发现隐藏的模式
3. **强化学习**: 通过与环境交互来学习最佳行动策略

## 深度学习
深度学习是机器学习的一个子集，它使用多层神经网络来模拟人脑的工作方式。
深度学习已经在图像识别、自然语言处理和游戏领域取得了突破性的成果。

## 应用领域
- 医疗诊断
- 金融预测
- 自动驾驶
- 推荐系统
- 语音识别
- 计算机视觉

## 未来展望
随着计算能力的提升和算法的革新，人工智能将继续融入我们的日常生活，
解决更复杂的问题，创造新的机遇。
`;

// 处理结果的回调函数
function handleResults(chunks: string[]) {
  console.log(`\n文本被分割成 ${chunks.length} 个块：\n`);

  chunks.forEach((chunk, index) => {
    console.log(`--- 块 ${index + 1} (长度: ${chunk.length}) ---`);
    console.log(chunk);
    console.log('\n');
  });

  console.log('文本分割示例完成。');
}

// 运行文本分割测试
async function runTextSplitterPipeline() {
  console.log('开始文本分割示例...\n');

  // 创建 TextSplitter 组件
  const textSplitter = new TextSplitter({
    chunkSize: 100, // 较小的块大小，便于示例展示
    overlap: 20, // 20 字符的重叠
    separator: /\n\s*\n/, // 按段落分割
  });

  // 创建流水线
  const pipeline = new Pipeline();

  // 添加组件到流水线
  pipeline.addComponent('textSplitter', textSplitter);

  // 运行流水线 - 把文本作为输入参数，在结果回调中处理文本块
  // component in pipeline
  const result = await pipeline.run<string[]>('textSplitter.text', sampleText);
  const result2 = await pipeline.run('textSplitter.text', sampleText);

  // standalone 模式
  const result3 = textSplitter.run(sampleText);

  console.log(result);
  console.log(result3);

  handleResults(result2 as string[]);
}

// 执行示例
runTextSplitterPipeline();
