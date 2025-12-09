import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  user:any
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  user:null
});

interface ProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: ProviderProps) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<any>();

  const decodeAndSetUser = (jwt: string) => {
    try {
      const decoded = jwtDecode<any>(jwt);
      setUser(decoded);
    } catch (err) {
      console.error("Error al decodificar el token:", err);
      setUser(null);
    }
  };

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    decodeAndSetUser(newToken);
    navigate("/home"); 
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/"); 
  };

  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) {
      decodeAndSetUser(token);
    } else {
      setUser(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user , login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
