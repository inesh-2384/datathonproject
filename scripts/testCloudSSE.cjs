const https = require('https');

console.log('Connecting to Cloud SSE stream: https://financial-immune-system-d9vz.onrender.com/api/events/stream...');

const req = https.get('https://financial-immune-system-d9vz.onrender.com/api/events/stream', (res) => {
  console.log('SSE HTTP Status:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  console.log('Cache-Control:', res.headers['cache-control']);
  console.log('X-Accel-Buffering:', res.headers['x-accel-buffering']);

  let eventCount = 0;
  res.on('data', (chunk) => {
    eventCount++;
    const str = chunk.toString();
    console.log(`[Event ${eventCount}] Received ${chunk.length} bytes:`, str.slice(0, 100).replace(/\n/g, ' '));
    if (eventCount >= 2) {
      console.log('SSE STREAM VERIFIED: Real-time event transport operational.');
      req.destroy();
      process.exit(0);
    }
  });
});

req.on('error', (err) => {
  console.error('SSE Error:', err.message);
  process.exit(1);
});

setTimeout(() => {
  console.error('SSE Timeout: Did not receive events within 10 seconds.');
  req.destroy();
  process.exit(1);
}, 10000);
