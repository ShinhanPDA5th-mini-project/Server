import axios from 'axios';

const PYTHON_SERVER_URL = 'http://127.0.0.1:5000/analyze';

const comparePhotos = async (beforePhotoUrl, afterPhotoUrl) => {
    try {
        const response = await axios.post(PYTHON_SERVER_URL, {
            beforePhotoUrl,
            afterPhotoUrl
        });
        return response.data.isCompleted;
    } catch (error) {
        console.error("Error analyzing photos:", error);
        return false;
    }
};

export default { comparePhotos };
