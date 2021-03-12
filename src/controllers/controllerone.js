"use strict"

//-----------------------------------Este Modelo tiene todas las funciones por defecto------------------
//-----------------------------------Este modelo tiene tosdas las funciones para crear------------------

//Importaciones
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const jwt2 = require("../services/jwtc");
const RolUsuario = require("../models/rolmodel");
const Usuarios = require("../models/usermodel");
const Categoria = require("../models/categoriesmodel");
const Productos = require("../models/productsmodel");
const CarritoDeCompras = require("../models/shoppincart");

// esta funcion es para crear el rol administrador por decto tiene que ejecutarse de primero
//esta funcion no necesita parametros para realizar su funcion
//esta es la funcion para crear el usuario maestro no se necesita paramentro para enviar la peticion
//la tiene que crear para crear nuevos usuarios con un rol asignado opor el
//esta funcion no es utilizada para registrar usuarios con el rol de cliente por defecto
function UsuarioMaestro(req,res){
    var RolModelo = RolUsuario();
    var UsuariosModelo = Usuarios();

    RolUsuario.find({$or: [
        {rol: "Administrador"}
    ]}).exec((err, RolEncontrado) => {
        if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda"})
        if(RolEncontrado && RolEncontrado.length >= 1){
            Usuarios.find({or: [
                {email: "Admin"}
            ]}).exec((err, UsuarioEncontrado) => {
                if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda de los usuarios"})
                
                if(UsuarioEncontrado && UsuarioEncontrado.length >= 1){
                    res.status(500).send({Mensaje: "El Usuario ya existe"});
                }else{
                    RolUsuario.findOne({$or: [
                        {rol: "Administrador"}
                    ]}).exec((err, RolEncontrado) => {
                        if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busquqe de los roles"})
                        
                        if(RolEncontrado){
                            bcrypt.hash("123456", null, null, (err, passencriptada) => {
                                UsuariosModelo.nombre = "Usuario Maestro";
                                UsuariosModelo.email = "Admin";
                                UsuariosModelo.password = passencriptada;
                                UsuariosModelo.rol = RolEncontrado.rol;
        
                                UsuariosModelo.save((err, UsuarioGuardado) => {
                                    if(err) return res.status(500).send({Advertencia: "A ocurrido un erro al guardar el usuario"})
                                    if(UsuarioGuardado) return res.status(200).send({UsuarioGuardado})
                                })
                            })
                        }else{
                            res.status(500).send({Mensaje: "El rol no existe"})
                        }
                    })
                }
            })
        }else{
            RolModelo.rol = "Administrador";
            RolModelo.save((err, RolGuardado) => {
                if(err) return res.status(200).send({Advertencia: "A ocurrido un erro en Guardar el Rol"})
                if(RolGuardado){
                    Usuarios.find({or: [
                        {email: "Admin"}
                    ]}).exec((err, UsuarioEncontrado) => {
                        if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda de los usuarios"})
                        
                        if(UsuarioEncontrado && UsuarioEncontrado.length >= 1){
                            res.status(500).send({Mensaje: "El Usuario ya existe"});
                        }else{
                            RolUsuario.findOne({$or: [
                                {rol: "Administrador"}
                            ]}).exec((err, RolEncontrado) => {
                                if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busquqe de los roles"})
                                
                                if(RolEncontrado){
                                    bcrypt.hash("123456", null, null, (err, passencriptada) => {
                                        UsuariosModelo.nombre = "Usuario Maestro";
                                        UsuariosModelo.email = "Admin";
                                        UsuariosModelo.password = passencriptada;
                                        UsuariosModelo.rol = RolEncontrado.rol;
                
                                        UsuariosModelo.save((err, UsuarioGuardado) => {
                                            if(err) return res.status(500).send({Advertencia: "A ocurrido un erro al guardar el usuario"})
                                            if(UsuarioGuardado) return res.status(200).send({UsuarioGuardado})
                                        })
                                    })
                                }else{
                                    res.status(500).send({Mensaje: "El rol no existe"})
                                }
                            })
                        }
                    })
                }else{
                    res.status(500).send({Mensaje: "No se apodido crear elRol"})
                }
            })
        }
    })
}

