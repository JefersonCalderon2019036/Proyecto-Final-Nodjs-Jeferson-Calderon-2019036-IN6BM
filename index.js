"use strict"

const mongoose = require("mongoose");
require('dotenv').config();

const app = require("./src/app/app");
const database = process.env.database;

mongoose.Promise = global.Promise;
mongoose.connect(database, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Se encuentra conectado a la Base de Datos");

    app.listen(3000, function () {
        console.log("El Servidor esta arracando en el puerto 3000");
    })

}).catch(err => console.log(err));