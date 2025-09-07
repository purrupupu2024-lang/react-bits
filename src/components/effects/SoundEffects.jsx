import { useEffect, useRef } from 'react';
import { useNakamas } from '../context/NakamasContext';

// Simulador de efectos de sonido (sin Howler.js por ahora)
const SoundEffects = () => {
  const { soundEnabled } = useNakamas();
  const audioContextRef = useRef(null);

  useEffect(() => {
    // Inicializar Web Audio API para efectos de sonido básicos
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  const playTone = (frequency, duration, type = 'sine') => {
    if (!soundEnabled || !audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  // Efectos de sonido específicos
  const soundEffects = {
    success: () => {
      // Acorde de éxito (Do Mayor)
      playTone(523.25, 0.2); // Do
      setTimeout(() => playTone(659.25, 0.2), 100); // Mi
      setTimeout(() => playTone(783.99, 0.3), 200); // Sol
    },
    
    coin: () => {
      // Sonido de moneda
      playTone(800, 0.1);
      setTimeout(() => playTone(1000, 0.1), 50);
    },
    
    button: () => {
      // Sonido de botón
      playTone(600, 0.1, 'square');
    },
    
    notification: () => {
      // Sonido de notificación
      playTone(440, 0.15);
      setTimeout(() => playTone(554.37, 0.15), 75);
    },
    
    levelUp: () => {
      // Sonido de subir de nivel
      playTone(523.25, 0.2);
      setTimeout(() => playTone(659.25, 0.2), 100);
      setTimeout(() => playTone(783.99, 0.2), 200);
      setTimeout(() => playTone(1046.50, 0.4), 300);
    },
    
    error: () => {
      // Sonido de error
      playTone(200, 0.3, 'sawtooth');
    }
  };

  // Exponer los efectos de sonido globalmente
  useEffect(() => {
    window.nakamasSounds = soundEffects;
  }, [soundEnabled]);

  return null; // Este componente no renderiza nada
};

export default SoundEffects;