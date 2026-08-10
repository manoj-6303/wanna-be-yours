import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import User from './models/User.js';
import http from 'http';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found');
      process.exit(1);
    }
    
    const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || 'lakshya_secret_key', { expiresIn: '30d' });
    
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
    
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
};
run();
