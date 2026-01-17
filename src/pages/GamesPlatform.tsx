import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Play, ShoppingCart, Trophy, ChevronLeft, ChevronRight, Star, Lock, Coins, Gem, Shield, Zap, Info, TrendingUp } from 'lucide-react';
import HubPspGameShell, { isHubPspPlayableGameId } from '../components/Games/HubPspGameShell';
import { platformEngine } from '../modules/hub-psp-profesional/core/PlatformEngine';
import { saveUserState, loadUserState } from '../modules/hub-psp-profesional/core/PlatformPersistence';

type Vista = 'hub' | 'juego' | 'tienda';

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
    image?: string;
    rtp?: string;
    volatility?: string;
    implemented?: boolean;
}

const JUEGOS_FUNCIONALES: Juego[] = [
    { id: 'snake', nombre: 'Neon Snake', icono: '🐍', categoria: 'Arcade', dificultad: 'Media', precio: 10, recompensa: 60, niveles: 30, descripcion: 'Clásico retro: crece, evita colisiones y rompe récords.', desbloqueado: true, image: '/images/abogado.png', rtp: '99%', volatility: 'Medium', implemented: true },
    { id: '2048', nombre: '2048 Fusion', icono: '🔢', categoria: 'Strategy', dificultad: 'Media', precio: 15, recompensa: 55, niveles: 20, descripcion: 'Combina tiles, crea cadenas y llega al 2048 (o más).', desbloqueado: true, image: '/images/abogado.png', rtp: '99%', volatility: 'Low', implemented: true },
    { id: 'pong', nombre: 'Pong Quantum', icono: '🏓', categoria: 'Arcade', dificultad: 'Media', precio: 20, recompensa: 75, niveles: 25, descripcion: 'Retro competitivo: reacción, control y rachas.', desbloqueado: true, image: '/images/abogado.png', rtp: '99%', volatility: 'Medium', implemented: true },
    { id: 'tictactoe', nombre: 'TicTacToe Blitz', icono: '⭕', categoria: 'Strategy', dificultad: 'Fácil', precio: 5, recompensa: 45, niveles: 15, descripcion: 'Lógica rápida: gana o fuerza el draw. Perfecto para torneos.', desbloqueado: true, image: '/images/abogado.png', rtp: '99%', volatility: 'Low', implemented: true },
    { id: 'connect4', nombre: 'Connect 4 Arena', icono: '🔴', categoria: 'Strategy', dificultad: 'Media', precio: 12, recompensa: 70, niveles: 22, descripcion: 'Conecta 4 en vertical/horizontal/diagonal. Puro mind-game.', desbloqueado: true, image: '/images/abogado.png', rtp: '99%', volatility: 'Low', implemented: true },
    { id: 'memory', nombre: 'Memory Matrix', icono: '🧠', categoria: 'Arcade', dificultad: 'Media', precio: 10, recompensa: 60, niveles: 25, descripcion: 'Encuentra parejas, optimiza movimientos y sube tu precisión.', desbloqueado: true, image: '/images/abogado.png', rtp: '99%', volatility: 'Low', implemented: true },
];

