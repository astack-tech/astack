/**
 * Homepage code samples. They are the example programs from `examples/`, synced into
 * `content/examples` by `scripts/sync-examples.mjs`, so the homepage cannot drift from
 * code that type-checks and runs in CI.
 */

import agent from '@/content/examples/agent.json';
import component from '@/content/examples/component.json';
import pipeline from '@/content/examples/pipeline.json';
import streamingAgent from '@/content/examples/streaming-agent.json';

export const componentCode = component.code;
export const pipelineCode = pipeline.code;
export const agentCode = agent.code;
export const streamingCode = streamingAgent.code;
