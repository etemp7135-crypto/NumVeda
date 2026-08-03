const express = require('express');
const app = express();
const path = require('path');
app.get('/', (req, res) => {
  const file = path.resolve(__dirname, 'love.html');
  console.log("Serving:", file);
  res.sendFile(file, (err) => {
    if (err) {
      console.log("Error object:", err);
      res.status(500).send(err.message);
    }
  });
});
app.listen(3001, () => {
  console.log("Listening on 3001");
});
