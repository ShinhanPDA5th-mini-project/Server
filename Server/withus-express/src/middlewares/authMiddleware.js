import userRepository from '../repositories/userRepository.js';

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Access Token이 필요합니다." });
    }

    try {
        const user = await userRepository.findUserByToken(token);
        if (!user) {
            return res.status(401).json({ message: "유효하지 않은 Access Token입니다." });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error("Error during authentication:", error);
        return res.status(500).json({ message: "서버 인증 오류" });
    }
};

export default authenticate;