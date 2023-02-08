const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const colors = require('colors')
const { dbConection } = require('./src/Database/config')
require('dotenv').config() 

const app = express()

//Database
dbConection()

//Directorio publico
app.use(express.static('src/public'))

//ModdleWares
app.use(morgan('dev'))
//Cors
app.use(cors())
//lectura y parseo del body.
app.use(express.json({limit: '50mb'}))

//EndPionts
app.use('/gymkhana/auth', require('./src/routes/auth.routes'))
app.use('/gymkhana/crud', require('./src/routes/trabajos.routes'))

//CallBack para enviar un mensaje cuando inicie el servidor
app.listen(process.env.PORT, () => {
    console.log(colors.rainbow(`Servidor Corriendo En El Puerto: ${process.env.PORT}`))
})