import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Play, ShoppingCart, Menu, X, User, ChevronLeft, Star, Lock } from 'lucide-react';
import HubPspGameShell, { isHubPspPlayableGameId } from '../components/Games/HubPspGameShell';
import { platformEngine } from '../modules/hub-psp-profesional/core/PlatformEngine';
import { saveUserState, loadUserState } from '../modules/hub-psp-profesional/core/PlatformPersistence';

type Vista = 'hub' | 'juego' | 'hubPspGame' | 'tienda' | 'personaje' | 'planes' | 'accesorios' | 'habilidades';

interface Juego {
  id: string;
  nombre: string;
  icono: string;
  categoria: string;
  dificultad: string;
  precio: number;
  recompensa: number;
  niveles: number;
  descripcion: string;
  desbloqueado: boolean;
}

interface Personaje {
  id: string;
  nombre: string;
  icono: string;
  precio: number;
  bonus: number;
}

interface Plan {
  id: string;
  nombre: string;
  precio: number;
  beneficios: string[];
  destacado: boolean;
}

interface Accesorio {
  id: string;
  nombre: string;
  icono: string;
  precio: number;
  bonus: number;
  descripcion: string;
}

interface Habilidad {
  id: string;
  nombre: string;
  icono: string;
  precio: number;
  efecto: string;
}

