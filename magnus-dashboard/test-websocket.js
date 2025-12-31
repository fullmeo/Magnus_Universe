/**
 * WebSocket Connection Test
 * Tests the WebSocket connection to the dashboard server
 */

import WebSocket from 'ws';

async function testWebSocket() {
  return new Promise((resolve, reject) => {
    console.log('\n🧪 Testing WebSocket Connection...\n');

    const ws = new WebSocket('ws://localhost:3000');
    let messageReceived = false;

    // Connection opened
    ws.on('open', () => {
      console.log('✅ WebSocket connected');

      // Send subscription message
      ws.send(JSON.stringify({
        type: 'subscribe',
        events: ['pattern-detected', 'sync-completed']
      }));
      console.log('📤 Subscription sent');
    });

    // Message received
    ws.on('message', (data) => {
      console.log('📨 Message received:', data);
      messageReceived = true;

      // Close after first message
      setTimeout(() => {
        ws.close();
      }, 1000);
    });

    // Connection closed
    ws.on('close', () => {
      console.log('❌ WebSocket closed');
      console.log('\n📊 Test Result:');
      console.log('   Connection: ✅ Successful');
      console.log(messageReceived ? '   Messages: ✅ Received' : '   Messages: ⚠️  None received');
      console.log('\n✅ WebSocket test completed\n');
      resolve();
    });

    // Error
    ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error.message);
      console.log('\n❌ WebSocket test failed\n');
      reject(error);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    }, 10000);
  });
}

// Run test
testWebSocket().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
