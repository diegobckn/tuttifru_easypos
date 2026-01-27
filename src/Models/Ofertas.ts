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
import ModosTrabajoConexion from '../definitions/ModosConexion.ts';
import Oferta134 from './Oferta134.ts';
import Oferta5 from './Oferta5.ts';
import Oferta2 from './Oferta2.ts';


export default class extends ModelSingleton {
  static cantidadAplicada = 0

  static aplicando = false

  constructor() {
    super()
    this.sesion = new StorageSesion("ofertas")
  }

  static guardarOffline(info: any) {
    this.getInstance().sesion.guardar(info)
  }

  static async getOfertas(callbackOk: any, callbackWrong: any) {
    const url = ModelConfig.get("urlBase") + "/api/Ofertas/GetOfertas"
    EndPoint.sendGet(url, (responseData: any, response: any) => {
      callbackOk(responseData.ofertas, response)
    }, callbackWrong)
  }

  static revisarOfertas(productosVendidos: any, ofertas: any, callbackAplicoAlgo: any, callbackNoAplicoNada: any) {
    // console.log("revisarOfertas")
    if (this.aplicando) return
    this.aplicando = true
    if (ofertas.length < 1) {
      callbackNoAplicoNada()
      this.aplicando = false
    }

    var copiaProductos = productosVendidos
    var resultadoOfertas: any = {
      productosQueAplican: [],
      productosQueNoAplican: copiaProductos
    }

    var tieneTipo2 = false

    ofertas.forEach((ofer: any, ix: number) => {
      if ([1, 2, 3, 4, 5].includes(ofer.tipo)) {
        var of: any = null;
        if (ofer.tipo == 5) {
          of = new Oferta5();
        } else {
          if (ofer.tipo == 2) {
            tieneTipo2 = true
            of = new Oferta2();
          } else {
            of = new Oferta134();
          }
        }
        of.setInfo(ofer)


        while (of.debeAplicar(resultadoOfertas.productosQueNoAplican)) {
          const resultadoAplicar: any = of.aplicar(resultadoOfertas.productosQueNoAplican)
          // console.log("luego de aplicar queda asi", resultadoAplicar)

          resultadoOfertas.productosQueAplican =
            resultadoOfertas.productosQueAplican.concat(resultadoAplicar.productosQueAplican)
          resultadoOfertas.productosQueNoAplican =
            resultadoAplicar.productosQueNoAplican
        }
      }
    })

    if (tieneTipo2 && resultadoOfertas.productosQueAplican.length > 0) {
      // console.log("hay que corregir")

      // console.log("resultadoOfertas", resultadoOfertas)
      resultadoOfertas.productosQueAplican.forEach((prodConOferta: any) => {
        const miGrup = prodConOferta.grupoAplicado
        if (
          prodConOferta.ofertaAplicada.tipo == 2
          && prodConOferta.grupoAplicado
          && prodConOferta.resumenOfertaAplicada[miGrup]
        ) {
          const totSinDesc = prodConOferta.resumenOfertaAplicada[miGrup].totalSinDescuento
          const dif = totSinDesc - prodConOferta.resumenOfertaAplicada[miGrup].montoFinal


          const miSubOri = prodConOferta.precioVentaOriginal * prodConOferta.cantidad
          const miPorc = miSubOri * 100 / totSinDesc

          prodConOferta.descuentoReal = ((miPorc / 100) * dif) / prodConOferta.cantidad
          prodConOferta.precioVenta = prodConOferta.precioVentaOriginal - prodConOferta.descuentoReal

          // console.log("prodConOferta.resumenOfertaAplicada[miGrup]", prodConOferta.resumenOfertaAplicada[miGrup])
          // console.log("totSinDesc", totSinDesc)
          // console.log("dif", dif)
          // console.log("miSubOri", miSubOri)
          // console.log("miPorc", miPorc)
        }
      })
    }
    // console.log("resultado final", resultadoOfertas)

    var totalVentasx = 0
    var productosVendidosx: any = []

    resultadoOfertas.productosQueAplican.forEach((prod: any) => {
      totalVentasx += prod.total
      productosVendidosx.push(prod)
    })

    resultadoOfertas.productosQueNoAplican.forEach((prod: any) => {
      totalVentasx += prod.total
      productosVendidosx.push(prod)
    })
    callbackAplicoAlgo(resultadoOfertas, totalVentasx, productosVendidosx)

    this.aplicando = false
  }

  // static getTotalResultados(resultados: any) {
  //   var totalVentasx = 0
  //   var productosVendidosx: any = []

