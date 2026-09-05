import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// Change this if your backend port changes
const API_URL = "https://stockflow-wms-backend.onrender.com/api";
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // 1. Added loading state

  useEffect(() => {
    // 2. Initialize from localStorage on refresh
    const savedUser = localStorage.getItem("sf_user");
    const savedToken = localStorage.getItem("sf_token");
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false); // 3. Mark as ready
  }, []);

  // Update your useEffect that saves to localStorage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("sf_user", JSON.stringify(user));
      localStorage.setItem("sf_token", token);
    }
  }, [user, token]);



const login = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    // 1. Get the data. Note: 'role' is inside 'user' in your specific backend
    const { token: receivedToken, user: userData } = response.data;

    // 2. Safely get the role from the nested user object
    const userRole = userData.role || "customer"; 

    const nextUser = { 
      email: userData.email, 
      role: userRole, 
      name: userData.fullName || userData.name 
    };

    setToken(receivedToken);
    setUser(nextUser);
    
    // For debugging during team development
    console.log("Context updated with user:", nextUser);
    
    return nextUser;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Login failed.";
    throw new Error(errorMsg);
  }
};

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  // 4. Pass 'loading' in the Provider
  return (
    <AuthContext.Provider value={{ user, login, logout, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);