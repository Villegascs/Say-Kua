import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrdersContext';
import { Trash2, ArrowLeft, CheckCircle } from 'lucide-react';

const VENEZUELAN_BANKS = [
  'Banesco', 'Mercantil', 'Provincial', 'Bancamiga', 'Banco de Venezuela', 
  'BNC', 'Bancaribe', 'Banco del Tesoro', 'Banplus'
];

// Mock API fetch for BCV Euro Rate
const fetchBCVRate = async () => {
  // In a real app, this would hit an API.
  return new Promise(resolve => setTimeout(() => resolve(45.20), 500));
};

const Checkout = () => {
  const { cart, totalUSD, removeFromCart, updateQuantity, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    cedula: '',
    paymentMethod: 'pago_movil',
    cashCurrency: 'usd',
    bank: VENEZUELAN_BANKS[0],
    reference: ''
  });

  useEffect(() => {
    fetchBCVRate().then(setRate);
  }, []);

  const totalBS = rate ? (totalUSD * rate).toFixed(2) : '...';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      addOrder({
        customer: {
          name: formData.name,
          lastName: formData.lastName,
          cedula: formData.cedula
        },
        items: cart,
        totalUSD,
        totalBS,
        payment: {
          method: formData.paymentMethod,
          bank: formData.paymentMethod === 'pago_movil' ? formData.bank : null,
          currency: formData.paymentMethod === 'efectivo' ? formData.cashCurrency : null,
          reference: formData.reference
        }
      });
      setLoading(false);
      setSuccess(true);
      clearCart();
    }, 1500);
  };

  if (success) {
    return (
      <div className="container" style={styles.successContainer}>
        <CheckCircle size={64} color="var(--primary-color)" className="animate-fade-in" />
        <h2 style={{marginTop: '20px'}}>¡Pedido Realizado con Éxito!</h2>
        <p style={{color: 'var(--text-muted)', marginBottom: '30px'}}>
          Tu pedido está pendiente de verificación. Nuestro equipo confirmará tu pago en breve.
        </p>
        <button className="btn-primary" onClick={() => navigate('/')}>Volver al Menú</button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate('/')}>
        <ArrowLeft size={20} /> Volver
      </button>

      <div style={styles.grid}>
        {/* Cart Review */}
        <div className="glass-panel" style={styles.panel}>
          <h2 style={styles.panelTitle}>Tu Pedido</h2>
          
          {cart.length === 0 ? (
            <p style={{color: 'var(--text-muted)'}}>El carrito está vacío.</p>
          ) : (
            <div style={styles.cartList}>
              {cart.map(item => (
                <div key={item.id} style={styles.cartItem}>
                  <div style={styles.itemInfo}>
                    <h4 style={styles.itemName}>{item.name}</h4>
                    <div style={styles.qtyControl}>
                      <button onClick={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>+</button>
                    </div>
                  </div>
                  <div style={styles.itemMeta}>
                    <span style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              
              <div style={styles.totals}>
                <div style={styles.totalRow}>
                  <span>Total (USD):</span>
                  <span style={styles.totalValue}>${totalUSD.toFixed(2)}</span>
                </div>
                <div style={styles.totalRow}>
                  <span>Total (Bs) a Tasa BCV Euro ({rate || '...'}):</span>
                  <span style={styles.totalValueBs}>Bs {totalBS}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Form */}
        <div className="glass-panel" style={styles.panel}>
          <h2 style={styles.panelTitle}>Datos y Pago</h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
              <div className="input-group">
                <label>Nombre</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Apellido</label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>

            <div className="input-group">
              <label>Cédula de Identidad</label>
              <input required type="text" name="cedula" value={formData.cedula} onChange={handleChange} />
            </div>

            <div className="input-group" style={{marginTop: '20px'}}>
              <label>Método de Pago</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                <option value="pago_movil">Pago Móvil</option>
                <option value="zelle">Zelle</option>
                <option value="binance">Binance Pay</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </div>

            {formData.paymentMethod === 'pago_movil' && (
              <div className="input-group animate-fade-in">
                <label>Banco Origen</label>
                <select name="bank" value={formData.bank} onChange={handleChange}>
                  {VENEZUELAN_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            )}

            {formData.paymentMethod === 'efectivo' && (
              <div className="input-group animate-fade-in">
                <label>Moneda a Pagar</label>
                <select name="cashCurrency" value={formData.cashCurrency} onChange={handleChange}>
                  <option value="usd">Dólares ($)</option>
                  <option value="bs">Bolívares (Bs)</option>
                  <option value="eur">Euros (€)</option>
                </select>
              </div>
            )}

            {formData.paymentMethod !== 'efectivo' && (
              <div className="input-group animate-fade-in">
                <label>Número de Referencia</label>
                <input required type="text" name="reference" value={formData.reference} onChange={handleChange} placeholder="Ej. 12345678" />
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              style={{marginTop: '24px', width: '100%'}}
              disabled={cart.length === 0 || loading || !rate}
            >
              {loading ? 'Procesando...' : 'Proceder al Pago'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '40px',
    paddingBottom: '80px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-muted)',
    marginBottom: '20px',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px',
    alignItems: 'start',
  },
  panel: {
    padding: '30px',
  },
  panelTitle: {
    fontSize: '1.5rem',
    marginBottom: '24px',
    color: 'var(--accent-color)',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px',
  },
  cartList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-color)',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  itemName: {
    fontSize: '1.1rem',
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'var(--bg-secondary)',
    width: 'fit-content',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
  },
  qtyBtn: {
    color: 'var(--primary-color)',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    width: '24px',
  },
  itemMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  itemPrice: {
    fontWeight: '600',
    fontSize: '1.1rem',
  },
  removeBtn: {
    color: 'var(--text-muted)',
  },
  totals: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#fff',
  },
  totalValueBs: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'var(--accent-color)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    textAlign: 'center',
  }
};

export default Checkout;
