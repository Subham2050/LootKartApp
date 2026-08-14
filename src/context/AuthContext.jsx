import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("lootkart_user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("lootkart_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("lootkart_user");
      }
    } catch (e) {
      console.error("Failed to save user session", e);
    }
  }, [user]);

  const login = (email, password) => {
    // Simulated authentication success
    const name = email.split("@")[0] || "User";
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    const userData = {
      id: "usr_" + Date.now(),
      name: formattedName,
      email: email,
      token: "jwt_mock_token_" + Date.now(),
    };
    setUser(userData);
    return userData;
  };

  const register = (name, email, password) => {
    const userData = {
      id: "usr_" + Date.now(),
      name: name || "User",
      email: email,
      token: "jwt_mock_token_" + Date.now(),
    };
    setUser(userData);
    return userData;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