//esta es la funcion de login para los usuarios crea token para cada uno de forma automatica
//necesita como parametro el email y password
function Login(req,res){
    var params = req.body;

    if(params.email && params.password){
        Usuarios.findOne({$or:[
            {email: params.email}
        ]}).exec((err, UsuarioEncontrado) => {
            if(err) return res.status(500).send({Advertencia: "A ocurrido un erro en la peticion de busqueda"})

            if(UsuarioEncontrado){
                bcrypt.compare(params.password, UsuarioEncontrado.password, (err, passCorrecta) => {
                    if(passCorrecta){
                        if(UsuarioEncontrado.rol == "Administrador"){

                            CarritoDeCompras.find({$or: [{usuario: UsuarioEncontrado._id},{cancelar: "Canceladas"}]}).exec((err, FacturasEncontradas) => {
                                if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda de las facturas"})
                               
                                if(FacturasEncontradas && FacturasEncontradas.length >= 1){
                                    res.status(200).send({Bienvenida: `Bienvenid@ ${UsuarioEncontrado.nombre}`,
                                    Rol: `El rol que esta trabajando es: ${UsuarioEncontrado.rol}`,
                                    Advertencia: 'Ten cuidado con lo que realizas ya que cuentas con funciones de administrador puedes hacer cambios en la base de datos irreversible',
                                    token: jwt.createToken(UsuarioEncontrado),
                                   Compras_Canceladas: FacturasEncontradas})
                                }else{
                                   res.status(200).send({Bienvenida: `Bienvenid@ ${UsuarioEncontrado.nombre}`,
                                   Rol: `El rol que esta trabajando es: ${UsuarioEncontrado.rol}`,
                                   Advertencia: 'Ten cuidado con lo que realizas ya que cuentas con funciones de administrador puedes hacer cambios en la base de datos irreversible',
                                   token: jwt.createToken(UsuarioEncontrado),Mensaje: "No hay facturas revise la base de datos si existe facturas creadas"})
                                }
                               })
                        }else{
                            CarritoDeCompras.find({$or: [{usuario: UsuarioEncontrado._id},{cancelar: "Cancelada"}]}).exec((err, FacturasEncontradas) => {
                                if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda de las facturas"})
                               
                                if(FacturasEncontradas && FacturasEncontradas.length >= 1){
                                    res.status(200).send({Bienvenida: `Bienvenid@ ${UsuarioEncontrado.nombre}`,
                                    Rol: `El rol que esta trabajando es: ${UsuarioEncontrado.rol}`,
                                    Advertencia: 'Ten cuidado con lo que realizas ya que cuentas con funciones de administrador puedes hacer cambios en la base de datos irreversible',
                                    token: jwt.createToken(UsuarioEncontrado),
                                   Compras_Canceladas: FacturasEncontradas})
                                }else{
                                   res.status(200).send({Bienvenida: `Bienvenid@ ${UsuarioEncontrado.nombre}`,
                                   Rol: `El rol que esta trabajando es: ${UsuarioEncontrado.rol}`,
                                   Advertencia: 'Ten cuidado con lo que realizas ya que cuentas con funciones de administrador puedes hacer cambios en la base de datos irreversible',
                                   token: jwt.createToken(UsuarioEncontrado),
                                   Mensaje: "Tiene facturas canceladas"})
                                }
                               })
                        }
                    }else{
                        res.status(500).send({Mensaje: "La contraseña es incorrecta"})
                    }
                })
            }else{
                res.status(500).send({Mensaje: "No existe usuario"})
            }
        })
    }else{
        res.status(500).send({Advertencia: "Rellene los datos necesarios para Iniciar Sección"})
    }
}

