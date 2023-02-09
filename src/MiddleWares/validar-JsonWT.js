const { response } = require("express")
const jwt = require("jsonwebtoken")

const validarJWT = (req, res = response, next) => {

    const JWtoken = req.header('X-Token')

    if (!JWtoken) {
        return res.status(401).json({
            status: false,
            message: "Error en el JsonWebToken"
        })
    }

    try {

        const {uid, nombre, apellido, email} = jwt.verify(JWtoken, process.env.SECRET_JWT_SEED)

        req.uid = uid
        req.nombre = nombre
        req.apellido = apellido
        req.email = email
        
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Token no valido"
        })
    }

    next()
}

module.exports = {
    validarJWT
}