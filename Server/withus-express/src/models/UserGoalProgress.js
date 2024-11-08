import mongoose from 'mongoose';

const UserGoalProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // User 모델과의 관계 설정
        required: true
    },
    goalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal',  // Goal 모델과의 관계 설정
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
        default: Date.now  // 목표 수행 날짜
    }
});

// UserGoalProgress 모델 생성
const UserGoalProgress = mongoose.model('UserGoalProgress', UserGoalProgressSchema);

export default UserGoalProgress;
