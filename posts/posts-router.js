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

router.get('/:id', (req, res) => {

});

router.post('/', (req, res) => {
  
});

router.delete('/', (req, res) => {
  
});

router.put('/', (req, res) => {
  
});

module.exports = router;