//esta es una funcion para administradores solo los administradores pueden crear usuarios
// tiene que llevar los parametros: nombre, rol, email y contraseña
function AgregarUsuarios(req, res){
    var UsuariosModelo = Usuarios();
    var RolModelo = RolUsuario();
    var params = req.body;

    if(params.nombre && params.email && params.password && params.rol){
        Usuarios.findOne({$or: [
            {email: params.email}
        ]}).exec((err, UsuarioEncontrado) => {
            if(err) return res.status(500).send({Advertencia: 'A ocurrido un error en la peticion de busqueda de usuarios ya existentes'})
            
            if(UsuarioEncontrado){
                res.status(500).send({Mensaje: 'Ya existe un usuario con ese email'})
            }else{
                RolUsuario.findOne({$or: [
                    {rol: params.rol}
                ]}).exec((err, RolUsuarioEncontrado) => {
                    if(err) return res.status(500).send({Advertencia: 'A ocurrido un error en la peticion de busqueda en rol'})
                    
                    if(RolUsuarioEncontrado){
                        bcrypt.hash(params.password, null, null, (err, passencriptada) => {
                            UsuariosModelo.nombre = params.nombre;
                            UsuariosModelo.email = params.email;
                            UsuariosModelo.password = passencriptada;
                            UsuariosModelo.rol = params.rol;

                            UsuariosModelo.save((err, UsuarioGuardado) => {
                                if(err) return res.status(500).send({Advertencia: 'A ocurrido un error en la petición de Guardar el usuario'})
                                
                                if(UsuarioGuardado){
                                    res.status(500).send({UsuarioGuardado}) 
                                }else{
                                    res.status(500).send({Mensaje: "No se apodido Guardar su Usuario"}) 
                                }
                            })
                        })
                    }else{
                        RolModelo.rol = "Cliente";
                        RolModelo.save((err, RolGuardado) => {
                            if(err) return res.status(200).send({Advertencia: "A ocurrido un erro en Guardar el Rol"})
                            if(RolGuardado){
                                RolUsuario.findOne({$or: [
                                    {rol: params.rol}
                                ]}).exec((err, RolEncontrado) => {
                                    if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda"})
                                    
                                    if(RolEncontrado){
                                        bcrypt.hash(params.password, null, null, (err, passencriptada) => {
                                            UsuariosModelo.nombre = params.nombre;
                                            UsuariosModelo.email = params.email;
                                            UsuariosModelo.password = passencriptada;
                                            UsuariosModelo.rol = params.rol;
                
                                            UsuariosModelo.save((err, UsuarioGuardado) => {
                                                if(err) return res.status(500).send({Advertencia: 'A ocurrido un error en la petición de Guardar el usuario'})
                                                
                                                if(UsuarioGuardado){
                                                    res.status(500).send({UsuarioGuardado}) 
                                                }else{
                                                    res.status(500).send({Mensaje: "No se apodido Guardar su Usuario"}) 
                                                }
                                            })
                                        })
                                    }else{
                                        res.status(500).send({Mensaje: "No existe ese rol, utilice: Administrador o Cliente"})
                                    }
                                })
                            }else{
                                res.status(200).send({Mensaje: "A ocurrido un error en la creacion del Rol Cliente"})
                            }
                        })
                    }
                })
            }
        })  
    }else{
        res.status(200).send({Mensaje: "Rellene todos los datos para ingresar el nuevo usuario"})
    }
}