const JUEGOS: Juego[] = [
  { id: 'trivia', nombre: 'Trivia Legal', icono: '🎓', categoria: 'legal', dificultad: 'media', precio: 10, recompensa: 50, niveles: 20, descripcion: 'Preguntas sobre derecho ecuatoriano con 20 niveles', desbloqueado: true },
  { id: 'memoria', nombre: 'Memoria Legal', icono: '🧠', categoria: 'puzzle', dificultad: 'fácil', precio: 5, recompensa: 30, niveles: 15, descripcion: 'Juego de memoria con conceptos legales', desbloqueado: true },
  { id: 'poker', nombre: 'Poker Legal', icono: '🃏', categoria: 'cartas', dificultad: 'difícil', precio: 20, recompensa: 100, niveles: 25, descripcion: 'Poker profesional con IA y estrategia avanzada', desbloqueado: true },
  { id: 'solitario', nombre: 'Solitario Legal', icono: '🎴', categoria: 'cartas', dificultad: 'media', precio: 8, recompensa: 40, niveles: 30, descripcion: 'Solitario clásico con variantes legales', desbloqueado: true },
  { id: 'candy', nombre: 'Candy Crush Legal', icono: '🍬', categoria: 'puzzle', dificultad: 'media', precio: 12, recompensa: 55, niveles: 40, descripcion: 'Combina caramelos legales con poder-ups', desbloqueado: true },
  { id: 'ajedrez', nombre: 'Ajedrez Legal', icono: '♟️', categoria: 'estrategia', dificultad: 'difícil', precio: 20, recompensa: 80, niveles: 15, descripcion: 'Ajedrez estratégico profesional con IA', desbloqueado: true },
  { id: 'tictactoe', nombre: 'Tres en Raya', icono: '⭕', categoria: 'puzzle', dificultad: 'fácil', precio: 0, recompensa: 35, niveles: 10, descripcion: 'Tres en raya clásico, jugable en tiempo real', desbloqueado: true },
  { id: 'connect4', nombre: 'Conecta 4', icono: '🟡', categoria: 'puzzle', dificultad: 'fácil', precio: 0, recompensa: 35, niveles: 10, descripcion: 'Conecta 4 clásico, jugable en tiempo real', desbloqueado: true },
  { id: 'tetris', nombre: 'Tetris Legal', icono: '⬜', categoria: 'puzzle', dificultad: 'media', precio: 12, recompensa: 55, niveles: 30, descripcion: 'Tetris profesional con lógica avanzada y obstáculos', desbloqueado: true },
  { id: 'carros', nombre: 'Carros Legales', icono: '🏎️', categoria: 'arcade', dificultad: 'media', precio: 15, recompensa: 65, niveles: 25, descripcion: 'Carreras de carros con física realista', desbloqueado: true },
  { id: 'peleas', nombre: 'Peleas Legales', icono: '🥊', categoria: 'arcade', dificultad: 'difícil', precio: 18, recompensa: 75, niveles: 20, descripcion: 'Combates de boxeo profesional con combos', desbloqueado: true },
  { id: 'crucigrama', nombre: 'Crucigrama Legal', icono: '📝', categoria: 'puzzle', dificultad: 'media', precio: 12, recompensa: 50, niveles: 25, descripcion: 'Crucigramas con términos legales y contexto', desbloqueado: false },
  { id: 'tenis', nombre: 'Tenis Legal', icono: '🎾', categoria: 'arcade', dificultad: 'media', precio: 10, recompensa: 45, niveles: 20, descripcion: 'Tenis profesional con controles avanzados', desbloqueado: false },
  { id: 'tanques', nombre: 'Tanques Legales', icono: '🛢️', categoria: 'arcade', dificultad: 'difícil', precio: 15, recompensa: 60, niveles: 25, descripcion: 'Batalla de tanques estratégica con power-ups', desbloqueado: false },
  { id: 'snake', nombre: 'Snake Legal', icono: '🐍', categoria: 'arcade', dificultad: 'media', precio: 8, recompensa: 40, niveles: 20, descripcion: 'Clásico Snake con obstáculos y contexto legal', desbloqueado: false },
  { id: 'flappy', nombre: 'Flappy Bird Legal', icono: '🦅', categoria: 'arcade', dificultad: 'fácil', precio: 5, recompensa: 25, niveles: 15, descripcion: 'Vuela entre obstáculos legales con dificultad progresiva', desbloqueado: false },
  { id: 'pacman', nombre: 'Pac-Man Legal', icono: '👾', categoria: 'arcade', dificultad: 'media', precio: 10, recompensa: 45, niveles: 20, descripcion: 'Laberinto con contexto legal y enemigos inteligentes', desbloqueado: false },
  { id: 'dino', nombre: 'Dino Runner Legal', icono: '🦕', categoria: 'arcade', dificultad: 'media', precio: 10, recompensa: 45, niveles: 25, descripcion: 'Corre y salta sobre obstáculos legales', desbloqueado: false },
  { id: 'match3', nombre: 'Match 3 Legal', icono: '💎', categoria: 'puzzle', dificultad: 'media', precio: 12, recompensa: 50, niveles: 30, descripcion: 'Combina gemas legales con estrategia', desbloqueado: false },
  { id: 'blackjack', nombre: 'BlackJack Legal', icono: '🎰', categoria: 'cartas', dificultad: 'media', precio: 15, recompensa: 70, niveles: 20, descripcion: 'BlackJack profesional con estrategia básica', desbloqueado: false },
  { id: 'parchis', nombre: 'Parchís Legal', icono: '🎲', categoria: 'cartas', dificultad: 'media', precio: 12, recompensa: 60, niveles: 15, descripcion: 'Parchís clásico con dados y estrategia', desbloqueado: true },
  { id: 'ruleta', nombre: 'Ruleta Legal', icono: '🎡', categoria: 'cartas', dificultad: 'media', precio: 18, recompensa: 85, niveles: 20, descripcion: 'Ruleta profesional con apuestas', desbloqueado: true },
  { id: 'cartas', nombre: 'Cartas Avanzado', icono: '🃏', categoria: 'cartas', dificultad: 'difícil', precio: 20, recompensa: 90, niveles: 25, descripcion: 'Juego de cartas avanzado con estrategia', desbloqueado: true },
  { id: 'naves', nombre: 'Space Invaders', icono: '👾', categoria: 'arcade', dificultad: 'media', precio: 15, recompensa: 75, niveles: 20, descripcion: 'Clásico Space Invaders con muchos niveles', desbloqueado: true },
  { id: 'snake-pro', nombre: 'Snake Profesional', icono: '🐍', categoria: 'arcade', dificultad: 'media', precio: 10, recompensa: 60, niveles: 30, descripcion: 'Snake clásico con 30 niveles y dificultad progresiva', desbloqueado: true },
  { id: 'breakout', nombre: 'Breakout', icono: '🧱', categoria: 'arcade', dificultad: 'media', precio: 12, recompensa: 65, niveles: 25, descripcion: 'Breakout clásico rompe bloques con física realista', desbloqueado: true },
  { id: 'ladrillos', nombre: 'Brick Breaker Pro', icono: '🎯', categoria: 'arcade', dificultad: 'media', precio: 14, recompensa: 80, niveles: 30, descripcion: 'Rompe ladrillos con rebote realista, 30 niveles progresivos', desbloqueado: true },
  { id: 'pong', nombre: 'Pong Profesional', icono: '🏓', categoria: 'arcade', dificultad: 'media', precio: 13, recompensa: 75, niveles: 25, descripcion: 'Pong clásico contra IA inteligente con 25 niveles', desbloqueado: true },
  { id: '2048', nombre: '2048 Legal', icono: '🔢', categoria: 'puzzle', dificultad: 'media', precio: 10, recompensa: 55, niveles: 20, descripcion: '2048 clásico con 20 niveles progresivos', desbloqueado: true },
  { id: 'clicker', nombre: 'Clicker Legal', icono: '👆', categoria: 'arcade', dificultad: 'fácil', precio: 5, recompensa: 40, niveles: 15, descripcion: 'Clicker profesional con multiplicadores y bonos', desbloqueado: true },
  { id: 'memoria-avanzada', nombre: 'Memoria Avanzada', icono: '🧩', categoria: 'puzzle', dificultad: 'media', precio: 11, recompensa: 50, niveles: 25, descripcion: 'Memoria avanzada con más parejas por nivel', desbloqueado: true },
  { id: 'damas-chinas', nombre: 'Damas Chinas', icono: '🔴', categoria: 'mesa', dificultad: 'media', precio: 12, recompensa: 65, niveles: 20, descripcion: 'Damas chinas profesional con 20 niveles', desbloqueado: true },
  { id: 'memoria-pro', nombre: 'Memoria Profesional', icono: '🧠', categoria: 'puzzle', dificultad: 'media', precio: 11, recompensa: 60, niveles: 25, descripcion: 'Memoria profesional con tiempo y puntos', desbloqueado: true },
  { id: 'ajedrez-simple', nombre: 'Ajedrez Simple', icono: '♟️', categoria: 'mesa', dificultad: 'media', precio: 13, recompensa: 70, niveles: 22, descripcion: 'Ajedrez simplificado contra IA', desbloqueado: true },
  { id: 'pintura', nombre: 'Pintura de Colores', icono: '🎨', categoria: 'puzzle', dificultad: 'fácil', precio: 6, recompensa: 45, niveles: 20, descripcion: 'Pinta celdas con colores, encuentra el camino', desbloqueado: true },
  { id: 'rompecabezas', nombre: 'Rompecabezas', icono: '🧩', categoria: 'puzzle', dificultad: 'media', precio: 10, recompensa: 55, niveles: 25, descripcion: 'Coloca todas las piezas del rompecabezas', desbloqueado: true },
  { id: 'estacionamiento', nombre: 'Estacionamiento', icono: '🅿️', categoria: 'puzzle', dificultad: 'fácil', precio: 7, recompensa: 48, niveles: 18, descripcion: 'Estaciona autos en los espacios disponibles', desbloqueado: true },
  { id: 'carrera', nombre: 'Carrera de Obstáculos', icono: '🏃', categoria: 'arcade', dificultad: 'media', precio: 9, recompensa: 52, niveles: 20, descripcion: 'Corre contra el tiempo y llega a la meta', desbloqueado: true },
];

