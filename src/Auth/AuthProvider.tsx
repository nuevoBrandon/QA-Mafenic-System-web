import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

interface ProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: ProviderProps) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    navigate("/home"); 
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/"); 
  };

  const isAuthenticated = !!token;

  useEffect(() => {
    if (!token) {
      // Aquí podrías hacer validaciones adicionales, como refresh token
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
