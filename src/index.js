export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }

    // Everything else is served from the public/ folder automatically
    return env.ASSETS.fetch(request);
  }
};

async function handleChat(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { messages } = body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return jsonResponse({ error: 'Missing messages' }, 400);
  }

  if (!env.AI) {
    return jsonResponse({ error: 'AI binding not found. Check wrangler.jsonc.' }, 500);
  }

  try {
    const aiMessages = [
      { role: 'system', content: 'You are Eyula AI, a friendly and helpful assistant. Keep answers clear and concise.' },
      ...messages
    ];

    const result = await env.AI.run('@cf/google/gemma-4-26b-a4b-it', {
      messages: aiMessages
    });

    return jsonResponse({ reply: result.response }, 200);
  } catch (err) {
    return jsonResponse({ error: 'Server error: ' + err.message }, 500);
  }
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
