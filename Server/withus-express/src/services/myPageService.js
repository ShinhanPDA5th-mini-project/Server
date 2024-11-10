import goalRepository from '../repositories/goalRepository.js';
import userRepository from '../repositories/userRepository.js';

export const getMyPageData = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new Error("User not found");

    const levels = { beginner: [], growing: [], master: [] };
    const levelNames = Object.keys(levels);

    // 레벨별 목표들 조회
    for (const level of levelNames) {
        const goals = await goalRepository.getGoalsByLevel(userId, level);

        levels[level] = goals.length > 0 
            ? goals.map((goal, index) => ({
                missionNumber: index + 1,
                description: goal.description,
                isCompleted: goal.status === '완료'
            }))
            : Array.from({ length: 10 }, () => ({
                missionNumber: null,
                description: "잠금 처리됨",
                isCompleted: false
            }));
    }
    return {
        currentLevel: user.currentLevel,
        levels
    };
};

export default {
    getMyPageData
};