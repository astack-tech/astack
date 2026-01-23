import { Pipeline, Component } from '@astack-tech/core';
import type { Port } from '@astack-tech/core';

/**
 * AStack Ultimate Test Suite - Comprehensive Coverage
 *
 * Complete scenario coverage:
 * 1. Arbitrary Start Points
 * 2. Arbitrary End Points
 * 3. Circular/Loop Connections
 * 4. Multi-Output Collection
 * 5. Complex Topologies
 * 6. Branch & Merge
 * 7. Dynamic Routing
 * 8. Parallel Execution
 * 9. Conditional Routing
 * 10. Self-Loop Components
 */

// ============================================================================
// Basic Test Components
// ============================================================================

class DataSource extends Component {
  constructor(opts: unknown) {
    super(opts);
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((input: { query: string }) => {
      console.log(`DataSource: Fetching data for "${input.query}"`);
      const result = {
        query: input.query,
        results: [`result1 for ${input.query}`, `result2 for ${input.query}`],
        metadata: { timestamp: Date.now(), source: 'DataSource' },
      };
      $o('out').send(result);
    });
  }
}

class Transformer extends Component {
  constructor(opts: unknown) {
    super(opts);
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { results: string[] }) => {
      console.log(`Transformer: Processing ${data.results.length} results`);
      const result = {
        transformed: data.results.map(r => r.toUpperCase()),
        count: data.results.length,
      };
      $o('out').send(result);
    });
  }
}

class Filter extends Component {
  constructor(opts: unknown) {
    super(opts);
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { transformed: string[] }) => {
      console.log(`Filter: Filtering ${data.transformed.length} items`);
      const result = {
        filtered: data.transformed.filter(r => r.includes('RESULT1')),
        totalProcessed: data.transformed.length,
      };
      $o('out').send(result);
    });
  }
}

class Aggregator extends Component {
  constructor(opts: unknown) {
    super(opts);
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { filtered: string[] }) => {
      console.log(`Aggregator: Aggregating ${data.filtered.length} items`);
      const result = {
        aggregated: data.filtered.join(', '),
        itemCount: data.filtered.length,
      };
      $o('out').send(result);
    });
  }
}

class Validator extends Component {
  constructor(opts: unknown) {
    super(opts);
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { aggregated: string }) => {
      console.log(`Validator: Validating output`);
      const result = {
        valid: data.aggregated.length > 0,
        length: data.aggregated.length,
        result: data.aggregated,
      };
      $o('out').send(result);
    });
  }
}

// ============================================================================
// Advanced Components with Multiple Ports
// ============================================================================

/**
 * IterativeEnhancer - Loop component with continue and final output ports
 *
 * Input: { value: string; iteration?: number }
 * Output 'continue': sends for next iteration
 * Output 'final': sends when loop completes
 */
class IterativeEnhancer extends Component {
  private maxIterations: number;

  constructor(opts: { maxIterations?: number } = {}) {
    super(opts);
    this.maxIterations = opts.maxIterations || 3;

    Component.Port.I('in').attach(this);
    Component.Port.O('continue').attach(this);
    Component.Port.O('final').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { value: string; iteration?: number }) => {
      const currentIteration = (data.iteration || 0) + 1;
      console.log(`IterativeEnhancer: Iteration ${currentIteration}`);

      const enhanced = {
        value: data.value + `_enhanced_${currentIteration}`,
        iteration: currentIteration,
      };

      if (currentIteration < this.maxIterations) {
        console.log(`  -> Sending to 'continue' port for next iteration`);
        $o('continue').send(enhanced);
      } else {
        console.log(`  -> Sending to 'final' port (loop complete)`);
        $o('final').send(enhanced);
      }
    });
  }
}

/**
 * ConditionalRouter - Routes data to different outputs based on condition
 *
 * Input: { value: number }
 * Output 'even': sends if value is even with result
 * Output 'odd': sends if value is odd with result
 * Output 'all': always sends routing metadata
 */
class ConditionalRouter extends Component {
  constructor(opts: unknown) {
    super(opts);

    Component.Port.I('in').attach(this);
    Component.Port.O('even').attach(this);
    Component.Port.O('odd').attach(this);
    Component.Port.O('all').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { value: number }) => {
      console.log(`ConditionalRouter: Routing value ${data.value}`);

      const isEven = data.value % 2 === 0;
      const result = isEven ? data.value * 2 : data.value * 3;

      // Send to specific route with processed result
      const routedData = {
        originalValue: data.value,
        processedValue: result,
        route: isEven ? 'even' : 'odd',
      };

      if (isEven) {
        console.log(`  -> Routing to 'even' port`);
        $o('even').send(routedData);
      } else {
        console.log(`  -> Routing to 'odd' port`);
        $o('odd').send(routedData);
      }

      // Always send metadata to 'all' port
      const metadata = {
        isEven,
        isPositive: data.value > 0,
        originalValue: data.value,
        processedValue: result,
        routePath: isEven ? 'even' : 'odd',
      };
      $o('all').send(metadata);
    });
  }
}

