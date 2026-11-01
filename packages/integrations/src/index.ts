/**
 * Model provider integrations for AStack. `ModelProvider.OpenAICompatible` calls any API
 * that speaks the OpenAI chat completions protocol, and `ModelProvider.Deepseek` is that
 * provider set up for DeepSeek. Both satisfy the `ModelProvider` interface of
 * `@astack-tech/components`.
 *
 * @packageDocumentation
 */

export * as ModelProvider from './model-provider';
