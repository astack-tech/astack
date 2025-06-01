import Image from 'next/image';
import CodeBlock from './CodeBlock';

export default function Hero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
      {/* Background gradient and grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-gray-800 opacity-90"></div>
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:30px_30px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                AStack
              </span>
              <span className="block mt-2 text-white">
                Flexible Component-based 
                <span className="text-blue-400"> Agent Framework</span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Everything is a component. Build powerful agent workflows with a pure functional 
              programming approach using AStack's modular architecture.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#quickstart" 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg text-white font-medium hover:from-blue-700 hover:to-teal-600 transition shadow-lg hover:shadow-blue-500/20"
              >
                Get Started
              </a>
              <a 
                href="https://github.com/qddegtya/astack" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-800 rounded-lg text-white font-medium hover:bg-gray-700 transition border border-gray-700"
              >
                View on GitHub
              </a>
            </div>
          </div>
          
          {/* Code Example */}
          <div className="w-full lg:w-auto shrink-0 max-w-xl">
            <CodeBlock
              code={`import { Pipeline, OpenAI, Agent, PromptTemplate } from "astack";

// Create a simple pipeline with components
const pipeline = new Pipeline();

// Add components to the pipeline
pipeline
  .add(new PromptTemplate({
    template: "Answer this question: {{question}}"
  }))
  .add(new OpenAI({
    model: "gpt-4"
  }))
  .add(new Agent())

// Run the pipeline
const response = await pipeline.run({
  question: "What is functional programming?"
});

console.log(response);`}
              language="typescript"
              showLineNumbers={true}
              fileName="example.ts"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
