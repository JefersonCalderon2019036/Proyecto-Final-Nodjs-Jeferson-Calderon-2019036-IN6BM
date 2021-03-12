"use strict"

//Exportaciones
const express = require("express");
const md_autentificador = require("../authenticator/authenticator");
const md_autentificadorc = require("../authenticator/authenticatorc");
const controllerOne = require("../controllers/controllerone");
const controllertwo = require("../controllers/controllertwo");
const controllerthree = require("../controllers/controllerthree");
const controllerfour = require("../controllers/controllerfour");

//Rutas
//localhost:3000/api/<<funcion>>
var api = express.Router();

//rutas para los datos por defecto
api.get("/UsuarioMaestro", controllerOne.UsuarioMaestro);

//ruta para el acceso
api.post("/Login", controllerOne.Login);

// rutas para control de datos nivel administrador
api.post("/AgregarUsuario", md_autentificador.ensureAuth, controllerOne.AgregarUsuarios);
api.post("/AgregarCategorias", md_autentificador.ensureAuth, controllerOne.AgregarCategorias);
api.post("/AgregarProductos", md_autentificador.ensureAuth, controllerOne.AgregarProductos)
api.post("/factura", md_autentificador.ensureAuth, controllerOne.factura)
api.post("/VerificacionDeProductosExistentes",md_autentificador.ensureAuth, controllertwo.VerificacionProductosExistentes);
api.get("/VerificacionDeFacturasCanceladas", md_autentificador.ensureAuth, controllertwo.VerificaionFacturasCanceladas)
api.get("/VerificacionesUsuariosClientes", md_autentificador.ensureAuth, controllertwo.verificaciondatosusuarioTipoClientes)
api.post("/FacturasPorId", md_autentificador.ensureAuth, controllertwo.VerificaionFacturasId)
api.get("/VerificacionCategoria", md_autentificador.ensureAuth, controllertwo.verificacioncategorias)
api.get("/TodasLasFactura", md_autentificador.ensureAuth, controllertwo.todaslasfacturas);
api.get("/TodosLosProductos", md_autentificador.ensureAuth, controllertwo.todoslosproductos);
api.get("/ProductosPorCategoria", md_autentificador.ensureAuth, controllertwo.productosporcategoria);
api.delete("/EliminarUsuarioCliente", md_autentificador.ensureAuth, controllerthree.EliminarUsuarioCliente);
api.delete("/EliminarMiUsuarioAdministrador", md_autentificador.ensureAuth, controllerthree.EliminarCuentaAdministrador);
api.delete("/EliminarProducto", md_autentificador.ensureAuth, controllerthree.EliminarProducto);
api.delete("/EliminarCategoria", md_autentificador.ensureAuth, controllerthree.EliminarCategoria);
api.put("/EditarUsuarioClientePorAdministrador", md_autentificador.ensureAuth, controllerfour.EditarUsuarioClienteAdministrador);
api.put("/EditarMiPerfilAdministrador", md_autentificador.ensureAuth, controllerfour.EditarPerfilAdministrador);
api.put("/EditarProductos", md_autentificador.ensureAuth, controllerfour.EditarProducto);


// rutas para control de datos nivel cliente
api.post("/RegistrarUsuario", controllerOne.RegistrarCliente);
api.post("/CarritoDeCompras",md_autentificadorc.ensureAuth, controllerOne.carritodecompras);
api.post("/VerificacionDeProductosExistentes",md_autentificadorc.ensureAuth, controllertwo.VerificacionProductosExistentes);
api.get("/VerificacionsDeFacturasClientes", md_autentificadorc.ensureAuth, controllertwo.verificaciondefacturascliente)
api.get("/TodosLosProductos", md_autentificadorc.ensureAuth, controllertwo.todoslosproductos);
api.get("/ProductosPorCategoria", md_autentificadorc.ensureAuth, controllertwo.productosporcategoria);
api.delete("/EliminarCuentaCliente", md_autentificadorc.ensureAuth, controllerthree.EliminarCuentaCliente);
api.put("/EditarMiPerfilCliente", md_autentificadorc.ensureAuth, controllerfour.EditarPerfilCliente);
module.exports = api;