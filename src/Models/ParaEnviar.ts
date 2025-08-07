import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig, { EmitirDetalle, ModosImpresion } from "../definitions/BaseConfig.ts";
import MovimientoCaja from "../Types/MovimientoCaja.ts";
import axios from "axios";
import Model from './Model';
import ModelConfig from './ModelConfig.ts';
import System from '../Helpers/System.ts';
import LoopProperties from '../Helpers/LoopProperties.ts';
import EndPoint from './EndPoint.ts';
import Product from './Product.ts';


class ParaEnviar {

    static sesion = new StorageSesion("paraEnviar")
    static procesando = false
    static sincronizando = false

    static reintentoTiempoSincro = 10

    static agregar(url, data, metodo, tipo) {
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
            ParaEnviar.doPostSend(quita)
            this.sesion.guardar(habia)
            this.procesando = false
            if (habia.length > 0) {
                ParaEnviar.cicloEnviar()
            }else{
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

        const paraEnviarAhora = habia[0]
        const met = paraEnviarAhora.metodo.toLocaleLowerCase()
        if (met == "get") {
            EndPoint.sendGet(paraEnviarAhora.url, callbackOkEnvio, intentarLuego)
        } else {
            const cmdEval = "EndPoint.send" + System.ucfirst(met) + "(paraEnviarAhora.url, paraEnviarAhora.data, callbackOkEnvio, intentarLuego)"
            // console.log("haciendo eval", cmdEval)
            eval(cmdEval)
        }
    }

    static doPostSend(infoArr) {
        const info = infoArr[0]
        // console.log("doPostSend..info", info)
        if (info.tipo == "nuevoProductoExpress") {
            Product.getInstance().almacenarParaOffline(() => { }, () => {
                // console.log("callback ok de producto express nuevo")
            })
        }
    }

};

export default ParaEnviar;