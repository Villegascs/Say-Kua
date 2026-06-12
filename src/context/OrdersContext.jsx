import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';

const OrdersContext = createContext();

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort orders by createdAt descending
      ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addOrder = async (orderData) => {
    try {
      const newOrder = {
        ...orderData,
        status: 'Pendiente', 
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, "orders"), newOrder);
    } catch (e) {
      console.error("Error adding order: ", e);
      alert("Error al enviar el pedido: Posible problema de permisos en Firestore");
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", id), { status: newStatus });
    } catch (e) {
      console.error("Error updating order: ", e);
    }
  };

  return (
    <OrdersContext.Provider value={{ orders, loading, addOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
};
