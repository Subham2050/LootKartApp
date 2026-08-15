import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();

  const getStorageKey = () => {
    return user ? `lootkart_orders_${user.email}` : "lootkart_orders_guest";
  };

  const [orders, setOrders] = useState([]);

  // Sync orders whenever logged-in user changes
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    try {
      const stored = localStorage.getItem(getStorageKey());
      setOrders(stored ? JSON.parse(stored) : []);
    } catch (e) {
      console.error("Failed to parse user orders", e);
      setOrders([]);
    }
  }, [user]);

  // Persist orders on change
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save user orders", e);
    }
  }, [orders, user]);

  const addOrder = (orderData) => {
    const newOrder = {
      id: "LK-" + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: "In Transit",
      step: 2,
      estimatedDelivery: "Tomorrow by 8:00 PM",
      ...orderData,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, orderCount: orders.length }}>
      {children}
    </OrderContext.Provider>
  );
};
