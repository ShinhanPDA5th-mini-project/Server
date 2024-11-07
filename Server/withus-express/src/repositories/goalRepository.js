import Goal from '../models/Goal.js';

// 오늘의 랜덤 목표를 불러오는 함수
exports.getRandomGoal = async (userId) => {
    // 목표 리스트 중 하나를 랜덤으로 가져옴
    const goals = await Goal.find({ userId, status: 'pending' });
    if (goals.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * goals.length);
    return goals[randomIndex];
};

// Before 사진을 업데이트하는 함수
exports.updateBeforePhoto = async (userId, photoUrl) => {
    const goal = await Goal.findOneAndUpdate(
        { userId, status: 'pending' },
        { beforePhotoUrl: photoUrl },
        { new: true }
    );
    return goal;
};

// After 사진을 업데이트하는 함수
exports.updateAfterPhoto = async (userId, photoUrl) => {
    const goal = await Goal.findOneAndUpdate(
        { userId, status: 'pending', beforePhotoUrl: { $exists: true } },
        { afterPhotoUrl: photoUrl },
        { new: true }
    );
    return goal;
};

// 목표 상태를 완료로 변경하는 함수
exports.updateStatus = async (userId, status) => {
    const goal = await Goal.findOneAndUpdate(
        { userId, status: 'pending' },
        { status },
        { new: true }
    );
    return goal;
};

// 특정 사용자의 목표를 가져오는 함수
exports.getGoalByUserId = async (userId) => {
    return await Goal.findOne({ userId, status: 'pending' });
};
