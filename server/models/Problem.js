const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  videoId: {
    type: String,
    default: "",
  },
  constraints: {
    type: String,
    default: "",
  },
  starterCode: {
    type: String,
    required: true,
  },
  handlerFunction: {
    type: String,
    required: true,
  },
  starterCodes: {
    cpp:    { type: String, default: '' },
    python: { type: String, default: '' },
    java:   { type: String, default: '' },
    c:      { type: String, default: '' },
  },
  editorial: {
    intuition: String,
    approach: String,
    complexity: String,
    solutionCode: String,
  },
  testCases: [
    {
      input: String,
      output: String,
      explanation: String,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Problem', problemSchema);
