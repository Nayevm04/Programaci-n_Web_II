const mongoose = require('mongoose');

const ProfesorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    cedula: {
        type: String,
        required: true,
        unique: true
    },
    edad: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Profesor', ProfesorSchema);
