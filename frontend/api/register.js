const https = require('https');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const data = JSON.stringify({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  const options = {
    hostname: 'produtos-ambiente-env-1.eba-njrz2a2f.sa-east-1.elasticbeanstalk.com',
    path: '/api/registro',
    method: 'POST'
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

  request.write(data);
  request.end();
}
