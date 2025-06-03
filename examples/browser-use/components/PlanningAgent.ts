import { Component } from '@astack-tech/core';
import type { ModelProvider } from '@astack-tech/components';
import { Agent, AgentConfig, AgentOutput } from '@astack-tech/components';

// 定义组件配置类型接口
interface PlanningAgentConfig {
  modelProvider: ModelProvider;
}

// 定义计划结构接口
interface Plan {
  raw: string;
  steps: string[];
}

/**
 * 规划代理组件 - 将自然语言意图转换为执行计划
 * 遵循 AStack 的 "一切皆组件" 原则，支持零适配层设计
 */
export class PlanningAgent extends Component {
  private agent: Agent;

  constructor({ modelProvider }: PlanningAgentConfig) {
    super({});
    // 组件端口定义
    Component.Port.I('intent').attach(this);
    Component.Port.O('plan').attach(this);

    // 初始化规划 Agent
    this.agent = new Agent({
      model: modelProvider,
      systemPrompt: this.buildPlanningPrompt(),
    } as AgentConfig);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform($i: any, $o: any) {
    $i('intent').receive(async (userIntent: string) => {
      try {
        // 分析用户意图并生成执行计划
        const agentOutput: AgentOutput = await this.agent.run(userIntent);

        // 将计划发送到输出端口
        $o('plan').send(this.structurePlan(agentOutput.message));
      } catch (error: unknown) {
        $o('plan').send({ error: error instanceof Error ? error.message : String(error) });
      }
    });
  }

  private structurePlan(rawPlan: string): Plan {
    // 将文本格式的计划转换为结构化数据
    // 这里使用简单的步骤解析，实际项目可能需要更复杂的解析
    try {
      const steps = rawPlan
        .split(/\n+/)
        .filter(line => line.trim().match(/^\d+\./))
        .map(step => step.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean);

      return {
        raw: rawPlan,
        steps,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { raw: rawPlan, steps: [] };
    }
  }

  private buildPlanningPrompt() {
    return `You are an expert web automation planner. 
Your task is to analyze the user's natural language intent and create a detailed step-by-step plan 
for interacting with web pages.

Given a high-level user request like "find information about X on website Y", 
you must break this down into concrete, executable steps.

For each step, be specific about:
1. The exact action to take (navigate, click, type, extract data)
2. The specific elements to interact with (using descriptive selectors)
3. Any text inputs or parameters needed

Format your response as a numbered list of steps. Each step should be clear, 
concise and directly executable by a browser automation system.

For example, if the user says "get me the latest news from BBC":

1. Navigate to https://www.bbc.com
2. Look for headline articles in the main content area (selector: .media__content)
3. Extract the titles and summaries of the top 5 news items
4. Extract links to the full articles
5. Format the information as a structured list of headlines with links

Be adaptable to different websites and tasks, but always provide concrete, specific steps.
When there is ambiguity in the user's request, make reasonable assumptions and explain your reasoning.

Remember that your plan will be executed by another component, so focus on WHAT needs to be done,
not HOW to implement it.`;
  }
}
