import User from '../models/User.js';

const getUserById = async (userId) => {
    return await User.findById(userId);
};

export default {
    getUserById
};