const mongooes = require("mongoose");
var Schema = mongooes.Schema;

var RolSchema = Schema({
    rol: String,
})

module.exports = mongooes.model("RolUsuario", RolSchema)