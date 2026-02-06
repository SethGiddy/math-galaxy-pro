import { gameState } from './state';

// Handle browser compatibility for AudioContext
const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
let audioContext: AudioContext | null = null;

export function initAudio() {
    if (!audioContext) {
        audioContext = new AudioContextClass();
    }
}

export function playSound(type: 'step' | 'correct' | 'wrong' | 'levelup') {
    if (!gameState.soundEnabled) return;
    if (!audioContext) initAudio();

    // Safety check: if audioContext failed to initialize
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const currentTime = audioContext.currentTime;

    switch (type) {
        case 'step':
            oscillator.frequency.value = 400;
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(currentTime + 0.1);
            break;

        case 'correct':
            oscillator.frequency.value = 523.25; // C5
            gainNode.gain.value = 0.2;
            oscillator.start();
            oscillator.frequency.setValueAtTime(659.25, currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, currentTime + 0.2); // G5
            oscillator.stop(currentTime + 0.3);
            break;

        case 'wrong':
            oscillator.frequency.value = 200;
            gainNode.gain.value = 0.15;
            oscillator.type = 'sawtooth';
            oscillator.start();
            oscillator.stop(currentTime + 0.3);
            break;

        case 'levelup':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, currentTime);
            gainNode.gain.value = 0.2;
            oscillator.start();
            oscillator.frequency.linearRampToValueAtTime(800, currentTime + 0.5);
            oscillator.stop(currentTime + 0.5);
            break;
    }
}

export function toggleSound(): void {
    gameState.soundEnabled = !gameState.soundEnabled;
    const btn = document.getElementById('soundBtn');
    if (btn) {
        btn.textContent = gameState.soundEnabled ? '🔊' : '🔇';
    }
}