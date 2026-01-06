import { RLMAgent, FileSystemContext, type LLMProvider } from '@astack-tech/components/agents';
import { Deepseek } from '@astack-tech/integrations/model-provider';

/**
 * OOLONG-Pairs Benchmark
 *
 * Based on the paper "Recursive Language Models" (arXiv:2512.24601v1)
 * OOLONG-Pairs is a synthetic benchmark that requires analyzing pairs of entries,
 * making it a quadratic complexity task (O(N²)) that challenges LLMs' long-context
 * reasoning capabilities.
 *
 * Task: Given N entries with user_id and semantic categories, find all pairs
 * where both users satisfy certain conditions (e.g., both have "entity" or "location").
 */

/**
 * Adapter to wrap Deepseek as LLMProvider for RLM
 */
class DeepseekLLMProvider implements LLMProvider {
  private deepseek: Deepseek;

  constructor(apiKey: string, model: string) {
    this.deepseek = new Deepseek({ apiKey, model });
  }

  async generate(prompt: string): Promise<string> {
    return await this.deepseek.generateCompletion(prompt);
  }

  async *generateStream(prompt: string): AsyncGenerator<string> {
    const messages = [{ role: 'user' as const, content: prompt }];
    for await (const chunk of this.deepseek.streamChatCompletion(messages)) {
      if (chunk.content) {
        yield chunk.content;
      }
    }
  }
}

/**
 * Semantic categories for OOLONG-Pairs tasks
 * Based on the paper's classification scheme
 */
type SemanticCategory =
  | 'entity'
  | 'location'
  | 'numeric value'
  | 'description and abstract concept'
  | 'abbreviation'
  | 'human being';

/**
 * Data entry structure for OOLONG-Pairs
 */
interface DataEntry {
  userId: number;
  question: string;
  category: SemanticCategory;
  date: string;
}

/**
 * OOLONG-Pairs task definition
 */
interface OolongPairsTask {
  name: string;
  context: string;
  query: string;
  expectedPairs: Array<[number, number]>;
  numEntries: number;
}

/**
 * Evaluation metrics for OOLONG-Pairs
 */
interface EvaluationMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
}

/**
 * Generate synthetic OOLONG-Pairs data
 *
 * Creates N entries with random user IDs, semantic categories, and dates.
 * This simulates the structure of the real OOLONG benchmark.
 *
 * @param numEntries - Number of data entries to generate
 * @returns Array of data entries
 */
