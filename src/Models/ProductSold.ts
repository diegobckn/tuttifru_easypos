import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Product from './Product.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import System from '../Helpers/System.ts';
import IProductSold from '../Types/IProductSold.ts';


class ProductSold extends Product implements IProductSold {
    esAgregado: boolean | undefined;
    quantity: number = 0;
    cantidad: number = 0;
    total: number = 0;

    pesable: undefined | boolean;
    tipoVenta: undefined | number;
    ownerEnvaseId: string | number | null | undefined;
    hasEnvase: boolean | undefined;
    isEnvase: boolean | undefined;
    preVenta: string | undefined;
    key: number | undefined;
    ocultarEnListado: boolean | undefined;
    extras: any | undefined;
    precioVenta: number | undefined


    static instance: ProductSold | null = null;
    static getInstance():ProductSold{
        if(ProductSold.instance == null){
            ProductSold.instance = new ProductSold();
        }

        return ProductSold.instance;
    }

    esPesable(product:any | null = null){
        if(!product) product = this
        if(product.pesable != undefined)
            return product.pesable

        if(product.tipoVenta != undefined)
            return product.tipoVenta == 2

        if(product.cantidad != undefined)
            return parseInt(product.cantidad) != parseFloat(product.cantidad)
        
        return false
    }

    getSubTotal(){
        return Math.round(this.quantity * (this.price ? this.price : 0)) ;
    }

    //price = 0 -> original price
    addQuantity(quantity = 1, price = 0){
        this.quantity = System.getInstance().typeIntFloat(this.quantity)
        quantity = System.getInstance().typeIntFloat(quantity)

        this.quantity += quantity;
        this.cantidad = this.quantity
        if(price != 0) this.price = price;
        this.total = this.getSubTotal();
        return this;
    }

    changeQuantity(quantity:number){
        this.quantity = quantity;
        this.updateSubtotal();
    }

    updateSubtotal(){
        return this.total = this.getSubTotal()
    }

    static tieneEnvases(producto:any){
        // console.log("tiene envases?")
        // console.log(producto)
        return(
            (
            //caso cuando viene del back
            Array.isArray(producto.envase) 
            && producto.envase.length>0 
            && producto.envase[0].costo>0
            && producto.envase[0].descripcion!=""
            )

            ||
            
            //caso cuando ya esta en el listado
            (
                producto.hasEnvase
            )



        )
    }

    static getOwnerByEnvase(envase:any, otherProducts:any){
        var owner:any = null
        otherProducts.forEach((pro:any)=>{
            if(pro.idProducto == envase.ownerEnvaseId){
                owner = pro
            }
        })
        return owner
    }

    static esEnvase(productData:any){
        return (productData.ownerEnvaseId!= undefined || productData.isEnvase)
    }

    static getEnvaseByOwner(owner:any, otherProducts:any){
        var envase:any = null
        otherProducts.forEach((pro:any)=>{
            if(owner.idProducto == pro.ownerEnvaseId){
                envase = pro
            }
        })
        return envase
    }


    tieneExtraAgregar(){
        return this.extras && this.extras.agregar && this.extras.agregar.length > 0
    }

    getAgregadosEnTexto(){
        var txt = ""
        if(!this.tieneExtraAgregar())return txt
        this.extras.agregar.forEach((agregado:any) => {
            if(txt != "") txt += ", "
            txt += agregado.nombre
        });
        return txt
    }

    tieneExtraQuitar(){
        return this.extras && this.extras.quitar && this.extras.quitar.length > 0
    }

    getQuitadosEnTexto(){
        var txt = ""
        if(!this.tieneExtraQuitar())return txt
        this.extras.quitar.forEach((agregado:any) => {
            if(txt != "") txt += ", "
            txt += agregado.nombre
        });
        return txt
    }
    

};

export default ProductSold;