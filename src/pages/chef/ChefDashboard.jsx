import React from 'react';
import { useOrders } from '../../context/OrdersContext';
import { Play, CheckSquare } from 'lucide-react';

const ChefDashboard = () => {
  const { orders, updateOrderStatus } = useOrders();

  // Chef solo ve "Aceptado" (Por preparar) y "En Proceso"
  const chefOrders = orders.filter(o => o.status === 'Aceptado' || o.status === 'En Proceso');

  return (
    <div className="animate-fade-in">
      <h2 style={{color: 'var(--accent-color)', marginBottom: '30px', fontSize: '2rem'}}>KDS - Pantalla de Cocina</h2>
      
      <div style={styles.grid}>
        {chefOrders.length === 0 ? (
          <p style={{color: 'var(--text-muted)', fontSize: '1.5rem'}}>No hay pedidos pendientes por preparar.</p>
        ) : (
          chefOrders.map(order => (
            <div 
              key={order.id} 
              className="glass-panel" 
              style={{
                ...styles.card, 
                borderTop: order.status === 'En Proceso' ? '4px solid #E64A19' : '4px solid #1976D2'
              }}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.orderId}>Pedido #{order.id.slice(-4)}</h3>
                <span style={styles.timer}>
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </div>

              <div style={styles.itemsList}>
                {order.items.map(item => (
                  <div key={item.id} style={styles.itemRow}>
                    <span style={styles.qty}>{item.quantity}</span>
                    <span style={styles.itemName}>{item.name}</span>
                  </div>
                ))}
              </div>

              <div style={styles.actions}>
                {order.status === 'Aceptado' && (
                  <button 
                    className="btn-primary" 
                    onClick={() => updateOrderStatus(order.id, 'En Proceso')} 
                    style={{width: '100%', fontSize: '1.2rem', padding: '16px', backgroundColor: '#E64A19'}}
                  >
                    <Play size={24} /> Empezar Preparación
                  </button>
                )}
                
                {order.status === 'En Proceso' && (
                  <button 
                    className="btn-primary" 
                    onClick={() => updateOrderStatus(order.id, 'Listo')} 
                    style={{width: '100%', fontSize: '1.2rem', padding: '16px', backgroundColor: '#388E3C'}}
                  >
                    <CheckSquare size={24} /> Marcar como Listo
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '30px',
  },
  card: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backgroundColor: 'var(--bg-secondary)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid var(--border-color)',
    paddingBottom: '16px',
  },
  orderId: {
    fontSize: '2rem',
    color: '#fff',
    fontWeight: '700',
  },
  timer: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flex: 1,
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-md)',
  },
  qty: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
    minWidth: '40px',
    textAlign: 'center',
  },
  itemName: {
    fontSize: '1.5rem',
    color: '#fff',
    fontWeight: '600',
  },
  actions: {
    marginTop: 'auto',
  }
};

export default ChefDashboard;
