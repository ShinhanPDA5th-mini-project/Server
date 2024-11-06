import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

const mongoDBUrl = process.env.DB_URL;

mongoose.connect(mongoDBUrl)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Connection error:', err));

app.get('/', (req, res) => {
    res.send('WithUs Express Server!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));