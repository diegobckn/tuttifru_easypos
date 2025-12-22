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

  findKeyAndPriceInProducts(productId: number, price: number | string): number {
    // console.log("findKeyAndPriceInProducts")
    // console.log("productId", productId)
    // console.log("price", price)

    return this.products.findIndex(
      (productSold: ProductSold) => (
        productSold.idProducto === productId
        && productSold.precioVenta === price
      )
    );
  }

  findKeyAndPriceAndNameInProducts(productId: number, price: number | string, name: string): number {
    // console.log("findKeyAndPriceAndNameInProducts")
    // console.log("productId", productId)
    // console.log("price", price)
    // console.log("name", name)

    var keyEncontrada = -1
    this.products.forEach((prod, ix) => {
      const aplica = (
        prod.idProducto + "" === productId + ""
        && prod.idProducto !== 0
        && (prod.precioVenta === price || prod.preVenta === price)
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
    //     && (productSold.precioVenta === price  || productSold.preVenta === price)
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
        product.extras.agregar.forEach((agrega: any) => {
          totalExtrasAgregar += (product.cantidad * agrega.precioVenta)
        })
      }
    })

    // console.log("total", allTotal)
    return allTotal + totalExtrasAgregar;
  }

  getTotalCantidad() {
    var allTotal = 0;
    this.products.forEach(function (product: ProductSold) {
      allTotal = allTotal + product.cantidad;
    })
    return allTotal;
  }

  incrementQuantityByIndex(index: number, cantidad = 1, newPrice = 0) {
    // console.log("incrementQuantityByIndex")
    const updatedSalesData = [...this.products];
    updatedSalesData[index] =
      updatedSalesData[index].addQuantity(cantidad, newPrice);
    this.products = updatedSalesData;
    return (updatedSalesData);
  }

  decrementQuantityByIndex(index: number) {
    // console.log("decrementQuantityByIndex")
    // console.log("revisar quantity de envases?")
    const updatedSalesData = [...this.products];
    updatedSalesData[index] =
      updatedSalesData[index].addQuantity(-1);

    if (updatedSalesData[index].cantidad < 1) {
      updatedSalesData.splice(index, 1);
    }
    return (updatedSalesData);
  }

  checkQuantityEnvase(productIndex: number, product: any = null) {
    // console.log("checkQuantityEnvase..productIndex:", productIndex)
    // console.log("checkQuantityEnvase..product:", product)

    var productoCambiando = this.products[productIndex];
    if (!ProductSold.tieneEnvases(productoCambiando)) {
      // console.log("no tiene envases..salgo")
      return
    }
    // console.log("tiene algun envase")

    const cantidadProducto = productoCambiando.cantidad
    // console.log("checkQuantityEnvase..cantidadProducto:", cantidadProducto)


    const envase = this.products[productIndex + 1];
    envase.cantidad = cantidadProducto
    envase.cantidad = cantidadProducto
    envase.updateSubtotal()

    // console.log("checkQuantityEnvase..envase quedo asi:", System.clone(envase))


    // const ownerEnvaseId = productoCambiando.idProducto//producto con envase
    // if (ownerEnvaseId === 0) {
    //   // console.log("tiene id 0 el owner del envase")
    // } else {
    //   // console.log("es un producto valido el owner del envase", ownerEnvaseId)
    //   // if(productoCambiando.preVenta){
    //   //   return // si es preventa no tiene que revisar envase porque el envase viene como un producto separado
    //   // }

    //   for (let index2 = 0; index2 < this.products.length; index2++) {
    //     const posibleEnvase = this.products[index2];
    //     // console.log("posible envase", System.clone(posibleEnvase))
    //     // console.log("productoCambiando", System.clone(productoCambiando))

    //     if (ownerEnvaseId == posibleEnvase.ownerEnvaseId) {//encontro su envase
    //       // console.log("confirmado es un envase del product ", ownerEnvaseId)

    //       if (product && ProductSold.tieneEnvases(product)) {
    //         var cantidadEnvase = product.envase[0].cantidad
    //         if (!cantidadEnvase) cantidadEnvase = product.envase[0].cantidad
    //         if (!cantidadEnvase) cantidadEnvase = 1
    //         posibleEnvase.cantidad += cantidadEnvase
    //       } else {
    //         posibleEnvase.cantidad = productoCambiando.cantidad
    //       }
    //       posibleEnvase.updateSubtotal()
    //     }
    //   }
    // }
  }

  changeQuantityByIndex(productIndex: number, newQuantity: number, removeIfQuantityIs0 = false) {
    // console.log("changeQuantityByIndex")
    // console.log("productIndex", productIndex)
    // console.log("newQuantity", newQuantity)
    // console.log("this")
    // console.log(this)

    const oldQuantity = this.products[productIndex].cantidad + 0
    const diffQuantity = newQuantity - oldQuantity

    // console.log("newQuantity", newQuantity + 0)
    // console.log("oldQuantity", oldQuantity)
    // console.log("prod quantity", this.products[productIndex].cantidad + 0)

    const producto = this.products[productIndex]
    producto.cantidad = newQuantity;
    producto.cantidad = newQuantity;



    if (removeIfQuantityIs0 && producto.cantidad <= 0) {
      // console.log("eliminando")
      this.products.splice(productIndex, 1);
    } else {
      producto.updateSubtotal();
    }

    //si tiene extras tengo que actualizar cantidades de agregados
    // if (producto.extras && producto.extras.agregar.length > 0) {

    // producto.extras.agregar.forEach((agregado, ix) => {
    // console.log("agregado", agregado)
    //suma
    // if (newQuantity > 0) {
    //   const keyDelProductoAgregado = this.findKeyAndPriceInProducts(producto.idProducto, producto.precioVenta)
    //   // const keyDelProductoAgregado = this.findKeyAndPriceInProducts(agregado.idProducto, agregado.precioVenta)
    //   console.log("keyDelProductoAgregado", keyDelProductoAgregado)
    //   // var productoAgregado = System.clone(this.products[keyDelProductoAgregado])
    //   // console.log("productoAgregado", productoAgregado)
    //   this.products[keyDelProductoAgregado].cantidad = newQuantity
    //   this.products[keyDelProductoAgregado].cantidad = this.products[keyDelProductoAgregado].cantidad
    //   // console.log("newQuantity", newQuantity)
    // } else {
    //   //resta
    //   const keyDelProductoAgregado = this.findKeyAndPriceInProducts(producto.idProducto, producto.precioVenta)
    //   const productoAgregado = this.products[keyDelProductoAgregado]

    //   // console.log("keyDelProductoAgregado", keyDelProductoAgregado)
    //   // console.log("productoAgregado", productoAgregado)
    //   // console.log("newQuantity", newQuantity)

    //   this.products[keyDelProductoAgregado].cantidad = newQuantity
    //   this.products[keyDelProductoAgregado].cantidad = this.products[keyDelProductoAgregado].cantidad

    //   if (productoAgregado.cantidad <= 0) {
    //     this.removeFromIndex(keyDelProductoAgregado)
    //   }
    // }
    // })
    // }

    this.sesionProducts.guardar(this.products)
    return (this.products);
  }





  addProductExist(productNew: any, newQuantity: number, indexExist: number) {
    // console.log("parece que ya esta agregado el producto..vamos a actualizar su cantidad")
    const cantAct = parseFloat(this.products[indexExist].cantidad + "")
    const cantNue = parseFloat(this.products[indexExist].cantidad + "") + parseFloat(newQuantity + "")

    // console.log("tipos de cantidad actual: ", typeof (cantAct), "..la nueva sera:", typeof (cantNue))
    // console.log("cantidad actual: ", cantAct, "..la nueva sera:", cantNue)

    const productExistente = this.products[indexExist]
    // console.log("productExistente: ", productExistente)

    if (
      productNew.preVenta
      && productExistente.preVenta
      && productNew.preVenta.indexOf(productExistente.preVenta) === -1
    ) {
      // console.log("revisamos has preventa")
      const updatedSalesData = [...this.products];
      updatedSalesData[indexExist].preVenta += "," + productNew.preVenta
      this.products = updatedSalesData;
      // console.log("finc de has preventa")
    }
    // this.products = this.incrementQuantityByIndex(indexExist, quantity, newPrice);
    // console.log("antes de changeQuantityByIndex")
    this.products = this.changeQuantityByIndex(indexExist, cantNue);
    // console.log("antes de checkQuantityEnvase")
    this.checkQuantityEnvase(indexExist, productNew)
  }






  addProductNew(productNew: any, newQuantity: number) {
    const newPrice = productNew.precioVenta;
    // console.log("es un producto que no esta en la lista.. no se agrupa o es pesable")
    const newProductSold = new ProductSold()
    newProductSold.fill(productNew)
    // newProductSold.idProducto = product.idProducto
    newProductSold.description = productNew.nombre
    // newProductSold.nombre = product.nombre
    newProductSold.cantidad = newQuantity
    newProductSold.cantidad = newQuantity
    newProductSold.pesable = (productNew.tipoVenta == 2)
    // newProductSold.tipoVenta = product.tipoVenta
    newProductSold.precioVenta = newPrice
    newProductSold.precioVenta = newProductSold.precioVenta
    newProductSold.key = this.products.length + 0
    // newProductSold.precioCosto = product.precioCosto
    // if (product.preVenta) {
    //   newProductSold.preVenta = product.preVenta
    //   // console.log("es preventa")
    // }

    newProductSold.extras = System.clone(extraDefaultLlevar)

    this.products = [...this.products, newProductSold]

    //si viene con envases desde back agrego como un producto especial
    if (ProductSold.tieneEnvases(productNew)) {
      // console.log("tiene envase")
      const envase = new ProductSold()
      envase.idProducto = 0
      envase.description = productNew.envase[0].descripcion
      envase.nombre = productNew.envase[0].descripcion
      if (productNew.envase[0].cantidad !== undefined) {
        envase.cantidad = productNew.envase[0].cantidad
      } else {
        envase.cantidad = newQuantity
      }
      envase.cantidad = newQuantity
      envase.pesable = false
      envase.tipoVenta = 1
      envase.ownerEnvaseId = productNew.idProducto
      envase.precioVenta = productNew.envase[0].costo
      envase.precioVenta = envase.precioVenta

      envase.precioCosto = productNew.envase[0].costo
      envase.updateSubtotal()
      this.products = [...this.products, envase]

      const lastProductIndex = this.findKeyAndPriceAndNameInProducts(
        productNew.idProducto,
        productNew.precioVenta,
        productNew.nombre
      )
      const lastProduct = this.products[lastProductIndex]

      lastProduct.hasEnvase = true
      envase.isEnvase = true
    }


    newProductSold.updateSubtotal()
  }


  addProduct(productoAAgregar: any, cantidad: number | null = null): ProductSold[] {
    // console.log("Sales: add product de sales", productoAAgregar)
    if (!productoAAgregar.precioVenta) return this.products;

    if (!cantidad && productoAAgregar.cantidad) cantidad = productoAAgregar.cantidad
    if (!cantidad) cantidad = 1

    // if(productoAAgregar.idProducto == 0) {
    //si tiene id en 0 deberia ser un envase que viene de preventa
    // console.log("productoAAgregar con idProducto en 0")
    // }

    const agruparProductoLinea = ModelConfig.get("agruparProductoLinea")

    // const existingProductIndex = this.findKeyAndPriceAndNameInProducts(product.idProducto, product.precioVenta, product.nombre)
    const existingProductIndex = this.findKeyAndPriceInProducts(productoAAgregar.idProducto, productoAAgregar.precioVenta)

    // console.log("agruparProductoLinea", agruparProductoLinea)
    // console.log("existingProductIndex", existingProductIndex)
    if (
      agruparProductoLinea
      // && !ProductSold.esPesable(productoAAgregar)
      && existingProductIndex !== -1
    ) {
      this.addProductExist(productoAAgregar, cantidad, existingProductIndex)
    } else {
      this.addProductNew(productoAAgregar, cantidad)
    }
    this.sesionProducts.guardar(this.products)
    return this.products;
  }

  removeFromIndex(index: number) {
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

  replaceProduct(keyProductRemove: number, productPut: any) {
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


  static prepararProductosParaPagar(productos: ProductSold[], requestData: any) {
    const productosFiltrados: any[] = []

    productos.forEach((producto) => {
      // console.log("prod", producto)
      const esEnvase = ProductSold.esEnvase(producto)
      if (esEnvase) {
        const owner = ProductSold.getOwnerByEnvase(producto, productos)
        const difcant = owner.cantidad - producto.cantidad
        productosFiltrados.push({
          codProducto: 0,
          codbarra: (producto.idProducto + ""),
          cantidad: System.getInstance().typeIntFloat(difcant),
          precioUnidad: producto.precioVenta,
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
          cantidad: System.getInstance().typeIntFloat(producto.cantidad),
          precioUnidad: producto.precioVenta,
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

  async getFromMirror(callbackOk: any, callbackWrong: any) {
    var url = "https://softus.com.ar/easypos/get-mirror"

    url += "?sucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    var uu = window.location.href
    uu = uu.replace("https://", "")
    uu = uu.replace("http://", "")
    uu = uu.split("/")[0]

    url += "&url=" + uu

    EndPoint.sendGet(url, (responseData: any, response: any) => {
      callbackOk(responseData.prods, response);
    }, callbackWrong)
  }

  async sendToMirror(prods: any, callbackOk: any, callbackWrong: any) {
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


    EndPoint.sendPost(url, data, (responseData: any, response: any) => {
      callbackOk(responseData.prods, response);
    }, callbackWrong)
  }
};


export default Sales;