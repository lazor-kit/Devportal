import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Menu, X, Zap } from "lucide-react";
import ThemeToggle from "./theme-toggle";

const NavigationBar = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Showcase", href: "/" },
    { name: "Submit Project", href: "/submit" },
  ];

  const isActiveLink = (path: string) => location === path;

  const { theme } = useTheme();

  return (
    <nav className={theme === 'dark' 
      ? "bg-black/40 backdrop-blur-md border-b border-white/10" 
      : "bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
    }>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="cursor-pointer flex items-center gap-2">
                <img 
                  src="/assets/images/lazor-logo.jpg" 
                  alt="Lazor.kit Logo" 
                  className="h-8 w-8 rounded animate-gentle-bounce solana-logo-pulse"
                />
                <span className={`text-xl font-bold ${theme === 'dark' ? 'glow-text' : 'text-gray-900'}`}>Lazor.kit</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`${
                    isActiveLink(link.href)
                      ? "border-primary text-primary"
                      : theme === 'dark'
                        ? "border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200"
                        : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-primary/50">
                    <Avatar className="h-8 w-8 bg-primary/10">
                      <AvatarImage src="/avatar-placeholder.png" alt={user.username} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-md border border-white/10">
                  {user.isAdmin && (
                    <DropdownMenuItem asChild className="text-gray-200 hover:text-white focus:text-white">
                      <Link href="/admin" className="w-full cursor-pointer">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-gray-200 hover:text-white focus:text-white">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className={theme === 'dark' ? 'crypto-button' : 'bg-black text-white hover:bg-gray-800'}>
                <Link href="/admin/login">Admin Login</Link>
              </Button>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`mr-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className={theme === 'dark' 
                  ? "bg-black/90 backdrop-blur-md border-r border-white/10" 
                  : "bg-white/95 backdrop-blur-md border-r border-gray-200"
                }
              >
                <div className="flex flex-col space-y-4 py-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className={`${
                        isActiveLink(link.href)
                          ? "bg-primary/20 text-primary"
                          : theme === 'dark'
                            ? "text-gray-300 hover:bg-black/40 hover:text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      } block px-3 py-2 rounded-md text-base font-medium`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <div className="flex items-center px-3 py-2">
                    <span className={theme === 'dark' ? "text-gray-300 mr-2" : "text-gray-600 mr-2"}>
                      Theme:
                    </span>
                    <ThemeToggle />
                  </div>

                  {user ? (
                    <>
                      {user.isAdmin && (
                        <Link 
                          href="/admin"
                          className={`block px-3 py-2 rounded-md text-base font-medium ${
                            theme === 'dark' 
                              ? "text-gray-300 hover:bg-black/40 hover:text-white" 
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        className={`w-full justify-start ${
                          theme === 'dark' 
                            ? "border-white/10 text-gray-300" 
                            : "border-gray-200 text-gray-600"
                        }`}
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <Link 
                      href="/admin/login"
                      className={`${theme === 'dark' ? 'crypto-button' : 'bg-black text-white hover:bg-gray-800'} block px-3 py-2 rounded-md text-base font-medium text-center`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Login
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
