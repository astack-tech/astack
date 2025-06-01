'use client';

import Image from 'next/image';

export default function UseCases() {
  const useCases = [
    {
      title: "Agent with Tools",
      description: "Create an agent that can use tools to perform real-world tasks like file operations. Showcases the zero-adaptation layer design principle where components work together without intermediate layers.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-blue-400/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-300",
      iconColor: "text-blue-400",
      githubLink: "https://github.com/qddegtya/astack/tree/main/examples/agent-with-tools",
    },
    {
      title: "Multi-Round Tool Execution",
      description: "Handle multi-round tool execution, where the agent processes multiple tool calls within a single conversation, maintaining context throughout the interaction.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      color: "from-purple-400/20 to-purple-600/20",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-300",
      iconColor: "text-purple-400",
      githubLink: "https://github.com/qddegtya/astack/tree/main/examples/multi-round-tool-execution",
    },
    {
      title: "Research Pipeline",
      description: "A sophisticated research pipeline that automatically searches for information, analyzes content, and generates comprehensive research reports using AI.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: "from-teal-400/20 to-teal-600/20",
      borderColor: "border-teal-500/30",
      textColor: "text-teal-300",
      iconColor: "text-teal-400",
      githubLink: "https://github.com/qddegtya/astack/tree/main/examples/research-pipeline",
    },
    {
      title: "Reactive Data Flow",
      description: "Implement dynamic systems with reactive data flows where components respond automatically to upstream changes, creating responsive AI applications.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "from-indigo-400/20 to-indigo-600/20",
      borderColor: "border-indigo-500/30",
      textColor: "text-indigo-300",
      iconColor: "text-indigo-400",
      githubLink: "https://github.com/qddegtya/astack/tree/main/examples",
    },
    {
      title: "Component Composition",
      description: "Create and compose reusable AI components that can be combined in different ways to build complex applications without duplicating code.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      color: "from-cyan-400/20 to-cyan-600/20",
      borderColor: "border-cyan-500/30",
      textColor: "text-cyan-300",
      iconColor: "text-cyan-400",
      githubLink: "https://github.com/qddegtya/astack/tree/main/examples",
    },
    {
      title: "Workflow Orchestration",
      description: "Orchestrate complex AI workflows with multiple stages, conditional branching, and parallel execution for advanced use cases.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      color: "from-amber-400/20 to-amber-600/20",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-300",
      iconColor: "text-amber-400",
      githubLink: "https://github.com/qddegtya/astack/tree/main/examples",
    },
  ];

  return (
    <section id="use-cases" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 opacity-95"></div>
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:30px_30px]"></div>
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
      
      {/* Glow effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-glow-blue"></span>
            <span className="w-2 h-2 rounded-full bg-teal-500 shadow-glow-teal"></span>
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-glow-purple"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Real-World <span className="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Use Cases</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore how AStack is used to build sophisticated AI applications with its component-based architecture
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-1 overflow-hidden shadow-xl shadow-black/20 group h-full"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 h-full relative overflow-hidden flex flex-col">
                {/* Background elements */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px] pointer-events-none"></div>
                <div className={`absolute -top-24 -left-24 w-48 h-48 ${useCase.color.split(' ')[0].replace('/20', '/5')} rounded-full blur-3xl group-hover:${useCase.color.split(' ')[0]} transition-all duration-700 pointer-events-none`}></div>
                
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${useCase.color} flex items-center justify-center border ${useCase.borderColor} shrink-0`}>
                    <div className={useCase.iconColor}>
                      {useCase.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{useCase.title}</h3>
                    <a 
                      href={useCase.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors relative z-10"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      View on GitHub
                    </a>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 flex-grow">
                  {useCase.description}
                </p>
                
                <a 
                  href={useCase.githubLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center px-4 py-2 ${useCase.color} rounded-lg border ${useCase.borderColor} ${useCase.textColor} hover:bg-opacity-80 transition-all group-hover:border-opacity-50 mt-auto w-full cursor-pointer`}
                >
                  <span>Explore Example</span>
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
