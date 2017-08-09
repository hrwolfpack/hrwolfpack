const express = require('express');
const path = require('path');

let app = express();

app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.get('/test', (req, res) => {
  res.send('hello world');
});

let port = process.env.PORT;
// export PORT = 3000;
app.listen(port, () => console.log('Listening on port ', port));
