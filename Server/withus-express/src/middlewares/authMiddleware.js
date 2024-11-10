import axios from 'axios';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // 헤더에서 액세스 토큰 추출
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // 카카오 API를 사용해 토큰의 유효성을 검사하고 사용자 정보 조회
        const kakaoUserData = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const kakaoId = kakaoUserData.data.id;

        // 데이터베이스에서 사용자 찾기
        let user = await User.findOne({ kakaoId });
        if (!user) {
            // 사용자가 없으면 에러 반환 또는 회원가입 로직 추가 가능
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        // req.user에 사용자 정보 추가
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication Error:', error.response?.data || error.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
