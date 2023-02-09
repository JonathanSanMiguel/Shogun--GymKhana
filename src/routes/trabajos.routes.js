const { Router } = require('express')
const { ObtenerTrabajos, ObtenerUnTrabajo, CrearTrabajo, ActualizarTrabajo, BorrarTrabajo } = require('../controllers/trabajos.controllers')
const fileUpload = require('express-fileupload')
const { validarJWT } = require('../MiddleWares/validar-JsonWT')


const router = Router()

// Ruta para obtener todos los registros.
router.get('/works', validarJWT, ObtenerTrabajos)

// Ruta para obtenner un registro.
router.get('/oneWork/:id', ObtenerUnTrabajo)

// Ruta para crear un registro.
router.post('/create', validarJWT, fileUpload({useTempFiles: true, tempFileDir: './uploads'}), CrearTrabajo)

// Ruta para actualizar un registro.
router.put('/upDate/:id', validarJWT, fileUpload({useTempFiles: true, tempFileDir: './uploads'}), ActualizarTrabajo)

// Ruta para borrar un registro.
router.delete('/delete/:id', validarJWT, BorrarTrabajo)


module.exports = router