//esta es la funcion para crear categorias
// tiene que llenar los paramentros: categoria y descripcion
function AgregarCategorias(req, res){
    var CategoriaModelo = Categoria();
    var params = req.body;

    if(params.categoria){
        Categoria.find({$or:[
            {categoria: params.categoria}
        ]}).exec((err, categoriaencontrada) => {
            if(err) return res.status(500).send({Mensaje: "A ocurrido un erro en la busqueda de la categoria"})
            
            if(categoriaencontrada && categoriaencontrada.length >= 1){
                res.status(200).send({Mensaje: "Categoria ya existe"})
            }else{
                CategoriaModelo.categoria = params.categoria;
                CategoriaModelo.descripcion = params.descripcion;

                CategoriaModelo.save((err, categoriaGuardada) => {
                    if(err) return res.status(200).send({Advertencia: "A ocurrido un erro en Guardar la categoria"})
                    if(categoriaGuardada){
                        res.status(200).send({categoriaGuardada})
                    }else{
                        res.status(200).send({Mensaje: "No se a podido Guardar su usuario"})
                    }
                })
            }
        })
    }else{
        res.status(500).send({Mensaje: "Rellene los datos necesarios"})
    }
}

//esta es la funcion para crear productos
//tiene que llenar los parametros: nombre, descripcion precio y categoria
//para esta funcion tambien se aplico que si categoria no entraba en las que existia 
//se le asignaria la categoria por defecto creada por la funcion categoria maestra
function AgregarProductos(req, res){
    var ProductosModelo = Productos();
    var params = req.body;
    if(params.nombre && params.categoria && params.precio && params.cantidad){
        Productos.find({$or:[
            {nombre: params.nombre}
        ]}).exec((err, ProductoEncontrado) => {
            if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda de los productos"})
            if(ProductoEncontrado && ProductoEncontrado.length >= 1){
                res.status(500).send({Mensaje: "El producto ya existe"})
            }else{
                Categoria.find({$or: [
                    {categoria: params.categoria}
                ]}).exec((err, categoriaencontrada) => {
                    if(err) return res.status(500).send({Mensaje: "A ocurrido un error en la busqueda de las categorias"})
                    
                    if(categoriaencontrada && categoriaencontrada.length >= 1){
                        ProductosModelo.nombre = params.nombre;
                        ProductosModelo.descripcion = params.descripcion;
                        ProductosModelo.categoria = params.categoria;
                        ProductosModelo.precio = params.precio
                        ProductosModelo.cantidad = params.cantidad;

                        ProductosModelo.save((err, ProductoGuardado) => {
                            if(err) return res.status(500).send({Advertencia: "A ocurrido un error en Guardar el producto"})
                            
                            if(ProductoGuardado){
                                res.status(200).send({ProductoGuardado})
                            }else{
                                res.status(200).send({Mensaje: "No se a podido Guardar su usuario"})
                            }
                        })
                    }else{
                        ProductosModelo.nombre = params.nombre;
                        ProductosModelo.descripcion = params.descripcion;
                        ProductosModelo.categoria = "default";
                        ProductosModelo.precio = params.precio
                        ProductosModelo.cantidad = params.cantidad;

                        ProductosModelo.save((err, ProductoGuardado) => {
                            if(err) return res.status(500).send({Advertencia: "A ocurrido un error en Guardar el producto"})
                            
                            if(ProductoGuardado){
                                res.status(200).send({Advertencia: "Ya que no existe la categoria de este producto se a aguardado en la categoria por defecto",ProductoGuardado})
                            }else{
                                res.status(200).send({Mensaje: "No se a podido Guardar su usuario"})
                            }
                        })
                    }
                })
            }
        })
    }else{
        res.status(500).send({Mensaje: "Rellene los datos necesarios"})
    }
}

