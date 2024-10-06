import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../types';

interface AuthContextProps {
  isLoggedIn: boolean;
  username: string | null;
  role: string | null;
  login: (token: string) => void; // function to log in user
  logout: () => void; // function to log out user
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // function to handle user login, decode the token, and store the data
  const login = (token: string) => {
    try {
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token); // decode the jwt
      setIsLoggedIn(true);
      setUsername(decodedToken.username);
      setRole(decodedToken.role);
      localStorage.setItem('authToken', token); // save token to localStorage
    } catch (error) {
      console.error('Error decoding token:', error);
      logout();
    }
  };

  // function to handle user logout, clear state, and remove token from storage
  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setRole(null);
    localStorage.removeItem('authToken');
  };

  // on component mount, check if token exists and set user details accordingly
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token); // deconde the jwt
        setIsLoggedIn(true);
        setUsername(decodedToken.username);
        setRole(decodedToken.role);

        // check if token expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          logout(); // if token expired, logout
        }
      } catch (error) {
        console.error('Error decoding token on mount:', error);
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
