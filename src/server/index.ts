import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.SILICONFLOW_API_KEY;

app.post('/api/llm', async (req, res) => {
  try {
    const { model, messages, options } = req.body;
    
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        ...options
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling LLM API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 