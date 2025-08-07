import StorageSesion from '../Helpers/StorageSesion.ts';
import System from '../Helpers/System.ts';
import ModelSingleton from './ModelSingleton.ts';
import OfflineAutoIncrement from './OfflineAutoIncrement.ts';
import PagoBoleta from './PagoBoleta.ts';
import ParaEnviar from './ParaEnviar.ts';

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
        me.listSales.forEach((saleSesion, ix) => {
            if (saleSesion.fechaIngreso == sale.fechaIngreso) {
                found = ix
            }
        })
        return found
    }

    remove(index) {
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

    static add(inf) {
        this.getInstance().add(inf)
        return this.getInstance().listSales
    }


    // static enviando = false
    // static sincronizando = false
    // static indexEnviando = -1

    // //en segundos
    // static reintentoTiempoSincro = 10

    static sincronizar(callbackCadaEnvio, callbackFinalizar) {
        SalesOffline.sincronizando = true
        this.sincronizarCiclo(callbackCadaEnvio, callbackFinalizar)

        ParaEnviar.enviar()
    }

    static sincronizarCiclo(callbackCadaEnvio, callbackFinalizar) {
        if (SalesOffline.enviando) return
        if (!SalesOffline.sincronizando) return
        SalesOffline.enviando = true
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

        this.reintentarPago(sinItem, callbackOkEnvio, () => {
            SalesOffline.enviando = false
            setTimeout(() => {
                SalesOffline.sincronizarCiclo(callbackCadaEnvio, callbackFinalizar)
            }, SalesOffline.reintentoTiempoSincro * 1000);
        })
    }


    static corregirFolios(tipo, nroFolioInicial, callbackOk) {
        var me = SalesOffline.getInstance()
        if (me.listSales.length < 1) {
            SalesOffline.sincronizando = false
            return
        }

        var nroFolio = parseInt(nroFolioInicial) + 0
        var copiaSales: any = []
        me.listSales.forEach((sale, ix) => {
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
    }

    static reintentarPago(saleInfo, callbackOk, callbackWrong) {
        var MPago = new PagoBoleta();
        MPago.fill(saleInfo);
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