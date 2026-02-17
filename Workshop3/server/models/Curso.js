const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    codigo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    profesor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profesor',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Curso', CursoSchema);
