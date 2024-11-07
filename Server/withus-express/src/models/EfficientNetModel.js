import axios from 'axios';

// Python 서버의 API 엔드포인트
const PYTHON_SERVER_URL = 'http://localhost:5000/analyze';

exports.comparePhotos = async (beforePhotoUrl, afterPhotoUrl) => {
    try {
        // Python API에 Before, After 사진 URL 전송
        const response = await axios.post(PYTHON_SERVER_URL, {
            beforePhotoUrl,
            afterPhotoUrl,
        });
        
        // 모델의 판별 결과 반환
        return response.data.isCompleted;
    } catch (error) {
        console.error("Error analyzing photos:", error);
        return false;
    }
};