const GamesPlatformNew: React.FC = () => {
    const [vistaActual, setVistaActual] = useState<Vista>('hub');
    const [userId] = useState('guest-' + Math.random().toString(36).substr(2, 9));
    const [tokens, setTokens] = useState(0);
    const [nivel, setNivel] = useState(1);
    const [juegoSeleccionado, setJuegoSeleccionado] = useState<Juego | null>(null);
    const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

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
    }, [userId]);

    useEffect(() => {
        document.title = 'Plataforma de Juegos - Abogados OS';
    }, []);

    const jugarJuego = (juego: Juego) => {
        if (!juego.implemented || !isHubPspPlayableGameId(juego.id)) {
            alert('Este juego estará disponible próximamente');
            return;
        }
        setJuegoSeleccionado(juego);
        setVistaActual('juego');
    };

    const onExitGame = () => {
        setVistaActual('hub');
        setJuegoSeleccionado(null);
        // Actualizar tokens desde el engine
        setTokens(platformEngine.getCoins(userId));
        setNivel(platformEngine.getProgress(userId).level);
    };

    const onRewardGame = (coins: number) => {
        // Usar PlatformEngine para recompensar
        if (juegoSeleccionado) {
            const result = platformEngine.finishGame(userId, {
                gameId: juegoSeleccionado.id,
                score: coins * 10,
                difficulty: 'MEDIUM',
                won: true
            });

            // Actualizar tokens
            setTokens(platformEngine.getCoins(userId));
            setNivel(result.progress.level);

            // Guardar estado
            try {
                saveUserState(userId, platformEngine.exportUserState(userId));
            } catch (e) {
                console.warn('Error guardando estado:', e);
            }
        }
    };

    const nextGame = () => setActiveCarouselIndex((prev) => (prev + 1) % JUEGOS_FUNCIONALES.length);
    const prevGame = () => setActiveCarouselIndex((prev) => (prev - 1 + JUEGOS_FUNCIONALES.length) % JUEGOS_FUNCIONALES.length);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-950">
            {/* Vistas */}
            <AnimatePresence mode="wait">
                {vistaActual === 'hub' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="space-y-16 py-12 min-h-[90vh] flex flex-col justify-center relative">
                            {/* Background Decorative */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />

                            {/* Header */}
                            <div className="text-center space-y-6 relative z-10">
                                <div className="flex flex-col items-center gap-2 mb-2">
                                    <div className="px-6 py-2 backdrop-blur-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-yellow-500/20 rounded-full text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                                        Nivel {nivel} • {tokens} Tokens 🪙
                                    </div>
                                    <h1 className="text-7xl font-orbitron font-black uppercase tracking-tighter leading-none">
                                        SUPREME <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">JUEGOS</span>
                                    </h1>
                                </div>
                                <p className="text-slate-500 text-xl max-w-2xl mx-auto font-light tracking-wide">
                                    Excelencia lúdica con la mejor experiencia de juegos funcionales.
                                </p>
                            </div>

                            {/* PS5 Style Horizontal Carousel */}
                            <div className="relative flex items-center justify-center h-[550px] mt-10">
                                {/* Navigation Left */}
                                <div className="absolute left-10 lg:left-24 z-30">
                                    <button onClick={prevGame} className="p-5 rounded-full backdrop-blur-3xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all text-white group">
                                        <ChevronLeft size={40} className="group-hover:-translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-12 overflow-visible px-20 perspective-1000 h-full">
                                    {JUEGOS_FUNCIONALES.map((juego, index) => {
                                        const isActive = index === activeCarouselIndex;
                                        const isPrev = index === (activeCarouselIndex - 1 + JUEGOS_FUNCIONALES.length) % JUEGOS_FUNCIONALES.length;
                                        const isNext = index === (activeCarouselIndex + 1) % JUEGOS_FUNCIONALES.length;

                                        let styles = "transition-all duration-700 transform scale-75 opacity-10 blur-sm pointer-events-none grayscale";
                                        if (isActive) styles = "transition-all duration-700 transform scale-110 opacity-100 z-20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] grayscale-0 translate-y-[-20px]";
                                        if (isPrev) styles = "transition-all duration-700 transform scale-90 opacity-40 z-10 blur-none -rotate-y-12 translate-x-10";
                                        if (isNext) styles = "transition-all duration-700 transform scale-90 opacity-40 z-10 blur-none rotate-y-12 -translate-x-10";

                                        return (
                                            <div
                                                key={juego.id}
                                                className={`backdrop-blur-3xl bg-white/5 w-[480px] rounded-[60px] overflow-hidden border border-white/10 flex-shrink-0 relative ${styles}`}
                                            >
                                                {/* Game Banner */}
                                                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                                                    <div className="absolute inset-0 flex items-center justify-center text-9xl">{juego.icono}</div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-transparent" />

                                                    {/* Badges */}
                                                    <div className="absolute top-8 left-8 flex flex-col gap-3">
                                                        {juego.implemented && (
                                                            <span className="px-4 py-1.5 bg-green-500 text-black text-[10px] font-black rounded-full uppercase tracking-widest shadow-2xl flex items-center gap-2 w-fit">
                                                                ✓ JUGABLE
                                                            </span>
                                                        )}
                                                        <span className="px-4 py-1.5 bg-black/40 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-2xl flex items-center gap-2 border border-white/10">
                                                            <TrendingUp size={14} className="text-green-400" /> RTP {juego.rtp}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Game Info */}
                                                <div className="p-10 space-y-8 bg-gradient-to-b from-transparent to-black/40">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-2 block">{juego.categoria}</span>
                                                            <h3 className="text-4xl font-orbitron font-black uppercase text-white tracking-tighter">{juego.nombre}</h3>
                                                        </div>
                                                        <div className="text-right flex flex-col items-end">
                                                            <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Recompensa</div>
                                                            <div className="flex items-center gap-2 text-yellow-500 font-orbitron font-black text-2xl">
                                                                <Coins size={20} /> {juego.recompensa}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="text-slate-400 text-sm leading-relaxed">{juego.descripcion}</p>

                                                    <div className="flex items-center gap-10">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Niveles</span>
                                                            <span className="text-xs font-bold text-white uppercase">{juego.niveles}</span>
                                                        </div>
                                                        <div className="h-8 w-[1px] bg-white/10" />
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Dificultad</span>
                                                            <span className="text-xs font-bold text-yellow-500 uppercase">{juego.dificultad}</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => isActive && jugarJuego(juego)}
                                                        className="w-full py-6 bg-white text-[#0B0E14] font-orbitron font-black rounded-[28px] flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all transform active:scale-95 text-lg hover:bg-cyan-400"
                                                    >
                                                        <Play size={24} fill="currentColor" /> {juego.implemented ? 'JUGAR AHORA' : 'PRÓXIMAMENTE'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Navigation Right */}
                                <div className="absolute right-10 lg:right-24 z-30">
                                    <button onClick={nextGame} className="p-5 rounded-full backdrop-blur-3xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all text-white group">
                                        <ChevronRight size={40} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Footer Trust Badges */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 lg:px-24">
                                {[
                                    { icon: <Shield className="text-green-500" />, title: 'Fair Play', desc: 'RNG Certificado' },
                                    { icon: <Gem className="text-purple-500" />, title: 'VIP Rewards', desc: 'Tokens Diarios' },
                                    { icon: <Zap className="text-cyan-500" />, title: 'Instant Play', desc: 'Sin Descargas' },
                                    { icon: <Info className="text-slate-400" />, title: 'Progreso', desc: 'Guardado Auto' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-5 border-l border-white/5 pl-8">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black uppercase text-white tracking-wider">{item.title}</div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {vistaActual === 'juego' && juegoSeleccionado && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <HubPspGameShell
                            gameId={juegoSeleccionado.id}
                            onExit={onExitGame}
                            onReward={onRewardGame}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GamesPlatformNew;
