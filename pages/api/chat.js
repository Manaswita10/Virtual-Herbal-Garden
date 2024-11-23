import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": "You are a knowledgeable herbal medicine expert. Provide accurate, helpful information about medicinal plants, herbs, their uses, and preparations. Keep responses concise but informative. If you're unsure about something, acknowledge it and suggest consulting a healthcare professional."
        },
        {
          "role": "user",
          "content": message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ message: 'Error processing your request' });
  }
}