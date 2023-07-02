const express = require("express");
const dotenv = require("dotenv");
const { findAll, findOneById, create, update, destroy } = require("./database/data.manager.js");

dotenv.config();

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//obtener todos los productos
server.get('/productos', (req, res) => {
    findAll()
        .then((productos) => res.status(200).send(productos))
        .catch((error) => res.status(400).send(error.message));

});

//obtener un producto por id
server.get('/productos/:id', (req, res) => {
    const { id } = req.params;
    findOneById(Number(id))
        .then((producto) => res.status(200).send(producto))
        .catch((error) => res.status(400).send(error.message));

});

//elimina un producto lo obtiene por id y lo destruye
server.delete('/productos/:id', (req, res) => {
    const { id } = req.params;

    destroy(Number(id))
        .then((producto) => res.status(201).send(producto))
        .catch((error) => res.status(400).send(error.message));
});

//crea un producto
server.post('/productos', (req, res) => {
    const { nombre, marca, categoria } = req.body;

    create({ nombre, marca, categoria })
        .then((productos) => res.status(201).send(productos))
        .catch((error) => res.status(400).send(error.message));
});
//Actualizar un producto por id
server.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, marca, categoria } = req.body;

    update({ id: Number(id), nombre, marca, categoria })
        .then((productos) => res.status(201).send(productos))
        .catch((error) => res.status(400).send(error.message));
});

server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/productos`);
});
