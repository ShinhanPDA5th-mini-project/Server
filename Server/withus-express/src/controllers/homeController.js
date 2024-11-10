import userRepository from '../repositories/userRepository.js';
import goalRepository from '../repositories/goalRepository.js';

// 메인화면 조회
export const getMainPageData = async (req, res) => {
    const { userId } = req.body;

    try {
        // 리워드 데이터 get
        const user = await userRepository.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        // 미완료 목표 중 첫 번째 목표
        const nextGoal = await goalRepository.getNextGoal(userId);
        if (!nextGoal) {
            return res.status(404).json({ message: "미완료 목표가 없습니다." });
        }

        res.json({
            reward: user.reward,
            nextGoal: {
                description: nextGoal.description,
                status: nextGoal.status
            }
        });
    } catch (error) {
        console.error("Error fetching main data:", error);
        res.status(500).json({ message: "메인 데이터를 조회하는 중에 오류가 발생했습니다." });
    }
};