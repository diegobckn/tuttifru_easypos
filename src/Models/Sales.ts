import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import Product from './Product.ts';
import IProductSold from '../Types/IProductSold.ts';
import Singleton from './Singleton.ts';
import ProductSold from './ProductSold.ts';
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import System from '../Helpers/System.ts';
import Preventa from './Preventa.ts';
import { extraDefaultLlevar } from '../Types/TExtra.ts';
import EndPoint from './EndPoint.ts';


class Sales {
  products: ProductSold[] = []
  sesionProducts: StorageSesion;

  lastServerId = 0

  constructor() {
    this.sesionProducts = new StorageSesion("salesproducts");
  }

  loadFromSesion() {
    // console.log("loadFromSesion..")
    if (!this.sesionProducts.hasOne()) return [];
    this.products = [];
    var prodsSession = this.sesionProducts.cargarGuardados()[0];
    // console.log("prodsSession..", prodsSession)
    for (let index = 0; index < prodsSession.length; index++) {
      const prodSold = new ProductSold();
      prodSold.fill(prodsSession[index]);
      this.products[index] = prodSold
    }
    return (this.products);
  }

  findKeyInProducts(productId: any): number {
    // console.log("findKeyInProducts ..productId ", productId)
    return this.products.findIndex(
      (productSold: ProductSold) => productSold.idProducto === productId
    );
  }

  findKeyAndPriceInProducts(productId: number, price): number {
    return this.products.findIndex(
      (productSold: ProductSold) => (
        productSold.idProducto === productId
        && productSold.price === price
      )
    );
  }

  findKeyAndPriceAndNameInProducts(productId: number, price, name): number {
    // console.log("findKeyAndPriceAndNameInProducts")
    // console.log("productId", productId)
    // console.log("price", price)
    // console.log("name", name)

    var keyEncontrada = -1
    this.products.forEach((prod, ix) => {
      const aplica = (
        prod.idProducto + "" === productId + ""
        && prod.idProducto !== 0
        && (prod.price === price || prod.preVenta === price)
        && prod.description === name
      )

      // console.log("item prod", prod)
      // console.log("aplica", aplica)
      if (aplica) {
        keyEncontrada = ix
      }
    })

    return keyEncontrada

    // return this.products.findIndex(
    //   (productSold: ProductSold) => (
    //     productSold.idProducto + "" === productId + ""
    //     && productSold.idProducto !== 0
    //     && (productSold.price === price  || productSold.preVenta === price)
    //     && productSold.description === name
    //   )
    // );
  }

  getTotal() {
    // console.log("getTotal..", System.clone(this.products))
    var allTotal = 0;
    var totalExtrasAgregar = 0
    this.products.forEach(function (product: ProductSold) {
      allTotal = allTotal + product.getSubTotal();
      if (product.extras && product.extras.agregar) {
        product.extras.agregar.forEach((agrega) => {
          totalExtrasAgregar += agrega.precioVenta
        })
      }
    })

    // console.log("total", allTotal)
    return allTotal + totalExtrasAgregar;
  }

  getTotalCantidad() {
    var allTotal = 0;
    this.products.forEach(function (product: ProductSold) {
      allTotal = allTotal + product.quantity;
    })
    return allTotal;
  }

  incrementQuantityByIndex(index, quantity = 1, newPrice = 0) {
    console.log("incrementQuantityByIndex")
    const updatedSalesData = [...this.products];
    updatedSalesData[index] =
      updatedSalesData[index].addQuantity(quantity, newPrice);
    this.products = updatedSalesData;
    return (updatedSalesData);
  }

  decrementQuantityByIndex(index) {
    console.log("decrementQuantityByIndex")
    // console.log("revisar quantity de envases?")
    const updatedSalesData = [...this.products];
    updatedSalesData[index] =
      updatedSalesData[index].addQuantity(-1);

    if (updatedSalesData[index].quantity < 1) {
      updatedSalesData.splice(index, 1);
    }
    return (updatedSalesData);
  }

  checkQuantityEnvase(index, product: any = null) {
    // console.log("checkQuantityEnvase..index:", index)
    var productoCambiando = this.products[index];
    if (productoCambiando.hasEnvase != undefined) {
      // console.log("tiene un envase")
      const ownerEnvaseId = productoCambiando.idProducto//producto con envase
      if (ownerEnvaseId === 0) {
        // console.log("tiene id 0 el owner del envase")
      } else {
        // console.log("es un producto valido el owner del envase", ownerEnvaseId)
        // if(productoCambiando.preVenta){
        //   return // si es preventa no tiene que revisar envase porque el envase viene como un producto separado
        // }

        for (let index2 = 0; index2 < this.products.length; index2++) {
          const posibleEnvase = this.products[index2];
          // console.log("posible envase", System.clone(posibleEnvase))
          // console.log("productoCambiando", System.clone(productoCambiando))

          if (ownerEnvaseId == posibleEnvase.ownerEnvaseId) {//encontro su envase
            // console.log("confirmado es un envase del product ", ownerEnvaseId)

            if (product && ProductSold.tieneEnvases(product)) {
              var cantidadEnvase = product.envase[0].cantidad
              if (!cantidadEnvase) cantidadEnvase = product.envase[0].quantity
              if (!cantidadEnvase) cantidadEnvase = 1
              posibleEnvase.quantity += cantidadEnvase
            } else {
              posibleEnvase.quantity = productoCambiando.quantity
            }
            posibleEnvase.updateSubtotal()
          }
        }
      }
    }
  }