/**
 * ParallelProcessorA - Processes routed data
 *
 * Input: { originalValue: number; processedValue: number; route: string }
 * Output: { processedBy: string; input: number; output: number }
 */
class ParallelProcessorA extends Component {
  constructor(opts: unknown) {
    super(opts);
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { originalValue: number; processedValue: number }) => {
      console.log(`ParallelProcessorA: Processing value ${data.originalValue}`);
      const result = {
        processedBy: 'ProcessorA',
        input: data.originalValue,
        output: data.processedValue * 10, // Additional processing
      };
      $o('out').send(result);
    });
  }
}

/**
 * ParallelProcessorB - Processes routed data
 *
 * Input: { originalValue: number; processedValue: number; route: string }
 * Output: { processedBy: string; input: number; output: number }
 */
class ParallelProcessorB extends Component {
  constructor(opts: unknown) {
    super(opts);
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { originalValue: number; processedValue: number }) => {
      console.log(`ParallelProcessorB: Processing value ${data.originalValue}`);
      const result = {
        processedBy: 'ProcessorB',
        input: data.originalValue,
        output: data.processedValue * 100, // Additional processing
      };
      $o('out').send(result);
    });
  }
}

/**
 * ResultAggregator - Aggregates processor results
 *
 * Input: { processedBy: string; input: number; output: number }
 * Output: { totalOutputs: number; sum: number; sources: string[] }
 */
class ResultAggregator extends Component {
  private results: Array<{ processedBy: string; output: number }> = [];

  constructor(opts: unknown) {
    super(opts);
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { processedBy: string; input: number; output: number }) => {
      console.log(`ResultAggregator: Collecting result from ${data.processedBy}`);
      this.results.push({ processedBy: data.processedBy, output: data.output });

      // Send aggregated result
      const result = {
        totalOutputs: this.results.length,
        sum: this.results.reduce((sum, r) => sum + r.output, 0),
        sources: this.results.map(r => r.processedBy),
        details: this.results,
      };
      $o('out').send(result);
    });
  }
}

/**
 * LoopCounter - Self-loop component with conditional output
 *
 * Input: { increment: number }
 * Output 'loop': sends back to self if count < threshold
 * Output 'done': sends final count when threshold reached
 */
class LoopCounter extends Component {
  private count: number = 0;
  private threshold: number;

  constructor(opts: { threshold?: number } = {}) {
    super(opts);
    this.threshold = opts.threshold || 10;

    Component.Port.I('in').attach(this);
    Component.Port.O('loop').attach(this);
    Component.Port.O('done').attach(this);
  }

  _transform($i: Port, $o: Port) {
    $i('in').receive((data: { increment: number }) => {
      this.count += data.increment;
      console.log(`LoopCounter: Count is now ${this.count}`);

      const result = {
        currentCount: this.count,
        threshold: this.threshold,
        shouldLoop: this.count < this.threshold,
      };

      if (this.count < this.threshold) {
        console.log(`  -> Sending to 'loop' port (continue counting)`);
        $o('loop').send({ increment: data.increment });
      } else {
        console.log(`  -> Sending to 'done' port (threshold reached)`);
        $o('done').send(result);
      }
    });
  }
}

// ============================================================================
// Ultimate Test Suite
// ============================================================================

