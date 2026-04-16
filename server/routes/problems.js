const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// Get all problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find().sort({ order: 1 });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single problem by title (slugified or exact)
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
