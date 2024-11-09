import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from 'multer';
import dotenv from 'dotenv';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import goalService from '../services/goalService.js';
import EfficientNetModel from '../models/EfficientNetModel.js';
import mongoose from 'mongoose';

dotenv.config();

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
        console.log("Submitting goal for userId:", userId, "goalId:", goalId);

        const goalProgress = await goalService.getUserGoalProgress(userId, goalId);
        console.log("Goal progress retrieved:", goalProgress);

        if (!goalProgress || !goalProgress.beforePhotoUrl || !goalProgress.afterPhotoUrl) {
            return res.status(400).json({ message: "Before와 After 사진을 모두 업로드해야 합니다." });
        }

        const { beforePhotoUrl, afterPhotoUrl } = goalProgress;
        const isCompleted = await EfficientNetModel.comparePhotos(beforePhotoUrl, afterPhotoUrl);
        await goalService.updateGoalCompletionStatus(userId, goalId, isCompleted);

        res.json({
            message: isCompleted ? "미션이 성공적으로 완료되었습니다!" : "미션 실패. 다시 시도해 주세요.",
            isCompleted
        });
    } catch (error) {
        console.error("Error in goal submission:", error);
        res.status(500).json({ message: "목표 제출 중 오류가 발생했습니다." });
    }
};