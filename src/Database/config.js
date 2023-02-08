const Mongoose = require("mongoose")

const dbConection = async() => {
    try {

        await Mongoose.connect(process.env.DB_CNN)
        console.log("Base de datos conectada")
    } catch (error) {
        console.log(error)
        throw new Error("Error en la Base de Datos")
    }
}

module.exports = {
    dbConection
}