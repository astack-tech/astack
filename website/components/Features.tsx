export default function Features() {
  const features = [
    {
      title: "Everything is a Component",
      description: "All elements inherit from the Component base class, with input and output ports for data flow, enabling both standalone and pipeline execution.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M15 2v2" />
          <path d="M15 20v2" />
          <path d="M2 15h2" />
          <path d="M20 15h2" />
        </svg>
      )
    },
    {
      title: "Zero Adaptation Layer",
      description: "Agents directly accept any model provider component and tools without middleware adapters, creating a cleaner and more intuitive API.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 7h10v10H7z" />
          <path d="M13 7V3h7v7h-4" />
          <path d="M13 17v4H6v-7h4" />
        </svg>
      )
    },
    {
      title: "Dual Run Modes",
      description: "Run components independently with run() or compose them into pipelines with _transform() - same interface, maximum flexibility.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      )
    },
    {
      title: "Type-Safe Ports",
      description: "Components communicate through a port system that ensures type safety and transparent data flow between components.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )
    },
    {
      title: "Modular Package Design",
      description: "Organized into core abstractions, domain-specific components, and external integrations for maximum code reuse and extensibility.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <line x1="12" y1="22" x2="12" y2="12" />
        </svg>
      )
    },
    {
      title: "External Ecosystem Integration",
      description: "Leverage OpenAI-compatible interfaces to integrate external model providers without requiring specialized SDKs.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2H2v10h10V2z" />
          <path d="M22 12h-10v10h10V12z" />
          <path d="M12 12H2v10h10V12z" />
          <path d="M22 2h-10v10h10V2z" />
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient and grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-90"></div>
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:30px_30px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Core <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            AStack implements a modern, component-based approach to building AI agents and workflows,
            with a focus on functional programming principles and composability.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
