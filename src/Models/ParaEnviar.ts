import StorageSesion from '../Helpers/StorageSesion.ts';
import System from '../Helpers/System.ts';
import EndPoint from './EndPoint.ts';
import PagoBoleta from './PagoBoleta.ts';
import Product from './Product.ts';


class ParaEnviar {

    static sesion = new StorageSesion("paraEnviar")
    static procesando = false
    static sincronizando = false

    static TIPO = {
        NUEVO_PRODUCTO_EXPRESS: 1,
        VENTA_TICKET: 2,
    }

    static reintentoTiempoSincro = 10

    static agregar(url: string, data: any, metodo: any, tipo: any) {
        // console.log("agregar")
        const habia = this.sesion.cargar(1) || []
        // console.log("habia", System.clone(habia))
        habia.push({ url, data, metodo, tipo })
        // console.log("habia", System.clone(habia))
        this.sesion.guardar(habia)
    }

    static enviar() {
        // console.log("enviar")
        if (this.sincronizando) return
        this.sincronizando = true
        // console.log("enviar2")
        this.cicloEnviar()
    }

    static cicloEnviar() {
        // console.log("cicloEnviar")
        if (this.procesando || !this.sincronizando) {
            // console.log("saliendo por true")
            return
        }
        // console.log("sigo")
        this.procesando = true
        const habia = this.sesion.cargar(1)
        console.log('habia', habia);
        if (habia.length < 1) {
            this.procesando = false
            this.sincronizando = false
            return
        }
        // habia.push({ url, data, metodo, callbackOk })
        // this.sesion.guardar(habia)

        const callbackOkEnvio = () => {
            // console.log("callbackOkEnvio")
            const quita = habia.splice(0, 1)
            ParaEnviar.doAfterSend(quita)
            this.sesion.guardar(habia)
            this.procesando = false
            if (habia.length > 0) {
                ParaEnviar.cicloEnviar()
            } else {
                this.sincronizando = false
            }
        }

        const intentarLuego = () => {
            setTimeout(() => {
                ParaEnviar.procesando = false
                ParaEnviar.cicloEnviar()
            }, ParaEnviar.reintentoTiempoSincro * 1000);
        }

        // intentar envio
        this.process(habia[0], callbackOkEnvio, intentarLuego)
    }

    static process(info: any, callbackOk: any, callbackWrong: any) {
        if (info.tipo == this.TIPO.VENTA_TICKET) {
            var MPago = new PagoBoleta();
            MPago.fill(info.data);
            MPago.hacerPago(info.data, callbackOk, callbackWrong, true)
            return
        }

        const met = info.metodo.toLocaleLowerCase()
        if (met == "get") {
            EndPoint.sendGet(info.url, callbackOk, callbackWrong)
        } else {
            const cmdEval = "EndPoint.send" + System.ucfirst(met) + "(info.url, info.data, callbackOkEnvio, intentarLuego)"
            // console.log("haciendo eval", cmdEval)
            eval(cmdEval)
        }
    }

    static doAfterSend(infoArr: any) {
        const info = infoArr[0]
        // console.log("doAfterSend..info", info)
        if (info.tipo == this.TIPO.NUEVO_PRODUCTO_EXPRESS) {
            Product.getInstance().almacenarParaOffline(() => { }, () => {
                // console.log("callback ok de producto express nuevo")
            })
        }
    }

};

export default ParaEnviar;