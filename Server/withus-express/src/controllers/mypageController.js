import mypageService from '../services/myPageService.js';

export const getMyPageData = async (req, res) => {
    try {
        const myPageData = await mypageService.getMyPageData(req.user);
        res.json(myPageData);
    } catch (error) {
        console.error("Error fetching my page data:", error);
        res.status(500).json({ message: "마이페이지 데이터를 조회하는 중에 오류가 발생했습니다." });
    }
};
