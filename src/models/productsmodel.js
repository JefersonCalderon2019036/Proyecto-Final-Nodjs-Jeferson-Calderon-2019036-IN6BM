const mongooes = require("mongoose");
var Schema = mongooes.Schema;

var ProductosSchema = Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    categoria: String,
    cantidad: Number
    
})

module.exports = mongooes.model("Productos", ProductosSchema)