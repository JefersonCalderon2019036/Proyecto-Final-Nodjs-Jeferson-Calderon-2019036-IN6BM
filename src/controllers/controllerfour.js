"use strict"

//-----------------------------------Este Modelo tiene todas las funciones por defecto------------------
//-----------------------------------Este modelo tiene tosdas las funciones para crear------------------

//Importaciones
const bcrypt = require("bcrypt-nodejs");
const RolUsuario = require("../models/rolmodel");
const Usuarios = require("../models/usermodel");
const Categoria = require("../models/categoriesmodel");
const Productos = require("../models/productsmodel");

//esta es una funcion para administradores puedes editar la informacion
//de un usuario cliente con el parametro principal del id
//puedes editar la informacion con los parametro
//password, nombre, email, rol
function EditarUsuarioClienteAdministrador(req, res){
    var params = req.body;
    if(params.id){
        Usuarios.findOne({$or:[{_id: req.user.sub}]}).exec((err, usuarioencontrado) => {
            if(err) return res.status(500).send({Adevertencia: "A ocurrido un error en la peticion de busqueda del usuario"})
            if(usuarioencontrado){
                if(usuarioencontrado.rol == "Administrador"){
                    if(params.password){
                        RolUsuario.findOne({$or:[{rol: params.rol}]}).exec((err, rolEncontrado) => {
                            if(err) return res.status(500).send({Adevertencia: "A ocurrido un error en la peticion de la busqueda del rol"})
                            
                            if(rolEncontrado){
                                bcrypt.hash(params.password, null, null, (err, passencriptada) => {
                                    if(err) return res.status(500).send({Adevertencia: "A ocurrido un erro en la peticion de encriptado"})
                                    if(passencriptada){
                                        Usuarios.findOneAndUpdate({_id: params.id},{nombre: params.nombre,
                                            email: params.email,
                                            rol: params.rol,
                                            password: passencriptada}).exec((err, usuarioreditado) => {
                                                if(err) return res.status(500).send({Adevertencia: "A ocurrido un erro en la peticion de edicion"}) 
                                                if(usuarioreditado){
                                                    Usuarios.findOne({$or:[{_id: params.id}]}).exec((err, Usuariosencontrados) => {
                                                        if(err) return res.status(500).send({Mensaje: "A ocurrido un error en la verificaciond de datos de los usuarios"})
                                                        if(Usuariosencontrados){
                                                            res.status(200).send({Usuariosencontrados})
                                                        }else{
                                                            res.status(200).send({Mensaje: "No se a podido encontrar el perfil del usuario"})
                                                        }
                                                    })
                                                }else{
                                                    res.status(200).send({Mensaje: "No se pudo editar el usuario"})
                                                }
                                            })
                                    }else{
                                        res.status(200).send({Mensaje: "No se puedo encriptar su contraseña"})   
                                    }
                                })
                            }else{
                                res.status(200).send({Mensaje: "El rol no existe"})
                            }
                        })
                    }else{
                        RolUsuario.findOne({$or:[{rol: params.rol}]}).exec((err, rolEncontrado) => {
                            if(err) return res.status(500).send({Adevertencia: "A ocurrido un error en la peticion de la busqueda del rol"})
                            
                            if(rolEncontrado){
                                Usuarios.findOneAndUpdate({_id: params.id},{nombre: params.nombre,
                                    email: params.email,
                                    rol: params.rol}).exec((err, usuarioreditado) => {
                                        if(err) return res.status(500).send({Adevertencia: "A ocurrido un erro en la peticion de edicion"}) 
                                        if(usuarioreditado){
                                            res.status(200).send({usuarioreditado})
                                        }else{
                                            res.status(200).send({Mensaje: "No se pudo editar el usuario"})
                                        }
                                    })        
                            }else{
                                res.status(200).send({Mensaje: "El rol no existe"})
                            }
                        })
                    }
                }else{
                    res.status(200).send({Mensaje: "No puedes realizar cambios ya que no eres administrador"})  
                }
            }else{
                res.status(200).send({Mensaje: "No se encontro tu usuario"})  
            }
        })
    }else{
        res.status(200).send({Mensaje: "Rellene los datos necesarios para editar el perfil"})
    }
}

//esta es una funcion para clientes para que puedan editar su perfil
//este no puede cambiar de rol cliente a administrador
//solo cambiar nombre, correo y contraseña
function EditarPerfilCliente(req, res){
    var params = req.body;
    var id = req.user.sub;

    if(params.password){
        bcrypt.hash(params.password, null, null, (err, passencriptada) => {
            if(err) return res.status(500).send({Adevertencia: "A ocurrido un erro en la peticion de encriptado"})
            if(passencriptada){
                Usuarios.findOneAndUpdate({_id:id},{nombre: params.nombre,
                    email: params.email, password: passencriptada}).exec((err, usuarioreditado) => {
                        if(err) return res.status(500).send({Adevertencia: "A ocurrido un erro en la peticion de edicion"}) 
                        if(usuarioreditado){
                            Usuarios.findOne({$or:[{_id: id}]}).exec((err, Usuariosencontrados) => {
                                if(err) return res.status(500).send({Mensaje: "A ocurrido un error en la verificaciond de datos de los usuarios"})
                                if(Usuariosencontrados){
                                    res.status(200).send({Usuariosencontrados})
                                }else{
                                    res.status(200).send({Mensaje: "No se a podido encontrar el perfil del usuario"})
                                }
                            })
                        }else{
                            res.status(200).send({Mensaje: "No se pudo editar el usuario"})
                        }
                    })
            }else{
                res.status(200).send({Mensaje: "Error en la encriptacion de la contraseña"})
            }
        })
    }else{
        Usuarios.findOneAndUpdate({_id:id},{nombre: params.nombre,
            email: params.email}).exec((err, usuarioreditado) => {
                if(err) return res.status(500).send({Adevertencia: "A ocurrido un erro en la peticion de edicion"}) 
                if(usuarioreditado){
                    Usuarios.findOne({$or:[{_id: id}]}).exec((err, Usuariosencontrados) => {
                        if(err) return res.status(500).send({Mensaje: "A ocurrido un error en la verificaciond de datos de los usuarios"})
                        if(Usuariosencontrados){
                            res.status(200).send({Usuariosencontrados})
                        }else{
                            res.status(200).send({Mensaje: "No se a podido encontrar el perfil del usuario"})
                        }
                    })
                }else{
                    res.status(200).send({Mensaje: "No se pudo editar el usuario"})
                }
            })
    }
}

