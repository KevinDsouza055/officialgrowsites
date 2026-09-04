// scripts/test-submit.js
// Run with: node scripts/test-submit.js

const handler = require('../api/submit-lead');

function makeRes() {
  let statusCode = 200;
  return {
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { statusCode = code; return this; },
    json(obj) { console.log('Response:', statusCode, obj); return this; },
    end() { console.log('Ended with status', statusCode); }
  };
}

async function run() {
  console.log('\nTest 1: JSON string body without required fields -> expect 400');
  await handler({ method: 'POST', body: JSON.stringify({ foo: 'bar' }), headers: { 'content-type': 'application/json' } }, makeRes());

  console.log('\nTest 2: URL-encoded body missing email -> expect 400');
  await handler({ method: 'POST', body: 'name=Bob&message=Hi', headers: { 'content-type': 'application/x-www-form-urlencoded' } }, makeRes());

  console.log('\nTest 3: OPTIONS preflight -> expect 200');
  await handler({ method: 'OPTIONS' }, makeRes());

  console.log('\nTest 4: Full valid contact-form payload -> expect 200 only if env vars set');
  await handler({ method: 'POST', body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    business: 'TestCo',
    whatsapp: '+11234567890',
    instagram: 'testinsta',
    facebook: 'facebook.com/test',
    message: 'Hello — this is a test',
    source: 'contact-form',
    timestamp: new Date().toISOString()
  }), headers: { 'content-type': 'application/json' } }, makeRes());
}

run().catch(err => { console.error('Test harness error:', err); process.exit(1); });
