const express = require('express');
const Model = require('../models/model'); 
const router = express.Router();

// POST - Crear un nuevo documento
router.post('/post', async (req, res) => {
    const data = new Model({
        name: req.body.name,
        age: req.body.age
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET - Obtener todos los documentos
router.get('/getAll', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET - Obtener un documento por ID
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "Documento no encontrado" });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH - Actualizar un documento por ID
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(id, updatedData, options);
        if (!result) return res.status(404).json({ message: "Documento no encontrado para actualizar" });
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE - Eliminar un documento por ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id);
        if (!data) return res.status(404).json({ message: "Documento no encontrado para eliminar" });
        res.json({ message: `Documento con nombre ${data.name} eliminado correctamente` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
