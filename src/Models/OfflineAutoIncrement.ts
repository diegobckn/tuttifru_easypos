import dayjs from 'dayjs';
import ModelSingleton from './ModelSingleton.ts';
import User from './User.ts';
import System from '../Helpers/System.ts';
import StorageSesion from '../Helpers/StorageSesion.ts';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';

class OfflineAutoIncrement extends ModelSingleton {

  idTurno = null
  nFolioBoleta = null
  nFolioBoletaExenta = null
  nFolioComprobanteMP = null
  nFolioFactura = null
  nFolioTicket = null

  static DIFERENCIA_SOLICITAR_FOLIOS = 10

  static sesion = new StorageSesion("offlineAutoIncrements")

  static saveInSesion(info: any) {
    return this.sesion.guardar(info)
  }

  static saveIfNotHasInSesion(info: any) {
    if (!this.getFromSesion()) {
      return this.sesion.guardar(info)
    }
  }

  static getFromSesion() {
    return this.sesion.cargar(1)
  }

  loadAllFromSesion(callbackOk: any, callbackWrong: any, replaceOldIfHasValue = false) {
    if (
      !replaceOldIfHasValue
      && this.idTurno !== null
      && this.nFolioBoleta !== null
      && this.nFolioBoletaExenta !== null
      && this.nFolioComprobanteMP !== null
      && this.nFolioFactura !== null
      && this.nFolioTicket !== null
    ) {
      //tiene info de la sesion
      callbackOk()
      return
    }

    const infoSesion = OfflineAutoIncrement.getFromSesion()
    // console.log("infoSesion", infoSesion)
    if (!infoSesion) return callbackWrong("No se pudo cargar la informacion de la sesion")

    if (replaceOldIfHasValue) {
      this.idTurno = infoSesion.idTurno
      this.nFolioBoleta = infoSesion.nFolioBoleta
      this.nFolioBoletaExenta = infoSesion.nFolioBoletaExenta
      this.nFolioComprobanteMP = infoSesion.nFolioComprobanteMP
      this.nFolioFactura = infoSesion.nFolioFactura
      this.nFolioTicket = infoSesion.nFolioTicket
    } else {
      if (this.idTurno === null) this.idTurno = infoSesion.idTurno
      if (this.nFolioBoleta === null) this.nFolioBoleta = infoSesion.nFolioBoleta
      if (this.nFolioBoletaExenta === null) this.nFolioBoletaExenta = infoSesion.nFolioBoletaExenta
      if (this.nFolioComprobanteMP === null) this.nFolioComprobanteMP = infoSesion.nFolioComprobanteMP
      if (this.nFolioFactura === null) this.nFolioFactura = infoSesion.nFolioFactura
      if (this.nFolioTicket === null) this.nFolioTicket = infoSesion.nFolioTicket
    }

    callbackOk()
  }

  loadFromSesion(prop: any, callbackOk: any, callbackWrong: any, replaceOldIfHasValue = false) {
    if (
      this.idTurno === null
      || this.nFolioBoleta === null
      || this.nFolioBoletaExenta === null
      || this.nFolioComprobanteMP === null
      || this.nFolioFactura === null
      || this.nFolioTicket === null
    ) {
      //tiene info de la sesion
      this.loadAllFromSesion(() => {
        this.loadFromSesion(prop, callbackOk, callbackWrong)
      }, callbackWrong, replaceOldIfHasValue)
      return
    }

    const infoSesion = OfflineAutoIncrement.getFromSesion()
    // console.log("infoSesion", infoSesion)
    if (!infoSesion) return callbackWrong("No se pudo cargar la informacion de la sesion")

    if (replaceOldIfHasValue) {
      System.setProp(this, prop, infoSesion[prop])
    } else {
      if (System.getProp(this, prop) === null) System.setProp(this, prop, infoSesion[prop])
    }

    // console.log("me esta asi", System.clone(this))
    callbackOk()
  }

