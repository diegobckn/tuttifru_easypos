import BaseConfig from "../definitions/BaseConfig.ts";
import ModelConfig from './ModelConfig.ts';
import System from '../Helpers/System.ts';
import LoopProperties from '../Helpers/LoopProperties.ts';
import PrinterPaper from './PrinterPaper.ts';
import PagoBoleta from './PagoBoleta.ts';
import PrinterServer from './PrinterServer.ts';

import Logo from './../assets/logo-print.png'
import EmitirDetalle from "../definitions/EmisionesDetalle.ts";
import ModosImpresion from "../definitions/ModosImpresion.ts";


class PrinterIframe {
    static arrPrints = []

    static instance: PrinterIframe | null = null;
    static popupwindow: any = null;

    static rePrints = 0
    static rePrintsTotal = 0
    static arrPrintsRepPints = []

    static afterPrintFunction = () => { }
    static preguntaFuncion = (txt:string, callyes:any, callno:any) => { }

    static getInstance(): PrinterIframe {
        if (PrinterIframe.instance == null) {
            PrinterIframe.instance = new PrinterIframe();
        }

        return PrinterIframe.instance;
    }

    static printSimple(imprimirTxt:string) {
        if (imprimirTxt === "") return
        // console.log("print simple")
        // console.log(imprimirTxt)
        let simplePrintWindow: any = window.open("about:blank", "printsimple", `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no` +
            `,width=` + ModelConfig.get("widthPrint") + `,left=0,top=0`);

        simplePrintWindow.document.write(imprimirTxt)
        simplePrintWindow.document.write(
            `<script>
            window.print();
            setTimeout(() => {
                console.log("cerrando")
                window.close();
            }, 3000);
            <\/script>`
        );
    }

    static generateQrPreventaOffline(requestInfo:any, funcionCrearQr:any) {
        var content = ""

        var prodsTxt = "";
        requestInfo.products.forEach((prod:any) => {
            if (prodsTxt != "") prodsTxt += ";;"
            prodsTxt += prod.codbarra + "," + prod.cantidad
        })

        prodsTxt = "@@offlinepreventa-p-" + prodsTxt + "-p-"

        const contentQr = funcionCrearQr(prodsTxt)
        content += "<html>"
        content += "<head>"
        content += "<style>"
        content += `@media print {
            @page {
                size: 80mm auto; /* Ajuste el tamaño de la página al ancho de la impresora */
                margin: 0; /* Eliminar márgenes predeterminados */
            }
                body {
                margin: 0;
            }
            .receipt {
                border: none; /* Opcional: eliminar borde para impresión */
                margin: 0;
            }
        }`

        content += "</style>"
        content += "</head>"
        content += "<body>"
        content += "<p>"
        content += "Preventa offline"
        content += "</p>"
        content += "<p>"
        content += "Total $" + requestInfo.total
        content += "</p>"
        content += contentQr
        content += "<br/>"
        content += "<br/>"

        content += "</body>"
        content += "</html>"
        this.printSimple(content)
    }

    static printFlat(imprimirTxt:string) {
        if (imprimirTxt.trim() == "") return

        // if (imprimirTxt.indexOf("COMANDA") > -1) return
        // console.log("va a imprimir esto:")
        imprimirTxt = imprimirTxt.replace("./EasyPosLogo3.png", Logo)

        imprimirTxt = imprimirTxt.replace("80mm auto", "80mm")
        imprimirTxt = imprimirTxt.replace("size: 80mm", "size: 80mm auto")
        imprimirTxt = imprimirTxt.replace("</body>", "<script> window.print()</script></body>")
        // console.log(imprimirTxt)


        var ss: any = document.querySelector("#ifm");
        if (ss) {
            ss.style.display = "block"
            ss.srcdoc = imprimirTxt
        }

        ss.style.display = "none"
    }

    static doPrints(callbackEnd: any = null) {
        var does = false
        // console.log("doPrints")
        // console.log(Object.keys(PrinterIframe.arrPrints))
        const keyItems = Object.keys(PrinterIframe.arrPrints)
        const hasToProcess = keyItems.length
        if (hasToProcess < 1) {
            this.rePrints++
            if (this.rePrints < this.rePrintsTotal) {
                PrinterIframe.arrPrints = PrinterIframe.arrPrintsRepPints
                this.doPrints(callbackEnd)
                return
            } else {
                // console.log("ya no hay mas para reimprimir")
                if (callbackEnd) {
                    callbackEnd()
                }
            }
        }

        keyItems.forEach((itPrint:any) => {
            if (itPrint != undefined && !does) {
                does = true
                // console.log("do print item: ")
                // console.log(itPrint)
                PrinterIframe.printFlat(PrinterIframe.arrPrints[itPrint])
                delete PrinterIframe.arrPrints[itPrint]
                setTimeout(() => {
                    PrinterIframe.doPrints(callbackEnd)
                }, ModelConfig.get("delayBetwenPrints") * 1000);
                return


            }
        })
    }




