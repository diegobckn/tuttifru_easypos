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
import ModelSingleton from './ModelSingleton.ts';
import Ofertas from './Ofertas.ts';

export interface ResultadoAplicarOferta {
  productosQueAplican: any[]
  productosQueNoAplican: any[]
}

class Oferta13 extends ModelSingleton {
  info: any = null
  codigosAplicables: any[] = []

  setInfo(infoOferta: any) {
    this.info = infoOferta
  }

  llegoACantidadRequerida(cantidad: number) {
    // console.log("llegoACantidadRequerida..cantidad", cantidad)

    var signo = this.info.signo === "=" ? ">=" : this.info.signo
    if (this.info.signo === ">") signo = ">="

    // const el = cantidad + signo + this.info.cantidad
    // console.log("eval", el, "----", this.info)
    return eval(cantidad + signo + this.info.cantidad)
  }

  debeAplicar(productos: any) {
    // console.log("debeAplicar...para", productos)
    // console.log("this.info.products", this.info.products)
    // console.log("debeAplicar..this", this)
    if (
      this.info.signo !== "="
      && this.info.signo !== ">"
      && this.info.signo !== "<"
      && this.info.signo !== ">="
      && this.info.signo !== "<="
    ) {
      // console.log("debeAplicar devuelve false")
      return false
    }

    if (this.codigosAplicables.length < 1) this.codigosAplicables = this.info.products.map((pr: any) => pr.codbarra)

    // console.log("this.codigosAplicables", this.codigosAplicables)
    var cuantosHay = 0
    productos.forEach((prod: any) => {
      if (this.estaEnAplicables(prod)) {
        cuantosHay += parseFloat(prod.cantidad)
      }
    });

    // console.log("cuantosHay", cuantosHay)

    const rs = this.llegoACantidadRequerida(cuantosHay)
    // console.log("debeAplicar devuelve ", rs, "la oferta es ", this)
    return rs
  }

  estaEnAplicables(producto: any) {
    return this.codigosAplicables.indexOf(producto.idProducto) > -1
  }

  aplicar(productos: any): ResultadoAplicarOferta {

    if (this.codigosAplicables.length < 1) this.codigosAplicables = this.info.products.map((pr: any) => pr.codbarra)


    const resul: ResultadoAplicarOferta = {
      productosQueAplican: [],
      productosQueNoAplican: []
    }

    var precioEnOferta = this.info.monto / this.info.cantidad
    var cantidadAcumulada = 0
    var seAplico = false

    var totalesGrupos: any = {}

    productos.forEach((prod: any) => {
      if (!seAplico && this.estaEnAplicables(prod)) {
        if (cantidadAcumulada === 0 && this.llegoACantidadRequerida(prod.cantidad)) {
          const copiaProd = System.clone(prod)

          const copiaAplica: any = new ProductSold()
          copiaAplica.fill(copiaProd)
          copiaAplica.cantidad = parseFloat(this.info.cantidad)//porque tiene igual o mas
          copiaAplica.precioVentaOriginal = prod.precioVenta + 0
          copiaAplica.precioVenta = precioEnOferta
          copiaAplica.ofertaAplicada = System.clone(this.info)
          Ofertas.cantidadAplicada++
          copiaAplica.grupoAplicado = Ofertas.cantidadAplicada
          copiaAplica.updateSubtotal()
          resul.productosQueAplican.push(copiaAplica)
          var cantidadRestante = parseFloat(prod.cantidad) - this.info.cantidad
          if (cantidadRestante > 0) {
            const copiaNoAplica = new ProductSold()
            copiaNoAplica.fill(copiaProd)
            copiaNoAplica.cantidad = cantidadRestante//toma lo que se paso
            copiaNoAplica.updateSubtotal()

            resul.productosQueNoAplican.push(copiaNoAplica)
          }
          seAplico = true
        } else if (this.llegoACantidadRequerida(parseFloat(prod.cantidad) + cantidadAcumulada)) {
          var cantidadAplica = parseFloat(this.info.cantidad) - cantidadAcumulada
          var cantidadSobra = cantidadAcumulada + parseFloat(prod.cantidad) - this.info.cantidad
          const copiaProd = System.clone(prod)
          const copiaAplica: any = new ProductSold()
          copiaAplica.fill(copiaProd)
          copiaAplica.cantidad = cantidadAplica
          copiaAplica.precioVentaOriginal = prod.precioVenta + 0
          copiaAplica.precioVenta = precioEnOferta
          copiaAplica.ofertaAplicada = System.clone(this.info)
          copiaAplica.updateSubtotal()
          copiaAplica.grupoAplicado = Ofertas.cantidadAplicada

          resul.productosQueAplican.push(copiaAplica)

          seAplico = true
          Ofertas.cantidadAplicada++
          if (cantidadSobra > 0) {
            const copiaNoAplica = new ProductSold()
            copiaNoAplica.fill(copiaProd)
            copiaNoAplica.cantidad = cantidadSobra
            copiaAplica.grupoAplicado = Ofertas.cantidadAplicada
            copiaNoAplica.updateSubtotal()
            resul.productosQueNoAplican.push(copiaNoAplica)
          }
        } else {
          const copiaProd = System.clone(prod)
          const copiaAplica: any = new ProductSold()
          copiaAplica.fill(copiaProd)
          copiaAplica.precioVenta = precioEnOferta
          copiaAplica.precioVentaOriginal = prod.precioVenta + 0
          copiaAplica.ofertaAplicada = System.clone(this.info)
          copiaAplica.grupoAplicado = Ofertas.cantidadAplicada

          copiaAplica.updateSubtotal()

          resul.productosQueAplican.push(copiaAplica)
          cantidadAcumulada += parseFloat(prod.cantidad)
        }
      } else {
        resul.productosQueNoAplican.push(System.clone(prod))
      }
    })
    // console.log("resul", resul)
    return resul
  }

};

export default Oferta13