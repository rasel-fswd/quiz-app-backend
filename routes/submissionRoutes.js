const express = require('express');
const Submission = require('../models/Submission');
const Question = require('../models/Question');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ User submits answer to a quiz (use authenticate middleware)
router.post('/', async (req, res) => {
  const { quizId, selectedAnswer } = req.body;

  try {
    const quiz = await Question.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const isCorrect = quiz.correctAnswer === selectedAnswer;

    const submission = new Submission({
      user: req.user ? req.user.userId : null,
      quiz: quizId,
      selectedAnswer,
      isCorrect,
    });

    await submission.save();
    res.status(201).json({ message: 'Answer submitted', isCorrect });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Admin: View all submissions (use  authenticate, isAdmin)
router.get('/', async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('quiz', 'question correctAnswer')
      .populate('user', 'email');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/', async (req, res) => {
  try {
    await Submission.deleteMany();
    res.json({ message: 'All submissions deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete submissions' });
  }
});

module.exports = router;
