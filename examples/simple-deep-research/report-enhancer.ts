import { Component } from '@astack/core';
import { ResearchReport } from './content-analyzer';

// 定义 Message 接口，避免依赖路径问题
interface Message {
  role: string;
  content: string;
}

/**
 * 报告增强器配置
 */
export interface ReportEnhancerConfig {
  /**
   * 生成内容的最大长度
   */
  maxLength?: number;

  /**
   * 要生成的部分数量
   */
  sectionCount?: number;
}

/**
 * 报告增强器组件
 *
 * 使用 AI 模型增强研究报告，添加深度分析和结构化内容
 *
 * 输入:
 *   - rawReport: 原始研究报告
 *   - llmResponse: 从 LLM 收到的响应
 *
 * 输出:
 *   - enhancedReport: 增强后的研究报告
 *   - promptMessages: 发送给 LLM 的提示消息
 */
class ReportEnhancer extends Component {
  private maxLength: number;
  private sectionCount: number;

  constructor(config: ReportEnhancerConfig = {}) {
    super({});

    // 设置配置
    this.maxLength = config.maxLength ?? 4000;
    this.sectionCount = config.sectionCount ?? 3;

    // 定义端口
    Component.Port.I('rawReport').attach(this);
    Component.Port.I('llmResponse').attach(this);
    Component.Port.O('enhancedReport').attach(this);
    Component.Port.O('promptMessages').attach(this);
  }

  /**
   * 生成提示消息
   * @param report 原始研究报告
   * @returns 提示消息数组
   */
  createPromptMessages(report: ResearchReport): Message[] {
    // 构建系统提示
    const systemPrompt = `你是一位专业的研究分析师，负责整理和增强研究报告。
      你的任务是分析提供的研究报告原始内容，并生成一份结构化、深入且专业的研究报告。
      报告应包含以下部分：
      1. 执行摘要 - 简明扼要地总结主题和关键发现
      2. 背景介绍 - 提供主题的背景和上下文
      3. 主要发现 - 分析主要观点和发现（${this.sectionCount}个小节）
      4. 结论和建议 - 基于研究得出结论并提供建议

      请确保报告：
      - 内容客观、基于事实
      - 逻辑清晰，结构合理
      - 语言专业，表达准确
      - 适当引用信息来源

      回复格式要求为JSON，使用以下结构：
      {
        "title": "报告标题",
        "summary": "执行摘要内容",
        "sections": [
          {"title": "章节标题", "content": "章节内容"},
          ...
        ]
      }`;

    // 构建用户提示
    let userPrompt = `我需要你帮我增强以下研究报告，主题是"${report.topic}"。

      原始报告数据：
      标题: ${report.title}
      摘要: ${report.summary}
      `;

    // 添加原始报告的章节内容
    if (report.sections && report.sections.length > 0) {
      userPrompt += '\n 原始章节内容 :\n';
      for (const section of report.sections) {
        userPrompt += `## ${section.title}\n${section.content}\n\n`;
      }
    }

    // 添加来源信息
    const sources = new Set<string>();
    for (const section of report.sections) {
      for (const source of section.sources) {
        sources.add(source);
      }
    }

    if (sources.size > 0) {
      userPrompt += '\n 信息来源 :\n';
      Array.from(sources).forEach(source => {
        userPrompt += `- ${source}\n`;
      });
    }

    // 返回提示消息数组
    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];
  }

  /**
   * 解析 LLM 响应并增强报告
   * @param report 原始研究报告
   * @param llmResponse LLM 响应
   * @returns 增强后的研究报告
   */
  enhanceReport(report: ResearchReport, llmResponse: Message): ResearchReport {
    try {
      // 尝试解析 JSON 响应
      let responseContent: {
        title?: string;
        summary?: string;
        sections?: Array<{
          title: string;
          content: string;
        }>;
      };

      try {
        responseContent = JSON.parse(llmResponse.content);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        // 如果不是有效的 JSON，尝试从文本中提取 JSON 部分
        const jsonMatch = llmResponse.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          responseContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('无法解析 LLM 响应为 JSON');
        }
      }

      // 创建增强的报告
      const enhancedReport: ResearchReport = {
        ...report,
        title: responseContent.title || report.title,
        summary: responseContent.summary || report.summary,
        sections: [],
      };

      // 添加新的章节
      if (Array.isArray(responseContent.sections)) {
        enhancedReport.sections = responseContent.sections.map(section => ({
          title: section.title,
          content: section.content,
          sources: report.sections.flatMap(s => s.sources), // 保留原始来源
        }));
      }

      return enhancedReport;
    } catch (error) {
      console.error('增强报告失败 :', error);

      // 如果处理失败，返回原始报告
      return {
        ...report,
        summary: report.summary + '\n\n(注: AI 增强失败，显示原始报告内容)',
      };
    }
  }

  /**
   * 组件运行方法，支持独立运行
   * @param input 输入参数对象
   * @returns 增强后的报告或提示消息
   */
  async run(input: {
    rawReport: ResearchReport;
    llmResponse?: Message;
  }): Promise<ResearchReport | Message[]> {
    const { rawReport, llmResponse } = input;

    // 如果有 LLM 响应，增强报告
    if (llmResponse) {
      return this.enhanceReport(rawReport, llmResponse);
    }

    // 否则，生成提示消息
    return this.createPromptMessages(rawReport);
  }

  /**
   * 在流水线中运行组件
   * @param $i 输入端口映射函数
   * @param $o 输出端口映射函数
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform($i: any, $o: any) {
    let rawReport: ResearchReport | null = null;

    // 接收原始报告
    $i('rawReport').receive((report: ResearchReport) => {
      rawReport = report;

      // 生成并发送提示消息
      const promptMessages = this.createPromptMessages(report);
      $o('promptMessages').send(promptMessages);
    });

    // 接收 LLM 响应
    $i('llmResponse').receive((response: Message) => {
      // 确保已接收到原始报告
      if (rawReport) {
        // 增强报告并发送
        const enhancedReport = this.enhanceReport(rawReport, response);
        $o('enhancedReport').send(enhancedReport);
      }
    });
  }
}

export default ReportEnhancer;
