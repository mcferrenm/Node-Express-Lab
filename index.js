const express = require('express');

const server = express();

server.get('/', (req, res) => {
  res.status(200).send("<h1>Welcome to Max's Server</h1>")
})

server.listen(4000, () => {
  console.log('\n*** Server Running on http://localhost:4000 ***\n');
});