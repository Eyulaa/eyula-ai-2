export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { messages } = body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'Missing messages' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!env.AI) {
    return new Response(JSON.stringify({ error: 'Workers AI binding not found. Add an "AI" binding to this project in the Cloudflare dashboard.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const aiMessages = [
      { role: 'system', content: 'You are Eyula AI, a friendly and helpful assistant. Keep answers clear and concise.' },
      ...messages
    ];

    const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: aiMessages
    });

    return new Response(JSON.stringify({ reply: result.response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
