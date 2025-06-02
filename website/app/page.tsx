import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ComputationModel from '@/components/ComputationModel';
import QuickStart from '@/components/QuickStart';
import Comparison from '@/components/Comparison';
import UseCases from '@/components/UseCases';
import BetaNotification from '@/components/BetaNotification';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="mt-[56px]"> {/* 固定导航栏高度，确保内容不被覆盖 */}
        <BetaNotification />
      </div>
      <Hero />
      <Features />
      <ComputationModel />
      <QuickStart />
      <Comparison />
      <UseCases />
      
      <footer className="py-16 mt-12 relative overflow-hidden">
        {/* Subtle gradient border instead of hard line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        
        {/* Background subtle glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-2/3 h-40 bg-blue-500/10 blur-3xl rounded-full"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">AStack</h2>
              <p className="text-gray-400 mt-2">Everything is a Component</p>
            </div>
            
            <div className="grid grid-cols-2 md:flex md:space-x-8 gap-4 md:gap-0">
              <a href="https://github.com/qddegtya/astack" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition">
                GitHub
              </a>
              <a href="#features" className="text-gray-400 hover:text-teal-400 transition">
                Features
              </a>
              <a href="#quickstart" className="text-gray-400 hover:text-teal-400 transition">
                Quick Start
              </a>
              <a href="#computation-model" className="text-gray-400 hover:text-teal-400 transition">
                Computation Model
              </a>
              <a href="#use-cases" className="text-gray-400 hover:text-teal-400 transition">
                Use Cases
              </a>
            </div>
          </div>
          
          <div className="mt-12 text-center text-gray-500 text-sm">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            </div>
            <p>&copy; {new Date().getFullYear()} AStack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
