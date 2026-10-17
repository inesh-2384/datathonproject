const http = require('http');

async function testRuntimeHealth() {
  console.log('===================================================================');
  console.log('  RUNNING STEP 3 & 4: RUNTIME HEALTH CHECK (PORTS 3000 & 3001)');
  console.log('===================================================================');

  // 1. Frontend Check
  await new Promise((resolve, reject) => {
    http.get('http://localhost:3000', (res) => {
      console.log(`[FRONTEND] http://localhost:3000 -> HTTP ${res.statusCode}`);
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 && html.includes('<!DOCTYPE html>')) {
          console.log('  ✓ Frontend responded with valid index.html');
          resolve();
        } else {
          reject(new Error(`Frontend returned unexpected status ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });

  // 2. Backend Health Check
  await new Promise((resolve, reject) => {
    http.get('http://localhost:3001/api/health', (res) => {
      console.log(`[BACKEND API] http://localhost:3001/api/health -> HTTP ${res.statusCode}`);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'ONLINE') {
            console.log(`  ✓ Enclave Server ONLINE: ${json.system} (version: ${json.version})`);
            resolve();
          } else {
            reject(new Error(`Unexpected health payload: ${data}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });

  // 3. Backend State Snapshot
  await new Promise((resolve, reject) => {
    http.get('http://localhost:3001/api/state', (res) => {
      console.log(`[BACKEND STATE] http://localhost:3001/api/state -> HTTP ${res.statusCode}`);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const cs = json.data.controlState;
          console.log(`  ✓ State received: Margin ${cs.control_margin_percent}% [${cs.overall_status}], ${json.data.institutions.length} banks, ${json.data.dependencies.length} rails`);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });

  // 4. SSE Stream Connectivity Test
  await new Promise((resolve, reject) => {
    console.log('[BACKEND SSE] Testing connection to http://localhost:3001/api/events/stream...');
    const req = http.get('http://localhost:3001/api/events/stream', (res) => {
      console.log(`  ✓ SSE Stream opened with HTTP ${res.statusCode}, headers:`, res.headers['content-type']);
      if (res.headers['content-type'] && res.headers['content-type'].includes('text/event-stream')) {
        let receivedData = false;
        res.on('data', (chunk) => {
          receivedData = true;
          console.log(`  ✓ SSE chunk received (${chunk.length} bytes):`, chunk.toString().slice(0, 80).replace(/\n/g, ' '));
        });
        setTimeout(() => {
          req.destroy();
          if (receivedData) {
            console.log('  ✓ SSE streaming active and receiving frames');
            resolve();
          } else {
            console.log('  ✓ SSE stream established and connected (idle wait)');
            resolve();
          }
        }, 1500);
      } else {
        reject(new Error(`Expected text/event-stream content-type, got ${res.headers['content-type']}`));
      }
    });
    req.on('error', (err) => {
      if (err.code === 'ECONNRESET') {
        resolve(); // We destroyed the request intentionally
      } else {
        reject(err);
      }
    });
  });

  console.log('\n✓ ALL RUNTIME HEALTH CHECKS PASSED WITH ZERO ERRORS!\n');
}

testRuntimeHealth().catch(err => {
  console.error('Runtime health check failed:', err);
  process.exit(1);
});
