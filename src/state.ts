// src/state.ts
import { GameState, Achievement } from './types';

export const gameState: GameState = {
    playerName: '',
    playerAge: null,
    stars: 0,
    level: 1,
    streak: 0,
    bestStreak: 0,
    currentStep: 0,
    totalSteps: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    rocketPosition: 10,
    soundEnabled: true,
    sessionHistory: [],
    achievements: {}
};

export const achievementDefs: Achievement[] = [
    {
        id: 'first_star',
        name: 'First Star',
        desc: 'Get your first star',
        icon: '⭐',
        condition: (state) => state.stars >= 1
    },
    // ... add the rest of your achievements here
];