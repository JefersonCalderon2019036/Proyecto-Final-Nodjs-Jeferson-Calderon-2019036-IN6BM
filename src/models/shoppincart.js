const mongooes = require("mongoose");
var Schema = mongooes.Schema;

var ShoppinCartSchema = Schema({
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuarios'},
    nombre: String,
    Productos: [{
        nombreproductos: String,
        cantidad: Number,
        valorunitario: Number,
        totaldelproducto: Number,
        adquiridor: {type: Schema.Types.ObjectId, ref: 'Usuarios'},
    }],
    Total: Number,
    cancelar: String
})

module.exports = mongooes.model("CarritoDeCompras", ShoppinCartSchema)