const PERSONAJES: Personaje[] = [
  { id: 'abogado', nombre: 'Abogado Profesional', icono: '👨‍⚖️', precio: 100, bonus: 10 },
  { id: 'juez', nombre: 'Juez Supremo', icono: '👨‍⚖️', precio: 150, bonus: 15 },
  { id: 'notario', nombre: 'Notario Experto', icono: '📝', precio: 120, bonus: 12 },
];

const ACCESORIOS: Accesorio[] = [
  { id: 'escudo', nombre: 'Escudo Protector', icono: '🛡️', precio: 50, bonus: 5, descripcion: 'Reduce daño en 5%' },
  { id: 'espada', nombre: 'Espada Dorada', icono: '⚔️', precio: 75, bonus: 10, descripcion: 'Aumenta ataque en 10%' },
  { id: 'pocion', nombre: 'Poción de Vida', icono: '🧪', precio: 30, bonus: 3, descripcion: 'Restaura 30% de vida' },
  { id: 'corona', nombre: 'Corona Real', icono: '👑', precio: 100, bonus: 15, descripcion: 'Bonus de 15% en todas las recompensas' },
  { id: 'gafas', nombre: 'Gafas de Visión', icono: '👓', precio: 40, bonus: 8, descripcion: 'Mejora precisión en 8%' },
];

