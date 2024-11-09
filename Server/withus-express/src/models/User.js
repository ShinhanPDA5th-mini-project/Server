import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    kakaoId: { type: String, required: true, unique: true },  // 카카오 소셜 로그인 ID
    name: { type: String, required: true },                   // 사용자 이름
    currentLevel: { type: String, default: "Beginner" },      // 사용자 현재 레벨
    reward: { type: Number, default: 0 },
    completedMissions: { type: Number, default: 0 }           // 누적 리워드 금액
});

export default mongoose.model('User', userSchema);
