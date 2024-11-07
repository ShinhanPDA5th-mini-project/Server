import Goal from '../models/Goal.js';

const getRandomGoal = async (userId) => {
    const goals = await Goal.find({ userId, status: 'pending' });
    if (goals.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * goals.length);
    return goals[randomIndex];
};

const updateBeforePhoto = async (userId, photoUrl) => {
    return await Goal.findOneAndUpdate(
        { userId, status: 'pending' },
        { beforePhotoUrl: photoUrl },
        { new: true }
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
    getRandomGoal,
    updateBeforePhoto,
    updateAfterPhoto,
    updateStatus,
    getGoalByUserId
};
