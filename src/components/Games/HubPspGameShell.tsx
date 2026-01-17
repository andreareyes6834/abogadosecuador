import { useEffect, useMemo } from 'react';
import type { Game } from '../../modules/hub-psp-profesional/types';
import { GameShell } from '../../modules/hub-psp-profesional/components/GameShell';
import themeCssUrl from '../../modules/hub-psp-profesional/styles/theme.css?url';

const HUB_GAME_IDS = new Set(['snake', 'pong', '2048', 'tictactoe', 'connect4', 'memory']);

function makeGame(gameId: string): Game {
  const safeId = HUB_GAME_IDS.has(gameId) ? gameId : 'snake';
  const titleMap: Record<string, string> = {
    snake: 'Snake',
    pong: 'Pong',
    '2048': '2048',
    tictactoe: 'Tres en raya',
    connect4: 'Conecta 4',
    memory: 'Memoria'
  };

  return {
    id: safeId,
    title: titleMap[safeId] ?? safeId,
    image: '/images/abogado.png',
    description: 'Juego integrado del Hub PSP Professional',
    category: 'Arcade',
    minBet: 0,
    isPremium: false,
    popularity: 100,
    rtp: '99%',
    volatility: 'Medium'
  };
}

export function isHubPspPlayableGameId(gameId: string): boolean {
  return HUB_GAME_IDS.has(gameId);
}

export default function HubPspGameShell({
  gameId,
  onExit,
  onReward,
}: {
  gameId: string;
  onExit: () => void;
  onReward: (coins: number) => void;
}) {
  const game = useMemo(() => makeGame(gameId), [gameId]);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = themeCssUrl;
    link.setAttribute('data-hub-psp-theme', 'true');
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, []);

  return <GameShell game={game} onExit={onExit} onReward={onReward} />;
}
