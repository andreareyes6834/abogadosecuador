import { EconomyEngine, MovementType, TokenType } from './EconomyEngine';
import { GamificationEngine, Mission, Achievement, UserProgress } from './GamificationEngine';
import type { PlatformUserState } from './PlatformPersistence';

export interface PlatformUserSeed {
  coins?: number;
  gems?: number;
  level?: number;
  xp?: number;
  maxXp?: number;
}

export interface GameFinishInput {
  gameId: string;
  score: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  won: boolean;
}

export interface GameFinishOutput {
  baseReward: number;
  bonusFromAchievements: number;
  bonusFromMissions: number;
  totalCoinsAwarded: number;
  unlockedAchievements: Achievement[];
  completedMissions: Mission[];
  progress: UserProgress;
}

// Platform Engine Core Class
export class PlatformEngine {
  private listeners: (() => void)[] = [];
  private economy = new EconomyEngine();
  private gamification = new GamificationEngine();

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emitChange() {
    this.listeners.forEach(l => l());
  }

  getCoins(userId: string): number {
    return this.economy.getWallet(userId)?.softTokens ?? 0;
  }

  getGems(userId: string): number {
    return this.economy.getWallet(userId)?.hardTokens ?? 0;
  }

  getProgress(userId: string): UserProgress {
    const progress = this.gamification.getProgress(userId);
    if (!progress) {
      // Create if missing or throw. Since this is a getter, maybe return partial or throw.
      // But finishGame relies on it.
      // Let's retry creation if we can, or just throw.
      // GamificationEngine has createUserProgress.
      return this.gamification.createUserProgress(userId);
    }
    return progress;
  }

  initUser(userId: string, seed?: PlatformUserSeed): void {
    // ... logic ...
    const existingWallet = this.economy.getWallet(userId);
    if (!existingWallet) {
      this.economy.createWallet(userId, seed?.coins ?? 0, seed?.gems ?? 0);
    }
    // ...
    // Note: Calling emitChange after init is useful
    this.emitChange();
  }

  // Override or wrap methods that change state to emitChange
  // But EconomyEngine methods are separate. 
  // Ideally EconomyEngine should emit events, but I can wrap them here.

  updateEconomy(userId: string, changes: { coins: number; gems: number; xp: number }): void {
    if (changes.coins !== 0) {
      if (changes.coins > 0) this.economy.rewardUser(userId, changes.coins, MovementType.REWARD, 'manual_update');
      else this.economy.deductTokens(userId, Math.abs(changes.coins), TokenType.SOFT, 'manual_update');
    }
    // Gems logic...
    // For now assuming economy updates.
    this.emitChange();
  }

  // Redefine methods to emit
  startGame(userId: string, gameId: string, minBet: number): void {
    if (minBet <= 0) return;
    this.economy.deductTokens(userId, minBet, TokenType.SOFT, `entry:${gameId}`);
    this.emitChange();
  }

  finishGame(userId: string, input: GameFinishInput): GameFinishOutput {
    // ... existing implementation ...
    const rewardCalc = this.economy.calculateReward(
      input.score,
      input.difficulty,
      this.getProgress(userId).currentStreak || 1,
      1.0
    );

    const baseReward = rewardCalc.finalReward;
    if (baseReward > 0) {
      this.economy.rewardUser(userId, baseReward, MovementType.REWARD, `game:${input.gameId}`);
    }

    const xpEarned = Math.max(50, Math.floor(input.score / 20));
    const { unlockedAchievements, completedMissions } = this.gamification.recordGamePlayed(
      userId,
      input.score,
      input.won,
      xpEarned
    );

    // ... bonuses ...
    const bonusFromAchievements = unlockedAchievements.reduce((sum, a) => sum + (a.tokenReward || 0), 0);
    if (bonusFromAchievements > 0) {
      this.economy.rewardUser(userId, bonusFromAchievements, MovementType.ACHIEVEMENT, `achievements:${input.gameId}`);
    }

    const bonusFromMissions = completedMissions.reduce((sum, m) => sum + (m.reward?.softTokens || 0), 0);
    if (bonusFromMissions > 0) {
      this.economy.rewardUser(userId, bonusFromMissions, MovementType.REWARD, `missions:${input.gameId}`);
    }

    this.emitChange(); // EMIT

    return {
      baseReward,
      bonusFromAchievements,
      bonusFromMissions,
      totalCoinsAwarded: baseReward + bonusFromAchievements + bonusFromMissions,
      unlockedAchievements,
      completedMissions,
      progress: this.getProgress(userId)
    };
  }
}

export const platformEngine = new PlatformEngine();

import { useState, useEffect } from 'react';
import * as LocalAuth from './LocalAuth';

export const usePlatform = () => {
  const [_, setTick] = useState(0);
  const session = LocalAuth.readSession();
  const userId = session?.username || 'guest';

  useEffect(() => {
    return platformEngine.subscribe(() => setTick(t => t + 1));
  }, []);

  return {
    state: {
      economy: {
        coins: platformEngine.getCoins(userId),
        gems: platformEngine.getGems(userId)
      },
      progress: (() => { try { return platformEngine.getProgress(userId); } catch { return null; } })()
    },
    updateEconomy: (changes: { coins: number; gems: number; xp: number }) => {
      platformEngine.updateEconomy(userId, changes);
    }
  };
};
