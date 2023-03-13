const Trabajo = require('../Models/Trabajo')
const { UploadImage, DeleteImage } = require('../cloudinary')
const fs = require('fs-extra')


// Funcion para obtener todos los registros.
const ObtenerTrabajos = async(req, res) => {
    try {
        let trabajos

        if (req.query.userId === "640f71072acb9b915d4d69a6") {
            // Consulta y guarda todos los registros en un arreglo.
            trabajos = await Trabajo.find()
        } else {
            const userID = req.query.userId

            // Consulta y guarda todos los registros en un arreglo.
            trabajos = await Trabajo.find({ usuarioId: userID })
        }

        // res del arreglo con los registros.
        res.status(200).json(
            trabajos
        )

        // En caso de error, res json con el error.
    } catch (error){
        res.status(500).json({
            status: false,
            message: error.message
        })//res
    }//catch
}//obtenerTrabajos


// Funcion para obtener un solo registro.
const ObtenerUnTrabajo = async(req, res) => {
    try {
        // Crea un objeto con los datos de la peticion.
        const trabajo = await Trabajo.findById(req.params.id)

        // Valida si encontro un registro.
        if(!trabajo) {
            return res.status(404).json( {
                status: false,
                message: 'El Registro no Existe'
            })
        } else {
            res.status(200).send({
                status: true,
                trabajo
            })
        }

        // En caso de error, res json con el error
    } catch (error){
        res.status(500).json({
            status: false,
            message: error.message
        })//res
    }//catch
}//ObtenerUnTrabajo


// Funcion para crear un nuevo registro.
const CrearTrabajo = async(req, res) => {
    try {
        // Desestructuracion de los parametros del req.body.
        const { usuarioNombre, usuarioId, nombre, descripcion, folio, fecha  } = req.body

        // Creacion de una instancia del modelo con los parametros.
        const trabajo = new Trabajo({ usuarioNombre, usuarioId, nombre, descripcion, folio, fecha })

        // Carga la imagen que esta en el request.files.
        if(req.files?.image) {
            const result = await UploadImage(req.files.image.tempFilePath)
            trabajo.image = {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
            await fs.unlink(req.files.image.tempFilePath)
        }

        // Carga la factura en PDF que esta en el request.files.
        if(req.files?.factura) {
            const result = await UploadImage(req.files.factura.tempFilePath)
            trabajo.factura = {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
            await fs.unlink(req.files.factura.tempFilePath)
        }

        // Guarda el objeto del registro en la DB.
        await trabajo.save()

        // res successful
        res.status(200).json({
            status: true,
            message: 'Registro creado Satisfactoriamente'
        })

        // En caso de error, res json con el error.
    } catch (error){
        res.status(500).json({
            status: false,
            message: error.message
        })//res
    }//catch
}//crearTrabajo


//Funcion para actualizar un registro.
const ActualizarTrabajo = async(req, res) => {
    try {
        const registroAnterior = await Trabajo.findById(req.params.id)
        console.log(registroAnterior);

        if(req.files?.image) {
            // Busca en la BD el registro a actualizar.
            console.log('si hay imagen para borrar');
    
            // Con el resultado de la busqueda anterior, borra las imagenes en cloudinary.
            if(!registroAnterior) {
                // Si el registro no existe, termina el proceso. 
                return res.status(404).json({
                    status: false,
                    message: 'El Registro no Existe'
                })
            } else {
                await DeleteImage(registroAnterior.image.public_id)
                console.log('se borro la imagen');
            }
        }

        if(req.files?.factura) {
            // Busca en la BD el registro a actualizar.
            console.log('si hay factura para borrar');
    
            // Con el resultado de la busqueda anterior, borra las imagenes en cloudinary.
            if(!registroAnterior) {
                // Si el registro no existe, termina el proceso. 
                return res.status(404).json({
                    status: false,
                    message: 'El Registro no Existe'
                })
            } else {
                await DeleteImage(registroAnterior.factura.public_id)
                console.log('se borro la factura');
            }
        }

        // Desestructuracion de los parametros del req.body.
        const { nombre, descripcion, fecha } = req.body

        // Creacion de una instancia del modelo con los parametros.
        const trabajo = new Trabajo({ nombre, descripcion, fecha })

        // Carga la imagen del form.
        if(req.files?.image) {
            const result = await UploadImage(req.files.image.tempFilePath)

            console.log('si hay imagen para subir');

            trabajo.image = {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
            await fs.unlink(req.files.image.tempFilePath)
        } else {
            console.log('no se cambia la imagen');
            trabajo.image = {
                public_id: registroAnterior.image.public_id,
                secure_url: registroAnterior.image.secure_url
            }
        }

        // Carga la factura en PDF del form.
        if(req.files?.factura) {
            const result = await UploadImage(req.files.factura.tempFilePath)

            console.log('si hay factura para subir');

            trabajo.factura = {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
            await fs.unlink(req.files.factura.tempFilePath)
        } else {
            console.log('no se cambia la factura');
            trabajo.factura = {
                public_id: registroAnterior.factura.public_id,
                secure_url: registroAnterior.factura.secure_url
            }
        }

        console.log(trabajo)

        // Actualiza el registro mandandole un objeto con los datos.
        await Trabajo.findByIdAndUpdate(req.params.id, {
            nombre: trabajo.nombre,
            descripcion: trabajo.descripcion,
            fecha: trabajo.fecha,
            image: {
                public_id: trabajo.image.public_id,
                secure_url: trabajo.image.secure_url
            },
            factura: {
                public_id: trabajo.factura.public_id,
                secure_url: trabajo.factura.secure_url
            }
        })

        // res successful.
        res.status(200).json({
            status: true,
            message: 'Registro Actualizado Satisfactoriamente'
        })

        // En caso de error, res json con el error.
    } catch (error){
        res.status(500).json({
            status: false,
            message: error.message
        })//res
    }//catch
}//ActualizarTrabajo


//Funcion para borrar un registro.
const BorrarTrabajo = async(req, res) => {
    try {
        // Busca el registro por Id y lo elimina.
        const trabajo = await Trabajo.findByIdAndDelete(req.params.id)

        if(!trabajo) {
            return res.status(404).json({
                message: 'El Registro no Existe'
            })
        } else {
            await DeleteImage(trabajo.image.public_id)
            await DeleteImage(trabajo.factura.public_id)
            res.status(200).send({
                status: true,
                message: 'Registro eliminado Satisfactoriamente'
            })
        }

        // En caso de error, res json con el error.
    } catch (error){
        res.status(500).json({
            status: false,
            message: error.message
        })//res
    }//catch
}//BorrarTrabajo


module.exports = {
    ObtenerTrabajos,
    ObtenerUnTrabajo,
    CrearTrabajo,
    ActualizarTrabajo,
    BorrarTrabajo
}