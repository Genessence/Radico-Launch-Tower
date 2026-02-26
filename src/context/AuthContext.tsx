import React, { createContext, useContext, useState, ReactNode } from "react";

export type Role = "CXO" | "Head" | "Team";

interface AuthState {
  user: string | null;
  role: Role | null;
  login: (name: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  role: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(() => localStorage.getItem("auth_user"));
  const [role, setRole] = useState<Role | null>(() => localStorage.getItem("auth_role") as Role | null);

  const login = (name: string, r: Role) => {
    setUser(name);
    setRole(r);
    localStorage.setItem("auth_user", name);
    localStorage.setItem("auth_role", r);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_role");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
