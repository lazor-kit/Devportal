import { Link } from "wouter";
import { Github, Twitter, MessageCircle, Zap } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={theme === 'dark' 
      ? "bg-black/40 backdrop-blur-md border-t border-white/10 mt-12" 
      : "bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-sm mt-12"
    }>
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <div className="cursor-pointer flex items-center gap-2">
            <div className={`h-8 w-8 animate-float solana-logo-pulse`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className="h-full w-full">
                <path
                  d="M100,120 L300,120 L240,200 L300,280 L100,280 L160,200 Z"
                  stroke={theme === 'dark' ? "#FFFFFF" : "#9945FF"}
                  strokeWidth="5"
                  fill="none"
                />
              </svg>
            </div>
            <span className={`text-xl font-bold ${theme === 'dark' ? 'glow-text' : 'text-gray-900'}`}>Lazor.kit Showcase</span>
          </div>
        </div>
        
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <Link href="/" className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-primary transition-colors duration-200`}>
              About
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link href="/" className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-primary transition-colors duration-200`}>
              Blog
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link href="/" className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-primary transition-colors duration-200`}>
              Jobs
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link href="/" className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-primary transition-colors duration-200`}>
              Press
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link href="/" className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-primary transition-colors duration-200`}>
              Privacy
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link href="/" className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-primary transition-colors duration-200`}>
              Terms
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link href="/" className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-primary transition-colors duration-200`}>
              Contact
            </Link>
          </div>
        </nav>
        
        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-primary transition-colors duration-200`}>
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </a>

          <a href="#" className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-primary transition-colors duration-200`}>
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" />
          </a>

          <a href="#" className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-primary transition-colors duration-200`}>
            <span className="sr-only">Discord</span>
            <MessageCircle className="h-6 w-6" />
          </a>
        </div>
        
        <div className="mt-8 flex flex-col items-center">
          <p className={`text-center text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            &copy; 2025 Lazor.kit Showcase. All rights reserved.
          </p>
          <div className={`mt-2 flex items-center text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="inline-block h-2 w-2 rounded-full bg-primary/50 mr-2"></span>
            Powered by Solana • Sign-in without wallet apps
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