const HABILIDADES: Habilidad[] = [
  { id: 'velocidad', nombre: 'Velocidad Aumentada', icono: '⚡', precio: 60, efecto: '+20% velocidad' },
  { id: 'precision', nombre: 'Precisión Mejorada', icono: '🎯', precio: 50, efecto: '+15% precisión' },
  { id: 'resistencia', nombre: 'Resistencia Extrema', icono: '💪', precio: 70, efecto: '+25% resistencia' },
  { id: 'regeneracion', nombre: 'Regeneración Rápida', icono: '🌿', precio: 80, efecto: 'Regenera 5% vida/segundo' },
];

const PLANES: Plan[] = [
  {
    id: 'basico',
    nombre: 'Plan Básico',
    precio: 0,
    beneficios: ['6 juegos desbloqueados', '1000 tokens iniciales', 'Acceso a tienda'],
    destacado: false,
  },
  {
    id: 'premium',
    nombre: 'Plan Premium',
    precio: 9.99,
    beneficios: ['Todos los juegos desbloqueados', '5000 tokens iniciales', 'Bonus tokens diarios', 'Personajes exclusivos'],
    destacado: true,
  },
  {
    id: 'elite',
    nombre: 'Plan Elite',
    precio: 19.99,
    beneficios: ['Todos los juegos', '10000 tokens', 'Bonus tokens x2', 'Personajes exclusivos', 'Soporte prioritario'],
    destacado: false,
  },
];