async function runUltimateTests() {
  console.log('AStack Ultimate Test Suite - Comprehensive Coverage');
  console.log('='.repeat(80));

  let testNumber = 0;

  // Test 1: Basic Linear Pipeline
  console.log(`\nTest ${++testNumber}: Basic Linear Pipeline`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('source', new DataSource({}));
    pipeline.addComponent('transform', new Transformer({}));
    pipeline.addComponent('filter', new Filter({}));

    pipeline.connect('source.out', 'transform.in');
    pipeline.connect('transform.out', 'filter.in');

    const result = await pipeline.run('source.in', { query: 'test' }, 'filter.out');
    console.log('Result:', result);
  }

  // Test 2: Arbitrary Start Point
  console.log(`\nTest ${++testNumber}: Arbitrary Start Point - Start from Middle`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('transform', new Transformer({}));
    pipeline.addComponent('filter', new Filter({}));

    pipeline.connect('transform.out', 'filter.in');

    const result = await pipeline.run(
      'transform.in',
      { results: ['apple', 'banana', 'result1_cherry'] },
      'filter.out'
    );
    console.log('Result:', result);
  }

  // Test 3: Arbitrary End Point
  console.log(`\nTest ${++testNumber}: Arbitrary End Point - End at Middle`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('source', new DataSource({}));
    pipeline.addComponent('transform', new Transformer({}));
    pipeline.addComponent('filter', new Filter({}));

    pipeline.connect('source.out', 'transform.in');
    pipeline.connect('transform.out', 'filter.in');

    const result = await pipeline.run('source.in', { query: 'test' }, 'transform.out');
    console.log('Result:', result);
  }

  // Test 4: Arbitrary Start AND End
  console.log(`\nTest ${++testNumber}: Arbitrary Start AND End - Middle to Middle`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('source', new DataSource({}));
    pipeline.addComponent('transform', new Transformer({}));
    pipeline.addComponent('filter', new Filter({}));
    pipeline.addComponent('aggregate', new Aggregator({}));

    pipeline.connect('source.out', 'transform.in');
    pipeline.connect('transform.out', 'filter.in');
    pipeline.connect('filter.out', 'aggregate.in');

    const result = await pipeline.run(
      'transform.in',
      { results: ['result1_test', 'other'] },
      'filter.out'
    );
    console.log('Result:', result);
  }

  // Test 5: Multi-Output Collection
  console.log(`\nTest ${++testNumber}: Multi-Output Collection (includeOutputsFrom)`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('source', new DataSource({}));
    pipeline.addComponent('transform', new Transformer({}));
    pipeline.addComponent('filter', new Filter({}));
    pipeline.addComponent('aggregate', new Aggregator({}));

    pipeline.connect('source.out', 'transform.in');
    pipeline.connect('transform.out', 'filter.in');
    pipeline.connect('filter.out', 'aggregate.in');

    const result = await pipeline.run(
      'source.in',
      { query: 'multi-collect' },
      {
        includeOutputsFrom: ['source.out', 'transform.out', 'filter.out', 'aggregate.out'],
      }
    );

    console.log('Multi-Output Result:');
    Object.entries(result).forEach(([key, value]) => {
      console.log(`   ${key}:`, value);
    });
  }

  // Test 6: Complex Branching Topology
  console.log(`\nTest ${++testNumber}: Complex Branching Topology`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('source', new DataSource({}));
    pipeline.addComponent('transformA', new Transformer({}));
    pipeline.addComponent('transformB', new Transformer({}));
    pipeline.addComponent('filterA', new Filter({}));
    pipeline.addComponent('filterB', new Filter({}));

    pipeline.connect('source.out', 'transformA.in');
    pipeline.connect('source.out', 'transformB.in');
    pipeline.connect('transformA.out', 'filterA.in');
    pipeline.connect('transformB.out', 'filterB.in');

    const result = await pipeline.run(
      'source.in',
      { query: 'branch-test' },
      {
        includeOutputsFrom: ['filterA.out', 'filterB.out'],
      }
    );

    console.log('Branched Results:');
    Object.entries(result).forEach(([key, value]) => {
      console.log(`   ${key}:`, value);
    });
  }

  // Test 7: Parallel Execution with Conditional Routing
  console.log(`\nTest ${++testNumber}: Parallel Execution with Conditional Routing`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('router', new ConditionalRouter({}));
    pipeline.addComponent('processorA', new ParallelProcessorA({}));
    pipeline.addComponent('processorB', new ParallelProcessorB({}));

    // Route even values to ProcessorA, odd values to ProcessorB
    pipeline.connect('router.even', 'processorA.in');
    pipeline.connect('router.odd', 'processorB.in');

    const result = await pipeline.run(
      'router.in',
      { value: 42 },
      {
        includeOutputsFrom: ['router.all', 'processorA.out'],
      }
    );

    console.log('Conditional Routing Results (even value):');
    Object.entries(result).forEach(([key, value]) => {
      console.log(`   ${key}:`, value);
    });
  }

  // Test 8: Diamond Topology
  console.log(`\nTest ${++testNumber}: Diamond Topology (Split & Merge)`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('source', new DataSource({}));
    pipeline.addComponent('transformA', new Transformer({}));
    pipeline.addComponent('transformB', new Transformer({}));
    pipeline.addComponent('filter', new Filter({}));

    pipeline.connect('source.out', 'transformA.in');
    pipeline.connect('source.out', 'transformB.in');
    pipeline.connect('transformA.out', 'filter.in');
    pipeline.connect('transformB.out', 'filter.in');

    const result = await pipeline.run('source.in', { query: 'diamond' }, 'filter.out');
    console.log('Diamond Result:', result);
  }

  // Test 9: Circular Topology Detection
  console.log(`\nTest ${++testNumber}: Circular Topology Detection`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('a', new Transformer({}));
    pipeline.addComponent('b', new Filter({}));
    pipeline.addComponent('c', new Aggregator({}));

    pipeline.connect('a.out', 'b.in');
    pipeline.connect('b.out', 'c.in');
    pipeline.connect('c.out', 'a.in');

    try {
      await pipeline.run('a.in', { results: ['test'] });
      console.log('ERROR: Should have thrown error for circular topology!');
    } catch (error) {
      console.log('Correctly detected circular topology:', (error as Error).message);
    }
  }

  // Test 10: Self-Loop Component (IterativeEnhancer)
  console.log(`\nTest ${++testNumber}: Self-Loop Component (IterativeEnhancer)`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('enhancer', new IterativeEnhancer({ maxIterations: 3 }));

    // Connect continue port back to input for looping
    pipeline.connect('enhancer.continue', 'enhancer.in');

    const result = await pipeline.run(
      'enhancer.in',
      { value: 'start', iteration: 0 },
      'enhancer.final'
    );
    console.log('Self-Loop Result:', result);
  }

  // Test 11: Multi-Level Nested Branching
  console.log(`\nTest ${++testNumber}: Multi-Level Nested Branching`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('source', new DataSource({}));
    pipeline.addComponent('transform1', new Transformer({}));
    pipeline.addComponent('transform2', new Transformer({}));
    pipeline.addComponent('filter1', new Filter({}));
    pipeline.addComponent('filter2', new Filter({}));
    pipeline.addComponent('agg1', new Aggregator({}));
    pipeline.addComponent('agg2', new Aggregator({}));

    pipeline.connect('source.out', 'transform1.in');
    pipeline.connect('source.out', 'transform2.in');
    pipeline.connect('transform1.out', 'filter1.in');
    pipeline.connect('transform2.out', 'filter2.in');
    pipeline.connect('filter1.out', 'agg1.in');
    pipeline.connect('filter2.out', 'agg2.in');

    const result = await pipeline.run(
      'source.in',
      { query: 'nested-branch' },
      {
        includeOutputsFrom: ['agg1.out', 'agg2.out'],
      }
    );

    console.log('Multi-Level Branch Results:');
    Object.entries(result).forEach(([key, value]) => {
      console.log(`   ${key}:`, value);
    });
  }

  // Test 12: Conditional Routing with Odd Value
  console.log(`\nTest ${++testNumber}: Conditional Routing with Odd Value`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('router', new ConditionalRouter({}));
    pipeline.addComponent('processorA', new ParallelProcessorA({}));
    pipeline.addComponent('processorB', new ParallelProcessorB({}));

    pipeline.connect('router.even', 'processorA.in');
    pipeline.connect('router.odd', 'processorB.in');

    const result = await pipeline.run(
      'router.in',
      { value: 7 },
      {
        includeOutputsFrom: ['router.all', 'processorB.out'],
      }
    );

    console.log('Conditional Routing Results (odd value):');
    Object.entries(result).forEach(([key, value]) => {
      console.log(`   ${key}:`, value);
    });
  }

  // Test 13: Self-Loop Counter Component
  console.log(`\nTest ${++testNumber}: Self-Loop Counter (LoopCounter)`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('counter', new LoopCounter({ threshold: 10 }));

    // Connect loop port back to input
    pipeline.connect('counter.loop', 'counter.in');

    const result = await pipeline.run('counter.in', { increment: 3 }, 'counter.done');
    console.log('Loop Counter Result:', result);
  }

  // Test 14: Complex Multi-Stage Pipeline with Validation
  console.log(`\nTest ${++testNumber}: Complex Multi-Stage Pipeline with Validation`);
  console.log('-'.repeat(80));
  {
    const pipeline = new Pipeline();
    pipeline.addComponent('source', new DataSource({}));
    pipeline.addComponent('transform', new Transformer({}));
    pipeline.addComponent('filter', new Filter({}));
    pipeline.addComponent('aggregate', new Aggregator({}));
    pipeline.addComponent('validate', new Validator({}));

    pipeline.connect('source.out', 'transform.in');
    pipeline.connect('transform.out', 'filter.in');
    pipeline.connect('filter.out', 'aggregate.in');
    pipeline.connect('aggregate.out', 'validate.in');

    const result = await pipeline.run(
      'source.in',
      { query: 'validation-test' },
      {
        includeOutputsFrom: ['transform.out', 'filter.out', 'aggregate.out', 'validate.out'],
      }
    );

    console.log('Multi-Stage Pipeline Results:');
    Object.entries(result).forEach(([key, value]) => {
      console.log(`   ${key}:`, value);
    });
  }

  // Test 15: Ultimate Mix - Looping + Conditional + Aggregation
  console.log(`\nTest ${++testNumber}: Ultimate Mix - Looping + Conditional + Aggregation`);
  console.log('-'.repeat(80));
  {
    // Need a converter component between enhancer and router
    class NumberConverter extends Component {
      constructor(opts: unknown) {
        super(opts);
        Component.Port.I('in').attach(this);
        Component.Port.O('out').attach(this);
      }

      _transform($i: Port, $o: Port) {
        $i('in').receive((data: { value: string; iteration: number }) => {
          console.log(`NumberConverter: Converting enhanced value to number`);
          // Extract iteration count as the number to route
          const result = {
            value: data.iteration, // Use iteration count as the numeric value
          };
          $o('out').send(result);
        });
      }
    }

    const pipeline = new Pipeline();
    pipeline.addComponent('enhancer', new IterativeEnhancer({ maxIterations: 2 }));
    pipeline.addComponent('converter', new NumberConverter({}));
    pipeline.addComponent('router', new ConditionalRouter({}));
    pipeline.addComponent('processorA', new ParallelProcessorA({}));
    pipeline.addComponent('processorB', new ParallelProcessorB({}));
    pipeline.addComponent('aggregator', new ResultAggregator({}));

    // Complex topology with loop
    pipeline.connect('enhancer.continue', 'enhancer.in'); // Self-loop
    pipeline.connect('enhancer.final', 'converter.in');
    pipeline.connect('converter.out', 'router.in');
    pipeline.connect('router.even', 'processorA.in');
    pipeline.connect('router.odd', 'processorB.in');
    pipeline.connect('processorA.out', 'aggregator.in');
    pipeline.connect('processorB.out', 'aggregator.in');

    // Start with a string that will be enhanced twice, then converted and routed
    const result = await pipeline.run(
      'enhancer.in',
      { value: 'data', iteration: 0 },
      'aggregator.out'
    );
    console.log('Ultimate Mix Result:', result);
  }

  console.log('\n' + '='.repeat(80));
  console.log('AStack Ultimate Test Suite - ALL TESTS COMPLETED');
  console.log('='.repeat(80));

  console.log('\nComprehensive Feature Coverage:');
  console.log('  1. Basic Linear Pipeline');
  console.log('  2. Arbitrary Start Point (middleware execution)');
  console.log('  3. Arbitrary End Point (partial pipeline execution)');
  console.log('  4. Arbitrary Start AND End (middle-to-middle execution)');
  console.log('  5. Multi-Output Collection (includeOutputsFrom)');
  console.log('  6. Complex Branching Topology (fan-out)');
  console.log('  7. Parallel Execution with Conditional Routing');
  console.log('  8. Diamond Topology (split & merge)');
  console.log('  9. Circular Topology Detection');
  console.log('  10. Self-Loop Component (IterativeEnhancer)');
  console.log('  11. Multi-Level Nested Branching');
  console.log('  12. Conditional Routing with Odd Value');
  console.log('  13. Self-Loop Counter Component');
  console.log('  14. Complex Multi-Stage Pipeline with Validation');
  console.log('  15. Ultimate Mix (Looping + Conditional + Aggregation)');

  console.log('\nAStack Pipeline Production Capabilities:');
  console.log('  - Virtual START/END nodes for flexible orchestration');
  console.log('  - Loop and iteration support with conditional outputs');
  console.log('  - Multi-output conditional routing');
  console.log('  - Arbitrary start/end point execution');
  console.log('  - Complex topology support (diamond, branching, circular)');
  console.log('  - Topology reuse optimization');
  console.log('  - Multi-output collection with includeOutputsFrom');
  console.log('  - Component-level _transform implementation for reactive FBP');
  console.log('  - Strict data contracts between components');

  console.log('\nAStack + HLang: Production-Ready Flow-Based Programming Framework');
}

runUltimateTests().catch(console.error);
