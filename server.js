import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model } = req.body;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-OpenRouter-Title': 'CodeVault'
            },
            body: JSON.stringify({
                model: model || 'openai/gpt-4o-mini',
                messages: messages
                // 👇 SIN stream: true
            })
        });

        const data = await response.json();

        // 👇 Esto te ayudará a depurar si algo falla
        if (!response.ok) {
            console.error('OpenRouter error:', response.status, data);
        }

        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al contactar con la IA' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});