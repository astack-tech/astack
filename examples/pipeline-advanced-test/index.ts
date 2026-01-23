import { Pipeline, Component } from '@astack-tech/core';
import type { Port } from '@astack-tech/core';

/**
 * Advanced Pipeline Test Suite
 *
 * Demonstrates AStack's core capabilities:
 * 1. Arbitrary start/end point selection via virtual START/END nodes
 * 2. Multi-output collection with includeOutputsFrom
 * 3. Complex topologies with multiple branches
 * 4. Same topology, different execution paths
 */

// Test Components with proper _transform implementation

class DataPreprocessor extends Component {
  constructor(opts: unknown) {
    super(opts);
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { text: string }) => {
      console.log('Preprocessor: Cleaning data...');
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
      console.log('Sentiment: Analyzing...');
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
      console.log('Keywords: Extracting...');
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
      console.log('Length: Analyzing...');
      const result = {
        charCount: data.cleaned.length,
        wordCount: data.cleaned.split(' ').length,
        avgWordLength: data.cleaned.length / data.cleaned.split(' ').length,
      };
      $o('out').send(result);
    });
  }
}

async function runAdvancedTests() {
  console.log('AStack Pipeline Advanced Test Suite\n');
  console.log('='.repeat(60));

  // Test 1: Multi-branch topology with different endpoints
  console.log('\nTest 1: Complex topology - same start, different endpoints');
  console.log('-'.repeat(60));

  const pipeline = new Pipeline();

  const preprocessor = new DataPreprocessor({});
  const sentimentAnalyzer = new SentimentAnalyzer({});
  const keywordExtractor = new KeywordExtractor({});
  const lengthAnalyzer = new LengthAnalyzer({});

  pipeline.addComponent('preprocessor', preprocessor);
  pipeline.addComponent('sentiment', sentimentAnalyzer);
  pipeline.addComponent('keywords', keywordExtractor);
  pipeline.addComponent('length', lengthAnalyzer);

  // Topology: preprocessor fans out to 3 analyzers
  pipeline.connect('preprocessor.out', 'sentiment.in');
  pipeline.connect('preprocessor.out', 'keywords.in');
  pipeline.connect('preprocessor.out', 'length.in');

  const testData = {
    text: '  This is a GREAT example of Advanced Pipeline capabilities!  ',
  };

  console.log('Test Data:', testData);
  console.log();

  // Route 1: preprocessor -> sentiment
  console.log('Route 1: preprocessor -> sentiment');
  const result1 = await pipeline.run('preprocessor.in', testData, 'sentiment.out');
  console.log('Result - Sentiment:', result1);
  console.log();

  // Route 2: preprocessor -> keywords
  console.log('Route 2: preprocessor -> keywords');
  const result2 = await pipeline.run('preprocessor.in', testData, 'keywords.out');
  console.log('Result - Keywords:', result2);
  console.log();

  // Route 3: preprocessor -> length
  console.log('Route 3: preprocessor -> length');
  const result3 = await pipeline.run('preprocessor.in', testData, 'length.out');
  console.log('Result - Length:', result3);
  console.log();

  // Test 2: Multi-output collection
  console.log('\nTest 2: Collect multiple outputs (includeOutputsFrom)');
  console.log('-'.repeat(60));
  const result4 = await pipeline.run('preprocessor.in', testData, {
    includeOutputsFrom: ['sentiment.out', 'keywords.out', 'length.out'],
  });
  console.log('Multi-Output Results:');
  console.log('   Sentiment:', result4['sentiment.out']);
  console.log('   Keywords:', result4['keywords.out']);
  console.log('   Length:', result4['length.out']);
  console.log();

  // Test 3: Reuse with different data
  console.log('\nTest 3: Topology reuse with different data');
  console.log('-'.repeat(60));
  const testData2 = { text: '  Bad and terrible experience with old systems  ' };
  const result5 = await pipeline.run('preprocessor.in', testData2, 'sentiment.out');
  console.log('Result - Sentiment (different data):', result5);
  console.log();

  // Test 4: Multi-output reuse
  console.log('\nTest 4: Multi-output reuse');
  console.log('-'.repeat(60));
  const result6 = await pipeline.run('preprocessor.in', testData2, {
    includeOutputsFrom: ['sentiment.out', 'keywords.out', 'length.out'],
  });
  console.log('Multi-Output Results (Reused):');
  console.log('   Sentiment:', result6['sentiment.out']);
  console.log('   Keywords:', result6['keywords.out']);
  console.log('   Length:', result6['length.out']);
  console.log();

  // Test 5: Standalone component (arbitrary start point via single component)
  console.log('\nTest 5: Standalone component execution');
  console.log('-'.repeat(60));
  const pipeline2 = new Pipeline();
  const standaloneSentiment = new SentimentAnalyzer({});
  pipeline2.addComponent('sentiment', standaloneSentiment);

  const directData = { cleaned: 'this is a great test of arbitrary execution' };
  const result7 = await pipeline2.run('sentiment.in', directData);
  console.log('Result - Standalone sentiment:', result7);
  console.log();

  // Test 6: Different start points via multiple standalone pipelines
  console.log('\nTest 6: Different pipelines, different entry points');
  console.log('-'.repeat(60));

  // Pipeline A: Start from keywords
  const pipelineA = new Pipeline();
  const keywordsOnly = new KeywordExtractor({});
  pipelineA.addComponent('keywords', keywordsOnly);
  const resultA = await pipelineA.run('keywords.in', directData);
  console.log('Result - Pipeline A (keywords only):', resultA);

  // Pipeline B: Start from length
  const pipelineB = new Pipeline();
  const lengthOnly = new LengthAnalyzer({});
  pipelineB.addComponent('length', lengthOnly);
  const resultB = await pipelineB.run('length.in', directData);
  console.log('Result - Pipeline B (length only):', resultB);
  console.log();

  console.log('\n' + '='.repeat(60));
  console.log('All tests completed successfully!');
  console.log('\nAStack Pipeline Capabilities Demonstrated:');
  console.log('   - Virtual START/END nodes enable arbitrary execution paths');
  console.log('   - Same topology, multiple different routes (different endpoints)');
  console.log('   - Multi-output collection (includeOutputsFrom)');
  console.log('   - Topology reuse optimization');
  console.log('   - Multi-output reuse');
  console.log('   - Standalone component execution');
  console.log('   - Multiple independent pipelines with different entry points');
  console.log('\nAStack + HLang: Production-grade design');
  console.log('   HLang: Pure reactive FBP runtime (READABLE root node)');
  console.log('   AStack: Smart virtual START/END for flexible orchestration');
}

runAdvancedTests().catch(console.error);
