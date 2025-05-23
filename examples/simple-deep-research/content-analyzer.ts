import { Component } from '@astack/core';
import { SearchResultItem } from './web-driver';

/**
 * 内容分析组件配置
 */
export interface ContentAnalyzerConfig {
  /**
   * 最大处理的搜索结果数量
   */
  maxResults?: number;
  
  /**
   * 最大处理的内容长度
   */
  maxContentLength?: number;
}

/**
 * 研究报告部分
 */
export interface ReportSection {
  /**
   * 部分标题
   */
  title: string;
  
  /**
   * 部分内容
   */
  content: string;
  
  /**
   * 信息来源
   */
  sources: string[];
}

/**
 * 研究报告
 */
export interface ResearchReport {
  /**
   * 报告标题
   */
  title: string;
  
  /**
   * 研究主题
   */
  topic: string;
  
  /**
   * 摘要
   */
  summary: string;
  
  /**
   * 报告章节
   */
  sections: ReportSection[];
  
  /**
   * 生成时间
   */
  generatedAt: string;
}

/**
 * 内容分析组件
 * 
 * 分析搜索结果和页面内容，提取有用信息并整理成报告
 * 
 * 输入:
 *   - searchResults: 搜索结果列表
 *   - pageContents: 页面内容数组 (url 和 content 的对象数组)
 *   - topic: 研究主题
 * 
 * 输出:
 *   - relevantUrls: 相关 URL 列表
 *   - report: 整理后的研究报告
 */
class ContentAnalyzer extends Component {
  private maxResults: number;
  private maxContentLength: number;
  
  // 存储页面内容的缓存
  private contentCache: Map<string, string> = new Map();
  
  constructor(config: ContentAnalyzerConfig = {}) {
    super({});
    
    // 设置配置
    this.maxResults = config.maxResults ?? 5;
    this.maxContentLength = config.maxContentLength ?? 10000;
    
    // 定义端口
    Component.Port.I("searchResults").attach(this);
    Component.Port.I("pageContents").attach(this);
    Component.Port.I("topic").attach(this);
    Component.Port.O("relevantUrls").attach(this);
    Component.Port.O("report").attach(this);
    Component.Port.O("ready").attach(this);
  }
  
