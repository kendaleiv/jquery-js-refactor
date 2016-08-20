const express = require('express');
const app = express();

const port = process.env.port || 3000;

app.get('/', (req, res) => {
  res.sendFile('./index.html', { root: __dirname });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
