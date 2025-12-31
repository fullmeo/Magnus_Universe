const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3333,
  path: '/api/magnus14/projects',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.success) {
        console.log('✅ Dashboard API - List All Projects\n');
        console.log(`Found ${json.data.length} projects:\n`);
        json.data.forEach((proj, idx) => {
          console.log(`${idx + 1}. ${proj.projectName}`);
          console.log(`   Domain: ${proj.domain}`);
          console.log(`   ID: ${proj.projectId}`);
          console.log(`   Timestamp: ${proj.timestamp}\n`);
        });
      } else {
        console.log('Error:', json.error);
      }
    } catch (e) {
      console.log('Parse error:', e.message);
      console.log('Response:', data.substring(0, 200));
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
