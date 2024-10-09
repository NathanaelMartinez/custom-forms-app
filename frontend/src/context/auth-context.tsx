import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { DecodedToken, User } from "../types";

interface AuthContextProps {
  isLoggedIn: boolean;
  user: User | null; // include full user object
  login: (token: string) => void; // function to log in user
  logout: () => void; // function to log out user
  updateUserRole: (newRole: string) => void; // for demoting/promoting
  updateUserBlock: (newStatus: string) => void; // for blocking/unblocking
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // function to handle user login, decode the token, and store the data
  const login = (token: string) => {
    try {
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token); // decode the jwt

      // create user object from decoded token or fetch more user data here if needed
      const userData: User = {
        id: decodedToken.sub, // use sub as the id, which is the standard field for subject
        username: decodedToken.username,
        email: decodedToken.email,
        role: decodedToken.role,
        status: decodedToken.status,
        templates: [], // this could be fetched from an API if needed
        createdAt: new Date(decodedToken.createdAt),
      };

      setIsLoggedIn(true);
      setUser(userData);

      localStorage.setItem("authToken", token); // save token to localStorage
    } catch (error) {
      console.error("Error decoding token:", error);
      logout();
    }
  };

  // function to handle user logout, clear state, and remove token from storage
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("authToken");
  };

  const updateUserRole = (newRole: string) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const updateUserBlock = (newStatus: string) => {
    if (user) {
      setUser({ ...user, status: newStatus });
    }
  };

  // on component mount, check if token exists and set user details accordingly
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token); // decode the jwt

        // create user object from decoded token or fetch more user data here if needed
        const userData: User = {
          id: decodedToken.sub,
          username: decodedToken.username,
          email: decodedToken.email,
          role: decodedToken.role,
          status: decodedToken.status,
          templates: [], // this could be fetched from an API if needed
          createdAt: new Date(decodedToken.createdAt),
        };

        setIsLoggedIn(true);
        setUser(userData);

        // check if token expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          logout(); // if token expired, logout
        }
      } catch (error) {
        console.error("Error decoding token on mount:", error);
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUserRole, updateUserBlock }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
