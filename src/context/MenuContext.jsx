import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const MenuContext = createContext();

export const useMenu = () => useContext(MenuContext);

export const DEFAULT_MENU_ITEMS = [
  // --- ENTRADAS ---
  { category: 'Entradas', name: 'Croquetas de cangrejo', description: 'Queso crema, cebollín, cebolla, cangrejo', price: 8.00, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Entradas', name: 'Camarones Tempurizados', description: 'Tempurizados', price: 9.00, image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Entradas', name: 'Lumpias de pollo', description: 'Masa frita rellena de pollo', price: 6.00, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Entradas', name: 'Lumpias de camarón', description: 'Masa frita rellena de camarón', price: 8.00, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Entradas', name: 'Wanton al vapor', description: 'Masa rellena con albóndigas de camarón al vapor', price: 7.00, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Entradas', name: 'Wanton frito', description: 'Masa rellena con albóndigas de camarón frito', price: 8.00, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Entradas', name: 'Gyosas', description: 'Pollo, hongo, cebollín chino', price: 6.00, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&q=80&w=400', available: true },

  // --- ENSALADAS ---
  { category: 'Ensaladas', name: 'Poseidon', description: 'Wakame, cancrejo, salmón, atún rojo, mayonesa, aceite de sésamo', price: 9.00, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400', available: true },

  // --- ROLES FRIOS URAMAKI ---
  { category: 'Roles Fríos Uramaki', name: 'Dinamita', description: 'Cangrejo, wakame, mayonesa', price: 8.00, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Fríos Uramaki', name: 'Say-Kua', description: 'Salmón, atún rojo, aguacate, queso crema, topping de tartar de atún', price: 10.00, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Fríos Uramaki', name: 'Acevichado', description: 'Camarones tempura, queso crema', price: 9.00, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Fríos Uramaki', name: 'Alaska especial', description: 'Salmón, queso crema, cebollín, aguacate, topping de salmón y wakame', price: 12.00, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Fríos Uramaki', name: 'Tropical roll', description: 'Camarones tempura, aguacate, queso crema, topping de tajada', price: 8.00, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Fríos Uramaki', name: 'Fuji', description: 'Cebollín, topping de ceviche cremoso', price: 9.00, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Fríos Uramaki', name: 'Alaska', description: 'Salmón, aguacate, queso crema, cebollín', price: 10.00, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Fríos Uramaki', name: 'Fit-Say', description: 'Atún rojo, salmón, cangrejo, aguacate, queso crema y cebollín', price: 14.00, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Fríos Uramaki', name: 'Poseidon', description: 'Atún rojo, cancrejo, queso crema, cebollín, topping de ensalada dinamita', price: 12.00, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=400', available: true },

  // --- ROLES TEMPURIZADOS ---
  { category: 'Roles Tempurizados', name: 'Tokyo', description: 'Camarones, aguacate, queso crema, cebollín, acompañado de salsa Fuji y angila, topping de camarones troceados, mayo-spicy', price: 8.00, image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Tempurizados', name: 'Tiger', description: 'Salmón, aguacate, queso crema, cebollín, salsa anguila', price: 10.00, image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Tempurizados', name: 'Tsunami roll', description: 'Atún rojo, queso crema, cebollín, aguacate, topping de camarones tempura, salsa spicy y anguila', price: 12.00, image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Tempurizados', name: 'Miyagui', description: 'Cancrejo, aguacate, queso crema, topping de ensalada dinamita', price: 9.00, image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Tempurizados', name: 'Sakura roll', description: 'Camarones tempura, cancrejo, queso crema, cebollín, topping de wakame', price: 9.00, image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Tempurizados', name: 'Caribean', description: 'Cama de platano frito, queso crema, cebollín, cancrejo tempurizado, aguacate, topping de pasta dinamita y queso crema', price: 9.00, image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Roles Tempurizados', name: 'Chicken roll', description: 'Pollo tempurizado, queso crema, cebollín, aguacate, topping de pollo, anguila y fuji', price: 8.00, image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=400', available: true },

  // --- SOPAS ---
  { category: 'Sopas', name: 'Ramen', description: 'Sopa con pasta, vegetales, pollo, cerdo asado y huevo', price: 11.00, image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Sopas', name: 'Ramen kids', description: 'Sopa con pasta, vegetales, pollo, camarón, cerdo asado y huevo', price: 6.00, image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Sopas', name: 'Sopa con wanton', description: 'Sopa con wantones relleno de camarón, pasta, topping de camarón y cerdo', price: 11.00, image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&q=80&w=400', available: true },

  // --- OTROS PLATOS ---
  { category: 'Otros Platos', name: 'Pollo agridulce', description: 'Milanesa de pollo empanizado con salsa agridulce', price: 10.00, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Otros Platos', name: 'Croquetas', description: 'Cerdo, pescado, zanahoria, cebolla', price: 8.00, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Otros Platos', name: 'Arroz clásico', description: 'Arroz frito, vegetales, pollo, cerdo y huevo', price: 6.50, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Otros Platos', name: 'Arroz especial', description: 'Arroz frito, vegetales, pollo, cerdo, huevo y camarones', price: 8.50, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Otros Platos', name: 'Chow mein', description: 'Pasta salteada con vegetales, carne, pollo y cerdo', price: 10.00, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Otros Platos', name: 'Chow mein especial', description: 'Pasta salteada con vegetales, carne, pollo, camarón, jojoto y champiñones', price: 12.00, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Otros Platos', name: 'Chow mein crispy', description: 'Pasta frita con vegetales, carne, pollo, y cerdo', price: 10.00, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Otros Platos', name: 'Chow mein crispy especial', description: 'Pasta frita con vegetales, carne, pollo, cerdo, camarón, jojoto y champiñones', price: 12.00, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Otros Platos', name: 'Mai fun', description: 'Pasta a base de arroz salteado con vegetales, carne y pollo', price: 11.00, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Otros Platos', name: 'Mai fun especial', description: 'Pasta a base de arroz salteado con vegetales, carne y pollo, cerdo y camarón', price: 13.00, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Otros Platos', name: 'Chopsuey clásico', description: 'Cerdo, pollo, vegetales, carne y vainitas', price: 9.00, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Otros Platos', name: 'Chopsuey especial', description: 'Cerdo, pollo, vegetales, carne, camarones, champiñones y jojoto tierno', price: 11.00, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Otros Platos', name: 'Lomito', description: '250g de lomito, salteado con brocoli y champignon, acompañado de arroz cantones y vegetales', price: 15.00, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400', available: true },
  { category: 'Otros Platos', name: 'Pollo Kung Pao', description: 'Pollo marinado, acompañado arroz cantones, merey y vegetales', price: 12.00, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=400', available: true },
];

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen to Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "menu"), (snapshot) => {
      const menuData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenu(menuData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching menu:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addMenuItem = async (item) => {
    try {
      await addDoc(collection(db, "menu"), { ...item, available: true });
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error al guardar: Posible problema de permisos en Firestore");
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      await deleteDoc(doc(db, "menu", id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const toggleAvailability = async (id) => {
    const item = menu.find(i => i.id === id);
    if (!item) return;
    try {
      await updateDoc(doc(db, "menu", id), { available: !item.available });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const seedDatabase = async () => {
    for (const item of DEFAULT_MENU_ITEMS) {
      await addDoc(collection(db, "menu"), item);
    }
  };

  return (
    <MenuContext.Provider value={{ menu, loading, addMenuItem, deleteMenuItem, toggleAvailability, seedDatabase }}>
      {children}
    </MenuContext.Provider>
  );
};
