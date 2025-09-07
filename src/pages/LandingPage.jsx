import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNakamas } from '../components/context/NakamasContext';

gsap.registerPlugin(ScrollTrigger);

// Componente del barco 3D
function PirateShip() {
  const meshRef = useRef();
  
  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
      
      gsap.to(meshRef.current.position, {
        y: "+=0.5",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });
    }
  }, []);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[3, 1, 6]} />
        <meshStandardMaterial color="#8B4513" />
        
        {/* Vela */}
        <mesh position={[0, 2, 0]}>
          <planeGeometry args={[2, 3]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Mástil */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </mesh>
    </Float>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { addNotification, playSound } = useNakamas();
  const [formData, setFormData] = useState({
    pirateName: '',
    role: '',
    email: '',
    wallet: ''
  });
  const heroRef = useRef();
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Animaciones de entrada
    const tl = gsap.timeline();
    
    tl.from(".hero-title", {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out"
    })
    .from(".hero-subtitle", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5")
    .from(".hero-button", {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.3");

    // Scroll animations
    sectionsRef.current.forEach((section, index) => {
      if (section) {
        gsap.fromTo(section, 
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simular registro
    addNotification({
      id: Date.now(),
      type: 'success',
      title: '¡Te has unido a la tripulación!',
      message: `¡Bienvenido a bordo, ${formData.pirateName}!`,
      icon: '🏴‍☠️'
    });

    playSound('success');

    // Navegar al dashboard después de un delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="landing-page" style={{ minHeight: '100vh', background: 'var(--marineford-night)', color: 'var(--pirate-white)' }}>
      {/* Hero Section con barco 3D */}
      <div ref={heroRef} style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          <PirateShip />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
        
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            zIndex: 1,
            background: 'rgba(26, 26, 46, 0.3)'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
          >
            <h1 className="hero-title epic-title" style={{ marginBottom: '1rem' }}>
              NAKAMAS CREW
            </h1>
          </motion.div>
          
          <p className="hero-subtitle pirate-subtitle" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
            🏴‍☠️ La mayor tripulación musical del mundo te espera. 
            Gana mientras escuchas, crea mientras sueñas, navega hacia el One Piece musical.
          </p>
          
          <button
            className="hero-button nakama-button"
            onClick={() => document.getElementById('registro').scrollIntoView({ behavior: 'smooth' })}
          >
            ¡QUIERO SER NAKAMA!
          </button>
        </div>
      </div>

      {/* Sección: ¿Qué es NAKAMAS CREW? */}
      <div
        ref={el => sectionsRef.current[0] = el}
        style={{ padding: '5rem 2rem', textAlign: 'center' }}
      >
        <h2 className="epic-title" style={{ fontSize: '3rem', marginBottom: '2rem' }}>
          ¿QUÉ ES NAKAMAS CREW?
        </h2>
        <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
          Una plataforma Web3 donde la música se convierte en aventura. 
          Cada canción es una isla por explorar, cada beat un tesoro por descubrir.
        </p>
        
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div className="island-card" style={{ maxWidth: '300px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎵</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Escucha y Gana</h3>
            <p>Cada segundo de música te recompensa con $LUNA</p>
          </div>
          
          <div className="island-card" style={{ maxWidth: '300px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Crea con IA</h3>
            <p>Brook IA te ayuda a masterizar y crear portadas épicas</p>
          </div>
          
          <div className="island-card" style={{ maxWidth: '300px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚔️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Compite y Sube</h3>
            <p>Rankings, crews y batallas musicales te esperan</p>
          </div>
        </div>
      </div>

      {/* Sección: Gana mientras escuchas */}
      <div
        ref={el => sectionsRef.current[1] = el}
        style={{ padding: '5rem 2rem', background: 'rgba(10, 36, 99, 0.1)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ maxWidth: '500px' }}>
            <h2 className="epic-title" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
              GANA MIENTRAS ESCUCHAS
            </h2>
            <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>
              No es solo música, es tu futuro. Cada canción que reproduces 
              te acerca más al One Piece musical: la libertad financiera.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>$LUNA</span>
              <span className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>$MSC</span>
              <span className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>$NKM</span>
            </div>
          </div>
          
          <div className="floating-element">
            <div style={{ fontSize: '8rem' }}>🎧</div>
          </div>
        </div>
      </div>

      {/* Formulario de Preregistro */}
      <div
        id="registro"
        ref={el => sectionsRef.current[2] = el}
        style={{ padding: '5rem 2rem', textAlign: 'center' }}
      >
        <h2 className="epic-title" style={{ fontSize: '3rem', marginBottom: '2rem' }}>
          ¡ÚNETE A LA TRIPULACIÓN!
        </h2>
        
        <form
          onSubmit={handleSubmit}
          className="island-card"
          style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--one-piece-gold)', marginBottom: '0.5rem' }}>
                Nombre de Pirata
              </label>
              <input
                name="pirateName"
                value={formData.pirateName}
                onChange={handleInputChange}
                placeholder="Ej: Monkey D. Luffy"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(26, 26, 46, 0.5)',
                  border: '2px solid var(--grand-line-blue)',
                  borderRadius: '8px',
                  color: 'var(--pirate-white)',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', color: 'var(--one-piece-gold)', marginBottom: '0.5rem' }}>
                Tu Rol en la Tripulación
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(26, 26, 46, 0.5)',
                  border: '2px solid var(--grand-line-blue)',
                  borderRadius: '8px',
                  color: 'var(--pirate-white)',
                  fontSize: '1rem'
                }}
                required
              >
                <option value="">Selecciona tu rol</option>
                <option value="artista">🎤 Artista</option>
                <option value="productor">🎛️ Productor</option>
                <option value="fan">👂 Fan</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', color: 'var(--one-piece-gold)', marginBottom: '0.5rem' }}>
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(26, 26, 46, 0.5)',
                  border: '2px solid var(--grand-line-blue)',
                  borderRadius: '8px',
                  color: 'var(--pirate-white)',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', color: 'var(--one-piece-gold)', marginBottom: '0.5rem' }}>
                Wallet Address (Opcional)
              </label>
              <input
                name="wallet"
                value={formData.wallet}
                onChange={handleInputChange}
                placeholder="0x..."
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(26, 26, 46, 0.5)',
                  border: '2px solid var(--grand-line-blue)',
                  borderRadius: '8px',
                  color: 'var(--pirate-white)',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <button
              type="submit"
              className="nakama-button"
              style={{ width: '100%', padding: '1rem 2rem', fontSize: '1.1rem' }}
            >
              ¡ZARPAR HACIA LA AVENTURA!
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div style={{ padding: '2.5rem 0', textAlign: 'center', borderTop: '1px solid var(--grand-line-blue)' }}>
        <p className="text-gradient" style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
          NAKAMAS CREW © 2024
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          "¡El One Piece existe!" - Gol D. Roger
        </p>
      </div>
    </div>
  );
}
