import handler from '../dist/server/server.js';

export default async function (req, res) {
  // Convert Node req/res to Web Request/Response for Tanstack Start's fetch handler
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const url = new URL(req.url, `${protocol}://${req.headers.host}`);
  
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      value.forEach(v => headers.append(key, v));
    } else if (value) {
      headers.set(key, value);
    }
  }

  const requestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // Read body
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    requestInit.body = Buffer.concat(buffers);
  }

  const webRequest = new Request(url, requestInit);
  const webResponse = await handler.fetch(webRequest);

  res.statusCode = webResponse.status;
  webResponse.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (webResponse.body) {
    const reader = webResponse.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } else {
    res.end();
  }
}
