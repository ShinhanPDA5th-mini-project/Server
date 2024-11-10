import express from 'express';
import axios from 'axios';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/chat', authenticate, async (req, res) => {
    const { message } = req.body;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: '너는 우리나라에서 공감을 제일 잘하는 인간으로 빙의해주세요. 사람의 마음을 들여다 보고 어루만져 줄 수 있는 공감사가 되어주세요' },
                    { role: 'user', content: message },
                ],
                temperature: 0.8,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0.5,
                presence_penalty: 0.5,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        const aiResponse = response.data.choices[0].message.content;
        res.json({ message: aiResponse });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Error calling OpenAI API' });
    }
});

export default router;