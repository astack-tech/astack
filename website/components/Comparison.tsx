export default function Comparison() {
  return (
    <section id="comparison" className="py-20 md:py-28 relative overflow-hidden">
      {/* Enhanced background with multiple gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 opacity-95"></div>
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:30px_30px]"></div>
      
      {/* Glow effects */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-glow-blue"></span>
            <span className="w-2 h-2 rounded-full bg-teal-500 shadow-glow-teal"></span>
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-glow-purple"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Technical <span className="bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">Independence</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            AStack is a 100% original framework with completely independent technical implementation and architectural design, inspired only by Haystack's API design style.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mx-auto mt-6"></div>
        </div>
        
        <div className="flex flex-col items-center gap-12">
          {/* Main comparison card */}
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-1 max-w-4xl w-full overflow-hidden shadow-xl shadow-black/20 group">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 md:p-8 h-full relative overflow-hidden">
              {/* Background elements */}
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-all duration-700"></div>
              
              <div className="relative">
                {/* Section header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-teal-500 shadow-glow-teal"></span>
                  <h3 className="text-2xl font-bold text-white">Why Emphasize This Distinction?</h3>
                </div>
                
                <p className="text-gray-300 mb-8 max-w-3xl">
                  Clearly communicating AStack's originality and unique value is crucial. We want users to understand that AStack is not a derivative of Haystack,
                  but a completely independent framework with its own unique technical architecture and design philosophy.
                </p>
                
                {/* Enhanced comparison table */}
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-800/80 to-gray-900/80">
                          <th className="py-4 px-6 text-left text-gray-300 font-semibold border-b border-gray-700/50">Feature</th>
                          <th className="py-4 px-6 text-left text-gray-300 font-semibold border-b border-gray-700/50">AStack</th>
                          <th className="py-4 px-6 text-left text-gray-300 font-semibold border-b border-gray-700/50">Haystack</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-700/30 hover:bg-gray-800/20 transition-colors duration-150">
                          <td className="py-4 px-6 text-gray-300">Technical Implementation</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400/20 to-teal-600/20 flex items-center justify-center border border-teal-500/30 mr-3">
                                <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-teal-300 font-medium">100% Original Code</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-400">Independent Implementation</td>
                        </tr>
                        <tr className="border-b border-gray-700/30 hover:bg-gray-800/20 transition-colors duration-150">
                          <td className="py-4 px-6 text-gray-300">Design Philosophy</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center border border-blue-500/30 mr-3">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                </svg>
                              </div>
                              <span className="text-blue-300 font-medium">"Everything is a Component"</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-400">Pipeline and Node Model</td>
                        </tr>
                        <tr className="border-b border-gray-700/30 hover:bg-gray-800/20 transition-colors duration-150">
                          <td className="py-4 px-6 text-gray-300">Adaptation Layer</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center border border-purple-500/30 mr-3">
                                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <span className="text-purple-300 font-medium">Zero Adaptation Layer</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-400">Multi-layer Adaptation</td>
                        </tr>
                        <tr className="border-b border-gray-700/30 hover:bg-gray-800/20 transition-colors duration-150">
                          <td className="py-4 px-6 text-gray-300">Execution Model</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400/20 to-indigo-600/20 flex items-center justify-center border border-indigo-500/30 mr-3">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                              </div>
                              <span className="text-indigo-300 font-medium">Dual Run Modes</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-400">Pipeline Mode</td>
                        </tr>
                        <tr className="hover:bg-gray-800/20 transition-colors duration-150">
                          <td className="py-4 px-6 text-gray-300">Component Communication</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 flex items-center justify-center border border-cyan-500/30 mr-3">
                                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                              </div>
                              <span className="text-cyan-300 font-medium">Port System</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-400">Connector System</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Relationship card */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-1 max-w-4xl w-full overflow-hidden shadow-lg shadow-black/20 group">
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 md:p-8 h-full relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 via-teal-500/5 to-purple-500/5 rounded-full blur-3xl group-hover:opacity-70 transition-opacity duration-700"></div>
              
              <div className="relative text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shadow-glow-blue"></span>
                  <h3 className="text-2xl font-bold text-white">Relationship with Haystack</h3>
                  <span className="w-2 h-2 rounded-full bg-teal-500 shadow-glow-teal"></span>
                </div>
                
                <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
                  AStack maintains compatibility with Haystack's API style, making it easy for developers familiar with Haystack to get started,
                  but its underlying technical implementation, architectural design, and component model are completely original work.
                </p>
                
                <div className="bg-gradient-to-r from-gray-900/60 via-black/60 to-gray-900/60 backdrop-blur-md rounded-xl p-6 border border-gray-700/30 mx-auto max-w-2xl relative overflow-hidden group-hover:border-gray-600/40 transition-colors duration-300">
                  {/* Quote decoration */}
                  <div className="absolute top-4 left-4 text-5xl text-teal-500/20 font-serif">"</div>
                  <div className="absolute bottom-4 right-4 text-5xl text-teal-500/20 font-serif">"</div>
                  
                  <p className="text-teal-300 font-medium text-lg relative z-10">
                    AStack adheres to an independently innovative technical approach, providing developers with a more concise and flexible component-based AI framework.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
