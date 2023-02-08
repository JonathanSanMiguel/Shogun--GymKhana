const { Schema, model } = require("mongoose")

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    apellido: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
})

//El model cambia a prural al momento del registo
module.exports = model('Usuario', UsuarioSchema)