const GamesPlatform: React.FC = () => {
  const [vistaActual, setVistaActual] = useState<Vista>('hub');
  const [userId] = useState('guest-' + Math.random().toString(36).substr(2, 9));
  const [tokens, setTokens] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<Juego | null>(null);
  const [hubPspGameId, setHubPspGameId] = useState<string | null>(null);
  const [nivelActual, setNivelActual] = useState(1);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState('abogado');
  const [juegosDesbloqueados, setJuegosDesbloqueados] = useState(new Set<string>());
  const [accesoriosComprados, setAccesoriosComprados] = useState(new Set<string>());
  const [habilidadesCompradas, setHabilidadesCompradas] = useState(new Set<string>());

  // Inicializar PlatformEngine y cargar estado guardado
  useEffect(() => {
    const savedState = loadUserState(userId);
    if (savedState) {
      platformEngine.initUser(userId, {
        coins: savedState.wallet.softTokens,
        gems: savedState.wallet.hardTokens,
        level: savedState.progress.level,
        xp: savedState.progress.xp,
        maxXp: savedState.progress.xpToNextLevel
      });
      setTokens(savedState.wallet.softTokens);
      setNivel(savedState.progress.level);
    } else {
      platformEngine.initUser(userId, {
        coins: 1000,
        gems: 50,
        level: 1,
        xp: 0,
        maxXp: 1000
      });
      setTokens(1000);
    }

    // Desbloquear automáticamente los 6 juiegos funcionales
    setJuegosDesbloqueados(new Set([
      'snake', 'pong', '2048', 'memory', 'tictactoe', 'connect4',
      'trivia', 'poker', 'solitario', 'candy', 'blackjack'
    ]));
  }, [userId]);

  useEffect(() => {
    document.title = 'Plataforma de Juegos - Abogados OS';
  }, []);

  const mapToHubPspGameId = (id: string): string | null => {
    if (isHubPspPlayableGameId(id)) return id;
    if (id === 'snake-pro') return 'snake';
    if (id === 'memoria') return 'memory';
    return null;
  };

  const jugarJuego = (juego: Juego) => {
    const maybeHubPsp = mapToHubPspGameId(juego.id);

    if (maybeHubPsp) {
      setJuegoSeleccionado(juego);
      setHubPspGameId(maybeHubPsp);
      setVistaActual('hubPspGame');
      return;
    }

    setJuegoSeleccionado(juego);
    setNivelActual(1);
    setVistaActual('juego');
  };

  const avanzarNivel = () => {
    if (!juegoSeleccionado) return;

    // Usar PlatformEngine para recompensar
    const result = platformEngine.finishGame(userId, {
      gameId: juegoSeleccionado.id,
      score: 1000 * (nivelActual + 1),
      difficulty: 'MEDIUM',
      won: true
    });

    // Actualizar tokens desde el engine
    setTokens(platformEngine.getCoins(userId));
    setNivel(result.progress.level);

    // Guardar estado
    try {
      saveUserState(userId, platformEngine.exportUserState(userId));
    } catch (e) {
      console.warn('Error guardando estado:', e);
    }

    if (nivelActual < juegoSeleccionado.niveles) {
      setNivelActual(nivelActual + 1);
    } else {
      setVistaActual('hub');
    }
  };

  const comprarPersonaje = (personaje: Personaje) => {
    if (tokens < personaje.precio) {
      alert('No tienes suficientes tokens');
      return;
    }
    setTokens(tokens - personaje.precio);
    setPersonajeSeleccionado(personaje.id);
  };

  const comprarAccesorio = (accesorio: Accesorio) => {
    if (tokens < accesorio.precio) {
      alert('No tienes suficientes tokens');
      return;
    }
    if (accesoriosComprados.has(accesorio.id)) {
      alert('Ya tienes este accesorio');
      return;
    }
    setTokens(tokens - accesorio.precio);
    setAccesoriosComprados(new Set([...accesoriosComprados, accesorio.id]));
  };

  const comprarHabilidad = (habilidad: Habilidad) => {
    if (tokens < habilidad.precio) {
      alert('No tienes suficientes tokens');
      return;
    }
    if (habilidadesCompradas.has(habilidad.id)) {
      alert('Ya tienes esta habilidad');
      return;
    }
    setTokens(tokens - habilidad.precio);
    setHabilidadesCompradas(new Set([...habilidadesCompradas, habilidad.id]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-950">
      {/* Header Profesional Mac-like Cristal */}
      <motion.header className="backdrop-blur-3xl bg-white/8 border-b border-white/10 sticky top-0 z-40 shadow-2xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Plataforma de Juegos</h1>
              <p className="text-xs text-slate-400">Centro de Entretenimiento Profesional</p>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center gap-6">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="backdrop-blur-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/20 rounded-xl px-5 py-3 shadow-lg"
            >
              <p className="text-xs text-slate-300 font-semibold">TOKENS</p>
              <p className="text-3xl font-bold text-yellow-400">{tokens} 🪙</p>
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              className="backdrop-blur-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/20 rounded-xl px-5 py-3 shadow-lg"
            >
              <p className="text-xs text-slate-300 font-semibold">NIVEL</p>
              <p className="text-3xl font-bold text-purple-400">{nivel} ⭐</p>
            </motion.div>
          </div>

          <button onClick={() => setMenuAbierto(!menuAbierto)} className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20">
            {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Contenido Principal */}
      <AnimatePresence mode="wait">
        {vistaActual === 'hub' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Navegación Profesional */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-3 mb-8 p-4 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl"
            >
              {[
                { id: 'hub', label: '🎮 Juegos', icon: Gamepad2 },
                { id: 'tienda', label: '🛍️ Tienda', icon: ShoppingCart },
                { id: 'planes', label: '💎 Planes', icon: Star },
                { id: 'personaje', label: '👤 Personajes', icon: User },
                { id: 'accesorios', label: '⚔️ Accesorios', icon: ShoppingCart },
                { id: 'habilidades', label: '⚡ Habilidades', icon: Star }
              ].map(nav => (
                <motion.button
                  key={nav.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setVistaActual(nav.id as Vista)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${vistaActual === nav.id
                      ? 'backdrop-blur-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-blue-500/50 border border-white/30'
                      : 'backdrop-blur-md bg-white/10 border border-white/10 text-slate-300 hover:bg-white/20 hover:border-white/30'
                    }`}
                >
                  {nav.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Grid de Juegos - Título */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold text-white mb-2">
                🎮 Todos los Juegos Disponibles
              </h2>
              <div className="flex items-center gap-4">
                <p className="text-slate-400">Total: <span className="text-yellow-400 font-bold text-lg">{JUEGOS.length} juegos</span></p>
                <p className="text-slate-400">Desbloqueados: <span className="text-green-400 font-bold text-lg">{juegosDesbloqueados.size}</span></p>
              </div>
            </motion.div>

            {/* Grid de Juegos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {JUEGOS.map((juego, i) => (
                <motion.div
                  key={juego.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className={`backdrop-blur-3xl border rounded-3xl p-7 transition-all group cursor-pointer ${juegosDesbloqueados.has(juego.id)
                      ? 'bg-gradient-to-br from-blue-500/15 via-purple-400/10 to-pink-500/15 border-white/10 shadow-2xl hover:shadow-blue-400/40'
                      : 'bg-gradient-to-br from-slate-500/10 via-slate-600/5 to-slate-700/10 border-white/5 shadow-lg hover:shadow-slate-400/30'
                    }`}
                  onClick={() => jugarJuego(juego)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform">{juego.icono}</div>
                    {!juegosDesbloqueados.has(juego.id) && <Lock className="w-5 h-5 text-slate-400" />}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{juego.nombre}</h3>
                  <p className="text-slate-300 text-sm mb-4">{juego.descripcion}</p>
                  <div className="space-y-2 mb-4 backdrop-blur-md bg-white/5 rounded-lg p-3 border border-white/5">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-300">📊 {juego.niveles} niveles</p>
                      <p className="text-xs bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full">{juego.categoria}</p>
                    </div>
                    <p className="text-sm text-slate-300">⚡ Dificultad: <span className="text-amber-400 font-bold">{juego.dificultad}</span></p>
                    <p className="text-sm text-yellow-400 font-bold">💰 Recompensa: {juego.recompensa} tokens</p>
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-semibold">COSTO</span>
                      <span className="text-yellow-400 font-bold text-xl">{juego.precio} 🪙</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-bold ${juegosDesbloqueados.has(juego.id)
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/50'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50'
                        }`}
                    >
                      <Play className="w-4 h-4" />
                      {juegosDesbloqueados.has(juego.id) ? 'Jugar' : 'Desbloquear'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {vistaActual === 'tienda' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => setVistaActual('hub')}
              className="flex items-center gap-2 text-blue-400 mb-8 hover:text-blue-300 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Volver a Juegos
            </motion.button>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-8"
            >
              🛍️ Tienda de Tokens
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { tokens: 100, precio: 4.99, desc: 0 },
                { tokens: 500, precio: 19.99, desc: 8 },
                { tokens: 1000, precio: 34.99, desc: 15 },
                { tokens: 2500, precio: 74.99, desc: 25 }
              ].map((paquete, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="backdrop-blur-3xl bg-gradient-to-br from-emerald-500/15 via-teal-400/10 to-cyan-500/15 border border-white/10 rounded-3xl p-8 text-center shadow-2xl hover:shadow-emerald-400/30 transition-all"
                >
                  <p className="text-5xl font-bold text-white mb-3">{paquete.tokens}</p>
                  <p className="text-slate-300 mb-4 text-lg">Tokens</p>
                  <p className="text-3xl font-bold text-yellow-400 mb-4">${paquete.precio}</p>
                  {paquete.desc > 0 && <p className="text-green-400 text-sm mb-4 font-bold">💰 Ahorra {paquete.desc}%</p>}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all font-bold"
                  >
                    Comprar
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {vistaActual === 'planes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => setVistaActual('hub')}
              className="flex items-center gap-2 text-blue-400 mb-8 hover:text-blue-300 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Volver a Juegos
            </motion.button>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-8"
            >
              💎 Planes de Suscripción
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANES.map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`backdrop-blur-3xl border rounded-3xl p-8 transition-all ${plan.destacado
                      ? 'bg-gradient-to-br from-yellow-500/15 via-orange-400/10 to-yellow-600/15 border-yellow-400/30 ring-2 ring-yellow-400/20 shadow-2xl shadow-yellow-500/20'
                      : 'bg-gradient-to-br from-blue-500/15 via-purple-400/10 to-blue-600/15 border-white/10 shadow-2xl'
                    }`}
                >
                  {plan.destacado && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-yellow-400 text-sm font-bold mb-4 inline-block"
                    >
                      ⭐ RECOMENDADO
                    </motion.div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.nombre}</h3>
                  <p className="text-4xl font-bold text-yellow-400 mb-6">${plan.precio}/mes</p>
                  <ul className="space-y-3 mb-6">
                    {plan.beneficios.map((beneficio, j) => (
                      <li key={j} className="text-slate-300 text-sm flex items-center gap-2">
                        <span className="text-green-400">✓</span> {beneficio}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full px-4 py-3 rounded-xl font-bold transition-all ${plan.destacado
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black hover:shadow-lg hover:shadow-yellow-500/50'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50'
                      }`}
                  >
                    {plan.precio === 0 ? 'Plan Actual' : 'Suscribirse'}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {vistaActual === 'personaje' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => setVistaActual('hub')}
              className="flex items-center gap-2 text-blue-400 mb-8 hover:text-blue-300 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Volver a Juegos
            </motion.button>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-8"
            >
              👤 Personajes Disponibles
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PERSONAJES.map((personaje, i) => (
                <motion.div
                  key={personaje.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`backdrop-blur-3xl border rounded-3xl p-8 text-center transition-all ${personajeSeleccionado === personaje.id
                      ? 'bg-gradient-to-br from-yellow-500/15 via-orange-400/10 to-yellow-600/15 border-yellow-400/30 shadow-2xl shadow-yellow-500/20'
                      : 'bg-gradient-to-br from-blue-500/15 via-purple-400/10 to-blue-600/15 border-white/10 shadow-2xl'
                    }`}
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-7xl mb-4"
                  >
                    {personaje.icono}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">{personaje.nombre}</h3>
                  <p className="text-sm text-slate-300 mb-6">+{personaje.bonus}% Bonus en Recompensas</p>
                  {personajeSeleccionado === personaje.id ? (
                    <motion.button
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/50"
                    >
                      ✓ Seleccionado
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => comprarPersonaje(personaje)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all font-bold"
                    >
                      {personaje.precio} Tokens
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {vistaActual === 'accesorios' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => setVistaActual('hub')}
              className="flex items-center gap-2 text-blue-400 mb-8 hover:text-blue-300 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Volver a Juegos
            </motion.button>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-8"
            >
              ⚔️ Accesorios Disponibles
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ACCESORIOS.map((accesorio, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="backdrop-blur-3xl bg-gradient-to-br from-orange-500/15 via-red-400/10 to-orange-600/15 border border-white/10 rounded-3xl p-8 text-center shadow-2xl hover:shadow-orange-400/30 transition-all"
                >
                  <p className="text-6xl mb-4">{accesorio.icono}</p>
                  <h3 className="text-2xl font-bold text-white mb-2">{accesorio.nombre}</h3>
                  <p className="text-sm text-slate-300 mb-4">{accesorio.descripcion}</p>
                  <p className="text-sm text-slate-300 mb-4">Bonus: +{accesorio.bonus}%</p>
                  {accesoriosComprados.has(accesorio.id) ? (
                    <motion.button
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/50"
                    >
                      ✓ Poseído
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => comprarAccesorio(accesorio)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all font-bold"
                    >
                      {accesorio.precio} Tokens
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {vistaActual === 'habilidades' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => setVistaActual('hub')}
              className="flex items-center gap-2 text-blue-400 mb-8 hover:text-blue-300 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Volver a Juegos
            </motion.button>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-8"
            >
              ⚡ Habilidades Disponibles
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {HABILIDADES.map((habilidad, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="backdrop-blur-3xl bg-gradient-to-br from-yellow-500/15 via-amber-400/10 to-yellow-600/15 border border-white/10 rounded-3xl p-8 text-center shadow-2xl hover:shadow-yellow-400/30 transition-all"
                >
                  <p className="text-6xl mb-4">{habilidad.icono}</p>
                  <h3 className="text-2xl font-bold text-white mb-2">{habilidad.nombre}</h3>
                  <p className="text-sm text-slate-300 mb-4">{habilidad.efecto}</p>
                  {habilidadesCompradas.has(habilidad.id) ? (
                    <motion.button
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/50"
                    >
                      ✓ Adquirida
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => comprarHabilidad(habilidad)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl hover:shadow-lg hover:shadow-yellow-500/50 transition-all font-bold"
                    >
                      {habilidad.precio} Tokens
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {vistaActual === 'juego' && juegoSeleccionado && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-4 md:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{juegoSeleccionado.icono}</span>
                    <div>
                      <h2 className="text-2xl font-bold">{juegoSeleccionado.nombre}</h2>
                      <p className="text-blue-100">Nivel {nivelActual} de {juegoSeleccionado.niveles}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-100">Tokens</p>
                    <p className="text-3xl font-bold text-yellow-300">{tokens}</p>
                  </div>
                </div>
                <div className="w-full bg-blue-900/50 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(nivelActual / juegoSeleccionado.niveles) * 100}%` }}
                    className="bg-green-400 h-full rounded-full"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-8 min-h-96 flex flex-col items-center justify-center">
                <p className="text-6xl mb-4">{juegoSeleccionado.icono}</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{juegoSeleccionado.nombre}</h3>
                <p className="text-slate-600 text-center mb-8 max-w-md">{juegoSeleccionado.descripcion}</p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-blue-100 rounded p-4 text-center">
                    <p className="text-sm text-slate-700">Nivel</p>
                    <p className="text-2xl font-bold text-blue-600">{nivelActual}/{juegoSeleccionado.niveles}</p>
                  </div>
                  <div className="bg-green-100 rounded p-4 text-center">
                    <p className="text-sm text-slate-700">Dificultad</p>
                    <p className="text-2xl font-bold text-green-600">{juegoSeleccionado.dificultad}</p>
                  </div>
                  <div className="bg-yellow-100 rounded p-4 text-center">
                    <p className="text-sm text-slate-700">Recompensa</p>
                    <p className="text-2xl font-bold text-yellow-600">{juegoSeleccionado.recompensa}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-100 p-6 text-center">
                <p className="text-2xl font-bold text-green-700 mb-4">¡Juego Listo para Jugar!</p>
                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setTokens(tokens + juegoSeleccionado.recompensa);
                      avanzarNivel();
                    }}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
                  >
                    ✓ Ganar Nivel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setVistaActual('hub')}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
                  >
                    Volver
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {vistaActual === 'hubPspGame' && hubPspGameId && (
          <HubPspGameShell
            gameId={hubPspGameId}
            onExit={() => {
              setHubPspGameId(null);
              setVistaActual('hub');
            }}
            onReward={(coins) => {
              const earned = Number.isFinite(coins) ? Math.max(0, Math.floor(coins)) : 0;
              setTokens((t) => t + earned);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamesPlatform;
