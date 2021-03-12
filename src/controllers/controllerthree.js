"use strict"

//-----------------------------------Este Modelo tiene todas las funciones por defecto------------------
//-----------------------------------Este modelo tiene tosdas las funciones para crear------------------

//Importaciones
const Usuarios = require("../models/usermodel");
const Categoria = require("../models/categoriesmodel");
const Productos = require("../models/productsmodel");

//esta es una funcion para administrador
//solo puede eliminar usuario cliente con el id
function EliminarUsuarioCliente (req, res){
    var params = req.body;
    Usuarios.findOne({$or:[{_id: req.user.sub}]}).exec((err, UsuarioEncontrado) => {
        if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda del usuario"})
    
        if(UsuarioEncontrado){
            Usuarios.findOne({$or:[{_id: params.usuarioid}]
            }).exec((err, usuarioencontrado)=>{
                if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda del usuario"})
                
                if(usuarioencontrado){
                    if(usuarioencontrado.rol == "Cliente"){
                        Usuarios.findOneAndRemove({$or: [{_id: params.usuarioid}]
                        }).exec((err, UsuarioEliminado) => {
                            if(err) return res.status(500).send({Advertencia: "No se a podido eliminar el usuario"})
                            
                            if(UsuarioEliminado){
                                Usuarios.find({$or:[{rol: "Cliente"}]}).exec((err, Usuariosencontrados) => {
                                    if(err) return res.status(500).send({Mensaje: "A ocurrido un error en la verificaciond de datos de los usuarios"})
                                    if(Usuariosencontrados && Usuariosencontrados.length >= 1){
                                        res.status(200).send({Usuariosencontrados})
                                    }else{
                                        res.status(200).send({Mensaje: "No se a encontrado los usuairos tipo cliente verifique si tiene usuarios en la base de datos de tipo cliente"})
                                    }
                                })
                            }else{
                                res.status(500).send({Mensaje: "No se a podido eliminar"})
                            }
                            
                        })
                    }else{
                        res.status(500).send({Mensaje: "Este Usuario no es Cliente no puedes eliminarlo"})
                    }
                }else{
                    res.status(500).send({Mensaje: "No existe su usuario"})
                }
            })
        }else{
            res.status(500).send({Mensaje: "No existe su usuario"})
        }
    })
}

//esta es una funcion para administradores
//solo puede eliminar su propia cuenta
// necesita como parametro la confirmacion de que desea eliminar en este caso el parametro se llama eliminar
function EliminarCuentaAdministrador (req, res){
    var params = req.body;
   if(params.eliminar){
    if(params.eliminar == "true"){
        Usuarios.findOne({$or: [
            {_id: req.user.sub},
            {rol: "Administrador"}
        ]}).exec((err, UsuarioEncontrado) => {
            if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda del usuario"})

            if(UsuarioEncontrado){
                Usuarios.findByIdAndRemove({$or: [
                    {_id: req.user.sub}
                ]}).exec((err, UsuarioEliminado => {
                    if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la eliminacion"})
                    if(UsuarioEliminado){
                        res.status(500).send({Mensaje: "Usuario Eliminado, Que tenga un buen día"})  
                    }else{
                        res.status(500).send({Mensaje: "No se a podido eliminar"})   
                    }
                }))
            }else{
                res.status(500).send({Mensaje: "Su usuario no es Administrador no se puede eliminar su propio usuario"}) 
            }
        }) 
    }else{
        res.status(500).send({Mensaje: "No tiene una opción valida para la eliminacion, para eliminar utilice la palabra true"})
    }
   }else{
       res.status(500).send({Mensaje: "Rellene los datos necesarios para eliminar su usuario"})
   }
}

//esta es una funcion para administradores
//solo puede eliminar su propia cuenta
// necesita como parametro la confirmacion de que desea eliminar en este caso el parametro se llama eliminar
function EliminarCuentaCliente (req, res){
    var params = req.body;
   if(params.eliminar){
    if(params.eliminar == "true"){
        Usuarios.findOne({$or: [
            {_id: req.user.sub},
            {rol: "Cliente"}
        ]}).exec((err, UsuarioEncontrado) => {
            if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda del usuario"})

            if(UsuarioEncontrado){
                Usuarios.findByIdAndDelete({$or: [
                    {_id: req.user.sub}
                ]}).exec((err, UsuarioEliminado => {
                    if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la eliminacion"})
                    if(UsuarioEliminado){
                        res.status(500).send({Mensaje: "Usuario Eliminado, Que tenga un buen día"})  
                    }else{
                        res.status(500).send({Mensaje: "No se a podido eliminar"})   
                    }
                }))
            }else{
                res.status(500).send({Mensaje: "Su usuario no es Administrador no se puede eliminar su propio usuario"}) 
            }
        }) 
    }else{
        res.status(500).send({Mensaje: "No tiene una opción valida para la eliminacion, para eliminar utilice la palabra true"})
    }
   }else{
       res.status(500).send({Mensaje: "Rellene los datos necesarios para eliminar su usuario"})
   }
}
//esta es una funcion para administradores
//puede eliminar un producto por su id
//necesita como parametro principal el id del producto
//en este caso el ide se ingresa en el parametro producto
function EliminarProducto(req, res){
    var params = req.body;
    if(params.producto){
        Usuarios.findOne({$or: [{_id: req.user.sub }]}).exec((err, UsuarioEncontrado) => {
            if(err) return res.status(200).send({Advertencia: "A ocurrido un error en la busqueda del usuario"})
            
            if(UsuarioEncontrado.rol == "Administrador"){
                Productos.findOneAndRemove({$or: [{_id: params.producto}]}).exec((err, ProductoEliminador) => {
                    if(err) return res.status(200).send({Mensaje: "A ocurrido un error en la eliminación del producto"})
                    if(ProductoEliminador){
                        Productos.find().exec((err, productosencontrados) => {
                            if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la peticion de la busqueda de productos"})
                           
                            if(productosencontrados && productosencontrados.length >= 1){
                               res.status(200).send({productosencontrados})
                            }else{
                               res.status(200).send({Mensaje: "No hay productos"})
                            }
                           }) 
                    }else{
                        res.status(500).send({Mensaje: "No se a podido eliminar"})   
                    }
                })
            }else{
                res.status(200).send({Mensaje: "Lo sentimos no cuentas con rol administrador para realizar la eliminacion del producto"})
            }
        })
    }else{
        res.status(200).send({Mensaje: "Rellene los datos necesariso"})
    }
}

