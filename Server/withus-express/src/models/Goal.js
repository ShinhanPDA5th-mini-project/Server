import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    beforePhotoUrl: String,
    afterPhotoUrl: String,
});

module.exports = mongoose.model('Goal', goalSchema);
