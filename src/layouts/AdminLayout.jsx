import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ChefHat, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ title, role }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          {role === 'chef' ? <ChefHat size={32} color="var(--primary-color)" /> : <Settings size={32} color="var(--primary-color)" />}
          <h2 style={styles.title}>{title}</h2>
        </div>
        
        <div style={styles.navLinks}>
          <Link to="/" style={styles.link}>
            <ArrowLeft size={20} />
            Volver a Tienda
          </Link>
        </div>

        <div style={styles.sidebarFooter}>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
  },
  sidebar: {
    width: '280px',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '40px',
  },
  title: {
    fontSize: '1.2rem',
    color: 'var(--text-main)',
  },
  navLinks: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-muted)',
    transition: 'all var(--transition-fast)',
    textDecoration: 'none',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--primary-color)',
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
  },
  main: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto',
  }
};

export default AdminLayout;
