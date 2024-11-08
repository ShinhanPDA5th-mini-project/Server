import goalRepository from '../repositories/goalRepository.js';
import EfficientNetModel from '../models/EfficientNetModel.js';

const getSequentialGoal = async (userId) => {
    const goal = await goalRepository.getNextGoal(userId);
    if (goal) {
        return { description: goal.description };  // description 필드만 반환
    }
    return null;  // 목표가 없을 경우 null 반환
};

const uploadBeforePhoto = async (userId, goalId, beforePhotoUrl) => {
    await goalRepository.updateBeforePhoto(userId, goalId, beforePhotoUrl);
};

const uploadAfterPhoto = async (userId, photoUrl) => {
    await goalRepository.updateAfterPhoto(userId, photoUrl);
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
    uploadAfterPhoto,
    evaluateGoal
};
