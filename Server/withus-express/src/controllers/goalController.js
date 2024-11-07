import goalService from '../services/goalService.js';

export const getTodayGoal = async (req, res) => {
    const goal = await goalService.getTodayGoal(req.userId);
    res.json(goal);
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
