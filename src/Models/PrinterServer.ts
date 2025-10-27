import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import MovimientoCaja from "../Types/MovimientoCaja.ts";
import axios from "axios";
import Model from './Model';
import ModelConfig from './ModelConfig.ts';
import System from '../Helpers/System.ts';
import LoopProperties from '../Helpers/LoopProperties.ts';
import EmitirDetalle from '../definitions/EmisionesDetalle.ts';
import ModosImpresion from '../definitions/ModosImpresion.ts';


class PrinterServer {

    static preguntaFuncion = (txt:string, callyes:any, callno:any) => { }



    static sendInfo(infoToSend:any, callbackOk:any, callbackWrong:any) {
        // console.log("sendInfo")
        // console.log("infoToSend", infoToSend)
        try {
            var puerto = ""
            var zoom = ""
            var urlSocket = ""

            const urlServidor = ModelConfig.get("urlServicioImpresion")
            const urlServicioImpresionComanda = ModelConfig.get("urlServicioImpresionComanda")

            const puertoImpresion = ModelConfig.get("puertoImpresiones")
            const puertoImpresionComanda = ModelConfig.get("puertoImpresionComanda")

            const zoomImpresiones = ModelConfig.get("zoomImpresiones")
            const zoomImpresionComanda = ModelConfig.get("zoomImpresionComanda")

            if (infoToSend.imprimir && infoToSend.imprimir == "imprimirComanda") {
                puerto = puertoImpresionComanda
                zoom = zoomImpresionComanda
                urlSocket = urlServicioImpresionComanda
            } else {
                urlSocket = urlServidor
                puerto = puertoImpresion
                zoom = zoomImpresiones
            }
            infoToSend.puerto = puerto
            infoToSend.zoom = zoom
            console.log("urlServidor", urlSocket)
            const socket = new WebSocket(urlSocket);
            socket.onopen = () => {
                console.log("Conectado al servidor WebSocket");
                socket.send(JSON.stringify(infoToSend))
            };

            socket.onmessage = (event) => {
                const response = JSON.parse(event.data)
                console.log("datos recibidos", response);
                if (response.status) {
                    callbackOk(response);
                } else {
                    if (response.message && response.message.message) {
                        console.log("caso2")
                        response.message = response.message.message
                    }
                    console.log("response.message", response.message)
                    if (callbackWrong) callbackWrong(response.message);
                }
            };

            socket.onerror = (error) => {
                // console.error(" Error en WebSocket:", error);
                if (callbackWrong) callbackWrong("Servidor incorrecto. Revisar la direccion, permisos. Revisar si el servicio esta iniciado.")
            };

            socket.onclose = () => {
                console.log(" Conexión WebSocket cerrada");
            };
        } catch (err) {
            // console.log("err", err)
            if (callbackWrong) callbackWrong("Servidor incorrecto. Revisar la direccion, permisos. Revisar si el servicio esta iniciado.")
        }
    }

    static getPrinters(callbackOk:any, callbackWrong:any) {
        this.sendInfo({
            "accion": "impresoras",
        }, callbackOk, callbackWrong)
    }

    static printTest(callbackOk:any, callbackWrong:any) {
        this.sendInfo({
            "accion": "imprimirPrueba",
        }, callbackOk, callbackWrong)
    }

    static print(infoToSend:any, callbackOk:any, callbackWrong:any) {
        this.sendInfo({
            "accion": "imprimir",
            "datos": infoToSend
        }, callbackOk, callbackWrong)
    }

    static printAll(objectWithContents:any, callbackOk:any, callbackWrong:any, adicionalInfo = null) {

        new LoopProperties(objectWithContents, (prop:any, value:any, looper:LoopProperties) => {
            // console.log("prop", prop)
            // console.log("value", System.clone(value))

            if (prop == "imprimirComanda") {
                const impresoraComanda = ModelConfig.get("modoImpresionComanda")
                const imprimirPapelComanda = ModelConfig.get("imprimirPapelComanda")
                console.log("impresoraComanda", impresoraComanda)
                console.log("imprimirPapelComanda", imprimirPapelComanda)
                if (
                    impresoraComanda == ModosImpresion.SERVIDOR
                    && imprimirPapelComanda != EmitirDetalle.NUNCA
                ) {
                    if (imprimirPapelComanda == EmitirDetalle.PREGUNTAR) {

                        const value2 = System.clone(value)
                        PrinterServer.preguntaFuncion("Imprimir comanda?", () => {
                            PrinterServer.sendInfo({
                                accion: "imprimirHtml",
                                imprimir: prop,
                                datos: {
                                    // html: toPrint.imprimir.imprimirComanda
                                    html: value2
                                }
                            }, () => {
                                looper.next()
                            }, callbackWrong)


                        }, () => {
                            looper.next()
                            //eligio no imprimir
                        })
                        value = ""
                    }
                } else {
                    value = ""
                }
            }
            if (value != "") {
                PrinterServer.sendInfo({
                    accion: "imprimirHtml",
                    imprimir: prop,
                    datos: {
                        // html: toPrint.imprimir.imprimirComanda
                        html: value
                    }
                }, () => {
                    looper.next()
                }, callbackWrong)
            } else {
                looper.next()

            }
        }, () => {
            callbackOk()
        }, adicionalInfo)
    }
};

export default PrinterServer;