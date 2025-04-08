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
import { Menu, X, Zap } from "lucide-react";

const NavigationBar = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Discover", href: "/" },
    { name: "Submit", href: "/submit" },
  ];

  const isActiveLink = (path: string) => location === path;

  return (
    <nav className="bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="cursor-pointer flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold glow-text">CryptoShowcase</span>
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`${
                      isActiveLink(link.href)
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full`}
                  >
                    {link.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
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
                      <Link href="/admin">
                        <a className="w-full cursor-pointer">Admin Dashboard</a>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-gray-200 hover:text-white focus:text-white">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost" className="border border-primary/20 text-primary hover:bg-primary/10">
                <Link href="/admin/login">
                  <a>Admin Login</a>
                </Link>
              </Button>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 text-gray-200">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-black/90 backdrop-blur-md border-r border-white/10">
                <div className="flex flex-col space-y-4 py-4">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <a
                        className={`${
                          isActiveLink(link.href)
                            ? "bg-primary/20 text-primary"
                            : "text-gray-300 hover:bg-black/40 hover:text-white"
                        } block px-3 py-2 rounded-md text-base font-medium`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </a>
                    </Link>
                  ))}
                  {user ? (
                    <>
                      {user.isAdmin && (
                        <Link href="/admin">
                          <a
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-black/40 hover:text-white"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Admin Dashboard
                          </a>
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        className="w-full justify-start border-white/10 text-gray-300"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <Link href="/admin/login">
                      <a
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-black/40 hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Login
                      </a>
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