  //   resultados.productosQueAplican.forEach((prod: any) => {
  //     totalVentasx += prod.total
  //     productosVendidosx.push(prod)
  //   })

  //   resultados.productosQueNoAplican.forEach((prod: any) => {
  //     totalVentasx += prod.total
  //     productosVendidosx.push(prod)
  //   })

  //   // console.log("total de las ventas aplicando ofertas es $", totalVentasx)
  //   return totalVentasx
  // }

  static aplicarTodas(productosVendidos: any, callbackAplicoAlgo: any, callbackNoAplicoNada: any) {
    if (!ModelConfig.get("checkOfertas")) {
      callbackNoAplicoNada()
      return
    }

    const modoTrabajoConexion = ModelConfig.get("modoTrabajoConexion")

    if (
      (modoTrabajoConexion == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
        || modoTrabajoConexion == ModosTrabajoConexion.SOLO_OFFLINE)
      && this.getInstance().sesion.hasOne()
    ) {
      this.revisarOfertas(productosVendidos, this.getInstance().sesion.cargar(1), callbackAplicoAlgo, callbackNoAplicoNada)
      return
    }

    this.getOfertas((ofertas: any) => {
      // this.dejarSoloTipo(5, ofertas, (ofertasTipo: any) => {
      this.guardarOffline(ofertas)
      // this.revisarOfertas(productosVendidos, ofertasTipo, callbackAplicoAlgo, callbackNoAplicoNada)
      this.revisarOfertas(productosVendidos, ofertas, callbackAplicoAlgo, callbackNoAplicoNada)
      // })
    }, () => {
      if (this.getInstance().sesion.hasOne()) {
        this.revisarOfertas(productosVendidos, this.getInstance().sesion.cargar(1), callbackAplicoAlgo, callbackNoAplicoNada)
      } else {
        callbackNoAplicoNada()
      }
    })
  }

  static calcularDescuentosFinales(resultadoOfertas: any, callbackOk: any) {

    const agrupados: any = []

    resultadoOfertas.productosQueAplican.forEach((prod: any) => {
      if (agrupados[prod.idProducto]) {
        var cantidadAnterior = parseFloat(agrupados[prod.idProducto].cantidad)
        // console.log("cantidadAnterior", cantidadAnterior + 0)
        var totalAnterior = agrupados[prod.idProducto].precioVenta
        cantidadAnterior += parseFloat(prod.cantidad)
        // console.log("cantidadAnterior despues", cantidadAnterior + 0)
        totalAnterior += parseFloat(prod.cantidad) * parseFloat(prod.precioVenta)

        agrupados[prod.idProducto].cantidad = cantidadAnterior
      } else {
        agrupados[prod.idProducto] = System.clone(prod)
      }
    })
    // console.log("agrupados", agrupados)

    var totalDescuentos = 0

    const prodConOfer: any = []

    Object.keys(agrupados).forEach((prodOfe) => {
      // console.log("agrupados[prodOfe]", agrupados[prodOfe])

      const cant = parseFloat(agrupados[prodOfe].cantidad)
      const orig = parseFloat(agrupados[prodOfe].precioVentaOriginal)
      const conOfer = parseFloat(agrupados[prodOfe].precioVenta)

      // console.log("cant", cant)
      // console.log("orig", orig)
      // console.log("conOfer", conOfer)

      const elDescuento = parseFloat(((cant * orig) - (cant * conOfer)).toFixed(2))
      // console.log("elDescuento", elDescuento)

      agrupados[prodOfe].elDescuento = elDescuento

      if (elDescuento < 0) {
        // setOfertasContradictorias(true)
        totalDescuentos += elDescuento
      } else {
        totalDescuentos += elDescuento
        // totalDescuentos -= elDescuento
      }

      // console.log("acum descuentos ", totalDescuentos)
      prodConOfer.push(agrupados[prodOfe])
    })

    // console.log("prodConOfer", prodConOfer)
    // console.log("totalDescuentos", totalDescuentos)

    callbackOk(prodConOfer, totalDescuentos)

  }

  static dejarSoloTipo(tipo: number, ofertas: any, callback: any) {
    // console.log("dejarSoloTipo ", tipo)
    var ofertasTipo: any = []
    ofertas.forEach((ofer: any) => {
      if (ofer.tipo == tipo) {
        ofertasTipo.push(ofer)
      }
    })
    // console.log("queda tipo ", ofertasTipo)
    callback(ofertasTipo)
  }

};