const axios = require('axios');
(async () => {
  try {
    // Generate a token first by logging in
    const authRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@exampro.com',
      password: 'password123'
    });
    const token = authRes.data.token;
    
    const res = await axios.get('http://localhost:5000/api/v1/questions/grouped', {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('Chapters length:', res.data.chapters.length);
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
})();
