const mongoose = require('mongoose')

// Esquema de la collecion para los resgistros
const TrabajoSchema = mongoose.Schema({
    usuarioNombre:{
        type: String
    },
    usuarioId:{
        type: String
    },
    image:{
        public_id: String,
        secure_url: String
    },
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    folio: {
        type: Number,
        trim: true,
        unique: true
    },
    fecha: {
        type: Date
    },
    factura: {
        public_id: String,
        secure_url: String
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Trabajo', TrabajoSchema)