import { useCallback, useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const useAuth = () => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await getCurrentUser();

      const responseData = response?.data || response;
      const currentUser = responseData?.user || response?.user || null;

      if (!currentUser) {
        throw new Error("User data not found.");
      }

      localStorage.setItem("user", JSON.stringify(currentUser));
      setUser(currentUser);

      return currentUser;
    } catch (error) {
      console.error("Auth check failed:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return {
    user,
    setUser,
    loading,
    isAuthenticated: Boolean(token && user),
    refreshUser,
    logout,
  };
};

export default useAuth;
