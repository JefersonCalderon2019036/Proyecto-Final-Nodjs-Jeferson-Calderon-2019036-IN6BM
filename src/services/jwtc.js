"use strict"

var jwt = require("jwt-simple");
var moment = require("moment");
require('dotenv').config();

var secret = process.env.token2;

exports.createToken = function (usuario){
    var playload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        iat: moment().unix(),
        exp: moment().day(10, "days").unix()
    }

    return jwt.encode(playload, secret);
}