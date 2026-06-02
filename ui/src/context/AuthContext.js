import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * Authentication Provider
 *
 * Manages Basic Auth credentials for API calls.
 * Stores credentials in localStorage for persistence across page refreshes.
 *
 * Note: This is a simplified implementation for learning purposes.
 * Production apps should use more secure methods (HttpOnly cookies, JWT with refresh tokens).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing credentials on mount
  useEffect(() => {
    const storedCredentials = localStorage.getItem('auth_credentials');
    if (storedCredentials) {
      try {
        const credentials = JSON.parse(storedCredentials);
        setUser(credentials);
      } catch (e) {
        localStorage.removeItem('auth_credentials');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login with username and password
   * Validates credentials by making a test API call
   */
  const login = async (username, password) => {
    // Create Basic Auth token
    const token = btoa(`${username}:${password}`);

    // Test credentials against the API
    try {
      const response = await fetch('/api/folder/10000000-0000-0000-0000-000000000001', {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      if (response.ok || response.status === 404) {
        // 200 = success, 404 = auth worked but folder not found (still valid login)
        const credentials = { username, token };
        localStorage.setItem('auth_credentials', JSON.stringify(credentials));
        setUser(credentials);
        return { success: true };
      } else if (response.status === 401) {
        return { success: false, error: 'Invalid username or password' };
      } else {
        return { success: false, error: `Server error: ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: 'Unable to connect to server' };
    }
  };

  /**
   * Logout - clear credentials
   */
  const logout = () => {
    localStorage.removeItem('auth_credentials');
    setUser(null);
  };

  /**
   * Get the Authorization header for API calls
   */
  const getAuthHeader = () => {
    if (user?.token) {
      return { 'Authorization': `Basic ${user.token}` };
    }
    return {};
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    getAuthHeader
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