    static checkObjectIfNeed(objectInfo:any, functionAfter:any, adicionalInfo = null) {
        // console.log("checkObjectIfNeed")
        const listadoFiltrado: any = {}
        const listadoPosible: any = {}
        const emiteDetalles = ModelConfig.get("emitirDetalle")

        const keys = Object.keys(objectInfo)
        if (keys.length > 0) {
            keys.forEach((key) => {
                if (key.toLocaleLowerCase().indexOf("imprimir") > -1) {
                    // console.log("key", key)
                    const copiaImprimirTodo = Object.keys(objectInfo[key])

                    // console.log("copiaImprimirTodo", copiaImprimirTodo)
                    copiaImprimirTodo.forEach((itPrint) => {
                        // console.log("itPrint", itPrint)
                        if (objectInfo[key][itPrint] != "") {
                            listadoPosible[itPrint] = objectInfo[key][itPrint]
                        }
                    })
                }
            })
            if (Object.keys(listadoPosible).length > 0) {
                const impresoraComanda = ModelConfig.get("modoImpresionComanda")
                const trabajaConComanda = ModelConfig.get("trabajarConComanda")
                const imprimirPapelComanda = ModelConfig.get("imprimirPapelComanda")

                new LoopProperties(listadoPosible, (prop:string, value:any, looper:LoopProperties) => {
                    // console.log("objectInfo[itPrint]", objectInfo[key][itPrint])
                    // console.log("preparando para imprimir ", prop)


                    if (prop == "imprimirComanda") {
                        if (
                            (trabajaConComanda ||
                                (looper.adicionalInfo && looper.adicionalInfo.esVentaApp)
                            )
                            && imprimirPapelComanda != EmitirDetalle.NUNCA
                            && impresoraComanda == ModosImpresion.IMPRESORA_PREDETERMINADA
                        ) {
                            if (imprimirPapelComanda == EmitirDetalle.SIEMPRE) {
                                listadoFiltrado[prop] = value
                                looper.next()
                            } else if (imprimirPapelComanda == EmitirDetalle.PREGUNTAR) {
                                const txtTipo = (prop + "").replace("imprimir", "")
                                // console.log("caso 3 comanda")
                                // console.log("PrinterIframe.preguntaFuncion", PrinterIframe.preguntaFuncion)
                                PrinterIframe.preguntaFuncion("Emitir " + txtTipo + "?", () => {
                                    // console.log("agrega..", value)
                                    listadoFiltrado[prop] = value
                                    setTimeout(() => {
                                        looper.next()
                                    }, 300);
                                }, () => {
                                    setTimeout(() => {
                                        looper.next()
                                    }, 300);
                                })
                            }
                        } else {
                            looper.next()
                        }
                    } else {
                        const esDetalle = [
                            "imprimirTicket",
                            "imprimirBoleta",
                            "imprimirEnvase",
                        ].includes(prop)
                        // console.log("emiteDetalles", emiteDetalles)
                        // console.log("esDetalle", esDetalle)
                        if (prop == "imprimirBoleta") {
                            listadoFiltrado[prop] = value
                            looper.next()
                        } else if (emiteDetalles == EmitirDetalle.SIEMPRE && esDetalle) {
                            listadoFiltrado[prop] = value
                            looper.next()
                        } else if (emiteDetalles == EmitirDetalle.PREGUNTAR && esDetalle) {
                            const txtTipo = (prop + "").replace("imprimir", "")
                            // console.log("caso 3")
                            // console.log("PrinterIframe.preguntaFuncion", PrinterIframe.preguntaFuncion)
                            PrinterIframe.preguntaFuncion("Emitir detalle para " + txtTipo + "?", () => {
                                // console.log("agrega..", value)
                                listadoFiltrado[prop] = value
                                setTimeout(() => {
                                    looper.next()
                                }, 300);
                            }, () => {
                                setTimeout(() => {
                                    looper.next()
                                }, 300);
                            })
                        } else if (!esDetalle) {
                            listadoFiltrado[prop] = value
                            looper.next()
                        }
                    }
                }, () => {
                    functionAfter(listadoFiltrado)
                }, adicionalInfo)
            }
        }
    }



    static printAll(respuestaServidor:any, rePrintsTotal = 1, adicionalInfo: any = null, callbackEnd = null) {
        // console.log("printAll de Printer predeterminada")
        this.checkObjectIfNeed(respuestaServidor, (objFiltred:any) => {
            // console.log("despues de checkObjectIfNeed..objFiltred", objFiltred)
            if (Object.keys(objFiltred).length > 0) {
                PrinterIframe.arrPrints = objFiltred
                PrinterIframe.arrPrintsRepPints = System.clone(objFiltred)

                PrinterIframe.rePrints = 0
                if (rePrintsTotal < 1) rePrintsTotal = 1
                PrinterIframe.rePrintsTotal = rePrintsTotal
                PrinterIframe.doPrints(callbackEnd)
            }
        }, adicionalInfo)



    }