  changeQuantityByIndex(index, newQuantity, removeIfQuantityIs0 = false) {
    // console.log("changeQuantityByIndex")
    // console.log("this")
    // console.log(this)

    const oldQuantity = this.products[index].quantity + 0
    const diffQuantity = newQuantity - oldQuantity

    // console.log("newQuantity", newQuantity + 0)
    // console.log("oldQuantity", oldQuantity)
    // console.log("prod quantity", this.products[index].quantity + 0)

    const producto = this.products[index]
    producto.quantity = newQuantity;
    producto.cantidad = newQuantity;
    producto.updateSubtotal();

    this.checkQuantityEnvase(index)

    if (removeIfQuantityIs0 && producto.quantity <= 0) {
      // console.log("eliminando")
      this.products.splice(index, 1);
    }

    //si tiene extras tengo que actualizar cantidades de agregados
    if (producto.extras && producto.extras.agregar.length > 0) {

      producto.extras.agregar.forEach((agregado, ix) => {
        // console.log("agregado", agregado)
        //suma
        if (diffQuantity > 0) {
          const keyDelProductoAgregado = this.findKeyAndPriceInProducts(agregado.idProducto, agregado.precioVenta)
          // console.log("keyDelProductoAgregado", keyDelProductoAgregado)
          var productoAgregado = System.clone(this.products[keyDelProductoAgregado])
          // console.log("productoAgregado", productoAgregado)
          this.products[keyDelProductoAgregado].quantity += diffQuantity
          this.products[keyDelProductoAgregado].cantidad = this.products[keyDelProductoAgregado].quantity
          // console.log("diffQuantity", diffQuantity)
        } else {
          //resta
          const keyDelProductoAgregado = this.findKeyAndPriceInProducts(agregado.idProducto, agregado.precioVenta)
          const productoAgregado = this.products[keyDelProductoAgregado]

          // console.log("keyDelProductoAgregado", keyDelProductoAgregado)
          // console.log("productoAgregado", productoAgregado)
          // console.log("diffQuantity", diffQuantity)

          this.products[keyDelProductoAgregado].quantity += diffQuantity
          this.products[keyDelProductoAgregado].cantidad = this.products[keyDelProductoAgregado].quantity

          if (productoAgregado.quantity <= 0) {
            this.removeFromIndex(keyDelProductoAgregado)
          }
        }
      })


    }

    this.sesionProducts.guardar(this.products)
    return (this.products);
  }


  addProduct(product, quantity: number | null = null): ProductSold[] {
    // console.log("Sales: add product de sales", product)
    const newPrice = product.precioVenta || 0;
    if (quantity == null && product.cantidad > 0) quantity = product.cantidad
    if (quantity == null) quantity = 1

    // if(product.idProducto == 0) {
    //si tiene id en 0 deberia ser un envase que viene de preventa
    // console.log("producto con idProducto en 0")
    // }

    const agruparProductoLinea = ModelConfig.get("agruparProductoLinea")

    // const existingProductIndex = this.findKeyAndPriceAndNameInProducts(product.idProducto, product.precioVenta, product.nombre)
    const existingProductIndex = this.findKeyAndPriceInProducts(product.idProducto, product.precioVenta)
    if (
      (agruparProductoLinea) &&
      !ProductSold.getInstance().esPesable(product)
      && existingProductIndex !== -1
    ) {

      // console.log("parece que ya esta agregado el producto..vamos a actualizar su cantidad")
      // console.log("cantidad actual: ", this.products[existingProductIndex].quantity, "..la nueva sera:", this.products[existingProductIndex].quantity + quantity)
      const productExistente = this.products[existingProductIndex]
      if (product.preVenta && productExistente.preVenta && product.preVenta.indexOf(productExistente.preVenta) === -1) {
        const updatedSalesData = [...this.products];
        updatedSalesData[existingProductIndex].preVenta += "," + product.preVenta
        this.products = updatedSalesData;
      }

      // this.products = this.incrementQuantityByIndex(existingProductIndex, quantity, newPrice);
      this.products = this.changeQuantityByIndex(existingProductIndex, productExistente.cantidad + 1);
      this.checkQuantityEnvase(existingProductIndex, product)
    } else {
      // console.log("es un producto que no esta en la lista")
      const newProductSold = new ProductSold()
      newProductSold.fill(product)
      // newProductSold.idProducto = product.idProducto
      newProductSold.description = product.nombre
      // newProductSold.nombre = product.nombre
      newProductSold.quantity = quantity
      newProductSold.cantidad = quantity
      newProductSold.pesable = (product.tipoVenta == 2)
      // newProductSold.tipoVenta = product.tipoVenta
      newProductSold.price = newPrice
      newProductSold.precioVenta = newProductSold.price
      newProductSold.key = this.products.length + 0
      // newProductSold.precioCosto = product.precioCosto
      // if (product.preVenta) {
      //   newProductSold.preVenta = product.preVenta
      //   // console.log("es preventa")
      // }

      newProductSold.extras = System.clone(extraDefaultLlevar)

      this.products = [...this.products, newProductSold]

      //si viene con envases desde back agrego como un producto especial
      if (ProductSold.tieneEnvases(product)) {
        // console.log("tiene envase")
        const envase = new ProductSold()
        envase.idProducto = 0
        envase.description = product.envase[0].descripcion
        envase.nombre = product.envase[0].descripcion
        if (product.envase[0].cantidad !== undefined) {
          envase.quantity = product.envase[0].cantidad
        } else {
          envase.quantity = quantity
        }
        envase.cantidad = quantity
        envase.pesable = false
        envase.tipoVenta = 1
        envase.ownerEnvaseId = product.idProducto
        envase.price = product.envase[0].costo
        envase.precioVenta = envase.price

        envase.precioCosto = product.envase[0].costo
        envase.updateSubtotal()
        this.products = [...this.products, envase]

        const lastProductIndex = this.findKeyAndPriceAndNameInProducts(product.idProducto, product.precioVenta, product.nombre)
        const lastProduct = this.products[lastProductIndex]

        lastProduct.hasEnvase = true
        envase.isEnvase = true
      }


      newProductSold.updateSubtotal()


    }
    this.sesionProducts.guardar(this.products)
    return this.products;
  }