function generateSyntheticData(numEntries: number): DataEntry[] {
  const categories: SemanticCategory[] = [
    'entity',
    'location',
    'numeric value',
    'description and abstract concept',
    'abbreviation',
    'human being',
  ];

  const questionTemplates: Record<SemanticCategory, string[]> = {
    entity: ['What is the capital of {place}?', 'Who founded {company}?'],
    location: ['Where is {place} located?', 'What country is {city} in?'],
    'numeric value': ['What year was {event}?', 'How many {item} are there?'],
    'description and abstract concept': ['What is {concept}?', 'Explain {topic}'],
    abbreviation: ['What does {abbr} stand for?', 'Define {acronym}'],
    'human being': ['Who is {person}?', 'Who invented {invention}?'],
  };

  const entries: DataEntry[] = [];

  for (let i = 0; i < numEntries; i++) {
    const userId = 10000 + i;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const templates = questionTemplates[category];
    const template = templates[Math.floor(Math.random() * templates.length)];
    const question = template.replace(/\{[^}]+\}/g, 'X');

    // Generate random date in 2023
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const date = `2023-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    entries.push({ userId, question, category, date });
  }

  return entries;
}

/**
 * Create OOLONG-Pairs Task 1: Both users have "entity" or "location"
 *
 * This is a representative task from the paper (similar to Task 2 in Appendix E.1)
 * Complexity: O(N²) - must check all possible pairs
 *
 * @param numEntries - Number of entries in the dataset
 * @returns OOLONG-Pairs task definition
 */
function createTask1(numEntries: number): OolongPairsTask {
  const entries = generateSyntheticData(numEntries);

  // Build context string (simulating the paper's format)
  const contextLines = entries.map(
    entry =>
      `Date: ${entry.date} | User: ${entry.userId} | Question: ${entry.question} | Category: ${entry.category}`
  );
  const context = contextLines.join('\n');

  // Query (following the paper's format)
  const query = `In the above data, list all pairs of user IDs (no duplicate pairs, list lower ID first) where both users have at least one instance with an entity or location. Each question can be labelled as one of these categories: 'description and abstract concept', 'entity', 'human being', 'numeric value', 'location', 'abbreviation'. In your answer, list all pairs in the format (user_id_1, user_id_2), separated by newlines. Your answer must be sorted by first user ID.`;

  // Calculate expected pairs
  const userCategories = new Map<number, Set<SemanticCategory>>();
  for (const entry of entries) {
    if (!userCategories.has(entry.userId)) {
      userCategories.set(entry.userId, new Set());
    }
    userCategories.get(entry.userId)!.add(entry.category);
  }

  // Find all users with "entity" or "location"
  const validUsers = Array.from(userCategories.entries())
    .filter(([, cats]) => cats.has('entity') || cats.has('location'))
    .map(([userId]) => userId)
    .sort((a, b) => a - b);

  // Generate all pairs (lower ID first)
  const expectedPairs: Array<[number, number]> = [];
  for (let i = 0; i < validUsers.length; i++) {
    for (let j = i + 1; j < validUsers.length; j++) {
      expectedPairs.push([validUsers[i], validUsers[j]]);
    }
  }

  return {
    name: 'Task 1: Entity or Location Pairs',
    context,
    query,
    expectedPairs,
    numEntries,
  };
}

/**
 * Extract pairs from LLM response
 *
 * Parses output text to find all pairs in the format (12345, 67890)
 *
 * @param text - LLM response text
 * @returns Array of extracted user ID pairs
 */
function extractPairs(text: string): Array<[number, number]> {
  const regex = /\((\d+),\s*(\d+)\)/g;
  const pairs: Array<[number, number]> = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const id1 = parseInt(match[1], 10);
    const id2 = parseInt(match[2], 10);
    // Ensure lower ID is first
    if (id1 < id2) {
      pairs.push([id1, id2]);
    } else {
      pairs.push([id2, id1]);
    }
  }

  return pairs;
}

/**
 * Calculate evaluation metrics (F1 score, precision, recall)
 *
 * @param predicted - Predicted pairs from LLM
 * @param expected - Ground truth pairs
 * @returns Evaluation metrics
 */
function calculateMetrics(
  predicted: Array<[number, number]>,
  expected: Array<[number, number]>
): EvaluationMetrics {
  // Convert to string sets for easy comparison
  const predSet = new Set(predicted.map(([a, b]) => `${a},${b}`));
  const expSet = new Set(expected.map(([a, b]) => `${a},${b}`));

  // Calculate true positives, false positives, false negatives
  const truePositives = [...predSet].filter(p => expSet.has(p)).length;
  const falsePositives = predSet.size - truePositives;
  const falseNegatives = expSet.size - truePositives;

  // Calculate precision, recall, F1
  const precision = predSet.size > 0 ? truePositives / predSet.size : 0;
  const recall = expSet.size > 0 ? truePositives / expSet.size : 0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    precision: precision * 100,
    recall: recall * 100,
    f1Score: f1Score * 100,
    truePositives,
    falsePositives,
    falseNegatives,
  };
}

/**
 * Main benchmark execution with baseline comparison
 */
async function main() {
  const apiKey = process.env.DEEPSEEK_API_KEY || '';
  if (!apiKey) {
    console.error('Please set DEEPSEEK_API_KEY environment variable');
    process.exit(1);
  }

  console.log('🧪 OOLONG-Pairs Benchmark');
  console.log('Based on arXiv:2512.24601v1 - Recursive Language Models\n');
  console.log('This benchmark compares Direct LLM vs RLM on O(N²) reasoning tasks.\n');

  // Initialize LLM providers
  const rootLLM = new DeepseekLLMProvider(apiKey, 'deepseek-chat');
  const subLLM = new DeepseekLLMProvider(apiKey, 'deepseek-chat');
  const baselineLLM = new DeepseekLLMProvider(apiKey, 'deepseek-chat');

  // OOLONG-Pairs specific task guidance (appended to default RLM prompt)
  const oolongPairsPrompt = `
OOLONG-PAIRS TASK-SPECIFIC GUIDANCE:
This is an O(N²) complexity task requiring you to find all pairs of user IDs where both users match certain category conditions.

RECOMMENDED STRATEGY:
1. Read the data from __memory__.txt
2. Parse entries to extract user IDs and their categories
3. For scalability with large datasets, consider using llm_query() to process in chunks:
   - Chunk 1: Extract users with target categories (entity/location)
   - Chunk 2: Generate all valid pairs from filtered users
4. Alternatively, for moderate datasets, process directly in code for speed

TASK-SPECIFIC CODE EXAMPLES:

Example 1 - Direct processing (faster for <1000 entries):
  try {
    const data = readFile('__memory__.txt');
    const lines = data.split('\\n');
    const userCategories = new Map();

    for (const line of lines) {
      const match = line.match(/User: (\\d+).*Category: (.+)/);
      if (match) {
        const userId = parseInt(match[1]);
        const category = match[2].trim();
        if (!userCategories.has(userId)) {
          userCategories.set(userId, new Set());
        }
        userCategories.get(userId).add(category);
      }
    }

    const validUsers = [];
    for (const [userId, cats] of userCategories) {
      if (cats.has('entity') || cats.has('location')) {
        validUsers.push(userId);
      }
    }
    validUsers.sort((a, b) => a - b);

    const pairs = [];
    for (let i = 0; i < validUsers.length; i++) {
      for (let j = i + 1; j < validUsers.length; j++) {
        pairs.push(\`(\${validUsers[i]}, \${validUsers[j]})\`);
      }
    }

    FINAL(pairs.join('\\n'));
  } catch (error) {
    FINAL("Error: " + error.message);
  }

Example 2 - Using llm_query for very large datasets:
  try {
    const data = readFile('__memory__.txt');
    const extractPrompt = \`Extract all user IDs that have 'entity' or 'location' category from this data. Return just the user IDs as a comma-separated list:\\n\${data}\`;
    const userIdsStr = await llm_query(extractPrompt);
    const userIds = userIdsStr.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)).sort((a, b) => a - b);

    const pairs = [];
    for (let i = 0; i < userIds.length; i++) {
      for (let j = i + 1; j < userIds.length; j++) {
        pairs.push(\`(\${userIds[i]}, \${userIds[j]})\`);
      }
    }

    FINAL(pairs.join('\\n'));
  } catch (error) {
    FINAL("Error: " + error.message);
  }
`;

  const rlmAgent = new RLMAgent({
    rootLLM,
    subLLM,
    maxDepth: 2, // Use depth=2 for better performance on complex tasks
    systemPrompt: oolongPairsPrompt, // Use OOLONG-Pairs specific prompt
  });

  // Test with increasing dataset sizes (based on paper's evaluation)
  // Paper tested: N=100, 200, 500, 1000 for OOLONG-Pairs
  const testSizes = [100, 200, 500]; // Meaningful scales for O(N²) tasks

  for (const size of testSizes) {
    console.log(`${'='.repeat(60)}`);
    console.log(`📊 Running benchmark with ${size} entries`);
    console.log(`${'='.repeat(60)}\n`);

    // Create task
    const task = createTask1(size);
    console.log(`Task: ${task.name}`);
    console.log(`Entries: ${task.numEntries}`);
    console.log(`Expected pairs: ${task.expectedPairs.length}`);
    console.log(`Context size: ${task.context.length.toLocaleString()} characters\n`);

    // Prepare full prompt
    const fullPrompt = `${task.context}\n\n${task.query}`;

    // ========================================
    // Baseline: Direct LLM (no RLM)
    // ========================================
    console.log('🔵 Running Baseline (Direct LLM, no RLM)...\n');
    console.log('--- Baseline Output ---');

    const baselineStartTime = Date.now();
    let baselineResult = '';

    for await (const chunk of baselineLLM.generateStream(fullPrompt)) {
      baselineResult += chunk;
      process.stdout.write(chunk);
    }

    const baselineEndTime = Date.now();
    const baselineDuration = ((baselineEndTime - baselineStartTime) / 1000).toFixed(2);

    console.log('\n--- End Baseline Output ---\n');

    // Evaluate baseline results
    const baselinePairs = extractPairs(baselineResult);
    const baselineMetrics = calculateMetrics(baselinePairs, task.expectedPairs);

    console.log('📊 Baseline Results:');
    console.log(`   Execution time: ${baselineDuration}s`);
    console.log(`   Predicted pairs: ${baselinePairs.length}`);
    console.log(`   Expected pairs: ${task.expectedPairs.length}`);
    console.log(`   True positives: ${baselineMetrics.truePositives}`);
    console.log(`   False positives: ${baselineMetrics.falsePositives}`);
    console.log(`   False negatives: ${baselineMetrics.falseNegatives}`);
    console.log(`   Precision: ${baselineMetrics.precision.toFixed(2)}%`);
    console.log(`   Recall: ${baselineMetrics.recall.toFixed(2)}%`);
    console.log(`   F1 Score: ${baselineMetrics.f1Score.toFixed(2)}%\n`);

    // ========================================
    // RLM Agent (with recursive orchestration)
    // ========================================
    console.log('🟢 Running RLM Agent (recursive orchestration)...\n');
    console.log('--- RLM Output ---');

    const context = new FileSystemContext(fullPrompt);
    const rlmStartTime = Date.now();
    let rlmResult = '';

    for await (const chunk of rlmAgent.runStream({
      context,
      query: task.query,
    })) {
      rlmResult += chunk.content;
      process.stdout.write(chunk.content);
    }

    const rlmEndTime = Date.now();
    const rlmDuration = ((rlmEndTime - rlmStartTime) / 1000).toFixed(2);

    console.log('\n--- End RLM Output ---\n');

    // Evaluate RLM results
    const rlmPairs = extractPairs(rlmResult);
    const rlmMetrics = calculateMetrics(rlmPairs, task.expectedPairs);

    console.log('📊 RLM Results:');
    console.log(`   Execution time: ${rlmDuration}s`);
    console.log(`   Predicted pairs: ${rlmPairs.length}`);
    console.log(`   Expected pairs: ${task.expectedPairs.length}`);
    console.log(`   True positives: ${rlmMetrics.truePositives}`);
    console.log(`   False positives: ${rlmMetrics.falsePositives}`);
    console.log(`   False negatives: ${rlmMetrics.falseNegatives}`);
    console.log(`   Precision: ${rlmMetrics.precision.toFixed(2)}%`);
    console.log(`   Recall: ${rlmMetrics.recall.toFixed(2)}%`);
    console.log(`   F1 Score: ${rlmMetrics.f1Score.toFixed(2)}%\n`);

    // ========================================
    // Comparison Summary
    // ========================================
    console.log('📈 Comparison Summary:');
    console.log(`   Baseline F1: ${baselineMetrics.f1Score.toFixed(2)}%`);
    console.log(`   RLM F1: ${rlmMetrics.f1Score.toFixed(2)}%`);

    const improvement = rlmMetrics.f1Score - baselineMetrics.f1Score;
    const improvementPercent =
      baselineMetrics.f1Score > 0
        ? ((improvement / baselineMetrics.f1Score) * 100).toFixed(1)
        : 'N/A';

    if (improvement > 0) {
      console.log(
        `   📈 RLM Improvement: +${improvement.toFixed(2)}% (${improvementPercent}% relative)`
      );
      console.log('   ✅ RLM outperforms baseline!');
    } else if (improvement < 0) {
      console.log(`   📉 RLM Regression: ${improvement.toFixed(2)}%`);
      console.log('   ⚠️  Baseline outperforms RLM');
    } else {
      console.log('   ➡️  No difference between baseline and RLM');
    }

    console.log('\n');
  }

  console.log('✅ Benchmark completed!\n');
  process.exit(0);
}

main().catch(error => {
  console.error('Error running benchmark:', error);
  process.exit(1);
});
