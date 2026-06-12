import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useMenu } from '../../context/MenuContext';
import { Plus } from 'lucide-react';

const CATEGORIES = ['Todos', 'Entradas', 'Ensaladas', 'Roles Fríos Uramaki', 'Roles Tempurizados', 'Sopas', 'Arroz', 'Chow Mein', 'Combos', 'Platos Calientes', 'Menú Kids', 'Bebidas', 'Otros Platos'];

const Home = () => {
  const { addToCart } = useCart();
  const { menu } = useMenu();
  const [activeCategory, setActiveCategory] = useState('Todos');

  const availableMenu = menu.filter(item => item.available);
  const filteredMenu = activeCategory === 'Todos' 
    ? availableMenu 
    : availableMenu.filter(item => item.category === activeCategory);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Say-Kua</h1>
          <p style={styles.heroSubtitle}>La mejor fusión de Sushi y Comida China. Pide online y disfruta en casa o retira en nuestro local.</p>
          <a href="#menu" className="btn-primary" style={{ display: 'inline-flex', width: 'fit-content' }}>
            Ver Menú Digital
          </a>
        </div>
        <div style={styles.heroOverlay}></div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="container" style={styles.menuSection}>
        <h2 style={styles.sectionTitle}>Nuestro Menú</h2>
        
        <div style={styles.categoryFilter}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                ...styles.categoryBtn,
                backgroundColor: activeCategory === cat ? 'var(--primary-color)' : 'transparent',
                color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
                border: activeCategory === cat ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={styles.grid}>
          {filteredMenu.map((item) => (
            <div key={item.id} className="glass-panel" style={styles.card}>
              <div style={styles.imageContainer}>
                <img src={item.image} alt={item.name} style={styles.image} />
                <div style={styles.priceTag}>${item.price.toFixed(2)}</div>
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{item.name}</h3>
                <p style={styles.cardDesc}>{item.description}</p>
                <button 
                  className="btn-outline" 
                  style={styles.addBtn}
                  onClick={() => addToCart(item)}
                >
                  <Plus size={18} /> Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  hero: {
    height: '60vh',
    minHeight: '400px',
    backgroundImage: 'url(https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=1920&h=1080)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.4) 100%)',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  heroTitle: {
    fontSize: 'clamp(3rem, 6vw, 5rem)',
    color: '#fff',
    maxWidth: '600px',
    lineHeight: '1.1',
    letterSpacing: '2px',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    maxWidth: '500px',
  },
  menuSection: {
    padding: '80px 20px',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    textAlign: 'center',
    color: 'var(--accent-color)',
  },
  categoryFilter: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  categoryBtn: {
    padding: '8px 16px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '30px',
  },
  card: {
    overflow: 'hidden',
    transition: 'transform var(--transition-normal)',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform var(--transition-normal)',
  },
  priceTag: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: 'var(--radius-full)',
    fontWeight: '700',
    fontSize: '0.9rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  },
  cardContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  cardTitle: {
    fontSize: '1.25rem',
    color: '#fff',
  },
  cardDesc: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    minHeight: '60px',
  },
  addBtn: {
    marginTop: '10px',
    width: '100%',
  }
};

export default Home;
