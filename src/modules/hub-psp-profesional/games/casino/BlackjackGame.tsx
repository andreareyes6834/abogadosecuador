import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaCoins, FaRedo, FaHandPaper, FaPlus } from 'react-icons/fa';
import { usePlatform } from '../../core/PlatformEngine';

// Tipos
type Card = {
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
    value: string;
    numericValue: number;
};

type GameState = 'betting' | 'playing' | 'dealerTurn' | 'gameOver';

const SUITS: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const BlackjackGame: React.FC = () => {
    const { state, updateEconomy } = usePlatform();
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [gameState, setGameState] = useState<GameState>('betting');
    const [bet, setBet] = useState(10);
    const [message, setMessage] = useState('');

    // Generar mazo
    const createDeck = () => {
        const newDeck: Card[] = [];
        for (const suit of SUITS) {
            for (const value of VALUES) {
                let numericValue = parseInt(value);
                if (value === 'A') numericValue = 11;
                if (['J', 'Q', 'K'].includes(value)) numericValue = 10;
                newDeck.push({ suit, value, numericValue });
            }
        }
        return shuffle(newDeck);
    };

    const shuffle = (deck: Card[]) => {
        return [...deck].sort(() => Math.random() - 0.5);
    };

    const calculateScore = (hand: Card[]) => {
        let score = hand.reduce((acc, card) => acc + card.numericValue, 0);
        let aces = hand.filter(card => card.value === 'A').length;

        while (score > 21 && aces > 0) {
            score -= 10;
            aces -= 1;
        }
        return score;
    };

    const placeBet = () => {
        if (state.economy.coins < bet) {
            toast.error('No tienes suficientes monedas');
            return;
        }

        // Deducir apuesta
        updateEconomy({
            coins: -bet,
            gems: 0,
            xp: 5 // XP por participar
        });

        startRound();
    };

    const startRound = () => {
        const newDeck = createDeck();
        const pHand = [newDeck.pop()!, newDeck.pop()!];
        const dHand = [newDeck.pop()!, newDeck.pop()!];

        setDeck(newDeck);
        setPlayerHand(pHand);
        setDealerHand(dHand);
        setGameState('playing');
        setMessage('');

        // Check Blackjack inmediato
        if (calculateScore(pHand) === 21) {
            handleGameOver(pHand, dHand, 'blackjack');
        }
    };

    const hit = () => {
        const newDeck = [...deck];
        const card = newDeck.pop()!;
        const newHand = [...playerHand, card];

        setDeck(newDeck);
        setPlayerHand(newHand);

        if (calculateScore(newHand) > 21) {
            handleGameOver(newHand, dealerHand, 'bust');
        }
    };

    const stand = () => {
        setGameState('dealerTurn');
        let currentDealerHand = [...dealerHand];
        let currentDeck = [...deck];

        // Dealer rule: hit until 17
        while (calculateScore(currentDealerHand) < 17) {
            currentDealerHand.push(currentDeck.pop()!);
        }

        setDealerHand(currentDealerHand);
        setDeck(currentDeck);
        handleGameOver(playerHand, currentDealerHand, 'compare');
    };

    const handleGameOver = (pHand: Card[], dHand: Card[], reason: string) => {
        setGameState('gameOver');
        const pScore = calculateScore(pHand);
        const dScore = calculateScore(dHand);

        if (reason === 'bust') {
            setMessage('¡Te pasaste! Pierdes.');
        } else if (reason === 'blackjack') {
            setMessage('¡Blackjack! Ganas 2.5x.');
            updateEconomy({ coins: Math.floor(bet * 2.5), gems: 1, xp: 50 });
            toast.success(`Ganaste ${Math.floor(bet * 2.5)} monedas!`);
        } else {
            // Comparison
            if (dScore > 21) {
                setMessage('Dealer se pasó. ¡Ganas!');
                processWin();
            } else if (pScore > dScore) {
                setMessage('¡Ganas!');
                processWin();
            } else if (pScore === dScore) {
                setMessage('Empate. Recuperas apuesta.');
                updateEconomy({ coins: bet, gems: 0, xp: 10 });
            } else {
                setMessage('Dealer gana.');
            }
        }
    };

    const processWin = () => {
        updateEconomy({ coins: bet * 2, gems: 0, xp: 20 });
        toast.success(`Ganaste ${bet * 2} monedas!`);
    };

    // UI Components
    const CardView = ({ card, hidden = false }: { card: Card, hidden?: boolean }) => (
        <motion.div
            initial={{ scale: 0, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            className={`w-24 h-36 rounded-xl shadow-xl flex items-center justify-center text-3xl font-bold border-2 
        ${hidden
                    ? 'bg-gradient-to-br from-blue-900 to-slate-900 border-blue-500'
                    : 'bg-white border-gray-200'}`}
        >
            {hidden ? (
                <div className="w-full h-full flex items-center justify-center bg-pattern opacity-50">?</div>
            ) : (
                <div className={`flex flex-col items-center ${['hearts', 'diamonds'].includes(card.suit) ? 'text-red-500' : 'text-slate-900'}`}>
                    <span>{card.value}</span>
                    <span className="text-2xl">
                        {card.suit === 'hearts' && '♥'}
                        {card.suit === 'diamonds' && '♦'}
                        {card.suit === 'clubs' && '♣'}
                        {card.suit === 'spades' && '♠'}
                    </span>
                </div>
            )}
        </motion.div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] w-full p-8 bg-green-900/20 rounded-3xl backdrop-blur-md border border-white/10 relative overflow-hidden">
            {/* Table Background Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-800/20 via-slate-900/50 to-slate-950/80 -z-10" />

            {/* Stats Display */}
            <div className="absolute top-4 right-4 flex gap-4 text-white">
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-yellow-500/30">
                    <FaCoins className="text-yellow-400" />
                    <span className="font-mono">{state.economy.coins}</span>
                </div>
            </div>

            {gameState === 'betting' ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-6"
                >
                    <h2 className="text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">
                        Blackjack Royale
                    </h2>
                    <div className="p-8 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-xl">
                        <p className="text-gray-300 mb-4">Tu apuesta:</p>
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <button onClick={() => setBet(Math.max(10, bet - 10))} className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/40 text-red-300">-10</button>
                            <span className="text-3xl font-mono text-white w-24">{bet}</span>
                            <button onClick={() => setBet(state.economy.coins >= bet + 10 ? bet + 10 : bet)} className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/40 text-green-300">+10</button>
                        </div>
                        <button
                            onClick={placeBet}
                            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl font-bold text-black hover:scale-105 transition-transform"
                        >
                            Repartir Cartas
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div className="w-full max-w-4xl flex flex-col items-center gap-12">
                    {/* Dealer Area */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-sm uppercase tracking-widest text-gray-400">Dealer ({gameState === 'playing' ? '?' : calculateScore(dealerHand)})</div>
                        <div className="flex gap-4">
                            {dealerHand.map((card, i) => (
                                <CardView key={i} card={card} hidden={gameState === 'playing' && i === 1} />
                            ))}
                        </div>
                    </div>

                    {/* Message Area */}
                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="px-8 py-3 bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl"
                            >
                                <h3 className="text-2xl font-bold text-white">{message}</h3>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Player Area */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-4">
                            {playerHand.map((card, i) => (
                                <CardView key={i} card={card} />
                            ))}
                        </div>
                        <div className="text-sm uppercase tracking-widest text-gray-400">Tú ({calculateScore(playerHand)})</div>
                    </div>

                    {/* Controls */}
                    {gameState === 'playing' && (
                        <div className="flex gap-4">
                            <button
                                onClick={hit}
                                className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-900/50 transition-all hover:-translate-y-1"
                            >
                                <FaPlus /> Pedir
                            </button>
                            <button
                                onClick={stand}
                                className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-900/50 transition-all hover:-translate-y-1"
                            >
                                <FaHandPaper /> Plantarse
                            </button>
                        </div>
                    )}

                    {gameState === 'gameOver' && (
                        <button
                            onClick={() => setGameState('betting')}
                            className="flex items-center gap-2 px-12 py-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-bold shadow-lg shadow-yellow-900/50 transition-all hover:-translate-y-1 text-lg"
                        >
                            <FaRedo /> Jugar de Nuevo
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default BlackjackGame;
