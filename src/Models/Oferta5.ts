import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Sale from './Sale.ts';
import Sales from './Sales.ts';

import BaseConfig from "../definitions/BaseConfig.ts";
import ModelConfig from './ModelConfig.ts';
import axios from 'axios';
import EndPoint from './EndPoint.ts';
import Model from './Model.js';
import System from '../Helpers/System.ts';
import ProductSold from './ProductSold.ts';

export interface ResultadoAplicarOferta {
  productosQueAplican: any[]
  productosQueNoAplican: any[]
}

class Oferta5 {
  info: any = null
  codigosAplicables: any[] = []

  static session = new StorageSesion("ofertas")

  setInfo(infoOferta:any) {
    this.info = infoOferta

  }

  static guardarOffline(info:any) {
    this.session.guardar(info)
  }

  llegoACantidadRequerida(cantidad:number) {
    var signo = this.info.signo === "=" ? ">=" : this.info.signo
    if (this.info.signo === ">") signo = ">="

    const el = cantidad + signo + this.info.cantidad
    // console.log("eval", el)
    return eval(cantidad + signo + this.info.cantidad)
  }

  debeAplicar(productos:any) {
    // console.log("debeAplicar...para", productos)
    // console.log("this.info.products", this.info.products)

    if (this.codigosAplicables.length < 1) this.codigosAplicables = this.info.products.map((pr:any) => pr.codbarra)

    // console.log("this.codigosAplicables", this.codigosAplicables)
    var cuantosHay = 0
    productos.forEach((prod:any) => {
      if (this.estaEnAplicables(prod)) {
        cuantosHay += parseFloat(prod.quantity)
      }
    });

    // console.log("cuantosHay", cuantosHay)

    const rs = this.llegoACantidadRequerida(cuantosHay)
    // console.log("debeAplicar devuelve ", rs)
    return rs
  }

  estaEnAplicables(producto:any) {
    return this.codigosAplicables.indexOf(producto.idProducto) > -1
  }

  aplicar(productos:any): ResultadoAplicarOferta {

    if (this.codigosAplicables.length < 1) this.codigosAplicables = this.info.products.map((pr:any) => pr.codbarra)


    const resul: ResultadoAplicarOferta = {
      productosQueAplican: [],
      productosQueNoAplican: []
    }

    var precioEnOferta = this.info.monto / this.info.cantidad
    var cantidadAcumulada = 0
    var seAplico = false

    productos.forEach((prod:any) => {
      if (!seAplico && this.estaEnAplicables(prod)) {
        if (cantidadAcumulada === 0 && this.llegoACantidadRequerida(prod.quantity)) {
          const copiaProd = System.clone(prod)

          const copiaAplica = new ProductSold()
          copiaAplica.fill(copiaProd)
          copiaAplica.quantity = parseFloat(this.info.cantidad)//porque tiene igual o mas
          copiaAplica.price = precioEnOferta
          copiaAplica.updateSubtotal()
          resul.productosQueAplican.push(copiaAplica)

          var cantidadRestante = parseFloat(prod.quantity) - this.info.cantidad
          if (cantidadRestante > 0) {
            const copiaNoAplica = new ProductSold()
            copiaNoAplica.fill(copiaProd)
            copiaNoAplica.quantity = cantidadRestante//toma lo que se paso
            copiaNoAplica.updateSubtotal()
            resul.productosQueNoAplican.push(copiaNoAplica)
          }
          seAplico = true
        } else if (this.llegoACantidadRequerida(parseFloat(prod.quantity) + cantidadAcumulada)) {
          // revisar si sobre paso 
          var cantidadAplica = parseFloat(this.info.cantidad) - cantidadAcumulada
          var cantidadSobra = cantidadAcumulada + parseFloat(prod.quantity) - this.info.cantidad
          /*
          llegar a 7
          viene con 3
          este prod tiene 6
          ..
          aplica a 4 unidades de este prod... 7 -  (3).. 4
          sobran 2 unidades de este prod... 3 + 6 - 7 .. 2
          */
          const copiaProd = System.clone(prod)

          const copiaAplica = new ProductSold()
          copiaAplica.fill(copiaProd)
          copiaAplica.quantity = cantidadAplica
          copiaAplica.price = precioEnOferta
          copiaAplica.updateSubtotal()
          resul.productosQueAplican.push(copiaAplica)

          seAplico = true

          if (cantidadSobra > 0) {
            const copiaNoAplica = new ProductSold()
            copiaNoAplica.fill(copiaProd)
            copiaNoAplica.quantity = cantidadSobra
            copiaNoAplica.updateSubtotal()
            resul.productosQueNoAplican.push(copiaNoAplica)
          }
        } else {
          //lo acumulado no llega a lo requerido

          /*
          llegar a 7
          viene con 2
          este prod tiene 1
          ..
          aplica a 4 unidades de este prod... 7 -  (3).. 4
          sobran 2 unidades de este prod... 3 + 6 - 7 .. 2
          */

          const copiaProd = System.clone(prod)

          const copiaAplica = new ProductSold()
          copiaAplica.fill(copiaProd)
          copiaAplica.price = precioEnOferta
          copiaAplica.updateSubtotal()
          resul.productosQueAplican.push(copiaAplica)

          cantidadAcumulada += parseFloat(prod.quantity)

        }

      } else {
        resul.productosQueNoAplican.push(System.clone(prod))
      }

    })


    return resul
  }

};

export default Oferta5;