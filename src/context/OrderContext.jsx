import React, { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem("lootkart_orders");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse orders", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("lootkart_orders", JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders", e);
    }
  }, [orders]);

  const addOrder = (orderData) => {
    const newOrder = {
      id: "LK-" + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: "In Transit",
      step: 2, // 1: Placed, 2: Shipped/In Transit, 3: Out for Delivery, 4: Delivered
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
