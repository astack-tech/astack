import Image from 'next/image';

import CodeBlock from './CodeBlock';

export default function ComputationModel() {
  const computationModes = [
    {
      title: "Operator Composition",
      description: [
        "Each component is a composable transformation operator",
        "Maintains function purity with clear inputs and outputs",
        "Ensures type safety and transparent data flow through the port system"
      ],
      code: `// Component as transformation operator
const textProcessor = new Pipeline();

// Adding components with proper names
textProcessor.addComponent('splitter', new TextSplitter());
textProcessor.addComponent('embedder', new Embedder());
textProcessor.addComponent('vectorStore', new VectorStore());

// Function-style pipeline execution
const result = await textProcessor.run('splitter.input', document);`,
      diagram: (
        <svg className="w-full h-auto" viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="60" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="50" y="85" textAnchor="middle" fill="white" fontSize="12">Component A</text>
          
          <rect x="120" y="60" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="150" y="85" textAnchor="middle" fill="white" fontSize="12">组件B</text>
          
          <rect x="220" y="60" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="250" y="85" textAnchor="middle" fill="white" fontSize="12">组件C</text>
          
          <path d="M80 80 H120" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <path d="M180 80 H220" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#5EEAD4"/>
            </marker>
          </defs>
        </svg>
      )
    },
    {
      title: "Workflow Orchestration",
      description: [
        "Supports complex workflows with branching, merging, and conditional paths",
        "Provides dynamic routing, parallel processing, incremental building, and error handling",
        "Visualizes workflows and data paths"
      ],
      code: `// Complex workflow example
const workflow = new Pipeline();

// Add branch conditions
workflow.addComponent('classifier', new TextClassifier());
workflow.addComponent('router', new Router({
  routes: {
    question: new QuestionAnswer(),
    command: new CommandExecutor(),
    chat: new ChatHandler()
  }
}));`,
      diagram: (
        <svg className="w-full h-auto" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="120" y="20" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="150" y="45" textAnchor="middle" fill="white" fontSize="12">入口</text>
          
          <rect x="120" y="90" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="150" y="115" textAnchor="middle" fill="white" fontSize="12">路由器</text>
          
          <rect x="40" y="160" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="70" y="185" textAnchor="middle" fill="white" fontSize="12">分支A</text>
          
          <rect x="120" y="160" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="150" y="185" textAnchor="middle" fill="white" fontSize="12">分支B</text>
          
          <rect x="200" y="160" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="230" y="185" textAnchor="middle" fill="white" fontSize="12">分支C</text>
          
          <path d="M150 60 V90" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead2)"/>
          <path d="M150 130 L70 160" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead2)"/>
          <path d="M150 130 V160" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead2)"/>
          <path d="M150 130 L230 160" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead2)"/>
          
          <defs>
            <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#5EEAD4"/>
            </marker>
          </defs>
        </svg>
      )
    },
    {
      title: "Reactive Data Flow",
      description: [
        "Implements an event-driven asynchronous data processing model",
        "Components respond to data events rather than passive polling",
        "Supports backpressure handling and hot/cold data streams"
      ],
      code: `// Reactive data flow example
const dataStream = new DataStream();

// Add data listeners
dataStream.on('newData', async (data) => {
  const result = await processor.run(data);
  dataStream.emit('processedData', result);
});

// 从外部源接收数据
externalSource.pipe(dataStream);`,
      diagram: (
        <svg className="w-full h-auto" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="70" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="70" y="95" textAnchor="middle" fill="white" fontSize="12">事件源</text>
          
          <rect x="150" y="40" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="180" y="65" textAnchor="middle" fill="white" fontSize="12">处理器A</text>
          
          <rect x="150" y="100" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="180" y="125" textAnchor="middle" fill="white" fontSize="12">处理器B</text>
          
          <rect x="220" y="70" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="250" y="95" textAnchor="middle" fill="white" fontSize="12">汇聚点</text>
          
          <path d="M100 80 C120 80, 130 60, 150 60" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead3)"/>
          <path d="M100 90 C120 90, 130 120, 150 120" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead3)"/>
          <path d="M210 60 C230 60, 240 80, 220 80" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead3)"/>
          <path d="M210 120 C230 120, 240 100, 220 100" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead3)"/>
          
          <defs>
            <marker id="arrowhead3" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#5EEAD4"/>
            </marker>
          </defs>
        </svg>
      )
    },
    {
      title: "Inter-Agent Communication",
      description: [
        "Supports complex interactions and message passing between agents",
        "Maintains context continuity across multiple exchanges",
        "Enables multi-agent coordination and tool integration"
      ],
      code: `// Inter-agent communication example
const coordinator = new AgentCoordinator();

// Register multiple specialized agents
coordinator.register([
  new ResearchAgent({ name: 'researcher' }),
  new AnalysisAgent({ name: 'analyst' }),
  new WriterAgent({ name: 'writer' })
]);

// Start collaboration process
const report = await coordinator.collaborate({
  task: "Analyze market trends and generate a report"
});`,
      diagram: (
        <svg className="w-full h-auto" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="120" y="20" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="150" y="45" textAnchor="middle" fill="white" fontSize="12">协调器</text>
          
          <rect x="40" y="100" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="70" y="125" textAnchor="middle" fill="white" fontSize="12">代理A</text>
          
          <rect x="120" y="100" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="150" y="125" textAnchor="middle" fill="white" fontSize="12">代理B</text>
          
          <rect x="200" y="100" width="60" height="40" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="230" y="125" textAnchor="middle" fill="white" fontSize="12">代理C</text>
          
          <path d="M150 60 L70 100" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead4)"/>
          <path d="M150 60 V100" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead4)"/>
          <path d="M150 60 L230 100" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead4)"/>
          
          <path d="M70 100 L120 40" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead4)" strokeDasharray="4"/>
          <path d="M150 100 L150 60" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead4)" strokeDasharray="4"/>
          <path d="M230 100 L180 40" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead4)" strokeDasharray="4"/>
          
          <path d="M90 120 H120" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead4)" strokeDasharray="4"/>
          <path d="M180 120 H200" stroke="#5EEAD4" strokeWidth="2" markerEnd="url(#arrowhead4)" strokeDasharray="4"/>
          
          <defs>
            <marker id="arrowhead4" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#5EEAD4"/>
            </marker>
          </defs>
        </svg>
      )
    }
  ];

  return (
    <section id="computation-model" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient and grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-90"></div>
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:30px_30px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Computation <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Model</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            AStack implements a sophisticated computation model based on the <a href="https://github.com/hlang-tech/hlang" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">HLang</a> monadic functional programming paradigm, combining the flexibility of functional programming with the practical advantages of component-based development.
          </p>
        </div>
        
        {/* Bento Grid Layout for Computation Models */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Operator Composition - Larger Card */}
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-1 md:col-span-2 group overflow-hidden shadow-lg shadow-black/20">
            {/* Inner content with glass effect */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 md:p-8 h-full relative overflow-hidden">
              {/* Background glow effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all duration-700"></div>
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-teal-500 shadow-glow-teal"></span>
                  <h3 className="text-2xl font-bold text-white">Operator Composition</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative">
                  <div className="space-y-6">
                    {/* Feature list with enhanced styling */}
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                      <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 font-medium">Key Features</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-teal-400 mt-1 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Each component is a composable transformation operator</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-teal-400 mt-1 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Maintains function purity with clear inputs and outputs</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-teal-400 mt-1 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Ensures type safety and transparent data flow through the port system</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Code example with enhanced styling */}
                    <div className="mt-6">
                      <CodeBlock
                        code={computationModes[0].code}
                        language="typescript"
                        showLineNumbers={true}
                        fileName="operator-composition.ts"
                      />
                    </div>
                  </div>
                  
                  {/* SVG with enhanced container */}
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 relative overflow-hidden group-hover:from-gray-800/40 group-hover:to-gray-900/40 transition-colors duration-500">
                    <div className="relative h-64 md:h-72 w-full">
                      <Image 
                        src="/images/operator-composition.svg" 
                        alt="Operator Composition Diagram" 
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Orchestration */}
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-1 group overflow-hidden shadow-md shadow-black/20">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 h-full relative overflow-hidden">
              {/* Background glow effect */}
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-glow-blue"></span>
                  <h3 className="text-lg font-bold text-white">Workflow Orchestration</h3>
                </div>
                
                <div className="space-y-4">
                  {/* SVG with enhanced container */}
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 relative overflow-hidden group-hover:from-gray-800/40 group-hover:to-gray-900/40 transition-colors duration-500">
                    <div className="relative h-40 w-full">
                      <Image 
                        src="/images/workflow-orchestration.svg" 
                        alt="Workflow Orchestration Diagram" 
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  </div>
                  
                  {/* Feature list with enhanced styling */}
                  <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
                    <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Key Features</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-400 mt-0.5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">Supports complex workflows with branching and merging</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-400 mt-0.5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">Provides dynamic routing and parallel processing</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reactive Data Flow */}
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-1 group overflow-hidden shadow-md shadow-black/20">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 h-full relative overflow-hidden">
              {/* Background glow effect */}
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-glow-indigo"></span>
                  <h3 className="text-lg font-bold text-white">Reactive Data Flow</h3>
                </div>
                
                <div className="space-y-4">
                  {/* SVG with enhanced container */}
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 relative overflow-hidden group-hover:from-gray-800/40 group-hover:to-gray-900/40 transition-colors duration-500">
                    <div className="relative h-40 w-full">
                      <Image 
                        src="/images/reactive-dataflow.svg" 
                        alt="Reactive Data Flow Diagram" 
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  </div>
                  
                  {/* Feature list with enhanced styling */}
                  <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
                    <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Key Features</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">Implements event-driven asynchronous processing</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">Supports backpressure and hot/cold data streams</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inter-Agent Communication */}
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-1 md:col-span-2 group overflow-hidden shadow-lg shadow-black/20">
            {/* Inner content with glass effect */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 md:p-8 h-full relative overflow-hidden">
              {/* Background glow effect */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shadow-glow-purple"></span>
                  <h3 className="text-2xl font-bold text-white">Inter-Agent Communication</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative">
                  <div className="space-y-6 order-2 lg:order-1">
                    {/* Feature list with enhanced styling */}
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                      <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 font-medium">Key Features</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-purple-400 mt-1 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Supports complex interactions between agents</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-purple-400 mt-1 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Maintains context continuity across multiple exchanges</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-purple-400 mt-1 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Enables multi-agent coordination and tool integration</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Code example with enhanced styling */}
                    <div className="mt-6">
                      <CodeBlock
                        code={computationModes[3].code}
                        language="typescript"
                        showLineNumbers={true}
                        fileName="agent-communication.ts"
                      />
                    </div>
                  </div>
                  
                  {/* SVG with enhanced container */}
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 relative overflow-hidden order-1 lg:order-2 group-hover:from-gray-800/40 group-hover:to-gray-900/40 transition-colors duration-500">
                    <div className="relative h-64 md:h-72 w-full">
                      <Image 
                        src="/images/agent-events.svg" 
                        alt="Inter-Agent Communication Diagram" 
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Core Features section with enhanced design */}
        <div className="mt-16">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-md rounded-2xl overflow-hidden relative border border-gray-800/50 shadow-xl shadow-black/30">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-2/3 h-60 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 blur-3xl rounded-full"></div>
            
            <div className="relative p-8 md:p-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white inline-flex items-center gap-3">
                  <span className="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Core Features</span>
                  <span className="text-gray-400 text-lg">of the Monadic Design Pattern</span>
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mx-auto mt-4"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/40 hover:border-gray-600/40 transition-colors duration-300 group">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400/20 to-teal-600/20 flex items-center justify-center border border-teal-500/30 group-hover:from-teal-400/30 group-hover:to-teal-600/30 transition-colors duration-300">
                      <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">State Encapsulation</h4>
                      <p className="text-gray-400 text-sm">Encapsulates state, ensuring data immutability and predictable transformations</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/40 hover:border-gray-600/40 transition-colors duration-300 group">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center border border-blue-500/30 group-hover:from-blue-400/30 group-hover:to-blue-600/30 transition-colors duration-300">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Chained Operations</h4>
                      <p className="text-gray-400 text-sm">Chain operations seamlessly, simplifying complex workflows and data pipelines</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/40 hover:border-gray-600/40 transition-colors duration-300 group">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400/20 to-indigo-600/20 flex items-center justify-center border border-indigo-500/30 group-hover:from-indigo-400/30 group-hover:to-indigo-600/30 transition-colors duration-300">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Composable Transformations</h4>
                      <p className="text-gray-400 text-sm">Create reusable components that can be composed in different ways to form complex systems</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/40 hover:border-gray-600/40 transition-colors duration-300 group">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center border border-purple-500/30 group-hover:from-purple-400/30 group-hover:to-purple-600/30 transition-colors duration-300">
                      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Error Propagation</h4>
                      <p className="text-gray-400 text-sm">Control error propagation in a predictable way, enhancing system stability and reliability</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
