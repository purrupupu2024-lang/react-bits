import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useNakamas } from '../components/context/NakamasContext';
import MusicPlayer from '../components/music/MusicPlayer';

// Componente de Isla Navegable
function IslandCard({ icon, title, description, onClick, isActive = false }) {
  const cardRef = useRef();

  useEffect(() => {
    const card = cardRef.current;
    
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -10,
        rotationY: 5,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        rotationY: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`island-card interactive-element ${isActive ? 'active' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--one-piece-gold)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '1rem', opacity: 0.8 }}>{description}</p>
      
      {isActive && (
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--island-green)',
            boxShadow: '0 0 10px var(--island-green)'
          }}
        />
      )}
    </motion.div>
  );
}

// Componente de Token Display
function TokenDisplay({ symbol, amount, change }) {
  return (
    <div className="island-card" style={{ padding: '1.5rem', textAlign: 'center', minWidth: '150px' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
      <h4 className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        ${symbol}
      </h4>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
        {amount.toLocaleString()}
      </p>
      <p style={{ 
        fontSize: '0.875rem', 
        color: change >= 0 ? 'var(--island-green)' : 'var(--luffy-red)' 
      }}>
        {change >= 0 ? '+' : ''}{change}%
      </p>
    </div>
  );
}

// Componente de Progreso Diario
function DailyProgress({ listened, earned, completed }) {
  return (
    <div className="island-card" style={{ padding: '2rem' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--one-piece-gold)' }}>
        📊 Progreso de Hoy
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>🎵 Canciones Escuchadas</span>
            <span>{listened}/50</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(listened / 50) * 100}%` }}
            />
          </div>
        </div>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>💰 $LUNA Ganados</span>
            <span>{earned}/1000</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(earned / 1000) * 100}%` }}
            />
          </div>
        </div>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>⚔️ Retos Completados</span>
            <span>{completed}/5</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(completed / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Notificaciones
function NotificationCenter({ notifications, onRemove }) {
  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
      {notifications.map((notification) => (
        <motion.div
          key={notification.id}
          className={`nakama-notification ${notification.type}`}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          style={{ marginBottom: '1rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{notification.icon}</span>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {notification.title}
              </h4>
              <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => onRemove(notification.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--pirate-white)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                marginLeft: 'auto'
              }}
            >
              ×
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const {
    user,
    tokens,
    dailyProgress,
    notifications,
    currentIsland,
    connectWallet,
    disconnectWallet,
    earnTokens,
    navigateToIsland,
    dispatch
  } = useNakamas();

  const [selectedIsland, setSelectedIsland] = useState('dashboard');

  useEffect(() => {
    // Animación de entrada del dashboard
    gsap.fromTo('.dashboard-header', 
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );

    gsap.fromTo('.islands-grid', 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" }
    );

    // Simular ganancia de tokens cada 10 segundos
    const tokenInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% de probabilidad
        earnTokens(Math.floor(Math.random() * 50) + 10);
      }
    }, 10000);

    return () => clearInterval(tokenInterval);
  }, [earnTokens]);

  const handleIslandClick = (island) => {
    setSelectedIsland(island);
    navigateToIsland(island);
    
    // Aquí se implementaría la navegación real a cada isla
    console.log(`🏴‍☠️ Navegando a: ${island}`);
  };

  const handleWalletAction = () => {
    if (user.isConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const islands = [
    {
      id: 'music',
      icon: '🎧',
      title: 'Isla del Sonido',
      description: 'Escucha música y gana $LUNA'
    },
    {
      id: 'games',
      icon: '🎮',
      title: 'Isla de los Retos',
      description: 'Juegos musicales épicos'
    },
    {
      id: 'swap',
      icon: '💰',
      title: 'Isla del Tesoro',
      description: 'Swap y Staking de tokens'
    },
    {
      id: 'create',
      icon: '🎨',
      title: 'Isla de los Artistas',
      description: 'Crea con IA y sube música'
    },
    {
      id: 'rankings',
      icon: '🏆',
      title: 'Isla de los Rankings',
      description: 'Leaderboards y competencias'
    },
    {
      id: 'crews',
      icon: '👥',
      title: 'Isla de los Crews',
      description: 'Únete a tripulaciones'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--marineford-night)', color: 'var(--pirate-white)', padding: '2rem' }}>
      {/* Notificaciones */}
      <NotificationCenter 
        notifications={notifications} 
        onRemove={removeNotification} 
      />

      {/* Header del Dashboard */}
      <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="epic-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              PUENTE DE MANDO
            </h1>
            <p className="pirate-subtitle">
              ¡Bienvenido de vuelta, {user.name || 'Nakama'}! 🏴‍☠️
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Rango Actual</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--one-piece-gold)' }}>
                {user.rank}
              </p>
            </div>
            
            <button
              className={`nakama-button ${user.isConnected ? 'nakama-button-secondary' : ''}`}
              onClick={handleWalletAction}
              style={{ padding: '0.75rem 1.5rem' }}
            >
              {user.isConnected ? '🏴‍☠️ Desconectar' : '🔗 Conectar Wallet'}
            </button>
          </div>
        </div>

        {/* Tokens Display */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <TokenDisplay symbol="LUNA" amount={tokens.LUNA} change={+2.5} />
          <TokenDisplay symbol="MSC" amount={tokens.MSC} change={-1.2} />
          <TokenDisplay symbol="NKM" amount={tokens.NKM} change={+5.8} />
        </div>
      </div>

      {/* Grid de Islas */}
      <div className="islands-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {islands.map((island) => (
          <IslandCard
            key={island.id}
            icon={island.icon}
            title={island.title}
            description={island.description}
            onClick={() => handleIslandClick(island.id)}
            isActive={selectedIsland === island.id}
          />
        ))}
      </div>

      {/* Contenido de la Isla Seleccionada */}
      {selectedIsland === 'music' && (
        <div style={{ marginBottom: '3rem' }}>
          <MusicPlayer />
        </div>
      )}

      {selectedIsland === 'games' && (
        <div className="island-card" style={{ textAlign: 'center', padding: '3rem', marginBottom: '3rem' }}>
          <h2 className="epic-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            🎮 ISLA DE LOS RETOS
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            ¡Próximamente! Juegos musicales épicos te esperan.
          </p>
          <div style={{ fontSize: '8rem', marginBottom: '2rem' }}>🚧</div>
          <p style={{ fontSize: '1rem', opacity: 0.7 }}>
            "¡Los mejores retos están por venir, nakama!"
          </p>
        </div>
      )}

      {selectedIsland === 'swap' && (
        <div className="island-card" style={{ textAlign: 'center', padding: '3rem', marginBottom: '3rem' }}>
          <h2 className="epic-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            💰 ISLA DEL TESORO
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            Intercambia tus tesoros en Skypiea. ¡Próximamente!
          </p>
          <div style={{ fontSize: '8rem', marginBottom: '2rem' }}>⚡</div>
          <p style={{ fontSize: '1rem', opacity: 0.7 }}>
            "¡El intercambio de tesoros llegará pronto!"
          </p>
        </div>
      )}

      {selectedIsland === 'create' && (
        <div className="island-card" style={{ textAlign: 'center', padding: '3rem', marginBottom: '3rem' }}>
          <h2 className="epic-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            🎨 ISLA DE LOS ARTISTAS
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            Crea con Brook IA. ¡Masterización y portadas épicas!
          </p>
          <div style={{ fontSize: '8rem', marginBottom: '2rem' }}>🎭</div>
          <p style={{ fontSize: '1rem', opacity: 0.7 }}>
            "Yohohoho! ¡La IA musical está en desarrollo!"
          </p>
        </div>
      )}

      {selectedIsland === 'rankings' && (
        <div className="island-card" style={{ textAlign: 'center', padding: '3rem', marginBottom: '3rem' }}>
          <h2 className="epic-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            🏆 ISLA DE LOS RANKINGS
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            Compite con los mejores piratas musicales del mundo.
          </p>
          <div style={{ fontSize: '8rem', marginBottom: '2rem' }}>👑</div>
          <p style={{ fontSize: '1rem', opacity: 0.7 }}>
            "¡Las batallas épicas están por comenzar!"
          </p>
        </div>
      )}

      {selectedIsland === 'crews' && (
        <div className="island-card" style={{ textAlign: 'center', padding: '3rem', marginBottom: '3rem' }}>
          <h2 className="epic-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            👥 ISLA DE LOS CREWS
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            Únete a la tripulación más épica del Grand Line.
          </p>
          <div style={{ fontSize: '8rem', marginBottom: '2rem' }}>🏴‍☠️</div>
          <p style={{ fontSize: '1rem', opacity: 0.7 }}>
            "¡Los nakamas te están esperando!"
          </p>
        </div>
      )}

      {/* Progreso Diario */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <DailyProgress 
          listened={dailyProgress.listened}
          earned={dailyProgress.earned}
          completed={dailyProgress.completed}
        />
        
        {/* Actividad Reciente */}
        <div className="island-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--one-piece-gold)' }}>
            📜 Actividad Reciente
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(10, 36, 99, 0.2)', borderRadius: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🎵</span>
              <div>
                <p style={{ fontWeight: 'bold' }}>Escuchaste "Gomu Gomu no Beat"</p>
                <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>+25 $LUNA • Hace 5 min</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(10, 36, 99, 0.2)', borderRadius: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🏆</span>
              <div>
                <p style={{ fontWeight: 'bold' }}>Completaste "Reto del Día"</p>
                <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>+100 $LUNA • Hace 1 hora</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(10, 36, 99, 0.2)', borderRadius: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>👥</span>
              <div>
                <p style={{ fontWeight: 'bold' }}>Te uniste al Crew "Straw Hats"</p>
                <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Hace 2 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con cita épica */}
      <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', borderTop: '1px solid var(--grand-line-blue)' }}>
        <p className="text-gradient" style={{ fontSize: '1.25rem', fontStyle: 'italic' }}>
          "¡Los sueños de las personas nunca terminan!" - Marshall D. Teach
        </p>
      </div>
    </div>
  );
}