import { Pipeline } from '@astack/core';
import Deepseek from '../../packages/integrations/src/model-provider/deepseek';
import WebDriverComponent, { SearchResultItem } from './web-driver';
import ContentAnalyzer, { ResearchReport, ReportSection } from './content-analyzer';
import ReportEnhancer from './report-enhancer';
import GatewayComponent from './gateway';
import DataRelayComponent from './data-relay';
import fs from 'fs/promises';
import path from 'path';
import Mustache from 'mustache';

/**
 * 简易深度研究工具
 * 
 * 使用 astack 框架实现的自动研究工具，可以：
 * 1. 搜索指定主题的网络信息
 * 2. 分析和提取相关内容
 * 3. 使用 AI 生成结构化研究报告
 */
async function runSimpleDeepResearch(topic: string, apiKey: string): Promise<void> {
  console.log(`开始对 "${topic}" 进行深度研究...`);
  
  // 创建流水线
  const pipeline = new Pipeline();
  
  // 创建组件
  const gateway = new GatewayComponent({ searchDelay: 200 });
  const webDriver = new WebDriverComponent({ headless: false });
  const dataRelay = new DataRelayComponent();
  const contentAnalyzer = new ContentAnalyzer();
  const reportEnhancer = new ReportEnhancer();
  const llmModel = new Deepseek({
    apiKey,
    model: 'deepseek-chat',
    temperature: 0.5,
  });
  
  // 添加组件到流水线
  console.log('添加组件到流水线 ...');
  pipeline.addComponent('gateway', gateway);
  pipeline.addComponent('webDriver', webDriver);
  pipeline.addComponent('dataRelay', dataRelay);
  pipeline.addComponent('analyzer', contentAnalyzer);
  pipeline.addComponent('enhancer', reportEnhancer);
  pipeline.addComponent('llm', llmModel);
  
  // 连接组件
  console.log('开始连接组件端口 ...');
  
  // 网关到各组件的连接
  console.log('连接 gateway.topicOut -> analyzer.topic');
  pipeline.connect('gateway.topicOut', 'analyzer.topic');
  
  console.log('连接 gateway.searchQueryOut -> webDriver.searchQuery');
  pipeline.connect('gateway.searchQueryOut', 'webDriver.searchQuery');
  
  // 使用数据中继组件连接 WebDriver 和 ContentAnalyzer
  console.log('连接 webDriver.searchResults -> dataRelay.dataIn');
  pipeline.connect('webDriver.searchResults', 'dataRelay.dataIn');
  
  console.log('连接 dataRelay.dataOut -> analyzer.searchResults');
  pipeline.connect('dataRelay.dataOut', 'analyzer.searchResults');
  
  console.log('连接 analyzer.relevantUrls -> webDriver.url');
  pipeline.connect('analyzer.relevantUrls', 'webDriver.url');
  
  // 然后连接就绪信号
  console.log('连接 analyzer.ready -> gateway.analyzerReady');
  pipeline.connect('analyzer.ready', 'gateway.analyzerReady');
  
  console.log('连接 webDriver.pageContent -> analyzer.pageContents');
  pipeline.connect('webDriver.pageContent', 'analyzer.pageContents');
  
  console.log('连接 analyzer.report -> enhancer.rawReport');
  pipeline.connect('analyzer.report', 'enhancer.rawReport');
  
  console.log('连接 enhancer.promptMessages -> llm.messages');
  pipeline.connect('enhancer.promptMessages', 'llm.messages');
  
  console.log('连接 llm.message -> enhancer.llmResponse');
  pipeline.connect('llm.message', 'enhancer.llmResponse');
  
  // 将最终报告连接回网关
  console.log('连接 enhancer.enhancedReport -> gateway.reportIn');
  pipeline.connect('enhancer.enhancedReport', 'gateway.reportIn');
  
  console.log('所有组件端口连接完成');
  
  try {
    // 使用网关组件作为单一进入点
    console.log('通过网关触发完整流程 ...');
    const enhancedReport = await pipeline.run<ResearchReport>('gateway.input', { topic, apiKey });
    console.log('流水线处理完成，获取最终报告');
    
    // 保存报告到文件
    console.log('保存最终报告到文件 ...');
    const reportDir = path.join(process.cwd(), 'reports');
    await fs.mkdir(reportDir, { recursive: true });
    
    // 保存 JSON 格式报告（用于兼容）
    const jsonFileName = `${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.json`;
    const jsonFilePath = path.join(reportDir, jsonFileName);
    await fs.writeFile(jsonFilePath, JSON.stringify(enhancedReport, null, 2), 'utf8');
    
    // 生成 HTML 报告
    try {
      // 读取 HTML 模板
      const templatePath = path.join(process.cwd(), 'templates', 'report-template.html');
      const template = await fs.readFile(templatePath, 'utf8');
      
      // 准备渲染数据
      const allSources = new Set<string>();
      enhancedReport.sections.forEach(section => {
        section.sources.forEach(source => allSources.add(source));
      });
      
      const renderData = {
        ...enhancedReport,
        topic: enhancedReport.topic || topic,
        generatedDate: new Date().toLocaleString('zh-CN'),
        sources: Array.from(allSources)
      };
      
      // 渲染 HTML
      const htmlContent = Mustache.render(template, renderData);
      
      // 保存 HTML 报告
      const htmlFileName = `${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.html`;
      const htmlFilePath = path.join(reportDir, htmlFileName);
      await fs.writeFile(htmlFilePath, htmlContent, 'utf8');
      
      console.log('HTML 报告已保存至 :', htmlFilePath);
    } catch (error) {
      console.error('生成 HTML 报告失败 :', error);
    }
    
    // 打印报告摘要
    console.log('\n============= 研究报告摘要 =============');
    console.log(`标题: ${enhancedReport.title}`);
    console.log(`摘要: ${enhancedReport.summary}`);
    console.log('\n 章节 :');
    enhancedReport.sections.forEach((section: ReportSection, index: number) => {
      console.log(`  ${index + 1}. ${section.title}`);
    });
    console.log('\n 完整报告已保存至 :', jsonFilePath);
    
  } catch (error) {
    console.error('研究过程中出错 :', error);
  } finally {
    // 关闭 WebDriver
    console.log('关闭浏览器 ...');
    await webDriver.close();
  }
}

// 从环境变量或命令行参数获取 API 密钥
const apiKey = process.env.OPENAI_API_KEY || '';
if (!apiKey) {
  console.error('错误 : 未提供 API 密钥，请设置 OPENAI_API_KEY 环境变量');
  process.exit(1);
}

// 获取研究主题
const topic = process.argv[2] || '人工智能在医疗领域的应用';

// 运行深度研究
runSimpleDeepResearch(topic, apiKey)
  .then(() => console.log('研究完成!'))
  .catch(err => console.error('程序运行错误 :', err))
  .finally(() => process.exit(0));
