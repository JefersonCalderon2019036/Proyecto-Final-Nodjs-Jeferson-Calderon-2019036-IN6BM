const mongooes = require("mongoose");
var Schema = mongooes.Schema;

var CategoriaSchema = Schema({
    categoria: String,
    descripcion: String
})

module.exports = mongooes.model("Categoria", CategoriaSchema)