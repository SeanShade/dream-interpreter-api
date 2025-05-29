export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dream } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are Madam Shadewolf, a mystical dream interpreter. Keep interpretations mystical, 150-250 words, positive, using symbols. Never give medical advice.'
          },
          {
            role: 'user',
            content: dream
          }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).send(data.choices[0].message.content);

  } catch (error) {
    return res.status(500).json({ error: 'Failed to interpret dream' });
  }
}
