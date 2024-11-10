import dotenv from 'dotenv';
dotenv.config();

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from 'multer';
import multerS3 from 'multer-s3';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import goalService from '../services/goalService.js';
import PhotoCompare from '../models/PhotoCompare.js';
import moment from 'moment';
import goalRepository from '../repositories/goalRepository.js';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// multer 설정
const upload = multer();

// HEIC 이미지를 JPG로 변환하는 함수
const convertHeicToJpg = async (buffer) => {
    try {
        return await heicConvert({
            buffer, 
            format: 'JPEG',
            quality: 0.8 
        });
    } catch (error) {
        console.error("heic-convert 변환 실패, sharp로 시도 중:", error);
        return await sharp(buffer).jpeg().toBuffer();
    }
};

// S3 이미지 업로드
const uploadToS3 = async (buffer, key) => {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg'
    });
    await s3.send(command);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export const getTodayGoal = async (req, res) => {
    try {
        const userId = req.user._id;

        // 미완료된 가장 첫 번째 목표 가져오기
        const goal = await goalRepository.getNextGoal(userId);
        if (goal) {
            res.json(goal);
        } else {
            res.status(404).json({ message: "미완료 목표가 없습니다." });
        }
    } catch (error) {
        console.error("Error fetching top incomplete goal:", error);
        res.status(500).json({ message: "미완료 목표를 조회하는 중에 오류가 발생했습니다." });
    }
};

// Before 사진 업로드 API
export const uploadBeforePhoto = (req, res) => {
    upload.single('photo')(req, res, async (err) => {
        if (err) {
            console.error("Error uploading photo:", err);
            return res.status(500).json({ message: "사진 업로드에 실패했습니다." });
        }

        const { userId, goalId } = req.body;

        try {
            let photoBuffer = req.file.buffer;
            const fileMimeType = req.file.mimetype;

            // HEIC-> JPG 변환
            if (fileMimeType === 'image/heic' || fileMimeType === 'image/heif') {
                photoBuffer = await convertHeicToJpg(photoBuffer);
            }

            // S3에 업로드
            const uniqueName = `${Date.now()}_${userId}_Before.jpg`;
            const beforePhotoUrl = await uploadToS3(photoBuffer, uniqueName);

            // Before 사진 URL 저장
            await goalService.uploadBeforePhoto(userId, goalId, beforePhotoUrl);
            //await goalService.uploadBeforePhoto(new mongoose.Types.ObjectId(userId), new mongoose.Types.ObjectId(goalId), beforePhotoUrl);

            res.json({ message: "Before 사진이 성공적으로 업로드되었습니다.", beforePhotoUrl });
        } catch (error) {
            console.error("Error saving photo URL to database:", error);
            res.status(500).json({ message: "사진 URL을 저장하는 중에 오류가 발생했습니다." });
        }
    });
};

// After 사진 업로드 API
export const uploadAfterPhoto = (req, res) => {
    upload.single('photo')(req, res, async (err) => {
        if (err) {
            console.error("Error uploading photo:", err);
            return res.status(500).json({ message: "사진 업로드에 실패했습니다." });
        }

        const { userId, goalId } = req.body;

        try {
            const goalProgress = await goalService.getUserGoalProgress(userId, goalId);
            if (!goalProgress || !goalProgress.beforePhotoUrl) {
                return res.status(400).json({ message: "Before 사진을 먼저 업로드해야 합니다." });
            }

            let photoBuffer = req.file.buffer;
            const fileMimeType = req.file.mimetype;

            // HEIC->JPG로 변환
            if (fileMimeType === 'image/heic' || fileMimeType === 'image/heif') {
                photoBuffer = await convertHeicToJpg(photoBuffer);
            }

            // S3에 업로드
            const uniqueName = `${Date.now()}_${userId}_After.jpg`;
            const afterPhotoUrl = await uploadToS3(photoBuffer, uniqueName);

            // After 사진 URL 저장
            await goalService.uploadAfterPhoto(userId, goalId, afterPhotoUrl);
            //await goalService.uploadAfterPhoto(new mongoose.Types.ObjectId(userId), new mongoose.Types.ObjectId(goalId), afterPhotoUrl);


            res.json({ message: "After 사진이 성공적으로 업로드되었습니다.", afterPhotoUrl });
        } catch (error) {
            console.error("Error saving photo URL to database:", error);
            res.status(500).json({ message: "사진 URL을 저장하는 중에 오류가 발생했습니다." });
        }
    });
};

// 목표 제출 API
export const submitGoal = async (req, res) => {
    const { userId, goalId } = req.body;

    try {
        const today = moment().startOf('day');
        const existingProgress = await goalService.getUserGoalProgressByDate(userId, today);

        if (existingProgress) {
            return res.status(400).json({ message: "하루에 하나의 미션만 완료할 수 있습니다." });
        }

        const goalProgress = await goalService.getUserGoalProgress(userId, goalId);
        if (!goalProgress || !goalProgress.beforePhotoUrl || !goalProgress.afterPhotoUrl) {
            return res.status(400).json({ message: "Before와 After 사진을 모두 업로드해야 합니다." });
        }

        const { beforePhotoUrl, afterPhotoUrl } = goalProgress;
        const isCompleted = await PhotoCompare.comparePhotos(beforePhotoUrl, afterPhotoUrl);
        await goalService.updateGoalCompletionStatus(userId, goalId, isCompleted);

        if (isCompleted) {
            const updatedUser = await goalService.updateReward(userId);
            res.json({
                message: "미션이 성공적으로 완료되었습니다!",
                reward: updatedUser.reward,
                currentLevel: updatedUser.currentLevel
            });
        } else {
            res.json({
                message: "미션 실패. 다시 시도해 주세요.",
                isCompleted
            });
        }
    } catch (error) {
        console.error("Error in goal submission:", error);
        res.status(500).json({ message: "목표 제출 중 오류가 발생했습니다." });
    }
};
