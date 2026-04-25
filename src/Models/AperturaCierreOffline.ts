import StorageSesion from '../Helpers/StorageSesion.ts';
import System from '../Helpers/System.ts';
import AperturaCaja from './AperturaCaja.ts';
import CerrarCaja from './CerrarCaja.ts';
import InfoCierre from './InfoCierre.ts';
import ModelSingleton from './ModelSingleton.ts';
import OfflineAutoIncrement from './OfflineAutoIncrement.ts';
import PagoBoleta from './PagoBoleta.ts';
import ParaEnviar from './ParaEnviar.ts';
import SalesOffline from './SalesOffline.ts';
import User from './User.ts';

class AperturaCierreOffline extends ModelSingleton {
    sesion: StorageSesion = new StorageSesion("aperturacierreoffline")

    static sincronizando = false
    static enviando = false
    static indexEnviando = -1

    //en segundos
    static reintentoTiempoSincro = 10

    loadFromSesion() {
        // console.log("loadFromSesion")
        if (this.sesion.hasOne()) {
            return this.sesion.cargar(1)
        } else {
            return null
        }
    }

    static addApertura(info: any, offline = true) {
        var movimientos: any = []
        var me = new AperturaCierreOffline()
        var antes = me.loadFromSesion()
        if (antes) {
            movimientos = antes.movimientos
        }
        info.sended = !offline
        info.tipo = "apertura"
        movimientos.push(info)
        me.sesion.guardar({
            id: 1,
            movimientos
        })
    }

    static sincronizar(callbackCadaEnvio: any, callbackFinalizar: any) {
        // console.log("sincronizar.. offline")
        AperturaCierreOffline.sincronizando = true
        this.sincronizarCiclo(callbackCadaEnvio, callbackFinalizar)

        // ParaEnviar.enviar()
    }

    static primeroSinEnviarIndex() {
        // console.log("primeroSinEnviarIndex")
        var me = new AperturaCierreOffline()
        var antes = me.loadFromSesion()
        if (!antes || antes.movimientos.length < 1) {
            // console.log("primeroSinEnviarIndex sin item")
            return null
        }

        var primero: any = null
        antes.movimientos.forEach((mov: any, ix: number) => {
            if (!mov.sended && primero === null) {
                primero = ix
                // console.log("primeroSinEnviarIndex..asignando ", ix)
            }
        })

        // console.log("primeroSinEnviarIndex..devuelve", primero)
        return primero
    }

    static sincronizarCiclo(callbackCadaEnvio: any, callbackFinalizar: any) {
        // console.log("AperturaCierreOffline sincronizarCiclo offline ")
        // console.log("AperturaCierreOffline.enviando", AperturaCierreOffline.enviando)
        // console.log("AperturaCierreOffline.sincronizando", AperturaCierreOffline.sincronizando)
        if (AperturaCierreOffline.enviando) return
        if (!AperturaCierreOffline.sincronizando) return

        var me = new AperturaCierreOffline()
        var ensesion = me.loadFromSesion()
        if (!ensesion || ensesion.movimientos.length < 1) {
            // console.log("AperturaCierreOffline. nada para sincronizar")
            return
        }
        const ixEnvioItem = this.primeroSinEnviarIndex()
        if (ixEnvioItem === null) {
            // console.log("AperturaCierreOffline. nada para enviar")
            AperturaCierreOffline.sincronizando = false
            return
        }
        const envioItem = ensesion.movimientos[ixEnvioItem]
        // console.log("envioItem")

        AperturaCierreOffline.enviando = true
        const callbackOkEnvio = () => {
            // console.log("callbackOkEnvio")
            const copiaEnvioItem = System.clone(envioItem)
            copiaEnvioItem.sended = true
            ensesion.movimientos[ixEnvioItem] = copiaEnvioItem

            me.sesion.guardar(ensesion)

            // console.log("callbackOkEnvio..movimientos", System.clone(ensesion.movimientos))
            AperturaCierreOffline.enviando = false
            if (this.primeroSinEnviarIndex() !== null) {
                callbackCadaEnvio(envioItem)
                AperturaCierreOffline.sincronizarCiclo(callbackCadaEnvio, callbackFinalizar)
            } else {
                callbackFinalizar()
            }
        }

        // console.log("llamando reintentarEnvio..")
        this.reintentarEnvio(envioItem, callbackOkEnvio, () => {
            AperturaCierreOffline.enviando = false
            setTimeout(() => {
                AperturaCierreOffline.sincronizarCiclo(callbackCadaEnvio, callbackFinalizar)
            }, AperturaCierreOffline.reintentoTiempoSincro * 1000);
        })

    }

    static reintentarEnvio(info: any, callbackOk: any, callbackWrong: any) {
        var soff = SalesOffline.getInstance()
        if (soff.listSales.length > 0) {
            const sinItem = soff.listSales[0]
            if (sinItem.fechaIngreso <= info.fechaIngreso) {
                // console.log("esperando que se envien las ventas anteriores para luego hacer " + info.tipo)
                if (!SalesOffline.sincronizando) {
                    SalesOffline.sincronizar(() => { }, () => {
                        AperturaCierreOffline.sincronizarCiclo(callbackOk, callbackWrong)
                    })
                }
                return
            }
        }


        if (info.tipo == "apertura") {
            var env = new AperturaCaja();
            env.fill(info);
            env.sendToServer(callbackOk, callbackWrong, true)
        } else if (info.tipo == "cierre") {
            var env2 = new CerrarCaja();
            const infoCierreServidor = new InfoCierre()
            const us = new User()
            const priUs = us.getFromSesion()
            infoCierreServidor.obtenerDeServidor(priUs.codigoUsuario, (infoCierre: any) => {
                info.totalSistema = infoCierre.arqueoCajaById.totalSistema
                info.diferencia = info.totalIngresado - info.totalSistema
                env2.enviar(info, callbackOk, callbackWrong, true)
            }, (err: any) => {
                callbackWrong(err)
            })

        }
    }

    static addCierre(info: any, offline = true) {
        var movimientos: any = []
        var me = new AperturaCierreOffline()
        var antes = me.loadFromSesion()
        if (antes) {
            movimientos = antes.movimientos
        }
        info.tipo = "cierre"
        info.sended = !offline
        movimientos.push(info)
        me.sesion.guardar({
            id: 1,
            movimientos
        })
    }

    static hasApertura() {
        var me = new AperturaCierreOffline()
        var antes = me.loadFromSesion()
        if (antes) {
            const lastIndex = antes.movimientos.length - 1
            const last = antes.movimientos[lastIndex]
            return last.tipo == "apertura"
        }
        return false
    }

    static last() {
        var me = new AperturaCierreOffline()
        var antes = me.loadFromSesion()
        if (antes) {
            const lastIndex = antes.movimientos.length - 1
            if (lastIndex > -1) {
                const last = antes.movimientos[lastIndex]
                return last
            }
        }
        return null
    }

    static lastWasSent() {
        var last = this.last()
        if (last) {
            return last.sended
        }
        return false
    }


};

export default AperturaCierreOffline;