import { S3Client } from "@aws-sdk/client-s3";
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import goalService from '../services/goalService.js';

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});


const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: function (req, file, cb) {
            const uniqueName = `${Date.now()}_${file.originalname}`;
            cb(null, uniqueName);
        }
    })
});


export const getTodayGoal = async (req, res) => {
    try {
        const goal = await goalService.getSequentialGoal(req.body.userId);
        if (goal) {
            res.json(goal);
        } else {
            res.status(404).json({ message: "사용자의 목표가 없습니다." });
        }
    } catch (error) {
        console.error("Error fetching today's goal:", error);
        res.status(500).json({ message: "목표를 조회하는 중에 오류가 발생했습니다." });
    }
};

// Before 사진 업로드 API
export const uploadBeforePhoto = async (req, res) => {
    const { userId, goalId } = req.body;

    upload.single('photo')(req, res, async (err) => {
        if (err) {
            console.error("Error uploading photo:", err);
            return res.status(500).json({ message: "사진 업로드에 실패했습니다." });
        }

        try {
            // S3에 업로드된 사진 URL
            const beforePhotoUrl = req.file.location;

            // MongoDB에 Before 사진 URL 저장
            await goalService.uploadBeforePhoto(userId, goalId, beforePhotoUrl);

            res.json({ message: "Before 사진이 성공적으로 업로드되었습니다.", beforePhotoUrl });
        } catch (error) {
            console.error("Error saving photo URL to database:", error);
            res.status(500).json({ message: "사진 URL을 저장하는 중에 오류가 발생했습니다." });
        }
    });
};

// After 사진 업로드 API
export const uploadAfterPhoto = async (req, res) => {
    const { userId, goalId } = req.body;

    try {
        // Before 사진이 업로드되었는지 확인
        const goalProgress = await goalService.getUserGoalProgress(userId, goalId);
        if (!goalProgress || !goalProgress.beforePhotoUrl) {
            return res.status(400).json({ message: "Before 사진을 먼저 업로드해야 합니다." });
        }

        // S3에 After 사진 업로드
        upload.single('photo')(req, res, async (err) => {
            if (err) {
                console.error("Error uploading photo:", err);
                return res.status(500).json({ message: "사진 업로드에 실패했습니다." });
            }

            try {
                // S3에 업로드된 사진의 URL
                const afterPhotoUrl = req.file.location;

                // DB에 After 사진 URL 저장
                await goalService.uploadAfterPhoto(userId, goalId, afterPhotoUrl);

                res.json({ message: "After 사진이 성공적으로 업로드되었습니다.", afterPhotoUrl });
            } catch (error) {
                console.error("Error saving photo URL to database:", error);
                res.status(500).json({ message: "사진 URL을 저장하는 중에 오류가 발생했습니다." });
            }
        });
    } catch (error) {
        console.error("Error fetching goal progress:", error);
        res.status(500).json({ message: "목표 진행 상태를 조회하는 중에 오류가 발생했습니다." });
    }
};

export const submitGoal = async (req, res) => {
    const result = await goalService.evaluateGoal(req.userId);
    res.json(result);
};
