import { gameState } from './state';
// Fix 1: Removed the unused GameState import here

// Change this to your Render URL later when you deploy the backend
const API_URL = 'http://localhost:3000/api'; 

export function loadGame(): void {
    const saved = localStorage.getItem('mathGalaxyPro');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.assign(gameState, data);
        } catch (e) {
            console.error("Could not load save file", e);
        }
    }
}

export function saveGame(): void {
    localStorage.setItem('mathGalaxyPro', JSON.stringify(gameState));

    if (gameState.playerName && gameState.stars > 0) {
        fetch(`${API_URL}/save_score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: gameState.playerName,
                stars: gameState.stars,
                level: gameState.level
            })
        }).catch(() => { 
            // Fix 2: Changed 'err' to empty '()' so TypeScript doesn't complain
            console.log('Backend offline or unreachable');
        });
    }
}

export async function fetchGlobalLeaderboard(): Promise<any[]> {
    try {
        const res = await fetch(`${API_URL}/leaderboard`);
        if (!res.ok) throw new Error('Network response was not ok');
        return await res.json();
    } catch (error) {
        console.warn('Leaderboard offline');
        return [];
    }
}