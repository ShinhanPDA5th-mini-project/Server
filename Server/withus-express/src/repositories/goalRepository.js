import Goal from '../models/Goal.js';
import UserGoalProgress from '../models/UserGoalProgress.js';

const getNextGoal = async (userId) => {
    return await Goal.findOne({ userId: userId, status: 'pending' }).sort({ _id: 1 }); // ID 순서대로 첫 번째 미완료 목표 가져오기
};

const updateBeforePhoto = async (userId, goalId, beforePhotoUrl) => {
    await UserGoalProgress.findOneAndUpdate(
        { userId, goalId },
        { beforePhotoUrl },
        { new: true, upsert: true }
    );
};

const updateAfterPhoto = async (userId, photoUrl) => {
    return await Goal.findOneAndUpdate(
        { userId, status: 'pending', beforePhotoUrl: { $exists: true } },
        { afterPhotoUrl: photoUrl },
        { new: true }
    );
};

const updateStatus = async (userId, status) => {
    return await Goal.findOneAndUpdate(
        { userId, status: 'pending' },
        { status },
        { new: true }
    );
};

const getGoalByUserId = async (userId) => {
    return await Goal.findOne({ userId, status: 'pending' });
};

export default {
    getNextGoal,
    updateBeforePhoto,
    updateAfterPhoto,
    updateStatus,
    getGoalByUserId
};
