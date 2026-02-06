// src/main.ts
import './style.css'; // Import CSS directly!
import { gameState } from './state';

console.log("🚀 Professional Mode Loaded");

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="welcome-screen">
    <h1>Math Galaxy Pro 🚀</h1>
    <input type="text" id="playerName" placeholder="Enter Name" />
    <button id="startBtn" disabled>Launch</button>
  </div>
`;

// Logic example
const input = document.getElementById('playerName') as HTMLInputElement;
const btn = document.getElementById('startBtn') as HTMLButtonElement;

input.addEventListener('input', () => {
    gameState.playerName = input.value;
    if(input.value.length > 0) {
        btn.disabled = false;
    }
});