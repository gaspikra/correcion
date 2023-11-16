const fs = require('fs')
class ProductManager{
    constructor(){
        this.products=[];
        this.path= "C:\\Users\\Usuario\\Desktop\\entrega coder\\productos.json"
    }
    GetProducts(){
        let lectura=JSON.parse(fs.readFileSync(this.path,"utf-8"))
        return lectura
    }
    getProductById(id){
        let productos=this.GetProducts()
        let indice=productos.findIndex((producto)=>{
        return producto.id===id
        })
        if(indice===-1){
            console.log("no hay ningun producto con ese ID")
            return
        }
        return productos[indice];
    }
    DeleteProduct(id){
            let productos = this.GetProducts();
            let nuevoarray = productos.filter((producto) => producto.id !== id);
            if (productos.length === nuevoarray.length) {
                console.log("No se encontró ningún producto con ese ID.");
                return;
            }
            fs.writeFileSync(this.path, JSON.stringify(nuevoarray, null, "\t"));
        }
    }

module.exports = ProductManager;
