const express = require('express');
const Model = require('../models/model');
const router = express.Router();

// POST - crear dato
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

// GET - todos los datos
router.get('/getAll', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET por ID
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE por ID
router.patch('/update/:id', async (req, res) => {
    try {
        const result = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.send(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE por ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const data = await Model.findByIdAndDelete(req.params.id);
        res.send(`Document with ${data.name} deleted`);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
