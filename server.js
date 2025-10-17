// Modules
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Imports
const quizRoutes = require('./routes/quizRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const connectDB = require('./db/connect');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/submissions', submissionRoutes);

const PORT = process.env.PORT || 5000;

// Run DB and Server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`App is running ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
