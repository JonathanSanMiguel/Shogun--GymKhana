const { Router } = require('express')
const { ObtenerTrabajos, ObtenerUnTrabajo, CrearTrabajo, ActualizarTrabajo, BorrarTrabajo } = require('../controllers/trabajos.controllers')
const fileUpload = require('express-fileupload')


const router = Router()

router.get('/works', ObtenerTrabajos)

router.get('/oneWork/:id', ObtenerUnTrabajo)

router.post('/create', fileUpload({useTempFiles: true, tempFileDir: './uploads'}), CrearTrabajo)

router.put('/upDate/:id', fileUpload({useTempFiles: true, tempFileDir: './uploads'}), ActualizarTrabajo)

router.delete('/delete/:id', BorrarTrabajo)


module.exports = router