// File: context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// 1. Context create karein
const AuthContext = createContext();

// 2. Provider Component banayein
export const AuthProvider = ({ children }) => {
  // Global states define karein
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Favorites mein city add karne ka function
  const addToFavorites = (city) => {
    if (!favorites.find(fav => fav.name === city.name)) {
      setFavorites([...favorites, city]);
      return true; // Success
    }
    return false; // Already in favorites
  };

  // Favorites se remove karne ka function
  const removeFromFavorites = (cityName) => {
    setFavorites(favorites.filter(city => city.name !== cityName));
  };

  // NEW FUNCTION: Clear all favorites
  const clearAllFavorites = () => {
    setFavorites([]);
  };

  // Check karein k city favorite hai ya nahi
  const isFavorite = (cityName) => {
    return favorites.some(city => city.name === cityName);
  };

  // User login karne ka function
  const login = (userData) => {
    setUser(userData);
  };

  // User logout karne ka function
  const logout = () => {
    setUser(null);
    setFavorites([]);
  };

  // Dark mode toggle karne ka function
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Yeh sab values sab components ko available hon gi
  const value = {
    user,
    setUser,
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites, // Add this line
    isFavorite,
    login,
    logout,
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook banayein taake aasani se context use kar sakein
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};