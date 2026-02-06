import { gameState, achievementDefs } from './state';
// Assuming you will create storage.ts later, we import this. 
// If you haven't created it yet, you can comment the import out.
import { fetchGlobalLeaderboard } from './storage'; 

// --- Helper: Update the Start Button ---
export function checkStartButton(): void {
    const nameInput = document.getElementById('playerName') as HTMLInputElement;
    const startBtn = document.getElementById('startBtn') as HTMLButtonElement;

    if (!nameInput || !startBtn) return;

    const nameValue = nameInput.value.trim();
    const hasAge = gameState.playerAge !== null;

    if (nameValue.length > 0 && hasAge) {
        startBtn.disabled = false;
        startBtn.style.opacity = "1";
        startBtn.style.cursor = "pointer";
    } else {
        startBtn.disabled = true;
        startBtn.style.opacity = "0.5";
        startBtn.style.cursor = "not-allowed";
    }
}

// --- Age Selection ---
export function createAgeButtons(): void {
    const container = document.getElementById('ageButtons');
    if (!container) return;

    container.innerHTML = ''; // Clear existing
    for (let age = 2; age <= 9; age++) {
        const btn = document.createElement('button');
        btn.className = 'age-btn';
        btn.textContent = age.toString();

        if (gameState.playerAge === age) btn.classList.add('selected');

        btn.onclick = () => selectAge(age);
        container.appendChild(btn);
    }
}

export function selectAge(age: number): void {
    gameState.playerAge = age;

    document.querySelectorAll('.age-btn').forEach(btn => {
        const btnAge = parseInt(btn.textContent || '0');
        if (btnAge === age) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });

    checkStartButton();
}

// --- Visuals ---
export function createStars(): void {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    // Clear strictly to prevent duplicates if called twice
    starsContainer.innerHTML = '';

    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }
}

export function updateStats(): void {
    const starsEl = document.getElementById('starsCount');
    const levelEl = document.getElementById('levelCount');
    const streakEl = document.getElementById('streakCount');
    const streakIcon = document.getElementById('streakIcon');

    if (starsEl) starsEl.textContent = gameState.stars.toString();
    if (levelEl) levelEl.textContent = gameState.level.toString();
    if (streakEl) streakEl.textContent = gameState.streak.toString();

    if (streakIcon) {
        if (gameState.streak >= 3) {
            streakIcon.innerHTML = '<span class="streak-fire">🔥</span>';
        } else {
            streakIcon.textContent = '🔥';
        }
    }
}

export function updateRocketPosition(): void {
    const rocket = document.getElementById('rocketShip');
    const flame = document.getElementById('flame');
    if (rocket) rocket.style.bottom = gameState.rocketPosition + '%';
    if (flame) flame.style.bottom = (gameState.rocketPosition - 8) + '%';
}

export function createStepDots(): void {
    const container = document.getElementById('stepProgress');
    if (!container) return;

    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const dot = document.createElement('div');
        dot.className = 'step-dot';
        
        if (i < gameState.currentStep) {
            dot.textContent = '✓';
            dot.classList.add('completed');
        } else {
            dot.textContent = (i + 1).toString();
        }

        if (i === gameState.currentStep) dot.classList.add('current');
        container.appendChild(dot);
    }
}

export function createPlanets(): void {
    const container = document.getElementById('journeyContainer');
    if (!container) return;
    
    // Remove existing planets
    container.querySelectorAll('.planet').forEach(p => p.remove());

    const planets = ['🪐', '🌍', '🌙', '☀️', '⭐', '🌟', '💫'];

    for (let i = 0; i < 8; i++) {
        const planet = document.createElement('div');
        planet.className = 'planet';
        planet.textContent = planets[Math.floor(Math.random() * planets.length)];
        planet.style.left = Math.random() * 80 + 10 + '%';
        planet.style.top = Math.random() * 80 + '%';
        planet.style.opacity = (0.3 + Math.random() * 0.4).toString();
        planet.style.fontSize = (0.8 + Math.random()) + 'rem';
        container.appendChild(planet);
    }
}

