import StorageSesion from '../Helpers/StorageSesion.ts';
import System from '../Helpers/System.ts';
import AperturaCierreOffline from './AperturaCierreOffline.ts';
import ModelSingleton from './ModelSingleton.ts';
import OfflineAutoIncrement from './OfflineAutoIncrement.ts';
import PagoBoleta from './PagoBoleta.ts';
import ParaEnviar from './ParaEnviar.ts';
import Product from './Product.ts';

class SalesOffline extends ModelSingleton {
    sesion: StorageSesion = new StorageSesion("salesoffline")
    listSales: any[] = []

    static enviando = false
    static sincronizando = false
    static indexEnviando = -1

    //en segundos
    static reintentoTiempoSincro = 10

    add(infoSale: any) {
        this.listSales.push(infoSale)

        this.sesion.guardar({
            id: 1,
            listSales: this.listSales
        })

        return this.listSales
    }

    loadFromSesion() {
        // console.log("loadFromSesion")
        if (this.sesion.hasOne()) {
            this.listSales = this.sesion.cargar(1).listSales
        } else {
            this.listSales = this.listSales
        }
        // console.log("leido de sesion ", this.listSales)
        return this.listSales
    }

    static findIndex(sale: any) {
        var found = -1
        const me = SalesOffline.getInstance()
        me.loadFromSesion()
        me.listSales.forEach((saleSesion: any, ix: number) => {
            if (saleSesion.fechaIngreso == sale.fechaIngreso) {
                found = ix
            }
        })
        return found
    }

    remove(index: number) {
        const queda: any[] = []
        this.listSales.forEach((sale, ix) => {
            if (ix != index) {
                queda.push(sale)
            }
        })
        this.listSales = System.clone(queda)
        this.sesion.guardar({
            id: 1,
            listSales: this.listSales
        })
        return this.listSales
    }

    static add(inf: any) {
        this.getInstance().add(inf)
        return this.getInstance().listSales
    }


    // static enviando = false
    // static sincronizando = false
    // static indexEnviando = -1

    // //en segundos
    // static reintentoTiempoSincro = 10

    static sincronizar(callbackCadaEnvio: any, callbackFinalizar: any) {
        console.log("sincronizar.. offline")
        SalesOffline.sincronizando = true
        this.sincronizarCiclo(callbackCadaEnvio, callbackFinalizar)

        // ParaEnviar.enviar()
    }

    static sincronizarCiclo(callbackCadaEnvio: any, callbackFinalizar: any) {
        console.log("sincronizarCiclo offline ")
        console.log("SalesOffline.enviando", SalesOffline.enviando)
        console.log("SalesOffline.sincronizando", SalesOffline.sincronizando)
        if (SalesOffline.enviando) return
        if (!SalesOffline.sincronizando) return
        var me = SalesOffline.getInstance()
        if (me.listSales.length < 1) {
            SalesOffline.sincronizando = false
            return
        }
        const sinItem = me.listSales[0]
        this.indexEnviando = 0

        const callbackOkEnvio = () => {
            console.log("callbackOkEnvio")
            me.listSales.splice(0, 1)

            me.sesion.guardar({
                id: 1,
                listSales: me.listSales
            })

            console.log("callbackOkEnvio..listSales", System.clone(me.listSales))
            SalesOffline.enviando = false
            if (me.listSales.length > 0) {
                callbackCadaEnvio(sinItem)
                SalesOffline.sincronizarCiclo(callbackCadaEnvio, callbackFinalizar)
            } else {
                callbackFinalizar()
            }
        }

        console.log("llamando reintentarPago..")

        this.reintentarPago(sinItem, callbackOkEnvio, () => {
            SalesOffline.enviando = false
            setTimeout(() => {
                SalesOffline.sincronizarCiclo(callbackCadaEnvio, callbackFinalizar)
            }, SalesOffline.reintentoTiempoSincro * 1000);
        })
    }


    static corregirFolios(tipo: any, nroFolioInicial: string | number, callbackOk: any) {
        var me = SalesOffline.getInstance()
        if (me.listSales.length < 1) {
            SalesOffline.sincronizando = false
            return
        }

        var nroFolio = parseInt(nroFolioInicial + "") + 0
        var copiaSales: any = []
        me.listSales.forEach((sale: any) => {
            if (sale.queOperacionHace == tipo) {
                sale["nFolio" + tipo] = nroFolio + 0
                nroFolio++
            }
            copiaSales.push(sale)
        })

        if (nroFolio != nroFolioInicial) {
            const sesAI = OfflineAutoIncrement.getFromSesion()
            sesAI["nFolio" + tipo] = nroFolio + 0
            OfflineAutoIncrement.saveInSesion(sesAI)
        }
        me.listSales = copiaSales
        me.sesion.guardar({
            id: 1,
            listSales: me.listSales
        })
        callbackOk()
    }

    static frenarSincro() {
        SalesOffline.sincronizando = false
        ParaEnviar.sincronizando = false

        AperturaCierreOffline.sincronizando = false

    }

    static reintentarPago(saleInfo: any, callbackOk: any, callbackWrong: any) {
        console.log("reintentarPago..")
        console.log("saleInfo", saleInfo)
        const ixAperturaOCierre = AperturaCierreOffline.primeroSinEnviarIndex()
        console.log("ixAperturaOCierre", ixAperturaOCierre)
        if (ixAperturaOCierre !== null) {
            const ac = new AperturaCierreOffline()
            var antes = ac.loadFromSesion()
            const itAperturaCierre = antes.movimientos[ixAperturaOCierre]
            console.log("itAperturaCierre", itAperturaCierre)
            if (itAperturaCierre.fechaIngreso <= saleInfo.fechaIngreso) {
                console.log("Esperando un envio de " + itAperturaCierre.tipo)
                if (!AperturaCierreOffline.sincronizando) {
                    AperturaCierreOffline.sincronizar(() => {
                    }, () => {
                        SalesOffline.reintentarPago(saleInfo, callbackOk, callbackWrong)
                    })
                }
                return
            }
            console.log("todo ok.. sigo con el intento de pago")
        }
        
        const pr =Product.getInstance()
        if(pr.hayPreciosOffline()){
            pr.enviarPreciosOffline()
            callbackWrong("productos con cambio de precio pendiente")
            return
        }

        var MPago = new PagoBoleta();
        MPago.fill(saleInfo);
        SalesOffline.enviando = true
        MPago.hacerPago(saleInfo, callbackOk, callbackWrong, true)
    }

    static borrarTodos() {
        var me = SalesOffline.getInstance()
        me.listSales = []

        me.sesion.guardar({
            id: 1,
            listSales: me.listSales
        })

        return me.listSales
    }
};

export default SalesOffline;