//esta es una funcion para administradores
//puede eliminar un categoria y todos los productos
//con esa categoria se derigiran a la categoria por defecto
function EliminarCategoria(req, res){
    var CategoriaModel = Categoria();
    var params = req.body;

    if(params.categoria){
        Usuarios.findOne({$or: [{_id: req.user.sub }]}).exec((err, UsuarioEncontrado) => {
            if(err) return res.status(200).send({Advertencia: "A ocurrido un error en la busqueda del usuario"})
            
            if(UsuarioEncontrado.rol == "Administrador"){
                Categoria.findOne({$or:{_id: params.categoria}}).exec((err, categoraencontrada) => {
                    if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda de la categoria"})
                    if(categoraencontrada){
                        Productos.find({$or:[{categoria: categoraencontrada.categoria}]}).exec((err, productosencontrados) => {
                            if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda de los productos"})
                            
                            if(productosencontrados && productosencontrados.length >= 1){

                                Categoria.findOne({$or:[{categoria: "default"}]}).exec((err, categoriaencontrada2) => {
                                    if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda de la categoria"})
                                    if(categoriaencontrada2){
                                        let contador = 1;
                                        for(let x=0; x > productosencontrados.length; x++){
                                            Productos.findOneAndReplace({$or:[{categoria: categoraencontrada.categoria}]}).exec((err, productoencontrado)=> {
                                                if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda del producto"})
                                                if(productoencontrado){
                                                    let contador = contador+x; 
                                                }else{
                                                    res.status(500).send({Mensaje: "no se pude editar el producto"})  
                                                }
                                            })        
                                        }
                                        if(contador >= 2){
                                            Productos.find().exec((err, productosencontrados) => {
                                                if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la peticion de la busqueda de productos"})
                                               
                                                if(productosencontrados && productosencontrados.length >= 1){
                                                   res.status(200).send({productosencontrados})
                                                }else{
                                                   res.status(200).send({Mensaje: "No hay productos"})
                                                }
                                               })
                                        }else{
                                            res.status(500).send({Mensaje: "No hay productos con esa categoria"}) 
                                        }
                                    }else{
                                        CategoriaModel.categoria = "default";
                                        CategoriaModel.descripcion = "categoria por defecto";
                                        CategoriaModel.save((err, cateogriaguardada) => {
                                            if(err) return res.status(500).send({Advertencia: "A ocurrido un error en guardar la categoria"})
                                            if(cateogriaguardada){
                                                let contador = 1;
                                                for(let x=0; x > productosencontrados.length; x++){
                                                    Productos.findByIdAndUpdate({$or:[{categoria: categoraencontrada.categoria}]}).exec((err, productoencontrado)=> {
                                                        if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda del producto"})
                                                        if(productoencontrado){
                                                            let contador = contador+x; 
                                                        }else{
                                                            res.status(500).send({Mensaje: "no se pude editar el producto"})  
                                                        }
                                                    })        
                                                }
                                                if(contador >= 2){
                                                    Productos.find().exec((err, productosencontrados) => {
                                                        if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la peticion de la busqueda de productos"})
                                                       
                                                        if(productosencontrados && productosencontrados.length >= 1){
                                                           res.status(200).send({productosencontrados})
                                                        }else{
                                                           res.status(200).send({Mensaje: "No hay productos"})
                                                        }
                                                       })
                                                }else{
                                                    res.status(500).send({Mensaje: "No hay productos con esa categoria"}) 
                                                }
                                            }else{
                                                res.status(500).send({Mensaje: "la categoria no se a podido guardar"})   
                                            }
                                        })
                                    }
                                })
                            }else{
                                res.status(500).send({Mensaje: "No existe productos con esa categoria"}) 
                            }
                        })
                    }else{
                        res.status(500).send({Mensaje: "La categoria no existe"}) 
                    }
                })
            }else{
                res.status(500).send({Mensaje: "No puedes eliminar la categoria ya que no eres Administrador"}) 
            }
        })
    }else{
        res.status(500).send({Mensaje: "Rellene los datos necesarios"})
    }
}

module.exports = { 
    EliminarUsuarioCliente,
    EliminarCuentaAdministrador,
    EliminarCategoria,
    EliminarProducto,
    EliminarCuentaCliente
}