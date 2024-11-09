import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    description: { type: String, required: true },
    level: {type: String, required: true}
});

export default mongoose.model('Goal', goalSchema);
