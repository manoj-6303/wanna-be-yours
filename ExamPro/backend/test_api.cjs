const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign({ id: '60d0fe4f5311236168a109ca' }, process.env.JWT_SECRET || 'lakshya_secret_key');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/exams/1',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Status:', res.statusCode);
      if (Array.isArray(parsed)) {
        console.log('Returned Questions Length:', parsed.length);
      } else {
        console.log('Response:', parsed);
      }
    } catch(e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', error => console.error(error));
req.end();