// --- Dashboard & Leaderboard ---

export async function renderLeaderboard() {
    let leaderboardSection = document.getElementById('leaderboardSection');
    const dashboardContent = document.querySelector('.dashboard-content');

    if (!leaderboardSection && dashboardContent) {
        leaderboardSection = document.createElement('div');
        leaderboardSection.id = 'leaderboardSection';
        leaderboardSection.className = 'progress-section';
        leaderboardSection.innerHTML = '<h3 class="section-title">🌍 Global High Scores</h3><div id="leaderboardList" style="color:white;">Loading...</div>';
        dashboardContent.appendChild(leaderboardSection);
    }

    const listContainer = document.getElementById('leaderboardList');
    if (!listContainer) return;

    // Use try-catch for the fetch in case backend is offline
    try {
        const leaderboardData = await fetchGlobalLeaderboard();

        if (!leaderboardData || leaderboardData.length === 0) {
            listContainer.innerHTML = '<p>No scores yet. Be the first!</p>';
            return;
        }

        let html = '<table style="width:100%; text-align:left;"><tr><th>Name</th><th>Stars</th><th>Level</th></tr>';
        leaderboardData.forEach((player: any) => {
            html += `
            <tr>
                <td style="padding:5px;">${player.name}</td>
                <td style="padding:5px;">⭐ ${player.stars}</td>
                <td style="padding:5px;">Lvl ${player.level}</td>
            </tr>`;
        });
        html += '</table>';
        listContainer.innerHTML = html;
    } catch (e) {
        listContainer.innerHTML = '<p>Could not load leaderboard (Offline)</p>';
    }
}

export function updateDashboard(): void {
    const els = {
        totalStars: document.getElementById('totalStars'),
        totalCorrect: document.getElementById('totalCorrect'),
        bestStreak: document.getElementById('bestStreak'),
        accuracy: document.getElementById('accuracy')
    };

    if (els.totalStars) els.totalStars.textContent = gameState.stars.toString();
    if (els.totalCorrect) els.totalCorrect.textContent = gameState.totalCorrect.toString();
    if (els.bestStreak) els.bestStreak.textContent = gameState.bestStreak.toString();

    const accuracy = gameState.totalQuestions > 0
        ? Math.round((gameState.totalCorrect / gameState.totalQuestions) * 100)
        : 0;
    if (els.accuracy) els.accuracy.textContent = accuracy + '%';

    // Update Growth Chart
    const chart = document.getElementById('growthChart');
    if (chart) {
        chart.innerHTML = '';
        const history = gameState.sessionHistory.length > 0
            ? gameState.sessionHistory
            : [{ date: 'Today', accuracy: 0 }];

        const maxAccuracy = Math.max(...history.map((h: any) => h.accuracy), 100);

        history.forEach((session: any, index: number) => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = (session.accuracy / maxAccuracy * 150) + 'px';
            bar.innerHTML = `
                <span class="chart-bar-value">${session.accuracy}%</span>
                <span class="chart-bar-label">Day ${index + 1}</span>
            `;
            chart.appendChild(bar);
        });
    }

    // Update Achievements
    const grid = document.getElementById('achievementsGrid');
    if (grid) {
        grid.innerHTML = '';
        achievementDefs.forEach(ach => {
            const isUnlocked = gameState.achievements[ach.id];

            const div = document.createElement('div');
            div.className = `achievement ${isUnlocked ? 'unlocked' : 'locked'}`;
            div.innerHTML = `
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-name">${ach.name}</div>
                <div class="achievement-desc">${ach.desc}</div>
            `;
            grid.appendChild(div);
        });
    }
}

export function openDashboard(): void {
    updateDashboard();
    renderLeaderboard();
    const modal = document.getElementById('dashboardModal');
    if (modal) modal.classList.add('active');
}

export function closeDashboard(): void {
    const modal = document.getElementById('dashboardModal');
    if (modal) modal.classList.remove('active');
}

export function closeLevelUp(): void {
    const overlay = document.getElementById('levelUpOverlay');
    if (overlay) overlay.classList.remove('active');
}