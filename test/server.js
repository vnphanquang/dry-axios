const express = require('express');

express()
  .get('/sample', (_, res) => {
    res.status(200).json({ sample: true, additional: 'some other field' });
  })
  .listen(5678, () => {
    console.log("Server listening on port 5678!");
  });
