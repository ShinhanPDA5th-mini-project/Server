import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    description: { type: String, required: true },
    level: {type: String, required: true},
    status: { type: String, required: true, default: "미완료" }
});

export default mongoose.model('Goal', goalSchema);