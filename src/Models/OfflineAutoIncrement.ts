import dayjs from 'dayjs';
import ModelSingleton from './ModelSingleton.ts';
import User from './User.ts';
import System from '../Helpers/System.ts';
import StorageSesion from '../Helpers/StorageSesion.ts';

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
            //pedir mas folios

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

};

export default OfflineAutoIncrement;