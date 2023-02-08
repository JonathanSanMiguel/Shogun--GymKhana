const mongoose = require('mongoose')

const TrabajoSchema = mongoose.Schema({
    image:{
        public_id: String,
        secure_url: String
    },
    nombre: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    folio: {
        type: Number,
        trim: true
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