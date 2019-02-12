const express = require('express');
const db = require('../data/db.js')

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await db.find()
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ error: "The posts information could not be retrieved." })
  }
});

router.get('/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await db.findById(postId);
    if (post.length > 0) {
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  } catch (error) {
    res.status(500).json({ error: "The post information could not be retrieved." })
  }
});

router.post('/', async (req, res) => {
  const newPost = req.body;
  if(!newPost.title || !newPost.contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  } else {
    try {
      const newId = await db.insert(newPost)
      const createdPost = await db.findById(newId.id)
      res.status(201).json(createdPost)
    } catch (error) {
      res.status(500).json({ error: "There was an error while saving the post to the database" })
    }
  }

});

router.delete('/', (req, res) => {

});

router.put('/', (req, res) => {

});

module.exports = router;