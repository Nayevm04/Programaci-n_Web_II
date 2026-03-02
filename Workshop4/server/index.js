const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { authenticateToken, generateToken, registerUser } = require('./controllers/auth');

const Profesor = require('./models/Profesor');
const Curso = require('./models/Curso');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/workshop4')
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err));

//  AUTENTICACIÓN 
app.post('/auth/token',    generateToken);
app.post('/auth/register', registerUser);

//  CRUD PROFESORES 

// GET todos los profesores
app.get('/api/profesores', authenticateToken, async (req, res) => {
    try {
        const profesores = await Profesor.find();
        res.json(profesores);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// POST profesor
app.post('/api/profesores', authenticateToken, async (req, res) => {
    try {
        const nuevoProfesor = new Profesor(req.body);
        const profesorGuardado = await nuevoProfesor.save();
        res.json(profesorGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// PUT profesor
app.put('/api/profesores/:id', authenticateToken, async (req, res) => {
    try {
        const profesorActualizado = await Profesor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!profesorActualizado) {
            return res.status(404).json({ mensaje: "Profesor no encontrado" });
        }
        res.json(profesorActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// DELETE profesor
app.delete('/api/profesores/:id', authenticateToken, async (req, res) => {
    try {
        const profesorEliminado = await Profesor.findByIdAndDelete(req.params.id);
        if (!profesorEliminado) {
            return res.status(404).json({ mensaje: "Profesor no encontrado" });
        }
        res.json({ mensaje: "Profesor eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

//  CRUD CURSOS 

// GET todos los cursos
app.get('/api/cursos', authenticateToken, async (req, res) => {
    try {
        const cursos = await Curso.find().populate('profesor');
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// GET curso por ID
app.get('/api/cursos/:id', authenticateToken, async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.id).populate('profesor');
        if (!curso) {
            return res.status(404).json({ mensaje: "Curso no encontrado" });
        }
        res.json(curso);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// POST curso
app.post('/api/cursos', authenticateToken, async (req, res) => {
    try {
        const nuevoCurso = new Curso(req.body);
        const cursoGuardado = await nuevoCurso.save();
        res.json(cursoGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// PUT curso
app.put('/api/cursos/:id', authenticateToken, async (req, res) => {
    try {
        const cursoActualizado = await Curso.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!cursoActualizado) {
            return res.status(404).json({ mensaje: "Curso no encontrado" });
        }
        res.json(cursoActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// DELETE curso
app.delete('/api/cursos/:id', authenticateToken, async (req, res) => {
    try {
        const cursoEliminado = await Curso.findByIdAndDelete(req.params.id);
        if (!cursoEliminado) {
            return res.status(404).json({ mensaje: "Curso no encontrado" });
        }
        res.json({ mensaje: "Curso eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});
