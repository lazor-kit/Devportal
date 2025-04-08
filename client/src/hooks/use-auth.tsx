import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "./use-toast";
import { Login } from "@shared/schema";

interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: Login) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for token on initial load
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (data: Login): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiRequest("POST", "/api/login", data);
      const { token, user } = await response.json();
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setUser(user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
