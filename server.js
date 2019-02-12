const express = require('express');
const cors = require('cors')

const postsRouter = require('./posts/posts-router.js')

const server = express();

server.use(express.json());
server.use(cors())

server.use("/api/posts", postsRouter)

server.get('/', (req, res) => {
  res.status(200).send("<h1>Welcome to Max's Server</h1>")
})

module.exports = server;