"usre strict"

var jwt = require("jwt-simple");
var moment = require("moment")
require('dotenv').config();

var secret = process.env.token2;

exports.ensureAuth = function (req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send({mensaje: "La peticion no tiene la cabezera de autorizacion"})
    }

    var token = req.headers.authorization.replace(/[""]+/g, "")

    try{
        var playload = jwt.decode(token, secret);

        if(playload.exp <= moment().unix()){
            return res.status(401).send({
                mensaje: "El token ha expirado"
            });
        }
        }catch (error){
            return res.status(404).send({
                mensaje: "El token no es valido"
            });
        }
    req.user = playload;
    next();
} 