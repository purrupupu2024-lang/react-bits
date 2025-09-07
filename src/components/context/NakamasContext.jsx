import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial del contexto NAKAMAS
const initialState = {
  user: {
    name: '',
    avatar: '',
    rank: 'Marino de Hierro',
    crew: '',
    level: 1,
    experience: 0,
    isConnected: false,
    wallet: null
  },
  tokens: {
    LUNA: 0,
    MSC: 0,
    NKM: 0
  },
  achievements: [],
  dailyProgress: {
    listened: 0,
    earned: 0,
    completed: 0
  },
  notifications: [],
  currentIsland: 'dashboard',
  isLoading: false,
  soundEnabled: true
};

// Acciones del reducer
const nakamasReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'CONNECT_WALLET':
      return { 
        ...state, 
        user: { ...state.user, isConnected: true, wallet: action.payload }
      };
    case 'DISCONNECT_WALLET':
      return { 
        ...state, 
        user: { ...state.user, isConnected: false, wallet: null }
      };
    case 'UPDATE_TOKENS':
      return { ...state, tokens: { ...state.tokens, ...action.payload } };
    case 'ADD_ACHIEVEMENT':
      return { 
        ...state, 
        achievements: [...state.achievements, action.payload] 
      };
    case 'UPDATE_DAILY_PROGRESS':
      return { 
        ...state, 
        dailyProgress: { ...state.dailyProgress, ...action.payload } 
      };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload] 
      };
    case 'REMOVE_NOTIFICATION':
      return { 
        ...state, 
        notifications: state.notifications.filter(n => n.id !== action.payload) 
      };
    case 'SET_CURRENT_ISLAND':
      return { ...state, currentIsland: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    default:
      return state;
  }
};

// Crear contexto
const NakamasContext = createContext();

// Hook personalizado para usar el contexto
export const useNakamas = () => {
  const context = useContext(NakamasContext);
  if (!context) {
    throw new Error('useNakamas debe ser usado dentro de NakamasProvider');
  }
  return context;
};

// Provider del contexto
export const NakamasProvider = ({ children }) => {
  const [state, dispatch] = useReducer(nakamasReducer, initialState);

  // Funciones de utilidad
  const connectWallet = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simular conexión de wallet
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockWallet = {
        address: '0x1234...5678',
        balance: '1.5 ETH'
      };
      dispatch({ type: 'CONNECT_WALLET', payload: mockWallet });
      
      // Agregar notificación de éxito
      addNotification({
        id: Date.now(),
        type: 'success',
        title: '¡Jolly Roger conectada!',
        message: '¡Bienvenido a la tripulación, nakama!',
        icon: '🏴‍☠️'
      });
    } catch (error) {
      console.error('Error conectando wallet:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const disconnectWallet = () => {
    dispatch({ type: 'DISCONNECT_WALLET' });
    addNotification({
      id: Date.now(),
      type: 'info',
      title: 'Wallet desconectada',
      message: '¡Hasta la próxima aventura!',
      icon: '👋'
    });
  };

  const earnTokens = (amount, type = 'LUNA') => {
    dispatch({ 
      type: 'UPDATE_TOKENS', 
      payload: { [type]: state.tokens[type] + amount } 
    });
    
    // Actualizar progreso diario
    dispatch({ 
      type: 'UPDATE_DAILY_PROGRESS', 
      payload: { earned: state.dailyProgress.earned + amount } 
    });

    // Agregar notificación de recompensa
    addNotification({
      id: Date.now(),
      type: 'reward',
      title: `¡+${amount} $${type}!`,
      message: '¡Sigue así, nakama!',
      icon: '💰'
    });
  };

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Auto-remover notificación después de 5 segundos
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
    }, 5000);
  };

  const navigateToIsland = (island) => {
    dispatch({ type: 'SET_CURRENT_ISLAND', payload: island });
  };

  const playSound = (soundType) => {
    if (!state.soundEnabled) return;
    
    // Aquí se implementaría la lógica de sonidos con Howler.js
    console.log(`🔊 Reproduciendo sonido: ${soundType}`);
  };

  // Efectos
  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const savedUser = localStorage.getItem('nakamas-user');
    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    }
  }, []);

  useEffect(() => {
    // Guardar datos del usuario en localStorage
    localStorage.setItem('nakamas-user', JSON.stringify(state.user));
  }, [state.user]);

  const value = {
    ...state,
    dispatch,
    connectWallet,
    disconnectWallet,
    earnTokens,
    addNotification,
    navigateToIsland,
    playSound
  };

  return (
    <NakamasContext.Provider value={value}>
      {children}
    </NakamasContext.Provider>
  );
};