//esta es la funcion para registrar nuevos usuarios
//si que un administrador lo cre
//esta funcion solo crea usuarios de rol cliente
//tiene que llevar los parametros: nombre,email y contraseña
function RegistrarCliente(req, res){
    var UsuariosModelo = Usuarios();
    var RolModelo = RolUsuario();
    var params = req.body;

    if(params.nombre && params.email && params.password){
    
    RolUsuario.find({$or: [
        {rol: "Cliente"}
    ]}).exec((err, RolEncontrado) => {
        if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la busqueda"})
        if(RolEncontrado && RolEncontrado.length >= 1){
            Usuarios.findOne({$or: [
                {email: params.email}
            ]}).exec((err, UsuarioEncontrado) => {
                if(err) return res.status(500).send({Advertencia: 'A ocurrido un error en la peticion de busqueda de usuarios ya existentes'})
                if(UsuarioEncontrado){
                    res.status(500).send({Mensaje: 'Ya existe un usuario con ese email'})
                }else{
                    bcrypt.hash(params.password, null, null, (err, passencriptada) => {
                        UsuariosModelo.nombre = params.nombre;
                        UsuariosModelo.email = params.email;
                        UsuariosModelo.password = passencriptada;
                        UsuariosModelo.rol = "Cliente";
                        UsuariosModelo.save((err, UsuarioGuardado) => {
                            if(err) return res.status(500).send({Advertencia: "A ocurrido un erro en la peticion de guardar usuario"})
                            if(UsuarioGuardado){
                                res.status(200).send({UsuarioGuardado})
                            }else{
                                res.status(200).send({Mensaje: "No se a podido Guardar su usuario"})
                            }
                        })
                    })
                }
            }) 
        }else{
            RolModelo.rol = "Cliente";
            RolModelo.save((err, RolGuardado) => {
                if(err) return res.status(200).send({Advertencia: "A ocurrido un erro en Guardar el Rol"})
                if(RolGuardado){
                    Usuarios.findOne({$or: [
                        {email: params.email}
                    ]}).exec((err, UsuarioEncontrado) => {
                        if(err) return res.status(500).send({Advertencia: 'A ocurrido un error en la peticion de busqueda de usuarios ya existentes'})
                        if(UsuarioEncontrado){
                            res.status(500).send({Mensaje: 'Ya existe un usuario con ese email'})
                        }else{
                            bcrypt.hash(params.password, null, null, (err, passencriptada) => {
                                UsuariosModelo.nombre = params.nombre;
                                UsuariosModelo.email = params.email;
                                UsuariosModelo.password = passencriptada;
                                UsuariosModelo.rol = "Cliente";
                                UsuariosModelo.save((err, UsuarioGuardado) => {
                                    if(err) return res.status(500).send({Advertencia: "A ocurrido un erro en la peticion de guardar usuario"})
                                    if(UsuarioGuardado){
                                        res.status(200).send({UsuarioGuardado})
                                    }else{
                                        res.status(200).send({Mensaje: "No se a podido Guardar su usuario"})
                                    }
                                })
                            })
                        }
                    }) 
                }else{
                    res.status(200).send({Mensaje: "A ocurrido un error en la creacion del Rol Cliente"})
                }
            })
        }
    })
    }else{
        res.status(200).send({Mensaje: "Rellene todos los datos para ingresar el nuevo usuario"})
    }
}

