// services/kakaoAuthService.js
import axios from 'axios';

export const getAccessToken = async (code) => {
    try {
        const response = await axios.post("https://kauth.kakao.com/oauth/token", null, {
            params: {
                grant_type: "authorization_code",
                client_id: process.env.KAKAO_CLIENT_ID,
                redirect_uri: process.env.KAKAO_REDIRECT_URI,
                code,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        
        console.log("Access Token Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("액세스 토큰 요청 실패:", error.response ? error.response.data : error.message);
        throw new Error("Failed to retrieve access token");
    }
};

export const getKakaoUserData = async (accessToken) => {
    try {
        const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log("User Info Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error.response ? error.response.data : error.message);
        throw new Error("Failed to retrieve Kakao user data");
    }
};

export const kakaoLogout = async (accessToken) => {
    try {
      const response = await axios.post("https://kapi.kakao.com/v1/user/logout", {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("로그아웃 실패:", error.response ? error.response.data : error.message);
      throw new Error("로그아웃 실패");
    }
  };

export default {
    getAccessToken,
    getKakaoUserData,
    kakaoLogout
};
