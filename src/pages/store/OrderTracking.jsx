import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { ArrowLeft, Clock, CheckCircle, ChefHat, PackageCheck, XCircle } from 'lucide-react';

const STATUS_STEPS = ['Pendiente', 'Aceptado', 'En Proceso', 'Listo'];

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    
    const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      } else {
        setOrder(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container" style={styles.centerContainer}>
        <div className="spinner"></div>
        <p>Buscando tu pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={styles.centerContainer}>
        <XCircle size={64} color="var(--primary-color)" />
        <h2>Pedido no encontrado</h2>
        <p>Verifica que el enlace sea correcto.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Ir al Menú</button>
      </div>
    );
  }

  const currentStatusIndex = STATUS_STEPS.indexOf(order.status);
  const isCanceled = order.status === 'Cancelado';

  const isDelivery = order.delivery?.type === 'delivery';

  const getStepIcon = (step) => {
    switch (step) {
      case 'Pendiente': return <Clock size={24} />;
      case 'Aceptado': return <CheckCircle size={24} />;
      case 'En Proceso': return <ChefHat size={24} />;
      case 'Listo': return isDelivery ? <div style={{fontSize: '24px'}}>🛵</div> : <PackageCheck size={24} />;
      default: return <Clock size={24} />;
    }
  };

  const getStepText = (step) => {
    if (step === 'Listo') {
      return isDelivery ? 'Pedido Despachado' : 'Pedido Listo';
    }
    return step;
  };

  return (
    <div className="container animate-fade-in" style={{paddingTop: '40px', paddingBottom: '80px'}}>
      <button style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem'}} onClick={() => navigate('/')}>
        <ArrowLeft size={20} /> Volver a la Tienda
      </button>

      <div className="glass-panel" style={{padding: '30px', maxWidth: '600px', margin: '0 auto'}}>
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
          <h2 style={{color: 'var(--accent-color)', marginBottom: '10px'}}>Estado de tu Pedido</h2>
          <p style={{fontSize: '1.2rem', color: '#fff'}}>Pedido #{order.id.slice(-4)}</p>
          <p style={{color: 'var(--text-muted)'}}>¡Hola {order.customer.name}! Aquí puedes ver cómo va tu comida.</p>
        </div>

        {isCanceled ? (
          <div style={{textAlign: 'center', padding: '30px 0'}}>
            <XCircle size={64} color="var(--primary-color)" style={{marginBottom: '15px'}} />
            <h3 style={{color: 'var(--primary-color)'}}>Tu pedido fue cancelado</h3>
            <p style={{color: 'var(--text-muted)'}}>Por favor, comunícate con nosotros por WhatsApp para más detalles.</p>
          </div>
        ) : (
          <div style={styles.timeline}>
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = currentStatusIndex >= index;
              const isCurrent = currentStatusIndex === index;
              return (
                <div key={step} style={styles.timelineStep}>
                  <div style={{
                    ...styles.stepIcon,
                    backgroundColor: isCurrent ? 'var(--primary-color)' : (isCompleted ? 'var(--accent-color)' : 'var(--bg-primary)'),
                    color: isCompleted || isCurrent ? '#fff' : 'var(--text-muted)',
                    boxShadow: isCurrent ? '0 0 15px var(--primary-color)' : 'none'
                  }}>
                    {getStepIcon(step)}
                  </div>
                  <div style={{
                    ...styles.stepText,
                    color: isCurrent ? '#fff' : (isCompleted ? '#E0E0E0' : 'var(--text-muted)'),
                    fontWeight: isCurrent ? '700' : '500'
                  }}>
                    {getStepText(step)}
                  </div>
                  {index < STATUS_STEPS.length - 1 && (
                    <div style={{
                      ...styles.stepLine,
                      backgroundColor: currentStatusIndex > index ? 'var(--accent-color)' : 'var(--border-color)'
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-color)'}}>
          <h3 style={{marginBottom: '15px'}}>Resumen</h3>
          <ul style={{listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {order.items.map(item => (
              <li key={item.id} style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#E0E0E0'}}>{item.quantity}x {item.name}</span>
                <span style={{fontWeight: 'bold'}}>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-color)', fontSize: '1.2rem', fontWeight: 'bold'}}>
            <span>Total pagado:</span>
            <span>Bs {order.totalBS}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    gap: '20px'
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    position: 'relative',
    paddingLeft: '20px'
  },
  timelineStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    position: 'relative',
    height: '80px'
  },
  stepIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    transition: 'all 0.4s ease'
  },
  stepText: {
    fontSize: '1.2rem',
    transition: 'color 0.3s ease'
  },
  stepLine: {
    position: 'absolute',
    left: '24px',
    top: '50px',
    bottom: '-30px',
    width: '2px',
    zIndex: 1,
    transition: 'background-color 0.4s ease'
  }
};

export default OrderTracking;
