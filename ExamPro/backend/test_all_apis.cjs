const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign({ id: '60d0fe4f5311236168a109ca', role: 'admin' }, process.env.JWT_SECRET || 'lakshya_secret_key');

const checkEndpoint = (path) => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };
    
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ path, status: res.statusCode, data });
      });
    });
    
    req.on('error', error => resolve({ path, error: error.message }));
    req.end();
  });
};

const run = async () => {
  const endpoints = [
    '/api/v1/admin/stats',
    '/api/v1/admin/users',
    '/api/v1/questions',
    '/api/v1/levels',
    '/api/v1/exams/security-logs',
    '/api/v1/admin/certificates',
    '/api/v1/admin/analytics'
  ];
  
  for (let ep of endpoints) {
    const res = await checkEndpoint(ep);
    console.log(`[${res.status}] ${res.path} -> ${res.data.substring(0, 100)}`);
  }
};

run();
