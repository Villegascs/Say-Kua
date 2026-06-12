import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Utensils, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(credentials.username, credentials.password);
    
    if (success) {
      // AuthContext and ProtectedRoute will handle redirecting to the proper dashboard
      // But we can also force navigate if needed based on username
      if (credentials.username === 'admin') navigate('/admin');
      if (credentials.username === 'chef') navigate('/chef');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="container animate-fade-in" style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate('/')}>
        <ArrowLeft size={20} /> Volver a Tienda
      </button>

      <div className="glass-panel" style={styles.loginBox}>
        <div style={styles.header}>
          <Utensils color="var(--primary-color)" size={40} />
          <h2 style={{color: '#fff', fontSize: '1.8rem'}}>Acceso del Equipo</h2>
          <p style={{color: 'var(--text-muted)'}}>Inicia sesión para gestionar pedidos</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          
          <div className="input-group">
            <label>Usuario</label>
            <input 
              required 
              type="text" 
              name="username" 
              value={credentials.username} 
              onChange={handleChange} 
              placeholder="admin o chef"
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input 
              required 
              type="password" 
              name="password" 
              value={credentials.password} 
              onChange={handleChange} 
              placeholder="admin123 o chef123"
            />
          </div>

          <button type="submit" className="btn-primary" style={{marginTop: '10px'}}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  backBtn: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-muted)',
    marginBottom: '20px',
  },
  loginBox: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px 30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  error: {
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    color: 'var(--primary-color)',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
    fontSize: '0.9rem',
    border: '1px solid rgba(229, 57, 53, 0.3)',
  }
};

export default Login;
