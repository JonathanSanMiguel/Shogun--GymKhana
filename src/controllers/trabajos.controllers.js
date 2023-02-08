const Trabajo = require('../Models/Trabajo')
const { UploadImage, DeleteImage }  = require('../cloudinary')
const fs = require('fs-extra')

// Funcion GET
const ObtenerTrabajos = async(req, res) => {
    try {
        const trabajos = await Trabajo.find()
        res.status(200).json(trabajos)
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

//Funcion GET ONE
const ObtenerUnTrabajo = async(req, res) => {
    try {

        const producto = await Product.findById(req.params.id)

        if(!producto) {
            return res.status(404).json( {
                message: 'El producto no existe'
            })
        } else {
            res.status(200).send({
                status: true,
                producto
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

//Funcion POST
const CrearTrabajo = async(req, res) => {
    try {
        // Desestructuracion de los parametros del req.body.
        const { nombre, descripcion, folio, fecha  } = req.body

        // Creacion de una instancia del modelo con los parametros.
        const trabajo = new Trabajo({ nombre, descripcion, folio, fecha })

        // SI la peticion tiene una imagen la cargara.
        if(req.files?.image) {
            const result = await UploadImage(req.files.image.tempFilePath)
            trabajo.image = {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
            await fs.unlink(req.files.image.tempFilePath)
        }

        if(req.files?.factura) {
            const result = await UploadImage(req.files.factura.tempFilePath)
            trabajo.factura = {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
            await fs.unlink(req.files.factura.tempFilePath)
        }

        // Guarda el registro en la DB.
        await trabajo.save()

        // Respuesta en json
        res.status(200).json({
            status: true,
            message: 'Registro creado Satisfactoriamente',
            trabajo
        })
    } catch (error) {
        // En caso de error, res json con el error
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

//Funcion UPDATE
const ActualizarTrabajo = async(req, res) => {
    try {

        const productoAnterior = await Product.findById(req.params.id)

        if(!productoAnterior) {
            return res.status(404).json({
                message: 'El producto no existe'
            })
        } else {
            await DeleteImage(productoAnterior.image.public_id)
            await DeleteImage(productoAnterior.factura.public_id)
        }

        // Desestructuracion de los parametros del req.body.
        const { nombre, descripcion, fecha  } = req.body

        // Creacion de una instancia del modelo con los parametros.
        const producto = new Product({ nombre, descripcion, fecha })

        // Carga la imagen del form.
        if(req.files?.image) {
            const result = await UploadImage(req.files.image.tempFilePath)
            producto.image = {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
            await fs.unlink(req.files.image.tempFilePath)
        }

        // Carga la factura en PDF del form.
        if(req.files?.factura) {
            const result = await UploadImage(req.files.factura.tempFilePath)
            producto.factura = {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
            await fs.unlink(req.files.factura.tempFilePath)
        }

        //console.log(producto)
        await Product.findByIdAndUpdate(req.params.id, {
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            producto: producto.fecha,
            image: {
                public_id: producto.image.public_id,
                secure_url: producto.image.secure_url
            },
            factura: {
                public_id: producto.factura.public_id,
                secure_url: producto.factura.secure_url
            }
        })

        res.status(200).json({
            status: true,
            message: 'Registro actualizado Satisfactoriamente'
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

//Funcion DELETE
const BorrarTrabajo = async(req, res) => {
    try {
        // Busca el registro por Id y lo elimina
        const producto = await Product.findByIdAndDelete(req.params.id)

        if(!producto) {
            return res.status(404).json({
                message: 'El producto no existe'
            })
        } else {
            await DeleteImage(producto.image.public_id)
            await DeleteImage(producto.factura.public_id)
            res.status(200).send({
                status: true,
                message: 'Registro eliminado Satisfactoriamente'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

module.exports = {
    ObtenerTrabajos,
    ObtenerUnTrabajo,
    CrearTrabajo,
    ActualizarTrabajo,
    BorrarTrabajo
}