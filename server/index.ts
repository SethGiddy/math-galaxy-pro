import express from 'express';
import cors from 'cors';
import fs from 'fs'; // We'll use a file for DB simple start

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow Frontend to talk to Backend
app.use(express.json());

// Fake Database (In memory for now, swap with MongoDB later)
let scores: any[] = [];

app.get('/', (req, res) => {
    res.send('🚀 Math Galaxy API is Running!');
});

app.get('/api/leaderboard', (req, res) => {
    // Sort by stars
    const top5 = scores.sort((a, b) => b.stars - a.stars).slice(0, 5);
    res.json(top5);
});

app.post('/api/save_score', (req, res) => {
    const { name, stars, level } = req.body;
    scores.push({ name, stars, level, date: new Date() });
    console.log(`Saved score for ${name}`);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});