//este es el carrito de compras que llevara el control de los productos adquiridos
//este utiliza los parametro para calcular el valor de su producto con el nombre
//este utilizar el parametro de cantidad para calcular el valor en total de su producto
function carritodecompras(req, res){
    var CarritoDeComprasModel = CarritoDeCompras();
    var params = req.body;

    Productos.findOne({$or: [
        {nombre: params.producto}
    ]}).exec((err, ProductoEncontrado) => {
        if(err) return res.status(500).send({Advertencia: "A ocurrido un error en su busqueda del producto"})
        
        if(ProductoEncontrado){
            CarritoDeCompras.findOne({$or: [
                {usuario: req.user.sub},
                {cancelar: "pendiente"}
            ]}).exec((err, CarritoEncontrado) => {
                if(err) return res.status(500).send({Advertencia: "A ocurrido un erro en la busqueda de la carretilla"})

                if(CarritoEncontrado){
                  
                    CarritoDeCompras.findByIdAndUpdate(CarritoEncontrado._id, { $push: 
                        {Productos: {nombreproductos: ProductoEncontrado.nombre,
                            cantidad: params.cantidad,
                            valorunitario: ProductoEncontrado.precio,
                            totaldelproducto: params.cantidad * ProductoEncontrado.precio,
                            adquiridor: req.user.sub}}}, {new: true},
                             (err, compraguardada) => {
                                if(err) return res.status(500).send({Advertencia: "A ocurrido un error en guardar la compra"})
                                if(compraguardada){
                                    res.status(200).send({compraguardada})
                                }else{
                                    res.status(200).send({Mensaje: "No se a podido Guardar la compra"})
                                }  
                            })

                }else{
                    
                    CarritoDeComprasModel.usuario = req.user.sub;
                    CarritoDeComprasModel.Productos = {
                        nombreproductos: ProductoEncontrado.nombre,
                        cantidad: params.cantidad,
                        valorunitario: ProductoEncontrado.precio,
                        totaldelproducto: params.cantidad * ProductoEncontrado.precio,
                        adquiridor: req.user.sub
                    }
                    CarritoDeComprasModel.cancelar = "pendiente";
                    CarritoDeComprasModel.save((err, compraguardada) => {
                        if(err) return res.status(500).send({Advertencia: "A ocurrido un error en guardar la compra"})
                        if(compraguardada){
                            res.status(200).send({compraguardada})
                        }else{
                            res.status(200).send({Mensaje: "No se a podido Guardar la compra"})
                        }
                    })
                    
                }
            })
        }else{
            res.status(500).send({Mensaje: "Su producto no esta en vento pro el momento"})
        }
    })
    
}

// esta funcion aguardara la informacion de la compra 
// despues que se cancele la factura todos los productos adquiridos se reflejaran en 
// la informacion de la base de datos
// de esta manera se lleva el control de los productos existentes o no
// para que los usuarios puedan ver eso realizamos un funcion de verificacion de productos
// con el nombre de VerificacionProductosExistentes el cual solo necesita el nombre del producto
// esta funcion se encuentra en el controlador dos
// para la facutura se necesitara el nombre del propietario
//esta facturas no son editables
// solo puede facturar una persona admninistrador con el token administrador
function factura(req, res){
    var params = req.body;
    var suma = 0;

    if(params.nombre && params.cancelar){
        if(params.cancelar == "true"){
            Usuarios.findOne({$or: [
                {nombre: params.nombre}
            ]}).exec((err, UsuarioEncontrado) => {
                if(err) return res.status(500).send({Advertencia: "No se a podido encontrar el usuario que desea cancelar su producto"})
                
                if(UsuarioEncontrado) {
                    CarritoDeCompras.findOne({$or:[{usuario: UsuarioEncontrado._id},{cancelar: "pendiente"}]}).exec((err, compraencontrada) => {
                        if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la peticion"})
                        if(compraencontrada){
                            compraencontrada.nombre =  UsuarioEncontrado.nombre;
                            compraencontrada.cancelar = "Cancelada";
                            compraencontrada.Total = suma;
                            compraencontrada.save((err, facturacancelada) => {
                                if(err) return res.status(500).send({Advertencia: "A ocurrido un error en la peticion de guardar"})
                                if(facturacancelada){
                                    res.status(500).send({facturacancelada}) 
                                }else{
                                    res.status(500).send({Mensaje: "No se a podido cancelar su factura"}) 
                                }
                            })
                        }else{
                            res.status(500).send({Mensaje: "No tienes productos a cancelar"}) 
                        }
                    })
                }else{
                    res.status(200).send({Mensaje: "Su usuario no existe"})
                }
            })
        }else{
            res.status(500).send({Mensaje: "No se puede facturar ya que no se va a cancelar"})
        }
    }else{
        res.status(200).send({Mensaje: "Rellene los datos necesarios"})
    }
}

module.exports = { 
    UsuarioMaestro,
    Login,
    AgregarUsuarios,
    AgregarCategorias,
    AgregarProductos,
    RegistrarCliente,
    carritodecompras,
    factura
}