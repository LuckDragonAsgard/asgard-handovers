function requirePin(request) {
  const pin = request.headers.get('X-Pin') || request.headers.get('X-PIN');
  return pin && VALID_PINS.includes(pin);
}

function unauthorized() {
  return new Response(JSON.stringify({ ok: false, error: 'Unauthorized — X-Pin required' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Pin,X-PIN,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      }
    });
  }

  if (url.pathname === '/health') {
    const keys = await VAULT.list();
    return json({ ok: true, worker: 'asgard-vault', version: '1.1.0', secrets: keys.keys.length, ts: new Date() });
  }

  if (!requirePin(request)) return unauthorized();

  if (url.pathname.startsWith('/secret/') && request.method === 'GET') {
    const key = url.pathname.replace('/secret/', '');
    if (!key) return json({ error: 'key required' }, 400);
    const value = await VAULT.get(key);
    if (value === null) return json({ error: 'Secret not found: ' + key }, 404);
    return new Response(value, { headers: { 'Content-Type': 'text/plain' } });
  }

  if (url.pathname.startsWith('/secret/') && request.method === 'PUT') {
    const key = url.pathname.replace('/secret/', '');
    if (!key) return json({ error: 'key required' }, 400);
    const body = await request.text();
    if (!body) return json({ error: 'value required' }, 400);
    let value = body;
    try { const j = JSON.parse(body); if (j.value !== undefined) value = j.value; } catch (e) {}
    await VAULT.put(key, value);
    return json({ ok: true, key });
  }

  if (url.pathname.startsWith('/secret/') && request.method === 'DELETE') {
    const key = url.pathname.replace('/secret/', '');
    await VAULT.delete(key);
    return json({ ok: true, deleted: key });
  }

  if (url.pathname === '/secrets' && request.method === 'GET') {
    const list = await VAULT.list();
    return json({ keys: list.keys.map(k => k.name) });
  }

  if (url.pathname === '/secret' && request.method === 'POST') {
    const body = await request.json().catch(() => null);
    if (!body || !body.key || !body.value) return json({ error: 'key and value required' }, 400);
    await VAULT.put(body.key, body.value);
    return json({ ok: true, key: body.key });
  }

  if (url.pathname === '/inject' && request.method === 'GET') {
    const list = await VAULT.list();
    const secrets = {};
    await Promise.all(list.keys.map(async k => {
      secrets[k.name] = await VAULT.get(k.name);
    }));
    return json(secrets);
  }

  return json({
    ok: true, worker: 'asgard-vault', version: '1.1.0',
    endpoints: ['/health (public)', '/secret/KEY (PIN)', '/secrets (PIN)', '/inject (PIN)']
  });
}
