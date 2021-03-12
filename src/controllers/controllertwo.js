"use strict"

//-----------------------------------Este Modelo tiene todas las funciones por defecto------------------
//-----------------------------------Este modelo tiene tosdas las funciones para crear------------------

//Importaciones
const Usuarios = require("../models/usermodel");
const Categoria = require("../models/categoriesmodel");
const Productos = require("../models/productsmodel");
const CarritoDeCompras = require("../models/shoppincart");

//esta es la funcion para verificar si hay productos en existencia
//esta funcion necesita los parametros de producto
function VerificacionProductosExistentes(req, res){
    var params = req.body;

    Productos.findOne({$or: [
        {nombre: params.producto}
    ]}).exec((err, ProductoEncontrado) => {
        if(err) return res.status(500).send({Advertencia: "A ocurrido un erro en su busqueda del producto"})
        if(ProductoEncontrado){
            if(ProductoEncontrado.cantidad <= 1){
                res.status(500).send({Mensaje: "Su producto no esta en existencia pro el momento"}) 
            }else{
                res.status(500).send({ProductoEncontrado}) 
            }
        }else{
            res.status(500).send({Mensaje: "Su producto no esta en venta por el momento"})
        }
    })
    
}

//esta es la funcion para la verificacion el historial de facturas canceladas
//esta es una funcion de administrador
function VerificaionFacturasCanceladas(req, res){
 CarritoDeCompras.find({$or: [
     {cancelar: "Cancelada"}
 ]}).exec((err, FacturasEncontradas) => {
     if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda de las facturas canceladas"})
    
     if(FacturasEncontradas && FacturasEncontradas.length >= 1){
        res.status(200).send({FacturasEncontradas})
     }else{
        res.status(200).send({Mensaje: "No se a encontrado facturas canceladas verificar la base de datos"})
     }
    })
}

// esta es la funcion para la verificacion de una factura por su id
// esta necesita como parametro el id exacto de la factura
// esta es una funcion para administrador
function VerificaionFacturasId(req, res){
    var params = req.body;
    CarritoDeCompras.find({$or: [
        {_id: params.factura}
    ]}).exec((err, FacturasEncontradas) => {
        if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda de las facturas canceladas"})
       
        if(FacturasEncontradas && FacturasEncontradas.length >= 1){
           res.status(200).send({FacturasEncontradas})
        }else{
           res.status(200).send({Mensaje: "No se a encontrado facturas canceladas verificar la base de datos"})
        }
       })
}

//esta es una funcion para administrador puede observar los datos de todos los usuarios
//de tipo cliente
function verificaciondatosusuarioTipoClientes(req, res){
    Usuarios.find({$or:[{rol: "Cliente"}]}).exec((err, Usuariosencontrados) => {
        if(err) return res.status(500).send({Mensaje: "A ocurrido un error en la verificaciond de datos de los usuarios"})
        if(Usuariosencontrados && Usuariosencontrados.length >= 1){
            res.status(200).send({Usuariosencontrados})
        }else{
            res.status(200).send({Mensaje: "No se a encontrado los usuairos tipo cliente verifique si tiene usuarios en la base de datos de tipo cliente"})
        }
    })
}

//esta es una funcion para administrado para que pueda observar las categorias de los productos
function verificacioncategorias(req,res){
    Categoria.find().exec((err, categoriaencontrada) => {
        if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la peticion de busqueda"})
        if(categoriaencontrada){
            res.status(200).send({categoriaencontrada})
        }else{
            res.status(200).send({Mensaje: "No se a encontrado categorias"})
        }
    })
}

//esta es una funcion para cliente para que pueda observar las facturas que a realizado
function verificaciondefacturascliente(req, res){
    CarritoDeCompras.find({$or: [
        {user: req.user.sub},
        {cancelar: "Cancelada"}
    ]}).exec((err, FacturasEncontradas) => {
        if(err) return res.status(500).send({Advertencia: "A ocurrido un erro en la peticion de busqueda"})
        
        if(FacturasEncontradas && FacturasEncontradas.length >= 1){
            res.status(200).send({FacturasEncontradas})
        }else{
            res.status(200).send({Mensaje: "No tienes facturas"})
        }
    })
}

//esta es una funcion para ver todo tipo de factura
//esta es una funcion para administradores
function todaslasfacturas(req, res){
    CarritoDeCompras.find().exec((err, FacturasEncontradas) => {
     if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda de las facturas"})
    
     if(FacturasEncontradas && FacturasEncontradas.length >= 1){
        res.status(200).send({FacturasEncontradas})
     }else{
        res.status(200).send({Mensaje: "No hay facturas revise la base de datos si existe facturas creadas"})
     }
    })
}

//esta es una funcion para administradores y clientes
//esta funcion le permite observar todo los productos sin importas su categoria
function todoslosproductos(req, res){
 Productos.find().exec((err, productosencontrados) => {
     if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la peticion de la busqueda de productos"})
    
     if(productosencontrados && productosencontrados.length >= 1){
        res.status(200).send({productosencontrados})
     }else{
        res.status(200).send({Mensaje: "No hay productos"})
     }
    })
}

//esta es una funcion para administradores y clientes
//esta funcion le permite observar todo los productos por su categoria
//necesita ingresar el nombre de la categoria para filtrar
function productosporcategoria(req, res){
    var params = req.body;
    Productos.find({$or:[
        {categoria: params.categoria}
    ]}).exec((err, productosencontrados) => {
        if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la peticion de la busqueda de productos"})
       
        if(productosencontrados && productosencontrados.length >= 1){
           res.status(200).send({productosencontrados})
        }else{
           res.status(200).send({Mensaje: "No hay productos"})
        }
       })
}

module.exports = { 
    VerificacionProductosExistentes,
    VerificaionFacturasCanceladas,
    VerificaionFacturasId,
    verificaciondatosusuarioTipoClientes,
    verificacioncategorias,
    verificaciondefacturascliente,
    todaslasfacturas,
    todoslosproductos,
    productosporcategoria
}