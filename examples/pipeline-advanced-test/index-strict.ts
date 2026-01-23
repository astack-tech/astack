import { Pipeline, Component } from '@astack-tech/core';
import type { Port } from '@astack-tech/core';

/**
 * Strict Advanced Pipeline Test Suite
 *
 * Features:
 * - Expected vs actual result comparison with deep equality
 * - Automatic pass/fail reporting
 * - Detailed error messages for failures
 * - Execution count tracking to verify no duplicates
 */

// Execution counters for detecting duplicates
const executionCounts = {
  preprocessor: 0,
  sentiment: 0,
  keywords: 0,
  length: 0,
};

function resetCounters() {
  Object.keys(executionCounts).forEach(key => {
    executionCounts[key as keyof typeof executionCounts] = 0;
  });
}

// Test Components with execution tracking and proper _transform

class DataPreprocessor extends Component {
  constructor(opts: unknown) {
    super(opts);
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { text: string }) => {
      executionCounts.preprocessor++;
      const result = {
        cleaned: data.text.trim().toLowerCase(),
        original: data.text,
        timestamp: Date.now(),
      };
      $o('out').send(result);
    });
  }
}

class SentimentAnalyzer extends Component {
  constructor(opts: unknown) {
    super(opts);
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { cleaned: string }) => {
      executionCounts.sentiment++;
      const positive = data.cleaned.includes('good') || data.cleaned.includes('great');
      const negative = data.cleaned.includes('bad') || data.cleaned.includes('terrible');

      const result = {
        sentiment: positive ? 'positive' : negative ? 'negative' : 'neutral',
        confidence: 0.85,
      };
      $o('out').send(result);
    });
  }
}

class KeywordExtractor extends Component {
  constructor(opts: unknown) {
    super(opts);
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { cleaned: string }) => {
      executionCounts.keywords++;
      const keywords = data.cleaned.split(' ').filter(word => word.length > 4);
      const result = {
        keywords,
        count: keywords.length,
      };
      $o('out').send(result);
    });
  }
}

class LengthAnalyzer extends Component {
  constructor(opts: unknown) {
    super(opts);
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { cleaned: string }) => {
      executionCounts.length++;
      const result = {
        charCount: data.cleaned.length,
        wordCount: data.cleaned.split(' ').length,
        avgWordLength: data.cleaned.length / data.cleaned.split(' ').length,
      };
      $o('out').send(result);
    });
  }
}

// Test utilities
function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

interface TestCase {
  name: string;
  run: () => Promise<unknown>;
  expected: unknown;
  expectedExecutions?: Record<string, number>;
}

async function runTest(test: TestCase): Promise<boolean> {
  console.log(`\n${test.name}`);
  console.log('-'.repeat(60));

  resetCounters();

  try {
    const actual = await test.run();

    // Check result
    const resultMatch = deepEqual(actual, test.expected);

    // Check execution counts if specified
    let executionMatch = true;
    if (test.expectedExecutions) {
      executionMatch = deepEqual(executionCounts, test.expectedExecutions);
    }

    if (resultMatch && executionMatch) {
      console.log('PASS');
      console.log('   Expected:', JSON.stringify(test.expected, null, 2));
      console.log('   Actual:  ', JSON.stringify(actual, null, 2));
      if (test.expectedExecutions) {
        console.log('   Executions:', JSON.stringify(executionCounts));
      }
      return true;
    } else {
      console.log('FAIL');
      if (!resultMatch) {
        console.log('   Expected result:', JSON.stringify(test.expected, null, 2));
        console.log('   Actual result:  ', JSON.stringify(actual, null, 2));
      }
      if (!executionMatch && test.expectedExecutions) {
        console.log('   Expected executions:', test.expectedExecutions);
        console.log('   Actual executions:  ', executionCounts);
      }
      return false;
    }
  } catch (error) {
    console.log('ERROR:', (error as Error).message);
    return false;
  }
}

