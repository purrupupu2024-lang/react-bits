import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CoinRain = ({ trigger, amount = 10 }) => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    if (trigger) {
      createCoinRain();
    }
  }, [trigger, amount]);

  const createCoinRain = () => {
    const newCoins = [];
    for (let i = 0; i < amount; i++) {
      newCoins.push({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        delay: Math.random() * 1000,
        rotation: Math.random() * 360,
        size: 20 + Math.random() * 20
      });
    }
    setCoins(newCoins);

    // Limpiar monedas después de la animación
    setTimeout(() => {
      setCoins([]);
    }, 3000);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none', 
      zIndex: 1000 
    }}>
      <AnimatePresence>
        {coins.map((coin) => (
          <motion.div
            key={coin.id}
            initial={{
              x: coin.x,
              y: -50,
              rotate: 0,
              scale: 0
            }}
            animate={{
              y: window.innerHeight + 50,
              rotate: coin.rotation + 720,
              scale: 1
            }}
            exit={{
              scale: 0,
              opacity: 0
            }}
            transition={{
              duration: 2,
              delay: coin.delay / 1000,
              ease: "easeIn"
            }}
            style={{
              position: 'absolute',
              width: coin.size,
              height: coin.size,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--one-piece-gold) 0%, #FFA500 100%)',
              boxShadow: '0 0 20px var(--one-piece-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: coin.size * 0.6,
              fontWeight: 'bold',
              color: 'var(--marineford-night)'
            }}
          >
            💰
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CoinRain;