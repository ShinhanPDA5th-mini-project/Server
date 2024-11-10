import mongoose from 'mongoose';

const UserGoalProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    goalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal',
        required: true
    },
    beforePhotoUrl: {
        type: String,
        default: ''
    },
    afterPhotoUrl: {
        type: String,
        default: ''
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now  
    }
});

const UserGoalProgress = mongoose.model('UserGoalProgress', UserGoalProgressSchema);

export default UserGoalProgress;
