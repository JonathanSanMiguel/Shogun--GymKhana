const jwt = require('jsonwebtoken')

const generarJWT = (uid, email, nombre, apellido) => {

    const playload = {uid, email, nombre, apellido}

    return new Promise((resolve, reject) => {
        jwt.sign(playload, process.env.SECRET_JWT_SEED, {
            expiresIn: '48h'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject()
            }else{
                resolve(token)
            }
        })
    })//Promise
}//generarJWT

module.exports = {
    generarJWT
}