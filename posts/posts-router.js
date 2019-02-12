const express = require('express');
const db = require('../data/db.js')

const router = express.Router();

router.get('/', async (req, res) => {
  console.log(req.query.sortby)
  try {
    const sortField = req.query.sortby || "id";
    const posts = await db.find()
    posts.sort(
      (a, b) => (a[sortField] < b[sortField] ? -1 : 1)
    );
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
  if (!newPost.title || !newPost.contents) {
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

router.delete('/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await db.findById(postId)
    if (post.length > 0) {
      const isDeleted = await db.remove(postId)
      if (isDeleted > 0) {
        // TODO Also send status code 204 somehow
        res.json(post[0])
      } else {
        res.status(500).json({ error: "The post exists but could not be removed" })
      }
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  } catch (error) {
    res.status(500).json({ error: "The post could not be removed" })
  }
});

router.put('/:id', async (req, res) => {
  const postId = req.params.id;
  const postChanges = req.body;

  if (!postChanges.title || !postChanges.contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  } else {
    try {
      // Does the post exist in the db?
      const post = await db.findById(postId)
      if (post.length > 0) {
        // Did the db update this post?
        const isUpdated = await db.update(postId, postChanges)
        if (isUpdated > 0) {
          // If it did update, send the new post back to the client
          const newPost = await db.findById(postId)
          res.status(200).json(newPost)
        } else {
          res.status(500).json({ error: "The post information could not be modified." })
        }
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    } catch (error) {
      res.status(500).json({ error: "The post information could not be modified." })
    }
  }

});

module.exports = router;