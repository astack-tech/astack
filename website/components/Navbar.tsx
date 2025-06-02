import Image from 'next/image';
import Link from 'next/link';
import GitHubStars from './GitHubStars';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/80 border-b border-gray-800 before:absolute before:inset-0 before:bg-black/60 before:z-[-1]">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8">
            <Image
              src="/logo.svg"
              alt="AStack Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              AStack
            </span>
            <span className="ml-1.5 text-xs px-2 py-0.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium shadow-sm shadow-blue-500/50 border border-blue-500/30 animate-pulse">beta</span>
          </div>
        </Link>
        
        <div className="hidden md:flex space-x-8">
          <Link href="#features" className="text-gray-300 hover:text-white transition">
            Features
          </Link>
          <Link href="#computation-model" className="text-gray-300 hover:text-white transition">
            Computation Model
          </Link>
          <Link href="#quickstart" className="text-gray-300 hover:text-white transition">
            Quick Start
          </Link>
          <Link href="#comparison" className="text-gray-300 hover:text-white transition">
            Comparison
          </Link>
          <Link href="#use-cases" className="text-gray-300 hover:text-white transition">
            Use Cases
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <GitHubStars />
          <a 
            href="https://github.com/astack-tech/astack" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