//esta es una funcion para administradores para que puedan editar su perfil
//solo cambia el nombre, correo, contraseña y el rol
function EditarPerfilAdministrador(req, res){
    var params = req.body;
    var id = req.user.sub;

    if(params.password){
        RolUsuario.findOne({$or:[{rol: params.rol}]}).exec((err, rolEncontrado) => {
            if(err) return res.status(500).send({Adevertencia: "A ocurrido un error en la peticion de la busqueda del rol"})
            
            if(rolEncontrado){
                bcrypt.hash(params.password, null, null, (err, passencriptada) => {
                    if(err) return res.status(500).send({Adevertencia: "A ocurrido un erro en la peticion de encriptado"})
                    if(passencriptada){
                        Usuarios.findOneAndUpdate({_id:id},{nombre: params.nombre,
                            email: params.email,rol: params.rol, password: passencriptada}).exec((err, usuarioreditado) => {
                                if(err) return res.status(500).send({Adevertencia: "A ocurrido un erro en la peticion de edicion"}) 
                                if(usuarioreditado){
                                    Usuarios.findOne({$or:[{_id: id}]}).exec((err, Usuariosencontrados) => {
                                        if(err) return res.status(500).send({Mensaje: "A ocurrido un error en la verificaciond de datos de los usuarios"})
                                        if(Usuariosencontrados){
                                            res.status(200).send({Usuariosencontrados})
                                        }else{
                                            res.status(200).send({Mensaje: "No se a podido encontrar el perfil del usuario"})
                                        }
                                    })
                                }else{
                                    res.status(200).send({Mensaje: "No se pudo editar el usuario"})
                                }
                            })
                    }else{
                        res.status(200).send({Mensaje: "Error en la encriptacion de la contraseña"})
                    }
                })
            }else{
                res.status(200).send({Mensaje: "El rol no existe"})
            }
        })
    }else{
        RolUsuario.findOne({$or:[{rol: params.rol}]}).exec((err, rolEncontrado) => {
            if(err) return res.status(500).send({Adevertencia: "A ocurrido un error en la peticion de la busqueda del rol"})
            
            if(rolEncontrado){
                Usuarios.findOneAndUpdate({_id:id},{nombre: params.nombre,
                    email: params.email,rol: params.rol}).exec((err, usuarioreditado) => {
                        if(err) return res.status(500).send({Adevertencia: "A ocurrido un erro en la peticion de edicion"}) 
                        if(usuarioreditado){
                            Usuarios.findOne({$or:[{_id: id}]}).exec((err, Usuariosencontrados) => {
                                if(err) return res.status(500).send({Mensaje: "A ocurrido un error en la verificaciond de datos de los usuarios"})
                                if(Usuariosencontrados){
                                    res.status(200).send({Usuariosencontrados})
                                }else{
                                    res.status(200).send({Mensaje: "No se a podido encontrar el perfil del usuario"})
                                }
                            })
                        }else{
                            res.status(200).send({Mensaje: "No se pudo editar el usuario"})
                        }
                    })
            }else{
                res.status(200).send({Mensaje: "El rol no existe"})
            }
        })
    }
}


//esta es una funcion para administradores para que pueda realizar cambios en los productos
//solo cambia el nombre, el precio y la cantidad
function EditarProducto(req, res){
    var params = req.body;
    var id = req.user.sub;
    Usuarios.findOne({$or:[{_id: id}]}).exec((err, usuarioencontrado) => {
        if(err) return res.status(500).send({Adevertencia: "A ocurrido un error en la peticion"})
        if(usuarioencontrado && usuarioencontrado.rol == "Administrador"){
            Productos.findOneAndUpdate({_id: params.id},{nombre: params.producto,descripcion: params.descripcion,
                                        cantidad: params.cantidad, precio: params.precio}).exec((err, ProductoEditado) => {
                                            if(err) return res.status(500).send({Adevertencia: "A ocurrido un error en la peticion"})
                                            if(ProductoEditado){
                                                Productos.findOne({$or:[{_id: params.id}]}).exec((err, productosencontrados) => {
                                                    if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la peticion de la busqueda de productos"})
                                                   
                                                    if(productosencontrados){
                                                       res.status(200).send({productosencontrados})
                                                    }else{
                                                       res.status(200).send({Mensaje: "No hay productos"})
                                                    }
                                                   })
                                            }else{
                                                res.status(200).send({Mensaje: "No se a podido editar el producto"})
                                            }
                                        })
        }else{
            res.status(200).send({Mensaje: "Lo sentimos ya que no eres administrador no puedes editar la informacion de los productos"})
        }
    })
}

module.exports = { 
    EditarUsuarioClienteAdministrador,
    EditarPerfilCliente,
    EditarPerfilAdministrador,
    EditarProducto
}