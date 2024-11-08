import goalService from '../services/goalService.js';

export const getTodayGoal = async (req, res) => {
    try {
        const goal = await goalService.getTodayGoal(req.userId);
        
        if (goal) {
            res.json(goal);
        } else {
            res.status(404).json({ message: "오늘의 목표를 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("Error fetching today's goal:", error);
        res.status(500).json({ message: "목표를 가져오는 중 오류가 발생했습니다." });
    }
};

export const uploadBeforePhoto = async (req, res) => {
    const photoUrl = req.body.photoUrl; // 업로드 후 저장된 URL
    await goalService.uploadBeforePhoto(req.userId, photoUrl);
    res.json({ message: "Before 사진이 업로드되었습니다." });
};

export const uploadAfterPhoto = async (req, res) => {
    const photoUrl = req.body.photoUrl;
    await goalService.uploadAfterPhoto(req.userId, photoUrl);
    res.json({ message: "After 사진이 업로드되었습니다." });
};

export const submitGoal = async (req, res) => {
    const result = await goalService.evaluateGoal(req.userId);
    res.json(result);
};
