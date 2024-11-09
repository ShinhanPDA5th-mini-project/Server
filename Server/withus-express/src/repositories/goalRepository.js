import mongoose from 'mongoose';
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
    return await UserGoalProgress.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        goalId: new mongoose.Types.ObjectId(goalId)
    });
};

const getGoalProgressByDate = async (userId, date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await UserGoalProgress.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startOfDay, $lte: endOfDay }
    });
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
    getGoalProgressByDate,
    updateAfterPhoto,
    updateGoalCompletionStatus,
    updateStatus,
    getGoalByUserId
};