  /**
   * 过滤相关的搜索结果
   * @param results 搜索结果列表
   * @param topic 研究主题
   * @returns 相关的 URL 列表
   */
  filterRelevantResults(results: SearchResultItem[], topic: string): string[] {
    if (!results || results.length === 0) {
      console.log('[ContentAnalyzer] 没有搜索结果可供过滤');
      return [];
    }
    
    console.log(`[ContentAnalyzer] 开始过滤搜索结果，共 ${results.length} 条...`);
    
    // 将主题拆分为关键词
    const keywords = topic.toLowerCase().split(/\s+/);
    const importantKeywords = keywords.filter(k => k.length > 1);
    
    // 更智能的过滤算法
    const relevantResults = results
      .map(result => {
        const lowerTitle = result.title.toLowerCase();
        const lowerSnippet = result.snippet.toLowerCase();
        
        // 计算相关性分数
        let score = 0;
        for (const keyword of importantKeywords) {
          if (lowerTitle.includes(keyword)) score += 2;
          if (lowerSnippet.includes(keyword)) score += 1;
        }
        
        return { result, score };
      })
      .filter(item => item.score > 0) // 必须至少有一个关键词匹配
      .sort((a, b) => b.score - a.score) // 按相关性排序
      .map(item => item.result)
      .slice(0, this.maxResults);
    
    // 如果没有高度相关的结果，至少返回前几个结果
    let urls: string[] = [];
  
    if (relevantResults.length > 0) {
      // 高相关度结果
      urls = relevantResults.map(result => {
        console.log(`[ContentAnalyzer] 相关结果 URL: ${result.url}, 类型: ${typeof result.url}`);
        return result.url;
      }).filter(url => {
        // 验证 URL
        if (!url || typeof url !== 'string' || url.length < 5) {
          console.error(`[ContentAnalyzer] 无效 URL: "${url}", 类型: ${typeof url}`);
          return false;
        }
        return true;
      });
    } else {
      // 默认取前几个结果
      urls = results.slice(0, Math.min(3, results.length))
        .map(result => {
          console.log(`[ContentAnalyzer] 默认结果 URL: ${result.url}, 类型: ${typeof result.url}`);
          return result.url;
        }).filter(url => {
          // 验证 URL
          if (!url || typeof url !== 'string' || url.length < 5) {
            console.error(`[ContentAnalyzer] 无效 URL: "${url}", 类型: ${typeof url}`);
            return false;
          }
          return true;
        });
    }
  
    console.log(`[ContentAnalyzer] 过滤后找到 ${urls.length} 个有效相关 URL：${urls.join(', ')}`);
  
    // 确保返回的 URL 是有效的
    const validUrls = urls
      .filter(url => {
        // 基本验证
        if (!url || typeof url !== 'string' || url.length < 5) {
          return false;
        }
        
        // 过滤掉广告 URL（通常包含年份和 " 广告 " 字样）
        if (url.includes('广告') || /\d{4}-\d{2}广告/.test(url)) {
          console.log(`[ContentAnalyzer] 过滤掉广告 URL: ${url}`);
          return false;
        }
        
        // 检查 URL 格式是否有效（不应包含空格等无效字符）
        if (url.includes(' ') || !url.includes('.')) {
          console.log(`[ContentAnalyzer] URL 格式无效: ${url}`);
          return false;
        }
        
        // 检查是否是有效的网络地址
        try {
          // 尝试解析 URL，如果格式不对会抛出异常
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            new URL(`https://${url}`);
          } else {
            new URL(url);
          }
          return true;
        } catch (e: any) {
          console.log(`[ContentAnalyzer] URL 解析失败: ${url}, 错误: ${e.message || '未知错误'}`);
          return false;
        }
      })
      .map(url => {
        // 注意：百度链接中 url 参数不是直接的 URL，而是一个加密或编码的标识符
        // 所以直接用原始的百度链接，不做提取
        if (url.includes('baidu.com/link?')) {
          console.log(`[ContentAnalyzer] 保留原始百度链接: ${url}`);
          // 返回原始百度链接，浏览器会自动处理重定向
          return url;
        }
        return url; // 确保总是返回一个值
      })
      .filter((url): url is string => typeof url === 'string') // 过滤掉 undefined 值
      .map(url => {
        // 添加协议前缀
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return `https://${url}`;
        }
        return url;
      });
  
    // 返回多个 URL 中的第一个进行测试
    if (validUrls.length > 0) {
      console.log(`[ContentAnalyzer] 将发送第一个 URL 进行测试: ${validUrls[0]}`);
      return [validUrls[0]];
    }
  
    console.log(`[ContentAnalyzer] 最终返回 ${validUrls.length} 个完整 URL`);
    return validUrls;
  }
  
  /**
   * 从页面内容中提取关键信息
   * @param contents 页面内容映射 (URL -> 内容)
   * @param topic 研究主题
   * @returns 研究报告
   */
  organizeContent(contents: Map<string, string>, topic: string): ResearchReport {
    // 如果内容为空，返回空报告
    if (contents.size === 0) {
      return {
        title: `关于"${topic}"的研究报告`,
        topic,
        summary: "无法获取足够的相关信息",
        sections: [],
        generatedAt: new Date().toISOString()
      };
    }
    
    // 简单报告生成，实际应用中这里通常会使用 LLM 进行内容提取和整理
    const sections: ReportSection[] = [];
    const sources: string[] = [];
    let allContent = "";
    
    // 整合所有内容
    for (const [url, content] of contents.entries()) {
      if (content && content.trim().length > 0) {
        // 限制内容长度
        const truncatedContent = content.substring(0, this.maxContentLength);
        allContent += truncatedContent + "\n\n";
        sources.push(url);
      }
    }
    
    // 创建一个简单的报告部分
    sections.push({
      title: `${topic}的概述`,
      content: `这是关于${topic}的研究概述，基于多个网络来源。`,
      sources
    });
    
    // 生成报告
    return {
      title: `关于"${topic}"的研究报告`,
      topic,
      summary: `本报告提供了关于"${topic}"的综合分析，基于${sources.length}个不同来源。`,
      sections,
      generatedAt: new Date().toISOString()
    };
  }
  
  /**
   * 处理搜索结果
   * @param results 搜索结果列表
   */
  processSearchResults(results: SearchResultItem[]): void {
    // 实际实现中处理搜索结果逻辑
    console.log(`处理 ${results.length} 条搜索结果`);
  }
  
  /**
   * 生成初步报告
   * @param searchResults 搜索结果
   * @param contentMap 页面内容映射
   * @param topic 研究主题
   * @returns 研究报告
   */
  generateReport(searchResults: SearchResultItem[], contentMap: Map<string, string>, topic: string): ResearchReport {
    // 分析内容，生成结构化的报告部分
    const sections: ReportSection[] = [];
    
    // 从内容中提取信息，生成章节
    let sources: string[] = [];
    for (const [url, content] of contentMap.entries()) {
      if (content && content.length > 0) {
        sources.push(url);
      }
    }
    
    // 生成标准章节
    sections.push({
      title: '研究背景',
      content: `关于${topic}的研究已经收集了多个来源的信息。本报告将对这些信息进行整理和分析。`,
      sources: sources
    });
    
    // 生成报告
    return {
      title: `关于 ${topic} 的研究报告`,
      topic,
      summary: `本报告涉及 ${topic} 的多个方面，包括了相关研究信息和见解。`,
      sections,
      generatedAt: new Date().toISOString()
    };
  }
  
  /**
   * 尝试生成报告，当所有必要条件都满足时
   * @param $o 输出端口
   * @param searchResults 搜索结果
   * @param pageContentsMap 页面内容映射
   * @param topic 研究主题
   * @param searchResultsReceived 是否已接收到搜索结果
   * @param pageContentsReceived 是否已接收到页面内容
   */
  tryGenerateReport(
    $o: any, 
    searchResults: SearchResultItem[], 
    pageContentsMap: Map<string, string>, 
    topic: string, 
    searchResultsReceived: boolean, 
    pageContentsReceived: boolean
  ): void {
    console.log(`[ContentAnalyzer] tryGenerateReport 被调用`);
    console.log(`[ContentAnalyzer] 参数检查:`);
    console.log(`  - topic: ${topic}, 类型: ${typeof topic}, 长度: ${topic?.length || 0}`);
    console.log(`  - searchResultsReceived: ${searchResultsReceived}`);
    console.log(`  - searchResults: 类型=${typeof searchResults}, 是否数组=${Array.isArray(searchResults)}, 长度=${searchResults?.length || 0}`);
    console.log(`  - pageContentsReceived: ${pageContentsReceived}`);
    console.log(`  - pageContentsMap: 类型=${typeof pageContentsMap}, 是否 Map=${pageContentsMap instanceof Map}, 大小=${pageContentsMap?.size || 0}`);
    
    // 如果已有主题和搜索结果，则生成报告
    if (topic && searchResultsReceived) {
      console.log(`[ContentAnalyzer] 条件满足: 有主题和搜索结果`);
      
      try {
        // 获取相关 URL
        console.log(`[ContentAnalyzer] 调用 filterRelevantResults 方法过滤 ${searchResults.length} 条搜索结果...`);
        const relevantUrls = this.filterRelevantResults(searchResults, topic);
        console.log(`[ContentAnalyzer] 过滤完成，获取到 ${relevantUrls.length} 个相关URL`);
        
        if (relevantUrls.length > 0) {
          // 当前版本的 tryGenerateReport 中不需要发送 URL，因为我们已经在 _transform 中设置了 URL 接收器
          // 如果需要发送报告，我们可以在这里实现
          // 只记录日志，不尝试发送 URL
          console.log(`[ContentAnalyzer] 已找到相关 URL，但在 tryGenerateReport 方法中不再重复发送: ${relevantUrls[0]}`);
        } else {
          console.warn('[ContentAnalyzer] 没有找到相关 URL，无法发送给 WebDriver');
        }
      } catch (error) {
        console.error('[ContentAnalyzer] 过滤或发送相关 URL 时出错 :', error);
      }
      
      // 如果已经收到页面内容，生成完整报告
      if (pageContentsReceived && pageContentsMap.size > 0) {
        console.log(`[ContentAnalyzer] 条件满足: 已收到页面内容，准备生成报告...`);
        try {
          const report = this.generateReport(searchResults, pageContentsMap, topic);
          console.log(`[ContentAnalyzer] 报告生成完成，准备发送到 report 端口`);
          $o('report').send(report);
          console.log(`[ContentAnalyzer] 报告已发送到 report 端口`);
        } catch (error) {
          console.error('[ContentAnalyzer] 生成或发送报告时出错 :', error);
        }
      } else {
        console.log(`[ContentAnalyzer] 条件不满足: 页面内容未收到或为空，等待页面内容...`);
      }
    } else {
      console.log(`[ContentAnalyzer] 条件不满足: 缺少主题或搜索结果，等待更多输入...`);
    }
  }
  
  /**
   * 组件独立运行方法
   * @param input 输入数据
   * @returns 研究报告
   */
  async run(input: { 
    searchResults?: SearchResultItem[], 
    pageContents?: Array<{url: string, content: string}>,
    topic: string 
  }): Promise<ResearchReport> {
    const { searchResults = [], pageContents = [], topic } = input;
    
    // 处理搜索结果，获取相关 URL
    let relevantUrls: string[] = [];
    if (searchResults.length > 0) {
      relevantUrls = this.filterRelevantResults(searchResults, topic);
    }
    
    // 更新内容缓存
    if (pageContents.length > 0) {
      for (const item of pageContents) {
        this.contentCache.set(item.url, item.content);
      }
    }
    
    // 准备分析用的内容
    const contentForAnalysis = new Map<string, string>();
    
    // 如果有 URL 但没有对应的内容，报告可能不完整
    for (const url of relevantUrls) {
      if (this.contentCache.has(url)) {
        contentForAnalysis.set(url, this.contentCache.get(url) || "");
      }
    }
    
    // 生成并返回报告
    return this.generateReport(searchResults, contentForAnalysis, topic);
  }
  
  /**
   * 在流水线中运行组件
   * @param $i 输入端口
   * @param $o 输出端口
   */
  _transform($i: any, $o: any) {
    console.log('初始化 ContentAnalyzer _transform 方法');
    
    // 检查端口是否正确初始化
    if (!$i || typeof $i !== 'function') {
      console.error('[ContentAnalyzer] 输入端口对象无效');
    } else if (!$i('searchResults')) {
      console.error('[ContentAnalyzer] searchResults 输入端口不可用');
    } else {
      console.log('[ContentAnalyzer] 端口检查正常，searchResults 端口可用');
    }
    
    let topic = '';
    let searchResultsReceived = false;
    let pageContentsReceived = false;
    const pageContentsMap = new Map<string, string>();
    let searchResults: SearchResultItem[] = [];
    let readySent = false;
    
    // 监听研究主题
    $i('topic').receive((t: string) => {
      console.log(`收到研究主题: ${t}`);
      topic = t;
      console.log('尝试生成报告 (topic 触发 )...');
      this.tryGenerateReport($o, searchResults, pageContentsMap, topic, searchResultsReceived, pageContentsReceived);
      
      if (!readySent) {
        console.log('[ContentAnalyzer] 发送就绪信号，表明已准备好接收搜索结果');
        $o('ready').send(true);
        readySent = true;
      }
    });
    
    // 监听搜索结果 - 确保我们的回调一定会收到数据
    console.log('[ContentAnalyzer] 设置搜索结果接收器 ...');
    $i('searchResults').receive((results: SearchResultItem[]) => {
      console.log(`★★★★★ [ContentAnalyzer] 收到搜索结果！类型=${typeof results}, 是否数组=${Array.isArray(results)}, 长度=${results?.length || 0}`);
      
      // 防止空结果
      if (!results || !Array.isArray(results)) {
        console.error('[ContentAnalyzer] 收到的搜索结果无效 :', results);
        return;
      }
      
      try {
        // 输出前三个结果的详细信息以便调试
        if (results.length > 0) {
          console.log('[ContentAnalyzer] 搜索结果样本 :');
          for (let i = 0; i < Math.min(3, results.length); i++) {
            const result = results[i];
            console.log(`- 结果 ${i+1}: 标题="${result.title}", URL=${result.url}`);
          }
        } else {
          console.warn('[ContentAnalyzer] 搜索结果数组为空');
        }
      } catch (err) {
        console.error('[ContentAnalyzer] 输出搜索结果样本时出错 :', err);
      }
      
      searchResults = results;
      searchResultsReceived = true;
      console.log(`[ContentAnalyzer] 已设置 searchResultsReceived = ${searchResultsReceived}`);
      
      // 如果已经有主题，处理搜索结果
      if (topic) {
        console.log(`[ContentAnalyzer] 开始使用主题 "${topic}" 过滤搜索结果...`);
        try {
          const relevantUrls = this.filterRelevantResults(searchResults, topic);
          
          console.log(`[ContentAnalyzer] 过滤结果: 找到 ${relevantUrls.length} 个相关 URL`);
          
          if (relevantUrls.length > 0) {
            // 发送所有相关 URL
            console.log(`[ContentAnalyzer] 准备发送 ${relevantUrls.length} 个相关 URL 到 WebDriver`);
            
            try {
              // 先发送第一个进行测试
              const testUrl = relevantUrls[0];
              console.log(`[ContentAnalyzer] 发送第一个相关 URL: ${testUrl}`);
              $o('relevantUrls').send(testUrl);
              console.log(`[ContentAnalyzer] 成功发送第一个 URL 到 WebDriver: ${testUrl}`);
              
              // 之后发送其余 URL
              for (let i = 1; i < relevantUrls.length; i++) {
                console.log(`[ContentAnalyzer] 发送相关 URL ${i+1}/${relevantUrls.length}: ${relevantUrls[i]}`);
                $o('relevantUrls').send(relevantUrls[i]);
              }
              console.log(`[ContentAnalyzer] 所有相关 URL 已发送完成`);
            } catch (error) {
              console.error(`[ContentAnalyzer] 发送URL时出错:`, error);
            }
          } else {
            console.warn('[ContentAnalyzer] 没有找到相关 URL，无法发送给 WebDriver');
          }
        } catch (error) {
          console.error('[ContentAnalyzer] 过滤相关 URL 时出错 :', error);
        }
      } else {
        console.log('[ContentAnalyzer] 主题还未设置，等待主题输入再过滤 URL');
      }
      
      // 尝试生成报告
      console.log('尝试生成报告 (searchResults 触发 )...');
      this.tryGenerateReport($o, searchResults, pageContentsMap, topic, searchResultsReceived, pageContentsReceived);
    });
    
    // 监听页面内容
    $i('pageContents').receive((contentItem: {url: string, content: string}) => {
      console.log(`收到页面内容: ${contentItem.url}`);
      pageContentsReceived = true;
      
      // 更新内容缓存
      console.log(`缓存页面内容: ${contentItem.url.substring(0, 50)}...`);
      this.contentCache.set(contentItem.url, contentItem.content);
      pageContentsMap.set(contentItem.url, contentItem.content);
      
      // 尝试生成报告
      console.log('尝试生成报告 (pageContents 触发 )...');
      this.tryGenerateReport($o, searchResults, pageContentsMap, topic, searchResultsReceived, pageContentsReceived);
    });
    
    console.log('ContentAnalyzer _transform 方法设置完成');
  }
}

export default ContentAnalyzer;
