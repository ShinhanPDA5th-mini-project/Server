import kakaoAuthService from "../services/kakaoAuthService.js";
import userRepository from "../repositories/userRepository.js";

export const kakaoLogin = async (req, res) => {
    try {
        const code = req.query.code;
        if (!code) throw new Error("Authorization code is missing");

        const tokenData = await kakaoAuthService.getAccessToken(code);
        const userData = await kakaoAuthService.getKakaoUserData(tokenData.access_token);

        const user = await userRepository.getOrCreateUserByKakaoId(
            userData.id,
            userData.properties.nickname,
            tokenData.access_token
        );

        // 로그인 성공 시 클라이언트에 리다이렉트 URL과 사용자 데이터 전송
        res.json({ message: "로그인 성공", user });
        res.redirect('http://3.36.43.54');
    } catch (error) {
        console.error("카카오 로그인 에러:", error);
        res.status(500).json({ message: "카카오 로그인 실패" });
    }
};



export const logout = async (req, res) => {
    try {
        // 이 시점에서 `req.user`는 `authenticate` 미들웨어로 설정되어 있어야 함
        const user = req.user;

        // 카카오 로그아웃 요청 보내기
        await kakaoAuthService.kakaoLogout(user.accessToken);

        // 로그아웃 성공 시 로컬 DB에서 토큰 제거
        user.accessToken = null;
        await user.save();

        res.json({ message: "로그아웃 성공" });
    } catch (error) {
        console.error("로그아웃 에러:", error);
        res.status(500).json({ message: "로그아웃 실패" });
    }
};