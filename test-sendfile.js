const express = require('express');
const app = express();
const path = require('path');
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'love.html'), (err) => {
    if (err) {
      console.error("sendfile error:", err);
      res.status(500).send(err.message);
    }
  });
});
app.listen(3001, () => {
  console.log("Listening on 3001");
});
