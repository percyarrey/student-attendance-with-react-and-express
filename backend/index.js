// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 4000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student-attendance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Student model
const Student = mongoose.model('Student', {
    matricule: String,
    name: String,
    level: Number,
    status: String,
});

// CRUD routes
app.get('/api/students', async (req, res) => {
    try {
        const { id } = req.query;
        let query = {};

        query.name = { $regex: id };
        const students = await Student.find({ id: id });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/students', async (req, res) => {
    const student = new Student(req.body);
    try {
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/students', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Invalid request. Please provide an array of student IDs.' });
        }

        const deletedStudents = await Student.deleteMany({ _id: { $in: ids } });
        if (deletedStudents.deletedCount === 0) {
            return res.status(404).json({ message: 'No students found with the provided IDs.' });
        }

        res.json({ message: `${deletedStudents.deletedCount} students deleted.` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});