  generar(prop: string, callbackOk: any, callbackWrong: any, replaceOldIfHasValue = false) {
    // console.log("generar..", prop)
    var me = this
    if (me.loadFromSesion(prop, () => {
      // console.log("antes de cambiar esta asi", System.clone(me))
      System.setProp(me, prop, parseInt(System.getProp(me, prop)) + 1)

      if (prop == "nFolioBoleta") {
        const dsd = me[prop] ?? 0
        me.loadFromSesion("nFolioBoletaHasta", () => {
          // console.log("antes de cambiar esta asi", System.clone(me))
          const hst = parseFloat(System.getProp(me, "nFolioBoletaHasta"))
          const df = hst - dsd
          if (df <= OfflineAutoIncrement.DIFERENCIA_SOLICITAR_FOLIOS) {
            callbackWrong("ErrorFolio: Se agotaron los folios de boletas.")
          }
        }, () => { })
      } else if (prop == "nFolioBoletaExenta") {
        const dsd = me[prop] ?? 0
        me.loadFromSesion("nFolioBoletaExentaHasta", () => {
          // console.log("antes de cambiar esta asi", System.clone(me))
          const hst = parseFloat(System.getProp(me, "nFolioBoletaExentaHasta"))
          const df = hst - dsd
          if (df <= OfflineAutoIncrement.DIFERENCIA_SOLICITAR_FOLIOS) {
            callbackWrong("ErrorFolio: Se agotaron los folios de boletas excentas.")
          }
        }, () => { })


      }
      // console.log("despues de cambiar queda asi", System.clone(me))
      callbackOk(System.getProp(me, prop))
    }, callbackWrong, replaceOldIfHasValue))
      return
  }

  actualizarEnSesion(prop: string, callbackOk: any, callbackWrong: any) {
    var me = this
    // console.log("this esta asi", me)
    const infoSesion = OfflineAutoIncrement.getFromSesion()
    console.log("infoSesion", infoSesion)
    if (!infoSesion) return callbackWrong("No se pudo cargar la informacion de la sesion")
    infoSesion[prop] = System.getProp(me, prop)
    // console.log("infoSesion antes de guardar", System.clone(infoSesion))
    const rs = OfflineAutoIncrement.saveInSesion(infoSesion)
    // console.log("rs", rs)
    if (rs) {
      callbackOk()
    } else {
      callbackWrong("No se pudo guardar en sesion")
    }
  }

  nuevoHashEnvase() {
    var hashRs = dayjs().format("YYYY-MM-DD-HH-mm--ss")

    const user = User.getInstance()
    const infoSesion = user.getFromSesion()
    hashRs += "-" + infoSesion.codigoSucursal + "-" + infoSesion.puntoVenta

    //tengo que encryptar
    hashRs = System.encrypt(hashRs)

    return hashRs
  }


  static getByDte(arr: any, dte: number) {
    var found: any = null
    arr.forEach((item: any) => {
      if (item.codigoDte == dte && found === null) {
        found = item
      }
    })

    return found
  }

  static async loadFromServer(idTurno: number | null, callbackOk: any, callbackWrong: any) {
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Cajas/ObtenerFolios"

    url += "?CodigoSucursal=" + ModelConfig.get("sucursal")
    url += "&PuntoVenta=" + ModelConfig.get("puntoVenta")


    EndPoint.sendGet(url, (responseData: any, response: any) => {
      console.log("ok.. data", responseData)

      var infoGuardar: any = {}
      if (idTurno !== null) infoGuardar.idTurno = idTurno

      const infoBoletas = this.getByDte(responseData, 39)
      if (infoBoletas) {
        infoGuardar.folioActual = infoBoletas.folioActual
        infoGuardar.folioHasta = infoBoletas.folioHasta
      } else {
        infoGuardar.folioActual = 0
        infoGuardar.folioHasta = 1000
      }

      const infoBoletasExentas = this.getByDte(responseData, 41)
      if (infoBoletasExentas) {
        infoGuardar.folioActual = infoBoletasExentas.folioActual
        infoGuardar.folioHasta = infoBoletasExentas.folioHasta
      } else {
        infoGuardar.folioActual = 0
        infoGuardar.folioHasta = 1000
      }

      const infoFacturas = this.getByDte(responseData, 33)
      if (infoFacturas) {
        infoGuardar.folioActual = infoFacturas.folioActual
        infoGuardar.folioHasta = infoFacturas.folioHasta
      } else {
        infoGuardar.folioActual = 0
        infoGuardar.folioHasta = 1000
      }

      const infoTickets = this.getByDte(responseData, 0)
      if (infoTickets) {
        infoGuardar.folioActual = infoTickets.folioActual
        infoGuardar.folioHasta = infoTickets.folioHasta
      } else {
        infoGuardar.folioActual = 0
        infoGuardar.folioHasta = 1000
      }

      const infoGuiaDespachos = this.getByDte(responseData, 52)
      if (infoGuiaDespachos) {
        infoGuardar.folioActual = infoGuiaDespachos.folioActual
        infoGuardar.folioHasta = infoGuiaDespachos.folioHasta
      } else {
        infoGuardar.folioActual = 0
        infoGuardar.folioHasta = 1000
      }

      console.log("infoGuardar", infoGuardar)
      OfflineAutoIncrement.saveInSesion(infoGuardar)
      callbackOk(infoGuardar)
      // callbackOk(response.data.categorias, response);
    }, (er: any) => {
      console.log("err", er)
      callbackWrong(er)
    })
  }


};

export default OfflineAutoIncrement;