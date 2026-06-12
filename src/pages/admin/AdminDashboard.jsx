import React, { useState } from 'react';
import { useOrders } from '../../context/OrdersContext';
import { useMenu } from '../../context/MenuContext';
import { CheckCircle, XCircle, Clock, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const CATEGORIES = ['Entradas', 'Ensaladas', 'Roles Fríos Uramaki', 'Roles Tempurizados', 'Sopas', 'Arroz', 'Chow Mein', 'Combos', 'Platos Calientes', 'Menú Kids', 'Bebidas', 'Otros Platos'];

const AdminDashboard = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { menu, loading, addMenuItem, deleteMenuItem, toggleAvailability, seedDatabase } = useMenu();
  const [activeTab, setActiveTab] = useState('Pendiente');

  // Form state for adding new menu item
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '', category: CATEGORIES[0], description: '', price: '', image: ''
  });

  const filteredOrders = orders.filter(o => o.status === activeTab);

  const renderPaymentInfo = (payment) => {
    switch(payment.method) {
      case 'pago_movil': return `Pago Móvil (${payment.bank}) - Ref: ${payment.reference}`;
      case 'zelle': return `Zelle - Ref: ${payment.reference}`;
      case 'binance': return `Binance - Ref: ${payment.reference}`;
      case 'efectivo': return `Efectivo (${payment.currency.toUpperCase()})`;
      default: return 'N/A';
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addMenuItem({
      ...newItem,
      price: parseFloat(newItem.price) || 0,
      image: newItem.image || 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400'
    });
    setNewItem({ name: '', category: CATEGORIES[0], description: '', price: '', image: '' });
    setShowAddForm(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={styles.tabs}>
        {['Pendiente', 'Aceptado', 'En Proceso', 'Listo', 'Cancelado', 'Gestión de Menú'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab, 
              borderBottom: activeTab === tab ? '2px solid var(--primary-color)' : '2px solid transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-muted)'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Gestión de Menú' ? (
        <div className="animate-fade-in">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{color: 'var(--accent-color)'}}>Administrar Platos</h2>
            <div style={{display: 'flex', gap: '10px'}}>
              {menu.length === 0 && !loading && (
                <button className="btn-outline" onClick={() => seedDatabase()}>
                  Cargar Menú Base (Inicializar DB)
                </button>
              )}
              <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                <Plus size={20} /> {showAddForm ? 'Cancelar' : 'Añadir Plato'}
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="glass-panel" style={{padding: '20px', marginBottom: '30px'}}>
              <form onSubmit={handleAddSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                  <div className="input-group">
                    <label>Nombre del Plato</label>
                    <input required type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>Categoría</label>
                    <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Precio ($)</label>
                    <input required type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>URL Imagen (Opcional)</label>
                    <input type="text" placeholder="https://..." value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Descripción / Ingredientes</label>
                  <input required type="text" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                </div>
                <button type="submit" className="btn-primary" style={{width: 'fit-content'}}>Guardar Plato</button>
              </form>
            </div>
          )}

          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {menu.map(item => (
              <div key={item.id} className="glass-panel" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px'}}>
                <div>
                  <h4 style={{fontSize: '1.1rem', color: '#fff'}}>{item.name} <span style={{color: 'var(--accent-color)', fontSize: '0.9rem'}}>(${item.price.toFixed(2)})</span></h4>
                  <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>{item.category} • {item.description}</p>
                </div>
                <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                  <button 
                    onClick={() => toggleAvailability(item.id)}
                    style={{display: 'flex', alignItems: 'center', gap: '8px', color: item.available ? '#388E3C' : 'var(--text-muted)'}}
                  >
                    {item.available ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    {item.available ? 'Disponible' : 'Agotado'}
                  </button>
                  <button 
                    onClick={() => { if(window.confirm('¿Seguro que deseas eliminar este plato?')) deleteMenuItem(item.id) }}
                    style={{color: 'var(--primary-color)', padding: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px'}}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredOrders.length === 0 ? (
            <p style={{color: 'var(--text-muted)'}}>No hay pedidos en esta sección.</p>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="glass-panel" style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.orderId}>Pedido #{order.id.slice(-4)}</h3>
                  <span style={{...styles.badge, backgroundColor: getStatusColor(order.status)}}>
                    {order.status}
                  </span>
                </div>
                
                <div style={styles.customerInfo}>
                  <p><strong>Cliente:</strong> {order.customer.name} {order.customer.lastName}</p>
                  <p><strong>Cédula:</strong> {order.customer.documentType ? `${order.customer.documentType}-` : 'V-'}{order.customer.cedula}</p>
                  <p><strong>Total:</strong> ${order.totalUSD} / Bs {order.totalBS}</p>
                  <p><strong>Entrega:</strong> {order.delivery?.type === 'delivery' ? `Delivery - ${order.delivery.address}` : 'Retiro en Local (Pick-Up)'}</p>
                  <p><strong>Pago:</strong> {renderPaymentInfo(order.payment)}</p>
                  <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px'}}>
                    <Clock size={12} style={{display: 'inline', marginRight: '4px'}}/>
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <div style={styles.itemsList}>
                  {order.items.map(item => (
                    <div key={item.id} style={styles.itemRow}>
                      <span>{item.quantity}x {item.name}</span>
                    </div>
                  ))}
                </div>

                {activeTab === 'Pendiente' && (
                  <div style={styles.actions}>
                    <button className="btn-primary" onClick={() => updateOrderStatus(order.id, 'Aceptado')} style={{flex: 1, padding: '8px'}}>
                      <CheckCircle size={18} /> Aceptar Pago
                    </button>
                    <button className="btn-outline" onClick={() => updateOrderStatus(order.id, 'Cancelado')} style={{flex: 1, padding: '8px'}}>
                      <XCircle size={18} /> Cancelar
                    </button>
                  </div>
                )}

                {activeTab === 'Aceptado' && (
                  <div style={styles.actions}>
                    <button className="btn-outline" onClick={() => updateOrderStatus(order.id, 'Cancelado')} style={{flex: 1, padding: '8px'}}>
                      <XCircle size={18} /> Cancelar Pedido
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch(status) {
    case 'Pendiente': return '#F57C00';
    case 'Aceptado': return '#1976D2';
    case 'En Proceso': return '#E64A19';
    case 'Listo': return '#388E3C';
    case 'Cancelado': return '#D32F2F';
    default: return 'var(--border-color)';
  }
};

const styles = {
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '1px solid var(--border-color)',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '12px 16px',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all var(--transition-fast)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px',
  },
  orderId: {
    fontSize: '1.2rem',
    color: '#fff',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#fff',
  },
  customerInfo: {
    fontSize: '0.9rem',
    color: '#E0E0E0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemsList: {
    backgroundColor: 'var(--bg-primary)',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  itemRow: {
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: 'auto',
    paddingTop: '16px',
  }
};

export default AdminDashboard;
