import User from '../models/User.js';

const getUserById = async (userId) => {
    return await User.findById(userId);
};

// 액세스 토큰을 통해 사용자 조회
const findUserByToken = async (token) => {
    return await User.findOne({ accessToken: token });
};

const getOrCreateUserByKakaoId = async (kakaoId, name, accessToken) => {
    let user = await User.findOne({ kakaoId });
    if (!user) {
        user = new User({ kakaoId, name, accessToken });
        await user.save();
    } else {
        user.accessToken = accessToken;
        await user.save();
    }
    return user;
};

// 액세스 토큰으로 사용자 조회
const getUserByAccessToken = async (accessToken) => {
    return await User.findOne({ accessToken });
};

export default {
    getUserById,
    findUserByToken,
    getOrCreateUserByKakaoId,
    getUserByAccessToken,
};