const fs = require("fs");
const path = require("path");

const ruta = path.join(__dirname, "data.json");

function escribir(contenido) {
    return new Promise((resolve, reject) => {
        fs.writeFile(ruta, JSON.stringify(contenido, null, "\t"), "utf8", (error) => {
            if (error) reject(new Error("Error. No se puede escribir"));

            resolve(true);
        });
    });
}

function leer() {
    return new Promise((resolve, reject) => {
        fs.readFile(ruta, "utf-8", (error, contenido) => {
            if (error) reject(new Error("Error no se pudo leer"));

            resolve(JSON.parse(contenido));
        });

    });
}
//funcion auxiliar

function mayorId(productos) {

    let mayorActual = 0;

    productos.forEach((producto) => {
        if (Number(producto.id) > mayorActual) {
            mayorActual = Number(producto.id);
        }
    });
    return mayorActual;
}

function generarId(productos) {

    let mayorActual = mayorId(productos);

    return mayorActual + 1;
}

async function findAll() {
    const productos = await leer();
    return productos;
}

async function findOneById(id) {

    if (!id) throw new Error("Error id indefinido");

    const productos = await leer();
    const producto = productos.find((elemento) => elemento.id === id); //el casteo se hace desde server.js

    if (!producto) throw new Error("Error el producto no existe");

    if (id > mayorId(productos)) throw new Error("Este id no forma parte de la lista");

    if (id < 0) throw new Error("los Indices negativos no forman parte de la lista, intentelo de nuevo con un valor valido");

    return producto;
}

async function create(producto) {
    if (!producto.nombre || !producto.marca || !producto.categoria) throw new Error("Datos incompletos");
    const productos = await leer();
    const productoConId = { id: generarId(productos), ...producto };

    productos.push(productoConId);

    await escribir(productos);

    return productoConId;
}

async function update(producto) {

    if (!producto.id || !producto.nombre || !producto.marca || !producto.categoria) throw new Error("Datos incompletos");

    const productos = await leer();
    const indice = productos.findIndex((elemento) => elemento.id === producto.id); //el casteo se hace desde server.js

    if (!producto) throw new Error("Error el producto no existe");
    if (producto.id > mayorId(productos)) throw new Error("Este id no forma parte de la lista");

    if (producto.id < 0) throw new Error("los Indices negativos no forman parte de la lista, intentelo de nuevo con un valor valido");

    productos[indice] = producto;
    await escribir(productos);

    return (`Se ah Actualizado correctamente el producto ${producto.nombre}  ${producto.marca} \nPerteneciente a la categoria ${producto.categoria}`);
}

async function destroy(id) {

    if (!id) throw new Error("Error id indefinido");

    const productos = await leer();

    const producto = productos.find((elemento) => elemento.id === id);
    const indice = productos.findIndex((elemento) => elemento.id === id);

    if (id > mayorId(productos)) throw new Error("Este id no Hero G502 parte de la lista");

    if (id < 0) throw new Error("los Indices negativos no forman parte de la lista, intentelo de nuevo con un valor valido");

    if (!indice) throw new Error("Error el Id no existe");

    productos.splice(indice, 1);
    await escribir(productos);

    return (`Se ah Eliminado correctamente el producto ${producto.nombre}  ${producto.marca} \nPerteneciente a la categoria ${producto.categoria}`);

}

module.exports = { findAll, findOneById, create, update, destroy };