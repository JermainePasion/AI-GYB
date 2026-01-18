import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { fetchUserProfile } from '../api/users';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetchUserProfile();
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData); // Optional: skip this if you want to always fetch fresh profile
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
