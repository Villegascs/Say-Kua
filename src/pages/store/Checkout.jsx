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
  const [orderId, setOrderId] = useState(null);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    documentType: 'V',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    
    // Save order details before clearing cart
    const finalCart = [...cart];
    const finalTotalUSD = totalUSD;
    const finalTotalBS = totalBS;
    const finalFormData = { ...formData };

    const newOrderId = await addOrder({
      customer: {
        name: finalFormData.name,
        lastName: finalFormData.lastName,
        documentType: finalFormData.documentType,
        cedula: finalFormData.cedula
      },
      items: finalCart,
      totalUSD: finalTotalUSD,
      totalBS: finalTotalBS,
      payment: {
        method: finalFormData.paymentMethod,
        bank: finalFormData.paymentMethod === 'pago_movil' ? finalFormData.bank : null,
        currency: finalFormData.paymentMethod === 'efectivo' ? finalFormData.cashCurrency : null,
        reference: finalFormData.reference
      }
    });

    setLoading(false);
    
    if (newOrderId) {
      setSubmittedOrder({
        cart: finalCart,
        totalUSD: finalTotalUSD,
        totalBS: finalTotalBS,
        formData: finalFormData
      });
      setOrderId(newOrderId);
      setSuccess(true);
      clearCart();
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!submittedOrder) return;
    const phone = "584244745917";
    const trackingUrl = `${window.location.origin}/track/${orderId}`;
    
    let itemsText = submittedOrder.cart.map(i => `${i.quantity}x ${i.name}`).join('%0A');
    
    let text = `¡Hola Say-Kua! Acabo de realizar un pedido.%0A%0A`;
    text += `*Cliente:* ${submittedOrder.formData.name} ${submittedOrder.formData.lastName}%0A`;
    text += `*Cédula:* ${submittedOrder.formData.documentType}-${submittedOrder.formData.cedula}%0A%0A`;
    text += `*Pedido:*%0A${itemsText}%0A%0A`;
    text += `*Total Pagado:* Bs ${submittedOrder.totalBS} ($${submittedOrder.totalUSD})%0A`;
    text += `*Método:* ${submittedOrder.formData.paymentMethod} ${submittedOrder.formData.reference ? `(Ref: ${submittedOrder.formData.reference})` : ''}%0A%0A`;
    text += `Aquí pueden ver y cambiar el estado de mi pedido:%0A${trackingUrl}`;

    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    navigate(`/track/${orderId}`);
  };

  if (success) {
    return (
      <div className="container animate-fade-in" style={styles.successContainer}>
        <CheckCircle size={64} color="var(--primary-color)" />
        <h2 style={{marginTop: '20px', color: '#fff'}}>¡Pedido Enviado!</h2>
        <p style={{color: 'var(--text-muted)', marginBottom: '30px', maxWidth: '400px'}}>
          Para que nuestro equipo comience a prepararlo, por favor envíanos la confirmación por WhatsApp.
        </p>
        <button className="btn-primary" onClick={handleWhatsAppRedirect} style={{marginBottom: '15px', backgroundColor: '#25D366', color: '#fff', fontSize: '1.1rem', padding: '12px 24px'}}>
          Enviar Confirmación a WhatsApp
        </button>
        <button className="btn-outline" onClick={() => navigate(`/track/${orderId}`)}>
          Solo ver el estado del pedido
        </button>
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
              <label>Cédula o RIF</label>
              <div style={{display: 'flex', gap: '8px'}}>
                <select name="documentType" value={formData.documentType} onChange={handleChange} style={{width: '80px'}}>
                  <option value="V">V</option>
                  <option value="E">E</option>
                  <option value="J">J</option>
                  <option value="G">G</option>
                  <option value="P">P</option>
                </select>
                <input required type="text" name="cedula" value={formData.cedula} onChange={handleChange} placeholder="Ej. 12345678" style={{flex: 1}} />
              </div>
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