async function runStrictTests() {
  console.log('AStack Pipeline Strict Test Suite');
  console.log('='.repeat(60));

  const pipeline = new Pipeline();

  const preprocessor = new DataPreprocessor({});
  const sentimentAnalyzer = new SentimentAnalyzer({});
  const keywordExtractor = new KeywordExtractor({});
  const lengthAnalyzer = new LengthAnalyzer({});

  pipeline.addComponent('preprocessor', preprocessor);
  pipeline.addComponent('sentiment', sentimentAnalyzer);
  pipeline.addComponent('keywords', keywordExtractor);
  pipeline.addComponent('length', lengthAnalyzer);

  // Build topology
  pipeline.connect('preprocessor.out', 'sentiment.in');
  pipeline.connect('preprocessor.out', 'keywords.in');
  pipeline.connect('preprocessor.out', 'length.in');

  const testData1 = {
    text: '  This is a GREAT example of Advanced Pipeline capabilities!  ',
  };

  const testData2 = {
    text: '  Bad and terrible experience with old systems  ',
  };

  const tests: TestCase[] = [
    {
      name: 'Test 1: Route to sentiment endpoint',
      run: () => pipeline.run('preprocessor.in', testData1, 'sentiment.out'),
      expected: { sentiment: 'positive', confidence: 0.85 },
      expectedExecutions: { preprocessor: 1, sentiment: 1, keywords: 1, length: 1 },
    },
    {
      name: 'Test 2: Route to keywords endpoint',
      run: () => pipeline.run('preprocessor.in', testData1, 'keywords.out'),
      expected: {
        keywords: ['great', 'example', 'advanced', 'pipeline', 'capabilities!'],
        count: 5,
      },
      expectedExecutions: { preprocessor: 1, sentiment: 1, keywords: 1, length: 1 },
    },
    {
      name: 'Test 3: Route to length endpoint',
      run: () => pipeline.run('preprocessor.in', testData1, 'length.out'),
      expected: {
        charCount: 58,
        wordCount: 9,
        avgWordLength: 6.444444444444445,
      },
      expectedExecutions: { preprocessor: 1, sentiment: 1, keywords: 1, length: 1 },
    },
    {
      name: 'Test 4: Multi-output collection',
      run: () =>
        pipeline.run('preprocessor.in', testData1, {
          includeOutputsFrom: ['sentiment.out', 'keywords.out', 'length.out'],
        }),
      expected: {
        'sentiment.out': { sentiment: 'positive', confidence: 0.85 },
        'keywords.out': {
          keywords: ['great', 'example', 'advanced', 'pipeline', 'capabilities!'],
          count: 5,
        },
        'length.out': {
          charCount: 58,
          wordCount: 9,
          avgWordLength: 6.444444444444445,
        },
      },
      expectedExecutions: { preprocessor: 1, sentiment: 1, keywords: 1, length: 1 },
    },
    {
      name: 'Test 5: Topology reuse with different data',
      run: () => pipeline.run('preprocessor.in', testData2, 'sentiment.out'),
      expected: { sentiment: 'negative', confidence: 0.85 },
      expectedExecutions: { preprocessor: 1, sentiment: 1, keywords: 1, length: 1 },
    },
    {
      name: 'Test 6: Multi-output reuse',
      run: () =>
        pipeline.run('preprocessor.in', testData2, {
          includeOutputsFrom: ['sentiment.out', 'keywords.out', 'length.out'],
        }),
      expected: {
        'sentiment.out': { sentiment: 'negative', confidence: 0.85 },
        'keywords.out': {
          keywords: ['terrible', 'experience', 'systems'],
          count: 3,
        },
        'length.out': {
          charCount: 44,
          wordCount: 7,
          avgWordLength: 6.285714285714286,
        },
      },
      expectedExecutions: { preprocessor: 1, sentiment: 1, keywords: 1, length: 1 },
    },
    {
      name: 'Test 7: Standalone component execution',
      run: async () => {
        const pipeline2 = new Pipeline();
        const standaloneSentiment = new SentimentAnalyzer({});
        pipeline2.addComponent('sentiment', standaloneSentiment);

        const directData = { cleaned: 'this is a great test of arbitrary execution' };
        return pipeline2.run('sentiment.in', directData);
      },
      expected: { sentiment: 'positive', confidence: 0.85 },
      expectedExecutions: { preprocessor: 0, sentiment: 1, keywords: 0, length: 0 },
    },
    {
      name: 'Test 8: Different pipeline, different entry point - keywords',
      run: async () => {
        const pipelineA = new Pipeline();
        const keywordsOnly = new KeywordExtractor({});
        pipelineA.addComponent('keywords', keywordsOnly);
        const directData = { cleaned: 'this is a great test of arbitrary execution' };
        return pipelineA.run('keywords.in', directData);
      },
      expected: {
        keywords: ['great', 'arbitrary', 'execution'],
        count: 3,
      },
      expectedExecutions: { preprocessor: 0, sentiment: 0, keywords: 1, length: 0 },
    },
    {
      name: 'Test 9: Different pipeline, different entry point - length',
      run: async () => {
        const pipelineB = new Pipeline();
        const lengthOnly = new LengthAnalyzer({});
        pipelineB.addComponent('length', lengthOnly);
        const directData = { cleaned: 'this is a great test of arbitrary execution' };
        return pipelineB.run('length.in', directData);
      },
      expected: {
        charCount: 43,
        wordCount: 8,
        avgWordLength: 5.375,
      },
      expectedExecutions: { preprocessor: 0, sentiment: 0, keywords: 0, length: 1 },
    },
  ];

  // Run tests SEQUENTIALLY to avoid shared counter issues
  const results: boolean[] = [];
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
  }

  const passed = results.filter(Boolean).length;
  const failed = results.length - passed;

  console.log('\n' + '='.repeat(60));
  console.log('Test Summary');
  console.log('-'.repeat(60));
  console.log(`Passed: ${passed}/${results.length}`);
  console.log(`Failed: ${failed}/${results.length}`);

  if (failed === 0) {
    console.log('\nAll tests passed!');
    console.log('\nAStack Pipeline is production-ready!');
    console.log('   - Zero duplicate executions');
    console.log('   - Correct results for all routes');
    console.log('   - Topology reuse working perfectly');
    console.log('   - Multi-output collection accurate');
    console.log('   - Standalone and arbitrary execution verified');
  } else {
    console.log('\nSome tests failed. Please review above.');
    process.exit(1);
  }
}

runStrictTests().catch(console.error);
