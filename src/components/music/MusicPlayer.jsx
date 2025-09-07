import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNakamas } from '../context/NakamasContext';

const MusicPlayer = () => {
  const { earnTokens, playSound } = useNakamas();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const intervalRef = useRef();

  // Playlist simulada con temas de ONE PIECE
  const playlist = [
    {
      id: 1,
      title: "Gomu Gomu no Beat",
      artist: "Luffy DJ",
      duration: 180,
      cover: "🎵",
      genre: "Pirate Trap"
    },
    {
      id: 2,
      title: "Santoryu Symphony",
      artist: "Zoro Producer",
      duration: 210,
      cover: "⚔️",
      genre: "Epic Orchestral"
    },
    {
      id: 3,
      title: "Navigator's Dream",
      artist: "Nami Beats",
      duration: 165,
      cover: "🗺️",
      genre: "Chill Wave"
    },
    {
      id: 4,
      title: "Yohohoho Remix",
      artist: "Brook IA",
      duration: 195,
      cover: "💀",
      genre: "Skeleton Funk"
    },
    {
      id: 5,
      title: "Thousand Sunny Voyage",
      artist: "Straw Hat Collective",
      duration: 240,
      cover: "🚢",
      genre: "Adventure House"
    }
  ];

  const currentSong = playlist[currentTrack];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          
          // Ganar tokens cada 10 segundos
          if (newProgress % 10 === 0) {
            const tokensEarned = Math.floor(Math.random() * 20) + 5;
            earnTokens(tokensEarned);
            playSound('coin');
          }
          
          // Cambiar a la siguiente canción al terminar
          if (newProgress >= currentSong.duration) {
            nextTrack();
            return 0;
          }
          
          return newProgress;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentTrack, currentSong.duration, earnTokens, playSound]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    playSound('button');
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    setProgress(0);
    playSound('button');
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    setProgress(0);
    playSound('button');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (progress / currentSong.duration) * 100;

  return (
    <div className="island-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="epic-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          🎧 ISLA DEL SONIDO
        </h2>
        <p className="pirate-subtitle">Escucha y gana $LUNA con cada beat</p>
      </div>

      {/* Cover y Info de la canción */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'var(--treasure-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            boxShadow: 'var(--glow-shadow)'
          }}
        >
          {currentSong.cover}
        </motion.div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--one-piece-gold)' }}>
            {currentSong.title}
          </h3>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>
            {currentSong.artist}
          </p>
          <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            {currentSong.genre}
          </p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="progress-bar" style={{ height: '8px', marginBottom: '0.5rem' }}>
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', opacity: 0.7 }}>
          <span>{formatTime(progress)}</span>
          <span>{formatTime(currentSong.duration)}</span>
        </div>
      </div>

      {/* Controles */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          className="nakama-button-secondary"
          onClick={prevTrack}
          style={{ padding: '0.75rem', borderRadius: '50%', fontSize: '1.25rem' }}
        >
          ⏮️
        </button>
        
        <motion.button
          className="nakama-button"
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ 
            padding: '1rem', 
            borderRadius: '50%', 
            fontSize: '1.5rem',
            width: '60px',
            height: '60px'
          }}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </motion.button>
        
        <button
          className="nakama-button-secondary"
          onClick={nextTrack}
          style={{ padding: '0.75rem', borderRadius: '50%', fontSize: '1.25rem' }}
        >
          ⏭️
        </button>
      </div>

      {/* Control de volumen */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.25rem' }}>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{
            flex: 1,
            height: '6px',
            borderRadius: '3px',
            background: 'var(--grand-line-blue)',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
        <span style={{ fontSize: '0.875rem', minWidth: '30px' }}>
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Playlist */}
      <div>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--one-piece-gold)' }}>
          🎵 Playlist Pirata
        </h4>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {playlist.map((track, index) => (
            <motion.div
              key={track.id}
              onClick={() => {
                setCurrentTrack(index);
                setProgress(0);
                playSound('button');
              }}
              whileHover={{ backgroundColor: 'rgba(10, 36, 99, 0.3)' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                borderRadius: '10px',
                cursor: 'pointer',
                backgroundColor: index === currentTrack ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                border: index === currentTrack ? '1px solid var(--one-piece-gold)' : '1px solid transparent'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{track.cover}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{track.title}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{track.artist}</p>
              </div>
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                {formatTime(track.duration)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Estadísticas de ganancia */}
      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        background: 'rgba(0, 200, 150, 0.1)', 
        borderRadius: '10px',
        border: '1px solid var(--island-green)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>💰 Ganancia por minuto:</span>
          <span className="text-gradient" style={{ fontWeight: 'bold' }}>~15 $LUNA</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <span>🎵 Tiempo escuchado hoy:</span>
          <span className="text-gradient" style={{ fontWeight: 'bold' }}>2h 34m</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;