import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import kakaoAuthRoutes from './routes/kakaoAuthRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import mypageRoutes from './routes/mypageRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import authenticate from './middlewares/authMiddleware.js';

import cors from "cors";
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors()); app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '..', '..', '..', '..', 'withus-client', 'dist')));

const mongoDBUrl = process.env.DB_URL;
console.log("MongoDB URL:", mongoDBUrl);

mongoose.connect(mongoDBUrl, {
    writeConcern: { w: 'majority' }
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Connection error:', err));

app.use('/api/auth/kakao', kakaoAuthRoutes);
app.use('/api/goals', authenticate, goalRoutes);
app.use('/api', authenticate, mypageRoutes);
app.use('/api', authenticate, homeRoutes);
app.use('/api', chatRoutes);

app.get('/', (req, res) => {
    res.send('WithUs Express Server!');
});

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', '..', '..', '..', 'withus-client', 'dist', 'index.html'));
// });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));