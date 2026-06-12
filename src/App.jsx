import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoreLayout from './layouts/StoreLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/store/Home';
import Checkout from './pages/store/Checkout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ChefDashboard from './pages/chef/ChefDashboard';
import Login from './pages/auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import { AuthProvider } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';

function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <OrdersProvider>
          <CartProvider>
          <Router>
            <Routes>
              {/* Store Routes */}
              <Route path="/" element={<StoreLayout />}>
                <Route index element={<Home />} />
                <Route path="checkout" element={<Checkout />} />
              </Route>
              
              <Route path="/login" element={<Login />} />

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout title="Panel Administrativo" role="admin" />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
              </Route>

              {/* Chef Routes */}
              <Route 
                path="/chef" 
                element={
                  <ProtectedRoute allowedRoles={['chef']}>
                    <AdminLayout title="Say-Kua KDS (Cocina)" role="chef" />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ChefDashboard />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </OrdersProvider>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
