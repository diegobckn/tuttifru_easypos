import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Product from './Product.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import System from '../Helpers/System.ts';
import IProductSold from '../Types/IProductSold.ts';
import Client from './Client.ts';


class ProductSold extends Product implements IProductSold {
    esAgregado: boolean | undefined;
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
    mostrarPrecioRangos: any | undefined


    static instance: ProductSold | null = null;
    static getInstance(): ProductSold {
        if (ProductSold.instance == null) {
            ProductSold.instance = new ProductSold();
        }

        return ProductSold.instance;
    }

    static esPesable(product: any) {
        if (!product) product = this
        if (product.pesable != undefined)
            return product.pesable

        if (product.tipoVenta != undefined)
            return product.tipoVenta == 2

        if (product.cantidad != undefined)
            return parseInt(product.cantidad) != parseFloat(product.cantidad)

        return false
    }

    getPrecioCantidad(otraCantidad = null) {

        const cl = Client.getInstance()
        if (cl.sesion.hasOne()) {
            return this.precioVenta
        }

        if (
            this.mostrarPrecioRangos
            && this.mostrarPrecioRangos.length > 0
            && this.mostrarPrecioRangos[0].cantidadDesde > 0
        ) {
            // console.log("tengo rango de precios")

            const miCantidad = otraCantidad ? otraCantidad : this.cantidad

            var miRangoIndex = -1
            var ultimoRangoIndex = -1
            this.mostrarPrecioRangos.forEach((rango: any, ix: number) => {
                if (miCantidad >= rango.cantidadDesde && miCantidad <= rango.cantidadHasta) {
                    miRangoIndex = ix
                }
                ultimoRangoIndex = ix
            })
            if (miRangoIndex == -1) miRangoIndex = ultimoRangoIndex
            const miRango = this.mostrarPrecioRangos[miRangoIndex]
            if (this.precioVenta != miRango.precioVenta) {
                this.precioVenta = miRango.precioVenta
            }
        }
        return this.precioVenta
    }

    getSubTotal() {
        // console.log("getSubTotal de ", this)
        this.getPrecioCantidad()
        return Math.round(this.cantidad * (this.precioVenta ? this.precioVenta : 0));
    }

    //price = 0 -> original price
    addQuantity(cantidad = 1, price = 0) {
        this.cantidad = System.getInstance().typeIntFloat(this.cantidad)
        cantidad = System.getInstance().typeIntFloat(cantidad)

        this.cantidad += cantidad;
        this.cantidad = this.cantidad
        if (price != 0) this.precioVenta = price;
        this.total = this.getSubTotal();
        return this;
    }

    changeQuantity(cantidad: number) {
        this.cantidad = cantidad;
        this.updateSubtotal();
    }

    updateSubtotal() {
        return this.total = this.getSubTotal()
    }

    static tieneEnvases(producto: any) {
        // console.log("tiene envases?")
        // console.log(producto)
        return (
            (
                //caso cuando viene del back
                Array.isArray(producto.envase)
                && producto.envase.length > 0
                && producto.envase[0].costo > 0
                && producto.envase[0].descripcion != ""
            )

            ||

            //caso cuando ya esta en el listado
            (
                producto.hasEnvase
            )



        )
    }

    static getOwnerByEnvase(envase: any, otherProducts: any) {
        var owner: any = null
        otherProducts.forEach((pro: any) => {
            if (pro.idProducto == envase.ownerEnvaseId) {
                owner = pro
            }
        })
        return owner
    }

    static esEnvase(productData: any) {
        return (productData.ownerEnvaseId != undefined || productData.isEnvase)
    }

    static getEnvaseByOwner(owner: any, otherProducts: any) {
        var envase: any = null
        otherProducts.forEach((pro: any) => {
            if (owner.idProducto == pro.ownerEnvaseId) {
                envase = pro
            }
        })
        return envase
    }


    tieneExtraAgregar() {
        return this.extras && this.extras.agregar && this.extras.agregar.length > 0
    }

    getAgregadosEnTexto() {
        var txt = ""
        if (!this.tieneExtraAgregar()) return txt
        this.extras.agregar.forEach((agregado: any) => {
            if (txt != "") txt += ", "
            txt += agregado.nombre
        });
        return txt
    }

    tieneExtraQuitar() {
        return this.extras && this.extras.quitar && this.extras.quitar.length > 0
    }

    getQuitadosEnTexto() {
        var txt = ""
        if (!this.tieneExtraQuitar()) return txt
        this.extras.quitar.forEach((agregado: any) => {
            if (txt != "") txt += ", "
            txt += agregado.nombre
        });
        return txt
    }

    montoExtrasUnitario() {
        var totalEx = 0
        if (!this.tieneExtraAgregar()) return 0
        this.extras.agregar.forEach((agregado: any) => {
            totalEx += agregado.precioVenta
        });
        return totalEx
    }

    montoExtrasSubtotal() {
        var totalEx = 0
        if (!this.tieneExtraAgregar()) return 0
        this.extras.agregar.forEach((agregado: any) => {
            totalEx += (this.cantidad * agregado.precioVenta)
        });
        return totalEx
    }

    static createByValues(product: any) {
        const me = new ProductSold()
        me.fill(product)
        return me;
    }

};

export default ProductSold;