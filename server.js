import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Archivos estáticos
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API de IA
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model } = req.body;

        const response = await fetch(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://code-vault-orpin-delta.vercel.app',
                    'X-OpenRouter-Title': 'CodeVault'
                },
                body: JSON.stringify({
                    model: model || 'openai/gpt-4o-mini',
                    messages: messages
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('OpenRouter error:', response.status, data);
        }

        res.json(data);

    } catch (error) {
        console.error('Error:', error);

        res.status(500).json({
            error: 'Error al contactar con la IA'
        });
    }
});

export default app;