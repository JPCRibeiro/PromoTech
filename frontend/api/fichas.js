const https = require('https');

export default function handler(req, res) {
  const path = req.url.replace('/api/fichas', '');
  const options = {
    hostname: 'produtos-ambiente-env-1.eba-njrz2a2f.sa-east-1.elasticbeanstalk.com',
    path: `/api/fichas${path}`,
    method: 'GET'
  };

  const request = https.request(options, response => {
    let data = '';

    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
      res.status(200).json(JSON.parse(data));
    });
  });

  request.on('error', error => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
}
