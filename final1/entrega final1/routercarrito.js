const express = require("express");
const router = express.Router()
const fs = require('fs')
let path=("C:/Users/Usuario/Desktop/final1/entrega final1/carrito.json")
let path2=("C:/Users/Usuario/Desktop/final1/entrega final1/productos.json")
let lectura=JSON.parse(fs.readFileSync(path2,"utf-8"))
let carritos=JSON.parse(fs.readFileSync(path, "utf-8"))||[]
router.post("/post",(req,res)=>{
    let prods=[]
    id=1  
        if(carritos.length>0){
            let ultcarro=carritos[carritos.length-1]
            id=ultcarro.id+1  
        }
   let nuevoCarrito={id,prods}
   carritos.push(nuevoCarrito)
   fs.writeFileSync(path,JSON.stringify(carritos,null,"\t"))
   res.setHeader("content-type","text/plain")
    res.status(200).send("el carrito a sido creado correctamente :)")
})
router.post("/agregar/:prodid/:prodcarro", (req, res) => {
    let id = parseInt(req.params.prodcarro)
    if (isNaN(id)) {
        res.setHeader("content-type", "text/plain")
        res.status(400).json({ error: `El id ${id} no es un caracter valido` })
    }
    let prodId = parseInt(req.params.prodid)
    if (isNaN(prodId)) {
        res.setHeader("content-type", "text/plain")
        res.status(400).json({ error: `El id del producto ${prodId} no es valido` })
    }
    let prod = lectura.find(obj => obj.id === prodId)
    if (!prod) {
        res.setHeader("content-type", "text/plain")
        res.status(400).json({ error: `El producto con id ${prodId} no se encuentra` })
    } else {
        carritos[id].prods.push(prod)
        fs.writeFileSync(path, JSON.stringify(carritos, null, "\t"))
        res.setHeader("content-type", "text/plain")
        res.status(200).json({ prod })
    }
})
router.get("/post/:cid/product/:pid",(req,res)=>{
    let {cid}=req.params 
    cid=JSON.stringify(cid)
    let verificacion=carritos.findIndex(ids=>ids.id===cid)
    if (verificacion===-1){
        res.setHeader("content-type","text/plain")
        res.status(400).json({error:"ese carrito no existe :("}) 
    }
    let {pid}=req.params
    pid=parseInt(pid)
    let idprod=lectura.findIndex(obj=>obj.id===pid) //este seria el producto
    let prodbusqueda=carritos[verificacion].prods.findIndex(obj=>obj.id===pid) //esto seria si el producto ya esta añadido
    if(idprod!==-1){
        if(prodbusqueda!==-1){
            let cant=prodbusqueda.quantity++;
            let agregado={
                pid,
                quantity:cant
            }
            carritos[verificacion].prods[prodbusqueda]=agregado
            res.setHeader("content-type","text/plain")
            res.status(200).send("se a agregado un producto mas :)") 
        }
        else{
            cant=1
            let agregado={
                pid,
                quantity:cant
            }
            carritos[verificacion].prods.push(agregado)
            res.setHeader("content-type","text/plain")
            res.status(200).send("se a añadido un producto al carrito correctamente :)")
            }
        
        fs.writeFileSync(path,JSON.stringify(carritos,null,"\t"))
    }
    else{
        res.setHeader("content-type","text/plain")
        res.status(400).json({error:"ese producto no existe o no esta disponible :("}) 
    }
})
module.exports = router