    static prepareContent(requestInfo:any, createQrString:any) {
        // console.log("prepareContent")
        // console.log("content", requestInfo)
        const trabajaConComanda = ModelConfig.get("trabajarConComanda")
        const pp = PrinterPaper.getInstance()
        const esBoleta = PagoBoleta.analizarSiHaceBoleta(requestInfo)

        const toPrint: any = {
            imprimir: {
            }
        }
        if (!requestInfo.esVentaApp && esBoleta) {
            pp.infoToFill["Ticket.NFolio"] = requestInfo.nFolioBoleta
            toPrint.imprimir["imprimirBoleta"] = pp.getHtmlDetalles("Boleta", requestInfo)
        } else {
            pp.infoToFill["Ticket.NFolio"] = requestInfo.nFolioTicket
            toPrint.imprimir["imprimirTicket"] = pp.getHtmlDetalles("Ticket", requestInfo)
        }
        // console.log("antes de hacer la comanda", System.clone(toPrint))
        if (
            trabajaConComanda
            || requestInfo.esVentaApp
        ) {
            pp.infoToFill["Ticket.NombreComanda"] = requestInfo.nombreClienteComanda

            if (requestInfo.esVentaApp) {
                pp.infoToFill["Ticket.NFolio"] = "AP-" + requestInfo.pedidoId
            }

            toPrint.imprimir["imprimirComanda"] = pp.getHtmlComanda("TicketComanda", requestInfo)
        }
        // console.log("antes de hacer la comanda2", System.clone(toPrint))
        pp.infoToFill["Ticket.NFolio"] = requestInfo.hashEnvase
        // console.log("camiando n folio", pp.infoToFill["Ticket.NFolio"])
        // console.log("antes de hacer la comanda3", System.clone(toPrint))
        toPrint.imprimir["imprimirEnvase"] = pp.getHtmlEnvases("Envase", requestInfo, createQrString)

        return toPrint
    }


    static printContent(contenido:any, functionConfirm:any, showAlert:any, adicionalInfo = null, callbackEnd = null) {
        const queImpresoraUsa = ModelConfig.get("modoImpresion")
        // console.log("printContent")
        // console.log("contenido", contenido)
        // console.log("adicionalInfo", adicionalInfo)

        //adapto el response a una venta offline
        if (!contenido.imprimir && contenido.imprimirResponse) contenido.imprimir = contenido.imprimirResponse

        if (queImpresoraUsa == ModosImpresion.IMPRESORA_PREDETERMINADA) {
            // console.log("imprimiendo por IMPRESORA_PREDETERMINADA")

            PrinterIframe.preguntaFuncion = functionConfirm
            PrinterIframe.printAll(contenido, 1, adicionalInfo, callbackEnd)

            const impresoraComanda = ModelConfig.get("modoImpresionComanda")
            // console.log("reviso comanda", impresoraComanda)
            if (
                contenido.imprimir.imprimirComanda
                && impresoraComanda == ModosImpresion.SERVIDOR
            ) {
                // console.log("reviso comanda2")
                PrinterServer.preguntaFuncion = functionConfirm
                setTimeout(() => {
                    PrinterServer.printAll({
                        imprimirComanda: contenido.imprimir.imprimirComanda
                    }, (a:any) => {
                    }, showAlert, adicionalInfo)
                }, 3000);
            }
        } else {
            // console.log("imprimiendo por servidor")
            PrinterServer.preguntaFuncion = functionConfirm
            PrinterServer.printAll(contenido.imprimir, (a:any) => {
            }, showAlert, adicionalInfo)

            const impresoraComanda = ModelConfig.get("modoImpresionComanda")
            const cantAImprimir = parseInt(ModelConfig.get("cantidadTicketImprimir"))

            if (
                contenido.imprimir.imprimirComanda
                && impresoraComanda == ModosImpresion.IMPRESORA_PREDETERMINADA
            ) {
                PrinterIframe.preguntaFuncion = functionConfirm
                setTimeout(() => {
                    PrinterIframe.printAll({
                        imprimir: {
                            imprimirComanda: contenido.imprimir.imprimirComanda
                        }
                    }, cantAImprimir, adicionalInfo)
                }, 3000);
            }
        }
    }

    static adminContent({
        showAlert,
        functionConfirm,
        content,
        createQrString,
        adicionalInfo = null,
        callbackEnd = null
    }:any) {
        const toPrint: any = this.prepareContent(content, createQrString)
        this.printContent(toPrint, functionConfirm, showAlert, adicionalInfo, callbackEnd)
    }

};

export default PrinterIframe;