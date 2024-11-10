import userRepository from '../repositories/userRepository.js';
import goalRepository from '../repositories/goalRepository.js';

export const getMainPageData = async (req, res) => {
    const user = req.user; // authMiddleware에서 인증된 사용자

    if (!user) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    try {
        // 미완료 목표 조회
        const todayGoal = await goalRepository.getNextGoal(user._id);
        const tomorrowGoal = await goalRepository.getGoalAfterToday(user._id);

        // 응답 데이터 생성
        res.json({
            name: user.name,
            reward: user.reward,
            todayGoal: todayGoal ? {
                description: todayGoal.description,
                status: todayGoal.status
            } : "오늘의 목표가 없습니다.",
            tomorrowGoal: tomorrowGoal ? {
                description: tomorrowGoal.description,
                status: tomorrowGoal.status
            } : "내일의 목표가 없습니다."
        });
    } catch (error) {
        console.error("Error fetching main data:", error);
        res.status(500).json({ message: "메인 데이터를 조회하는 중에 오류가 발생했습니다." });
    }
};