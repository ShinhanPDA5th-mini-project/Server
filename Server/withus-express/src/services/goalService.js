import goalRepository from '../repositories/goalRepository.js';
import userRepository from '../repositories/userRepository.js'; 
import PhotoCompare from '../models/PhotoCompare.js';
import UserGoalProgress from '../models/UserGoalProgress.js';

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

const getUserGoalProgressByDate = async (userId, date) => {
    return await goalRepository.getGoalProgressByDate(userId, date);
};

const uploadAfterPhoto = async (userId, goalId, afterPhotoUrl) => {
    await goalRepository.updateAfterPhoto(userId, goalId, afterPhotoUrl);
};

const updateGoalCompletionStatus = async (userId, goalId, isCompleted) => {
    await goalRepository.updateGoalCompletionStatus(userId, goalId, isCompleted);
};

const evaluateGoal = async (userId) => {
    const goal = await goalRepository.getGoalByUserId(userId);
    const isCompleted = await PhotoCompare.comparePhotos(goal.beforePhotoUrl, goal.afterPhotoUrl);

    if (isCompleted) {
        await goalRepository.updateStatus(userId, 'completed');
        return { message: "미션이 완료되었습니다!" };
    } else {
        return { message: "인증에 실패하였습니다. 다시 시도해주세요.", retry: true };
    }
};

// 레벨별 리워드
const REWARD_PER_LEVEL = {
    beginner: 10000,
    growing: 15000,
    master: 20000
};

const LEVEL_ORDER = ["beginner", "growing", "master"];
const MAX_MISSIONS_PER_LEVEL = 10;

const updateReward = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new Error("User not found");

    // 레벨에 따른 리워드 보상
    const rewardToAdd = REWARD_PER_LEVEL[user.currentLevel.toLowerCase()];
    user.reward += rewardToAdd;

    // 미션 카운트 증가 & 레벨업 체크
    user.completedMissions = (user.completedMissions || 0) + 1;
    if (user.completedMissions >= MAX_MISSIONS_PER_LEVEL) {
        const currentLevelIndex = LEVEL_ORDER.indexOf(user.currentLevel.toLowerCase());
        if (currentLevelIndex < LEVEL_ORDER.length - 1) {
            user.currentLevel = LEVEL_ORDER[currentLevelIndex + 1]; // 다음 레벨로 승급
        }
        user.completedMissions = 0;
    }

    await user.save();
    return user;
};

const hasCompletedToday = async (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = await UserGoalProgress.findOne({
        userId: userId,
        isCompleted: true,
        date: { $gte: today }
    });

    return completedToday !== null;
};


export default {
    getSequentialGoal,
    uploadBeforePhoto,
    getUserGoalProgress,
    getUserGoalProgressByDate,
    uploadAfterPhoto,
    updateGoalCompletionStatus,
    evaluateGoal,
    updateReward,
    hasCompletedToday
};
