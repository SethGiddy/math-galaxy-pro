// src/types.ts
export interface GameState {
    playerName: string;
    playerAge: number | null;
    stars: number;
    level: number;
    streak: number;
    bestStreak: number;
    currentStep: number;
    totalSteps: number;
    totalCorrect: number;
    totalQuestions: number;
    rocketPosition: number;
    soundEnabled: boolean;
    sessionHistory: any[];
    achievements: Record<string, boolean>;
}

export interface Achievement {
    id: string;
    name: string;
    desc: string;
    icon: string;
    condition: (state: GameState) => boolean;
}