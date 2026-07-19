import WeeklyTest from '../models/WeeklyTest.js';
import Question from '../models/Question.js';
import mongoose from 'mongoose';

export const createWeeklyTest = async (req, res) => {
  try {
    const test = await WeeklyTest.create(req.body);
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWeeklyTests = async (req, res) => {
  try {
    const tests = await WeeklyTest.find().sort({ createdAt: -1 });
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWeeklyTestById = async (req, res) => {
  try {
    const test = await WeeklyTest.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateWeeklyTest = async (req, res) => {
  try {
    const test = await WeeklyTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteWeeklyTest = async (req, res) => {
  try {
    const test = await WeeklyTest.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.status(200).json({ message: 'Test deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const publishWeeklyTest = async (req, res) => {
  try {
    const test = await WeeklyTest.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });

    // Build match query for finding relevant questions
    const matchQuery = {
      status: 'Published',
      subject: test.subject,
      chapter: test.chapter,
      difficulty: test.difficulty,
      examType: test.examType
    };

    const questions = await Question.aggregate([
      { $match: matchQuery },
      { $sample: { size: test.questionCount } }
    ]);

    if (questions.length < test.questionCount) {
      return res.status(400).json({ 
        message: `Not enough published questions found for the given criteria. Found ${questions.length}, required ${test.questionCount}.` 
      });
    }

    test.questionIds = questions.map(q => q._id);
    test.status = 'Published';
    await test.save();

    res.status(200).json({ message: 'Weekly test published successfully', test });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