  removeFromIndex(index) {
    const productoAEliminar = this.products[index];
    if (ProductSold.tieneEnvases(productoAEliminar)) {
      this.products = this.products.filter((pro_, i) => {
        return pro_.ownerEnvaseId !== productoAEliminar.idProducto
      })
    }
    this.products = this.products.filter((_, i) => i !== index)
    this.sesionProducts.guardar(this.products)
    return this.products
  }

  replaceProduct(keyProductRemove, productPut) {
    var copiaProducts: any[] = []
    this.products.forEach((prod, ix) => {
      if (ix === keyProductRemove) {
        copiaProducts.push(productPut)
      } else {
        copiaProducts.push(prod)
      }
    })
    this.products = copiaProducts
    this.sesionProducts.guardar(this.products)

    this.loadFromSesion()
    return this.products;
  }

  actualizarSesion() {
    const copia = System.clone(this.products)
    this.products = []
    this.products = copia
    this.sesionProducts.guardar(this.products)
  }


  static prepararProductosParaPagar(productos: ProductSold[], requestData) {
    const productosFiltrados: any[] = []

    productos.forEach((producto) => {
      // console.log("prod", producto)
      const esEnvase = ProductSold.esEnvase(producto)
      if (esEnvase) {
        const owner = ProductSold.getOwnerByEnvase(producto, productos)
        const difcant = owner.quantity - producto.quantity
        productosFiltrados.push({
          codProducto: 0,
          codbarra: (producto.idProducto + ""),
          cantidad: System.getInstance().typeIntFloat(difcant),
          precioUnidad: producto.price,
          descripcion: producto.description,
          extras: System.clone(extraDefaultLlevar)
        })
      } else {
        if (producto.preVenta) {
          if (requestData.preVentaID.length > 0) {
            if (requestData.preVentaID.indexOf(producto.preVenta) === -1) {
              requestData.preVentaID += "," + producto.preVenta
            }
          } else {
            requestData.preVentaID = producto.preVenta
          }
        }

        const itemProducto: any = {
          codProducto: 0,
          codbarra: (producto.idProducto + ""),
          cantidad: System.getInstance().typeIntFloat(producto.quantity),
          precioUnidad: producto.price,
          descripcion: producto.description,
        }

        if (producto.extras) {
          itemProducto.extras = producto.extras
        }

        productosFiltrados.push(itemProducto)
      }

    })
    return productosFiltrados
  }

  async getFromMirror(callbackOk, callbackWrong) {
    var url = "https://softus.com.ar/easypos/get-mirror"

    url += "?sucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    var uu = window.location.href
    uu = uu.replace("https://", "")
    uu = uu.replace("http://", "")
    uu = uu.split("/")[0]

    url += "&url=" + uu

    EndPoint.sendGet(url, (responseData, response) => {
      callbackOk(responseData.prods, response);
    }, callbackWrong)
  }

  async sendToMirror(prods, callbackOk, callbackWrong) {
    var url = "https://softus.com.ar/easypos/update-mirror"

    var uu = window.location.href
    uu = uu.replace("https://", "")
    uu = uu.replace("http://", "")
    uu = uu.split("/")[0]

    const data = {
      "products": prods,
      "sucursal": ModelConfig.get("sucursal"),
      "puntoVenta": ModelConfig.get("puntoVenta"),
      "url": uu,
    }


    EndPoint.sendPost(url, data, (responseData, response) => {
      callbackOk(responseData.prods, response);
    }, callbackWrong)
  }
};


export default Sales;