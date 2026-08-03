const express = require('express');
const app = express();
const path = require('path');
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'love.html'), (err) => {
    if (err) {
      res.status(500).send(err.message);
    }
  });
});
app.listen(3001, () => {
  console.log("Listening on 3001");
});
