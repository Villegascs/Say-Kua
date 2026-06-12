import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('saykua_auth');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('saykua_auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('saykua_auth');
    }
  }, [user]);

  // Mock Login: In a real app, this would verify credentials in a backend.
  const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setUser({ role: 'admin', name: 'Administrador' });
      return true;
    }
    if (username === 'chef' && password === 'chef123') {
      setUser({ role: 'chef', name: 'Chef Principal' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
