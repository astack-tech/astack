import CodeBlock from './CodeBlock';

export default function QuickStart() {
  const steps = [
    {
      number: 1,
      title: "Install AStack",
      description: "Install AStack core and components packages using npm or yarn",
      code: `npm install @astack/core @astack/components
# 或者使用 yarn
yarn add @astack/core @astack/components`
    },
    {
      number: 2,
      title: "Create Your First Component",
      description: "Extend the Component base class to create custom components",
      code: `import { Component } from '@astack/core';

class TextProcessor extends Component {
  constructor() {
    super();
    // Define input and output ports
    this.inPort = {};
    this.outPort = {};
  }

  async _transform(chunk, encoding, callback) {
    try {
      // Process data
      const result = chunk.toString().toUpperCase();
      
      // Send to output port
      this.push(result);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}`
    },
    {
      number: 3,
      title: "Use Built-in Components",
      description: "Leverage AStack's built-in components to quickly build functionality",
      code: `import { Pipeline } from '@astack/core';
import { TextSplitter, Embedder } from '@astack/components';

// Create text processing pipeline
const pipeline = new Pipeline();

// Add components to pipeline
pipeline
  .add(new TextSplitter({ chunkSize: 1000 }))
  .add(new Embedder({ model: 'text-embedding-ada-002' }));`
    },
    {
      number: 4,
      title: "Run Components and Pipelines",
      description: "Process data using two running modes",
      code: `// Method 1: Run component independently
const splitter = new TextSplitter({ chunkSize: 1000 });
const chunks = await splitter.run("This is a long text...");

// Method 2: Run through pipeline
const result = await pipeline.run("This is another long text...");
console.log(result);`
    },
    {
      number: 5,
      title: "Build an Agent",
      description: "Create intelligent agents using the zero adaptation layer design",
      code: `import { Agent } from '@astack/components';
import { OpenAI } from '@astack/integrations';

// Create agent
const agent = new Agent();

// Configure model provider
const model = new OpenAI({
  model: 'gpt-4',
  apiKey: process.env.OPENAI_API_KEY
});

// Add tools
agent.addTool({
  name: 'search',
  description: 'Search the internet',
  execute: async (query) => {
    // Implement search functionality
    return searchResults;
  }
});

// Run the agent
const response = await agent
  .withModel(model)
  .run("Help me research recent AI advances");`
    }
  ];

  return (
    <section id="quickstart" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient and grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 opacity-90"></div>
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:30px_30px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Quick <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Start</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Follow these steps to start building component-based AI applications with AStack.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-teal-500 to-blue-600"></div>
            
            {/* Steps */}
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="relative pl-14">
                  {/* Step Number Circle */}
                  <div className="absolute left-0 top-0 w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    {step.number}
                  </div>
                  
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                    <p className="text-gray-300 mb-4">{step.description}</p>
                    
                    <CodeBlock 
                      code={step.code} 
                      language="typescript" 
                      showLineNumbers={true} 
                      fileName={step.number === 1 ? 'terminal' : 'index.ts'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <a 
              href="https://github.com/qddegtya/astack" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg text-white font-medium hover:from-teal-700 hover:to-blue-700 transition shadow-lg hover:shadow-blue-500/20 inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              View Full Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
