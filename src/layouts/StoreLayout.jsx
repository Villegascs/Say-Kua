import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';

const StoreLayout = () => {
  const { cart } = useCart();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="store-layout">
      <nav className="navbar" style={styles.navbar}>
        <div className="container" style={styles.navContainer}>
          <Link to="/" style={styles.logo}>
            <Utensils color="var(--primary-color)" size={28} />
            <span style={{color: 'var(--primary-color)'}}>Say-Kua</span>
          </Link>
          <div style={styles.navLinks}>
            <Link to="/checkout" style={styles.cartBtn} className="btn-primary">
              <ShoppingCart size={20} />
              {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
            </Link>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  navbar: {
    backgroundColor: 'var(--glass-bg)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'var(--font-heading)',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  linkText: {
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  cartBtn: {
    position: 'relative',
    padding: '8px 16px',
  },
  badge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: 'var(--accent-color)',
    color: '#000',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  main: {
    minHeight: 'calc(100vh - 70px)',
  }
};

export default StoreLayout;
