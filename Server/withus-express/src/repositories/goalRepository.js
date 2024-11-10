import mongoose from 'mongoose';
import Goal from '../models/Goal.js';
import UserGoalProgress from '../models/UserGoalProgress.js';

// 오늘 목표 (미완료 상태에서 첫 번째 목표)
const getNextGoal = async (userId) => {
    return await Goal.findOne({ 
        userId: new mongoose.Types.ObjectId(userId),
        status: '미완료'
    }).sort({ _id: 1 });
};

// 내일 목표 조회
const getGoalAfterToday = async (userId) => {
    return await Goal.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        status: '미완료'
    }).sort({ _id: 1 }).skip(1);
};

// 레벨에 따른 목표
const getGoalsByLevel = async (userId, level) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const capitalizedLevel = level.charAt(0).toUpperCase() + level.slice(1);
    const goals = await Goal.find({ userId: userObjectId, level: capitalizedLevel });
        
    return goals;
};

// 목표의 Before 사진 업데이트
const updateBeforePhoto = async (userId, goalId, beforePhotoUrl) => {
    await UserGoalProgress.findOneAndUpdate(
        { userId, goalId },
        { beforePhotoUrl },
        { new: true, upsert: true }
    );
};

// 목표의 After 사진 업데이트
const updateAfterPhoto = async (userId, goalId, afterPhotoUrl) => {
    await UserGoalProgress.findOneAndUpdate(
        { userId, goalId },
        { afterPhotoUrl },
        { new: true }
    );
};

// 목표 진행 데이터 가져오기
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


const updateGoalCompletionStatus = async (userId, goalId, isCompleted) => {
    await UserGoalProgress.findOneAndUpdate(
        { userId: userId, goalId: goalId },
        { isCompleted: isCompleted },
        { new: true }
    );
};

const updateGoalStatus = async (goalId, status) => {
    await Goal.findByIdAndUpdate(goalId, { status: status }, { new: true });
};

const updateStatus = async (userId, status) => {
    return await Goal.findOneAndUpdate(
        { userId, status: 'pending' },
        { status },
        { new: true }
    );
};

// 현재 목표 가져오기
const getGoalByUserId = async (userId) => {
    return await Goal.findOne({ userId, status: 'pending' });
};

const getGoalsByUserIdAndLevel = async (userId, level) => {
    return await Goal.find({ userId: userId, level: level }).sort({ _id: 1 }).limit(10);
};

export default {
    getGoalsByLevel,
    getNextGoal,
    getGoalAfterToday,
    updateBeforePhoto,
    getGoalProgress,
    getGoalProgressByDate,
    updateAfterPhoto,
    updateGoalCompletionStatus,
    updateGoalStatus,
    updateStatus,
    getGoalByUserId,
    getGoalsByUserIdAndLevel
};