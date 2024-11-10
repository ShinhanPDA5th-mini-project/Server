// mypageController.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const renderMyPage = (req, res) => {
    res.status(200).send('Navigate to Server');
};

export const serverMypage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', '..', '..', '..', 'withus-client', 'dist', 'index.html'));
};
