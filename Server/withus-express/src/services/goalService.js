import goalRepository from '../repositories/goalRepository.js';
import EfficientNetModel from '../models/EfficientNetModel.js';

const getSequentialGoal = async (userId) => {
    const goal = await goalRepository.getNextGoal(userId);
    if (goal) {
        return { description: goal.description }; 
    }
    return null; 
};

const uploadBeforePhoto = async (userId, goalId, beforePhotoUrl) => {
    await goalRepository.updateBeforePhoto(userId, goalId, beforePhotoUrl);
};

const getUserGoalProgress = async (userId, goalId) => {
    return await goalRepository.getGoalProgress(userId, goalId);
};

const uploadAfterPhoto = async (userId, goalId, afterPhotoUrl) => {
    await goalRepository.updateAfterPhoto(userId, goalId, afterPhotoUrl);
};

const updateGoalCompletionStatus = async (userId, goalId, isCompleted) => {
    await goalRepository.updateGoalCompletionStatus(userId, goalId, isCompleted);
};

const evaluateGoal = async (userId) => {
    const goal = await goalRepository.getGoalByUserId(userId);
    const isCompleted = await EfficientNetModel.comparePhotos(goal.beforePhotoUrl, goal.afterPhotoUrl);

    if (isCompleted) {
        await goalRepository.updateStatus(userId, 'completed');
        return { message: "미션이 완료되었습니다!" };
    } else {
        return { message: "인증에 실패하였습니다. 다시 시도해주세요.", retry: true };
    }
};

export default {
    getSequentialGoal,
    uploadBeforePhoto,
    getUserGoalProgress,
    uploadAfterPhoto,
    updateGoalCompletionStatus,
    evaluateGoal
};
