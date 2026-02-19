import { createContext, useState, useEffect, useRef } from 'react';
import { fetchUserProfile } from '../api/users';
import { toast } from "react-toastify";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const adjustmentShownRef = useRef(false);

  // 🔹 Load profile when token changes
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

  // 🔹 Show threshold adjustment popup when user state updates
  useEffect(() => {
    if (!user) return;

    const adj = user?.last_threshold_adjustment;
    if (!adj?.updatedAt) return;

    // Unique key per adjustment
    const adjustmentKey = `threshold_seen_${adj.updatedAt}`;

    // If already shown in this session, skip
    if (sessionStorage.getItem(adjustmentKey)) return;

    const format = (label, value) => {
      if (!value || value === 0) return null;
      const sign = value > 0 ? "+" : "";
      return (
        <div key={label}>
          • {label} {value > 0 ? "↑" : "↓"} {sign}{value}
        </div>
      );
    };

    const changes = [
      format("Flex", adj.flex),
      format("Upper Back", adj.gyroY),
      format("Side Tilt", adj.gyroZ),
    ].filter(Boolean);

    toast.info(
      <div>
        <strong>Posture Updated</strong>
        <div style={{ marginTop: 6 }}>{changes}</div>
      </div>,
      { autoClose: 4500 }
    );

    // Mark as shown for this session
    sessionStorage.setItem(adjustmentKey, "true");

  }, [user]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    adjustmentShownRef.current = false; 
  };

  return (
    <UserContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};