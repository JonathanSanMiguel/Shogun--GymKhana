// Sirve para igualar el res a response y permita el intellisense
const { response, json } = require('express')
const Usuario = require('../Models/Usuario')
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jsonWebToken')


// Funcion para Crear un nuevo usuario.
const createUser = async(req, res = response) => {
    try {
        // Parametros para el SignIn que estan en el request.body.
        const { nombre, apellido, email, password } = req.body

        // Verificacion de email.
        let usuario = await Usuario.findOne({email})

        // Si el email existe, termina el proceso. 
        if (usuario){
            return res.status(400).json({
                status: false,
                message: "Email ya Registrado"
            })
        }

        // Creacion del usuario con el modelo
        // Nueva instancia del usuario.
        const dbUser = new Usuario(req.body)

        // Hash al password.
        const salt = bcrypt.genSaltSync(15)
        dbUser.password = bcrypt.hashSync(password, salt)

        // Generar el JsonWebToken.
        const JWtoken = await generarJWT(dbUser.id, dbUser.email, dbUser.nombre, dbUser.apellido)

        // Crear usuario en la Batabase.
        await dbUser.save()
        
        // res successful.
        return res.status(200).json({
            status: true,
            message: "Registro Exitoso",
            uid: dbUser.id,
            email: dbUser.email,
            nombre: dbUser.nombre,
            apellido: dbUser.apellido,
            JWtoken
        })

        // En caso de error, res json con el error.
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })//return
    }//catch
}//createUser


// Funcion para iniciar sesion.
const LogIn = async(req, res = response) => {
    try {
        // Parametros para el LogIn que estan en el request.body.
        const { email, password } = req.body

        // Busca en la BD si el email existe.
       const dbUser = await Usuario.findOne({email})

       // Valida si el correo es valido.
       if(!dbUser){
        return res.status(400).json({
            status: false,
            message: "Correo no Valido"
        })
       }

       // Confirmar si el password hace match.
       const validPassword = bcrypt.compareSync(password, dbUser.password)
       if (!validPassword) {
            return res.status(400).json({
                status: false,
                message: "La Contraseña es Incorrecta"
            })
       }

       // Generar el JsonWebToken.
       const JWtoken = await generarJWT(dbUser.id, dbUser.email, dbUser.nombre, dbUser.apellido)

       // res successful
       return res.status(200).json({
            status: true,
            message: "Logueado Con Exito",
            uid: dbUser.id,
            email: dbUser.email,
            nombre: dbUser.nombre,
            apellido: dbUser.apellido,
            JWtoken
       })
       
        // En caso de error, res json con el error.
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })//return
    }//catch
}//login


// Funcion para validar el JsonToken.
const renewToken = async(req, res = response) => {
    try {
        const { uid, email, nombre, apellido } = req

        // Generar el JsonWebToken
        const JWtoken = await generarJWT(uid, email, nombre, apellido)
    
        // res successful
        return res.status(200).json({
            status: true,
            message: "JsonWebToken Renovado",
            uid,
            email,
            nombre,
            apellido,
            JWtoken
        })

        // En caso de error, res json con el error.
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })//return
    }//catch
}//renewToken


module.exports = {
    createUser,
    LogIn,
    renewToken
}