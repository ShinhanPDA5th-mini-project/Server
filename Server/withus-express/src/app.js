import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import goalRoutes from './routes/goalRoutes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoDBUrl = process.env.DB_URL;
console.log("MongoDB URL:", mongoDBUrl);

mongoose.connect(mongoDBUrl, {
    writeConcern: { w: 'majority' }
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Connection error:', err));

app.use('/api/goals', goalRoutes);

app.get('/', (req, res) => {
    res.send('WithUs Express Server!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
