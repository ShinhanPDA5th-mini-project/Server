import Goal from '../models/Goal.js';
import UserGoalProgress from '../models/UserGoalProgress.js';

const getNextGoal = async (userId) => {
    return await Goal.findOne({ userId: userId, status: 'pending' }).sort({ _id: 1 });
};

const updateBeforePhoto = async (userId, goalId, beforePhotoUrl) => {
    await UserGoalProgress.findOneAndUpdate(
        { userId, goalId },
        { beforePhotoUrl },
        { new: true, upsert: true }
    );
};

const getGoalProgress = async (userId, goalId) => {
    return await UserGoalProgress.findOne({ userId, goalId });
};

const updateAfterPhoto = async (userId, goalId, afterPhotoUrl) => {
    await UserGoalProgress.findOneAndUpdate(
        { userId, goalId },
        { afterPhotoUrl },
        { new: true }
    );
};

const updateGoalCompletionStatus = async (userId, goalId, isCompleted) => {
    await UserGoalProgress.findOneAndUpdate(
        { userId, goalId },
        { isCompleted: isCompleted },
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
    getGoalProgress,
    updateAfterPhoto,
    updateGoalCompletionStatus,
    updateStatus,
    getGoalByUserId
};
