const express = require('express');

const Question = require('../models/Question');

const router = express.Router();

// Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get one question
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Question.findById(req.params.id);

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quiz' });
  }
});

// Admin: Create a question (use middleware authenticate, isAdmin)
router.post('/', async (req, res) => {
  const { question, options, correctAnswer } = req.body;

  if (!question || !options || !correctAnswer)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const newQuestion = await Question.create({
      question,
      options,
      correctAnswer,
    });

    res.status(201).json({ message: 'Question created', newQuestion });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update a question (use middleware authenticate, isAdmin)
router.put('/:id', async (req, res) => {
  const { question, options, correctAnswer } = req.body;

  try {
    const quiz = await Question.findByIdAndUpdate(
      req.params.id,

      { question, options, correctAnswer },

      { new: true }
    );

    if (!quiz) return res.status(404).json({ message: 'Question not found' });

    res.json({ message: 'Question updated', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete a question (use middleware authenticate, isAdmin)
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Question.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
