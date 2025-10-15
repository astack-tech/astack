import { Component } from '@astack-tech/core';
import type { ModelProvider } from '@astack-tech/components';
import { StreamingAgent, type AgentConfig, type AgentOutput } from '@astack-tech/components';

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
  private agent: StreamingAgent;

  constructor({ modelProvider }: PlanningAgentConfig) {
    super({});
    // 组件端口定义
    Component.Port.I('intent').attach(this);
    Component.Port.O('plan').attach(this);
    Component.Port.O('stream').attach(this);

    // 初始化规划 Agent
    this.agent = new StreamingAgent({
      model: modelProvider,
      systemPrompt: this.buildPlanningPrompt(),
    } as AgentConfig);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform($i: any, $o: any) {
    $i('intent').receive(async (userIntent: string) => {
      try {
        let finalOutput: AgentOutput | undefined;
        let streamedText = '';

        for await (const chunk of this.agent.runStream(userIntent)) {
          if (chunk.type === 'assistant_message') {
            const content = chunk.content ?? '';
            let delta = content;
            if (content.startsWith(streamedText)) {
              delta = content.slice(streamedText.length);
            }
            streamedText = content;

            if (delta) {
              $o('stream').send({
                source: 'planner',
                chunk: {
                  ...chunk,
                  content: delta,
                },
              });
            }
          } else if (chunk.type !== 'model_thinking') {
            $o('stream').send({
              source: 'planner',
              chunk,
            });
          }

          if (chunk.type === 'completed') {
            finalOutput = {
              message: chunk.finalMessage ?? '',
              history: chunk.history ?? [],
              toolCalls: chunk.allToolCalls ?? [],
            };

            // 最终完整结果再发送给前端一次
            if (chunk.finalMessage && chunk.finalMessage !== streamedText) {
              const delta = chunk.finalMessage.startsWith(streamedText)
                ? chunk.finalMessage.slice(streamedText.length)
                : chunk.finalMessage;
              if (delta) {
                streamedText = chunk.finalMessage;
                $o('stream').send({
                  source: 'planner',
                  chunk: {
                    type: 'assistant_message',
                    content: delta,
                    toolCalls: chunk.allToolCalls,
                  },
                });
              }
            }
          }
        }

        const finalOutputNormalized: AgentOutput =
          finalOutput ??
          ({
            message: '',
            history: [],
            toolCalls: [],
          } as AgentOutput);

        // 将计划发送到输出端口
        $o('plan').send(this.structurePlan(finalOutputNormalized.message));
      } catch (error: unknown) {
        $o('plan').send({ error: error instanceof Error ? error.message : String(error) });
        $o('stream').send({
          source: 'planner',
          chunk: {
            type: 'error',
            error: error instanceof Error ? error.message : String(error),
          },
        });
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

IMPORTANT: You MUST ONLY use the tools listed below. These are the ONLY available tools in the browser automation system:

1. navigate(url: string)
   - Navigates to a specific URL
   - Example: navigate("https://www.example.com")

2. click(selector: string)
   - Clicks on an element identified by selector (CSS selector, XPath, or text content)
   - Example: click(".submit-button")
   - Example: click("Login")

3. type(selector: string, text: string)
   - Types text into an input field
   - Example: type("#search-input", "weather forecast")

4. extract(selector: string)
   - Extracts data from elements matching the selector
   - Example: extract(".article-title")

5. screenshot()
   - Takes a screenshot of the current page
   - Example: screenshot()

6. press(key: string)
   - Presses a keyboard key or key combination
   - Example: press("Enter")
   - Example: press("Control+A")

7. hover(selector: string)
   - Moves mouse over the specified element
   - Example: hover(".dropdown-menu")

8. scroll(options)
   - Scrolls the page to a specific element or by a number of pixels
   - Example: scroll({ selector: ".footer" })
   - Example: scroll({ pixels: 500 })

9. selectOption(selector: string, options)
   - Selects an option from a dropdown menu
   - Example: selectOption("#country-select", { value: "us" })
   - Example: selectOption("#country-select", { label: "United States" })
   - Example: selectOption("#country-select", { index: 0 })

10. waitForSelector(selector: string, timeout?: number)
    - Waits for an element to appear on the page
    - Example: waitForSelector(".search-results", 5000)

11. annotateElements(showAnnotations?: boolean)
    - Analyzes and optionally highlights interactive elements on the page
    - Example: annotateElements(true)

Format your response as a numbered list of steps. Each step should:
1. Be clear, concise and directly executable using ONLY the tools listed above
2. Use precise selectors (CSS selectors, XPath or text content) to identify page elements
3. Include all required parameters for the tool
4. Add brief comments explaining complex selectors or reasoning when necessary

Example plan for "get me the latest news from BBC":

1. navigate("https://www.bbc.com")
2. waitForSelector(".media__content", 5000)
3. extract(".media__content h3")
4. extract(".media__content p")
5. extract(".media__content a")

Always include waiting for elements when necessary, and be sure to use the proper tool and syntax for each action.
When there is ambiguity in the user's request, make reasonable assumptions and explain your reasoning.

Your plan will be executed exactly as written, so be precise with tool names and parameters!`;
  }
}
