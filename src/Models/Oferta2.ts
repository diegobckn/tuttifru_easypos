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

class Oferta2 extends ModelSingleton {
  info: any = null
  losCodbar: any = null
  codigosAplicables: any[] = []

  vaAplicando = 0

  setInfo(infoOferta: any) {
    this.info = infoOferta
  }

  // llegoACantidadRequerida(cantidad: number) {
  //   // console.log("llegoACantidadRequerida..cantidad", cantidad)

  //   var signo = this.info.signo === "=" ? ">=" : this.info.signo
  //   if (this.info.signo === ">") signo = ">="

  //   // const el = cantidad + signo + this.info.cantidad
  //   // console.log("eval", el, "----", this.info)
  //   return eval(cantidad + signo + this.info.cantidad)
  // }

  debeAplicar(productos: any) {
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

    if (productos.length < 1) {
      return false
    }

    // console.log("debeAplicar...para", System.clone(productos))
    this.info.products.forEach((pr: any) => {
      this.codigosAplicables[pr.codbarra] = 1
    })

    // console.log("this.codigosAplicables", this.codigosAplicables)
    var cuantosHay = 0
    productos.forEach((prod: any) => {
      if (this.estaEnAplicables(prod)) {
        cuantosHay++
        // } else {
        //   console.log("no aplica", prod)
      }
    });

    this.losCodbar = Object.keys(this.codigosAplicables)

    // console.log("cuantosHay", cuantosHay)
    // console.log("this.losCodbar", this.losCodbar)
    // console.log("this.codigosAplicables.length", this.codigosAplicables.length)

    const debeApli = cuantosHay == this.losCodbar.length
    // console.log("debe aplicar?", debeApli)

    // const rs = this.llegoACantidadRequerida(cuantosHay)
    // console.log("debeAplicar devuelve ", rs, "la oferta es ", this)
    // return rs
    if (debeApli) this.vaAplicando++

    if (this.vaAplicando > 10) {
      // if (this.vaAplicando > 100) {
      return false;
    }
    return debeApli
  }

  estaEnAplicables(producto: any) {
    return this.codigosAplicables[producto.idProducto]
  }

  agregarATotalGrupo(nuevaInfo: any, totalesGral: any) {
    var item: any = totalesGral[nuevaInfo.grupoAplicado]
    if (!item) {
      item = {}
      item.totalSinDescuento = parseFloat(nuevaInfo.precioVentaOriginal) * parseFloat(nuevaInfo.cantidad)
      item.montoFinal = parseFloat(nuevaInfo.ofertaAplicada.monto)
    } else {
      item.totalSinDescuento += parseFloat(nuevaInfo.precioVentaOriginal) * parseFloat(nuevaInfo.cantidad)
    }
    totalesGral[nuevaInfo.grupoAplicado] = item
    nuevaInfo.resumenOfertaAplicada = totalesGral
  }

  aplicar(productos: any): ResultadoAplicarOferta {

    if (this.codigosAplicables.length < 1) this.codigosAplicables = this.info.products.map((pr: any) => pr.codbarra)


    const resul: ResultadoAplicarOferta = {
      productosQueAplican: [],
      productosQueNoAplican: []
    }

    var precioEnOferta = this.info.monto / this.info.cantidad

    var totalesGrupos: any = {}

    var grupoNuevo = Ofertas.cantidadAplicada + 1

    var arrFaltaAplicar: any = System.clone(this.losCodbar)
    const faltaYDebeAplicar = (prod: any) => {
      if (!this.estaEnAplicables(prod)) {
        // console.log("no debe aplicar porque no esta en aplicables")
        return false
      }
      if (!arrFaltaAplicar.includes(prod.idProducto)) {
        // console.log("no debe aplicar porque ya se quito del array de faltantes")
        return false
      }
      return true
    }

    const quitarDeFaltantes = (prod: any) => {
      if (arrFaltaAplicar[prod.idProducto]) {
        const ixQuitar = arrFaltaAplicar.indexOf(prod.idProducto)
        if (ixQuitar > -1) {
          arrFaltaAplicar.splice(ixQuitar, 1)
        }
      }
    }

    // guarda las cantidades por codigos de barra
    var acumulando: any = {
      // codbarra: 1.5
    }
    const aCuantoLlega = (prod: any) => {
      if (acumulando[prod.idProducto] == undefined) {
        // console.log("lo inicia en 0 al acumulador")
        acumulando[prod.idProducto] = 0
      }
      return acumulando[prod.idProducto] + prod.cantidad
    }
    const acumularProd = (prod: any) => {
      // console.log("acumularProd", prod)
      // console.log("acumulando", System.clone(acumulando))
      // console.log("suma ", parseFloat(prod.cantidad), "al acumulador")
      acumulando[prod.idProducto] += parseFloat(prod.cantidad)
    }

    productos.forEach((prod: any) => {
      if (faltaYDebeAplicar(prod)) {
        // console.log("debe aplicar", prod)
        const llegaA = aCuantoLlega(prod)
        // console.log("llegaA", llegaA)

        if (llegaA >= 1) {

          // console.log("llegaA >= 1")



          const copiaProd = System.clone(prod)

          const copiaAplica: any = new ProductSold()
          copiaAplica.fill(copiaProd)
          copiaAplica.cantidad = 1
          copiaAplica.precioVentaOriginal = prod.precioVenta + 0
          copiaAplica.precioVenta = precioEnOferta
          copiaAplica.ofertaAplicada = System.clone(this.info)

          copiaAplica.grupoAplicado = grupoNuevo
          copiaAplica.updateSubtotal()

          this.agregarATotalGrupo(copiaAplica, totalesGrupos)

          resul.productosQueAplican.push(copiaAplica)

          quitarDeFaltantes(copiaAplica)

          var cantidadSobra = llegaA - 1
          if (cantidadSobra > 0) {
            const copiaNoAplica = new ProductSold()
            copiaNoAplica.fill(copiaProd)
            copiaNoAplica.cantidad = cantidadSobra
            copiaAplica.grupoAplicado = grupoNuevo
            copiaNoAplica.updateSubtotal()
            resul.productosQueNoAplican.push(copiaNoAplica)
            acumulando[prod.idProducto] = cantidadSobra
          }
        } else {
          acumularProd(prod)
        }
      } else {
        // console.log("no debe aplicar", prod)
        // console.log("arrFaltaAplicar", arrFaltaAplicar)
        // console.log("this.losCodbar", this.losCodbar)
        // console.log("this.codigosAplicables", this.codigosAplicables)
      }
    })

    // console.log("acumulando", acumulando)
    // console.log("resul", resul)
    return resul
  }

};

export default Oferta2