const https = require('https');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Token is missing!' });
    return;
  }

  const options = {
    hostname: 'produtos-ambiente-env-1.eba-njrz2a2f.sa-east-1.elasticbeanstalk.com',
    path: '/api/user',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const request = https.request(options, response => {
    let responseData = '';

    response.on('data', chunk => {
      responseData += chunk;
    });

    response.on('end', () => {
      res.status(response.statusCode).json(JSON.parse(responseData));
    });
  });

  request.on('error', error => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
}