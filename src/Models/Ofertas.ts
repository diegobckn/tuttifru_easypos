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
import Ofertas from './Ofertas.ts';
import LoopProperties from '../Helpers/LoopProperties.ts';
import Product from './Product.ts';
import Client from './Client.ts';


export default class extends ModelSingleton {
  static cantidadAplicada = 0

  static aplicando = false

  constructor() {
    super()
    this.sesion = new StorageSesion("ofertas")
  }

  async almacenarParaOffline(
    callbackOk: any = () => { },
    callbackWrong: any = () => { }) {
    var me = this

    Ofertas.getAllOfertas((ofertas: any) => {
      var ofersOk: any = []
      ofertas.forEach((ofer: any) => {
        if (!Ofertas.estaVacia(ofer)) {
          ofersOk.push(ofer)
        }
      })
      me.sesion.guardar(ofersOk)
      callbackOk()
    }, callbackWrong)
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
  static async getAllOfertas(callbackOk: any, callbackWrong: any) {
    const url = ModelConfig.get("urlBase") + "/api/Ofertas/GetAllOfertas"
    EndPoint.sendGet(url, (responseData: any, response: any) => {
      callbackOk(responseData.ofertas, response)
    }, callbackWrong)
  }

  static revisarOfertas(productosVendidos: any, ofertas: any, callbackAplicoAlgo: any, callbackNoAplicoNada: any) {
    if (this.aplicando) {
      // console.log("revisarOfertas ya se esta aplicando ofertas")
      return
    }
    this.aplicando = true
    if (ofertas.length < 1 || productosVendidos.length < 1) {
      callbackNoAplicoNada()
      this.aplicando = false
      return
    }

    // console.log("revisarOfertas las ofertas", System.clone(ofertas))
    // console.log("revisarOfertas para los productos", System.clone(productosVendidos))
    var copiaProductos = System.clone(productosVendidos)
    var resultadoOfertas: any = {
      productosQueAplican: [],
      productosQueNoAplican: copiaProductos
    }

    var tieneTipo2 = false

    ofertas.forEach((ofer: any, ix: number) => {
      // if (ofer.codigoTipo == 2) console.log("ciclo ", (ix + 1), "oferta: ", System.clone(ofer))
      if ([1, 2, 3, 4, 5].includes(ofer.codigoTipo)) {
        var of: any = null;
        // console.log("trabajando con oferta", System.clone(ofer))
        if (ofer.codigoTipo == 5) {
          of = new Oferta5();
        } else {
          if (ofer.codigoTipo == 2) {
            tieneTipo2 = true
            of = new Oferta2();
          } else {
            // console.log("es codigoTipo 1 o 3 o 4")
            of = new Oferta134();
          }
        }
        // if (ofer.codigoTipo == 2) console.log("ofer.codigoTipo", ofer.codigoTipo)
        of.setInfo(ofer)
        // if (ofer.codigoTipo == 2) console.log("of", of)


        while (of.debeAplicar(resultadoOfertas.productosQueNoAplican)) {
          // console.log("debe aplicar")
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
          prodConOferta.ofertaAplicada.codigoTipo == 2
          && prodConOferta.grupoAplicado
          && prodConOferta.resumenOfertaAplicada[miGrup]
        ) {
          // console.log("prodConOferta.resumenOfertaAplicada[miGrup]", prodConOferta.resumenOfertaAplicada[miGrup])
          const totSinDesc = prodConOferta.resumenOfertaAplicada[miGrup].totalSinDescuento
          const dif = totSinDesc - prodConOferta.resumenOfertaAplicada[miGrup].montoFinal

          // console.log("dif", dif)

          const miSubOri = prodConOferta.precioVentaOriginal * prodConOferta.cantidad
          // console.log("miSubOri", miSubOri)
          const miPorc = miSubOri * 100 / totSinDesc
          // console.log("miPorc", miPorc)

          prodConOferta.descuentoReal = ((miPorc / 100) * dif) / prodConOferta.cantidad
          prodConOferta.precioVenta = prodConOferta.precioVentaOriginal - prodConOferta.descuentoReal

          // console.log("prodConOferta", prodConOferta)
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
      const productoSold = ProductSold.createByValues(prod)
      totalVentasx += productoSold.total
      // console.log("productoSold", productoSold)
      productosVendidosx.push(prod)
    })

    resultadoOfertas.productosQueNoAplican.forEach((prod: any) => {
      const productoSold = ProductSold.createByValues(prod)
      totalVentasx += productoSold.total
      // console.log("productoSold", productoSold)
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

    this.getAllOfertas((ofertas: any) => {
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
    // console.log("calcularDescuentosFinales")
    const agrupados: any = {}

    resultadoOfertas.productosQueAplican.forEach((prod: any, indexPQA: number) => {
      // console.log("prod", prod)
      if (agrupados[prod.idProducto]) {
        agrupados[prod.idProducto + (indexPQA + 1)] = System.clone(prod)

        // console.log("existe agrupado para ", prod.idProducto, "..hace uno parecido")
        // var cantidadAnterior = parseFloat(agrupados[prod.idProducto].cantidad)
        // // console.log("cantidadAnterior", cantidadAnterior + 0)
        // var totalAnterior = agrupados[prod.idProducto].precioVenta
        // cantidadAnterior += parseFloat(prod.cantidad)
        // // console.log("cantidadAnterior despues", cantidadAnterior + 0)
        // totalAnterior += parseFloat(prod.cantidad) * parseFloat(prod.precioVenta)

        // agrupados[prod.idProducto].cantidad = cantidadAnterior
      } else {
        // console.log("no existe agrupado para ", prod.idProducto, ".. se debe crear")
        agrupados[prod.idProducto] = System.clone(prod)
      }
      // console.log("adentro de foreach agrupados", System.clone(agrupados))
    })
    // console.log("agrupados", System.clone(agrupados))

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


  static estaVacia(oferta: any) {
    return (
      oferta.monto <= 0
      && oferta.products[0].codbarra == "string"
    )
  }

  static esCorrecta(oferta: any) {
    return (
      oferta.productosValidos
      && oferta.productosValidos.length > 0
    )
  }

  static esProductoPermitido(producto: any) {
    return (
      !producto.mostrarPrecioRangos
      || producto.mostrarPrecioRangos.length < 1
      || producto.mostrarPrecioRangos[0].cantidadDesde <= 0
    )
  }


  static cargarProductosDeOferta(
    oferta: any,
    callbackOk: (prods: any) => void,
    arrayAcumuladorProductos: any = [],
    codigoCliente = 0) {

    var prodOfe: any = []
    new LoopProperties(oferta.products,
      (ix2: string, prodOferGuar: any, looperProds: LoopProperties) => {

        // console.log("prodOferGuar", prodOferGuar)
        Product.getInstance().findByCodigoBarras({
          codigoCliente,
          codigoProducto: prodOferGuar.codbarra
        }, (prodsServ: any) => {
          // console.log("prodsServ", System.clone(prodsServ))
          if (prodsServ.length > 0 && Ofertas.esProductoPermitido(prodsServ[0])) {
            // console.log("prodsServ[0].idProducto", prodsServ[0].idProducto)
            // console.log("prodsServ[0]", prodsServ[0])
            prodOfe.push(prodsServ[0])
            arrayAcumuladorProductos[prodsServ[0].idProducto] = prodsServ[0]
            // console.log("el producto es valido", prodsServ[0])
          } else {
            // console.log("el producto no es valido", prodsServ[0])
          }
          // console.log("pasó el if")
          looperProds.next()
        }, (er: string) => {
          // console.log("falla pero sigue con el siguiente", er)
          looperProds.next()
        })

      }, () => {
        // console.log("termino el ciclo prod de ofertas")
        callbackOk(prodOfe)
      })
  }

  static cargarSoloCorrectas(callbackOk: (ofertasCorrectas: any) => void) {
    const guardadas = Ofertas.getInstance().getFromSesion()
    // console.log("guardadas", guardadas)
    if (guardadas) {
      Ofertas.cargarSoloCorrectasFrom(guardadas, callbackOk)
    } else {
      Ofertas.getAllOfertas((ofers: any) => {
        Ofertas.guardarOffline(ofers)
        Ofertas.cargarSoloCorrectasFrom(ofers, callbackOk)
      }, () => { })
    }
  }

  static cargarSoloCorrectasFrom(ofertas: any, callbackOk: (ofertasCorrectas: any) => void) {
    // console.log("ofertas", ofertas)
    var productosDeOfertas: any = []

    var oferValids: any = []

    const cl = Client.getInstance().getFromSesion()
    var codigoCliente = 0
    if (cl) {
      codigoCliente = cl.codigoCliente
    }

    new LoopProperties(ofertas, (ix: string, ofertaGuardada: any, looperOferGuar: LoopProperties) => {
      // console.log("ofertas--item", ofertaGuardada)
      if (Ofertas.estaVacia(ofertaGuardada)) {
        looperOferGuar.next()
      } else {
        Ofertas.cargarProductosDeOferta(ofertaGuardada, (prods) => {
          ofertaGuardada.productosValidos = prods
          if (Ofertas.esCorrecta(ofertaGuardada)) {
            oferValids.push(ofertaGuardada)
          } else {
            // console.log("no es correcta", ofertaGuardada)
          }
          looperOferGuar.next()
        }, productosDeOfertas, codigoCliente)
      }
    }, () => {
      // console.log("termino el ciclo de ofertas guardadas")
      // console.log("productosDeOfertas", productosDeOfertas)
      // console.log("oferValids", oferValids)
      callbackOk(oferValids)
    })
  }

};