module.exports = async (req, res) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  const { prompt } = JSON.parse(body || '{}');

  if (!prompt) return res.status(400).json({ error: "No prompt" });

  const apiKey = process.env.OPENAI_API_KEY;

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  const data = await r.json();
  res.status(200).json({ text: data.choices?.[0]?.message?.content || "No result" });
};