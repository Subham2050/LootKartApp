import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();

  const getStorageKey = () => {
    return user ? `wishlistItems_${user.email}` : "wishlistItems_guest";
  };

  const [wishlistItems, setWishlistItems] = useState([]);

  // Sync wishlist whenever user logs in or out
  useEffect(() => {
    if (!user) {
      setWishlistItems([]);
      return;
    }
    try {
      const stored = localStorage.getItem(getStorageKey());
      setWishlistItems(stored ? JSON.parse(stored) : []);
    } catch (e) {
      console.error("Failed to parse user wishlistItems", e);
      setWishlistItems([]);
    }
  }, [user]);

  // Save wishlist on update
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(wishlistItems));
    } catch (e) {
      console.error("Failed to save user wishlistItems", e);
    }
  }, [wishlistItems, user]);

  const toggleWishlist = (product) => {
    if (!user) {
      return false; // Triggers login prompt
    }
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        const normalized = {
          id: product.id,
          title: product.title || product.name || "Product",
          image: product.image,
          price: product.price,
          rating: product.rating,
        };
        return [...prev, normalized];
      }
    });
    return true;
  };

  const isInWishlist = (id) => {
    if (!user) return false;
    return wishlistItems.some((item) => item.id === id);
  };

  const wishlistCount = user ? wishlistItems.length : 0;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
