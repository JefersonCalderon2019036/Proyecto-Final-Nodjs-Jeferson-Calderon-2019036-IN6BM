const mongooes = require("mongoose");
var Schema = mongooes.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    email: String,
    password: String,
    rol: String
})

module.exports = mongooes.model("Usuarios", UsuarioSchema)