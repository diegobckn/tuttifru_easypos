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

  //   var signo = this.info.oferta_Regla.signo === "=" ? ">=" : this.info.oferta_Regla.signo
  //   if (this.info.oferta_Regla.signo === ">") signo = ">="

  //   // const el = cantidad + signo + this.info.oferta_Regla.cantidad
  //   // console.log("eval", el, "----", this.info)
  //   return eval(cantidad + signo + this.info.oferta_Regla.cantidad)
  // }

  debeAplicar(productos: any) {
    var me = this
    // console.log("this.info.products", this.info.products)
    // console.log("debeAplicar??..this", this)
    if (
      me.info.oferta_Regla.signo !== "="
      && me.info.oferta_Regla.signo !== ">"
      && me.info.oferta_Regla.signo !== "<"
      && me.info.oferta_Regla.signo !== ">="
      && me.info.oferta_Regla.signo !== "<="
    ) {
      // console.log("debeAplicar?? devuelve false..signo mal")
      return false
    }

    if (productos.length < 1) {
      // console.log("debeAplicar?? devuelve false..no hay productos")

      return false
    }

    // console.log("debeAplicar...para", System.clone(productos))
    me.codigosAplicables = []
    me.info.products.forEach((pr: any) => {
      // me.codigosAplicables[pr.codbarra] = 1
      me.codigosAplicables.push(pr.codbarra)
    })

    // console.log("me.codigosAplicables", me.codigosAplicables)
    var cuantosHay = 0
    me.losCodbar = []
    productos.forEach((prod: any) => {
      if (me.estaEnAplicables(prod)) {
        // console.log("esta en aplicables", prod)
        cuantosHay += this.puedeTomarCantidad(prod)
        me.losCodbar.push(prod.idProducto)
      } else {
        // console.log("no aplica", prod)
      }
      // console.log("ya cuantosHay", cuantosHay + 0)

    });

    // me.losCodbar = Object.keys(me.codigosAplicables)

    // console.log("cuantosHay", cuantosHay)
    // console.log("me.losCodbar", me.losCodbar)
    // console.log("me.codigosAplicables.length", me.codigosAplicables.length)

    const debeApli = cuantosHay >= me.codigosAplicables.length
    // console.log("debe aplicar?", debeApli)
    // console.log("me", me)

    // const rs = me.llegoACantidadRequerida(cuantosHay)
    // console.log("debeAplicar devuelve ", rs, "la oferta es ", this)
    // return rs
    if (debeApli) me.vaAplicando++

    if (me.vaAplicando > 10) {
      // if (me.vaAplicando > 100) {
      return false;
    }
    return debeApli
  }

  estaEnAplicables(producto: any) {
    // return this.codigosAplicables[producto.idProducto]
    return this.codigosAplicables.includes(producto.idProducto)
  }

  agregarATotalGrupo(nuevaInfo: any, totalesGral: any) {
    // console.log("agregarATotalGrupo..nuevaInfo", System.clone(nuevaInfo))
    // console.log("agregarATotalGrupo..totalesGral", System.clone(totalesGral))
    var item: any = totalesGral[nuevaInfo.grupoAplicado]

    const cantidadATomar = parseFloat(this.puedeTomarCantidad(nuevaInfo))
    if (!item) {
      item = {}
      item.totalSinDescuento = parseFloat(nuevaInfo.precioVentaOriginal) * cantidadATomar
      item.montoFinal = parseFloat(nuevaInfo.ofertaAplicada.oferta_Regla.valor)
    } else {
      item.totalSinDescuento += parseFloat(nuevaInfo.precioVentaOriginal) * cantidadATomar
    }
    totalesGral[nuevaInfo.grupoAplicado] = item
    // console.log("agregarATotalGrupo..totalesGral quedo asi", System.clone(totalesGral))
    nuevaInfo.resumenOfertaAplicada = totalesGral
  }


  puedeTomarCantidad(prod: any) {
    // console.log("puedeTomarCantidad..oferta", this)
    // console.log("puedeTomarCantidad..prod", prod)
    var puede = 0
    this.info.products.forEach((prodOfer: any) => {
      if (prodOfer.codbarra == prod.idProducto) {
        puede++
      }
    })

    if (prod.cantidad <= puede) {
      // console.log("puede tomar devuelve:", prod.cantidad)
      return prod.cantidad
    } else {
      // console.log("puede tomar devuelve:", puede)
      return puede
    }
  }

  aplicar(productos: any): ResultadoAplicarOferta {
    var me = this
    if (Object.values(this.codigosAplicables).length < 1) {
      // console.log("no hay aplicables..lo relleno ahora", System.clone(this.codigosAplicables))
      var prodByCodBar: any = []
      this.info.products.forEach((pr: any) => {
        prodByCodBar[pr.codbarra] = pr
      })
      this.codigosAplicables = prodByCodBar
      // console.log("luego de rellenar", System.clone(this.codigosAplicables))
    }


    const resul: ResultadoAplicarOferta = {
      productosQueAplican: [],
      productosQueNoAplican: []
    }

    var precioEnOferta = this.info.oferta_Regla.valor / this.info.oferta_Regla.cantidad

    var totalesGrupos: any = {}

    var grupoNuevo = Ofertas.cantidadAplicada + 1

    var arrFaltaAplicar: any = System.clone(this.losCodbar)
    const faltaYDebeAplicar = (prod: any) => {
      if (!this.estaEnAplicables(prod)) {
        // console.log("no debe aplicar porque no esta en aplicables", System.clone(prod))
        // console.log("prod", System.clone(prod))
        // console.log("aplicables", System.clone(this.codigosAplicables))
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
        // console.log("revisando para aplicar", prod)
        // console.log("debe aplicar", prod)
        const llegaA = aCuantoLlega(prod)
        // console.log("llegaA", llegaA)

        if (llegaA >= 1) {

          // console.log("llegaA >= 1")



          const copiaProd = System.clone(prod)

          const puedeTomarCantidad = me.puedeTomarCantidad(prod)

          const copiaAplica: any = new ProductSold()
          copiaAplica.fill(copiaProd)
          copiaAplica.cantidad = puedeTomarCantidad
          copiaAplica.precioVentaOriginal = prod.precioVenta + 0
          copiaAplica.precioVenta = precioEnOferta
          copiaAplica.ofertaAplicada = System.clone(this.info)

          copiaAplica.grupoAplicado = grupoNuevo
          copiaAplica.updateSubtotal()

          this.agregarATotalGrupo(copiaAplica, totalesGrupos)

          resul.productosQueAplican.push(copiaAplica)

          quitarDeFaltantes(copiaAplica)

          var cantidadSobra = llegaA - puedeTomarCantidad
          // console.log("cantidadSobra", cantidadSobra)
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
        const copiaProd = System.clone(prod)

        const copiaNoAplica = new ProductSold()
        copiaNoAplica.fill(copiaProd)
        resul.productosQueNoAplican.push(copiaNoAplica)
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