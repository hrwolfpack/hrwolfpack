const express = require('express');

let app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

let port = 3000;
app.listen(port, () => console.log('Listening on port ', port));
