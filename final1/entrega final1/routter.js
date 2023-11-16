const express = require('express')
const router = express.Router()
const fs = require('fs')
const ProductManager = require('./productmanager')
const productos = new ProductManager()

router.get("/", (req, res) => {
    const prod = productos.GetProducts()
    if (!prod || prod.length === 0) {
        res.setHeader("content-type", "text/plain")
        res.status(400).json({ error: "No hay ningún producto por el momento" })
    } else {
        res.setHeader("content-type", "text/plain")
        res.status(200).json({ prod })
    }
})

router.get('/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    let prod = productos.getProductById(id)
    if (!prod) {
        res.setHeader("content-type", "text/plain")
        res.status(400).json({ error: `El id ${id} no se encuentra` })
    } else {
        res.setHeader("content-type", "text/plain")
        res.status(200).json({ prod })
    }
})

router.post("/post", (req, res) => {
    let { id, title, description, code, price, status, stock, category, thumbnails } = req.body
    id = 1

    if (productos.products.length > 0) {
        id = productos.products[productos.products.length - 1].id + 1
    }

    let nuevoproducto = {
        id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
        ...req.body
    }

    let propiedades = ["title", "description", "code", "price", "status", "stock", "category"]
    const valido = propiedades.every(propiedad => Object.keys(nuevoproducto).includes(propiedad))

    if (!valido) {
        res.setHeader("content-type", "text/plain")
        res.status(400).json({ error: "Faltó agregar alguna propiedad" })
    }

    const strings = [nuevoproducto.title, nuevoproducto.description, nuevoproducto.code, nuevoproducto.category]
    const valido2 = strings.every(valor => typeof valor === 'string')

    if (!valido2) {
        res.setHeader("content-type", "text/plain")
        res.status(400).json({ error: `Alguna de las siguientes variables no es un string: ${strings}` })
    }

    if (typeof nuevoproducto.price === "number" && typeof nuevoproducto.stock === "number") {
        productos.products.push(nuevoproducto)
        fs.writeFileSync(productos.path, JSON.stringify(productos.products, null, "\t"))
        res.setHeader("content-type", "text/plain")
        res.status(200).send("Elemento subido :)")
    } else {
        res.setHeader("content-type", "text/plain")
        res.status(400).json({ error: "La propiedad price o stock no son un número" })
    }
})

router.put('/put/:pid', (req, res) => {
    let { id, title, description, code, price, status, stock, category, thumbnails } = req.body
    let ids = parseInt(req.params.pid)
    let prods = productos.GetProducts()

    if (!prods || prods.length === 0) {
        res.setHeader("content-type", "text/plain")
        res.status(400).json({ error: "No hay ningún producto" })
    }

    let pos = prods.findIndex(producto => producto.id === ids)

    if (pos === -1) {
        res.setHeader("content-type", "text/plain")
        res.status(400).json({ error: "No hay ningún producto con ese id" })
    }

    let nuevoprod = {
        ...prods[pos],
        ...req.body,
        id
    }

    let propiedades = ["title", "description", "code", "price", "status", "stock", "category"]
    const valido = propiedades.every(propiedad => Object.keys(nuevoprod).includes(propiedad))

    if (!valido) {
        res.setHeader("content-type", "text/plain")
        res.status(400).json({ error: "Faltó agregar alguna propiedad" })
    }

    productos.products[pos] = nuevoprod
    fs.writeFileSync(productos.path, JSON.stringify(productos.products, null, "\t"))
    res.setHeader("content-type", "text/plain")
    res.status(200).send("Elemento actualizado :)")
})

router.delete("/delete/:pid", (req, res) => {
    let { pid } = req.params
    pid = parseInt(pid)

    if (isNaN(pid)) {
        res.setHeader("content-type", "text/plain")
        res.status(400).json({ error: "No introdujo un número válido" })
    }

    let resultado = productos.DeleteProduct(pid)

    if (resultado.error) {
        res.setHeader("content-type", "text/plain")
        res.status(400).json({ error: "No existe un producto con ese id" })
    } else {
        res.setHeader("content-type", "text/plain")
        res.status(200).send("Producto eliminado correctamente")
    }
})

module.exports = router