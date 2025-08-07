import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig, { EmitirDetalle, ModosImpresion } from "../definitions/BaseConfig.ts";
import MovimientoCaja from "../Types/MovimientoCaja.ts";
import Model from './Model';
import ModelConfig from './ModelConfig.ts';
import System from '../Helpers/System.ts';
import LoopProperties from '../Helpers/LoopProperties.ts';
import PrinterPaper from './PrinterPaper.ts';
import PagoBoleta from './PagoBoleta.ts';
import PrinterServer from './PrinterServer.ts';


class Printer {
    static arrPrints = []

    static instance: Printer | null = null;
    static popupwindow: any = null;

    static rePrints = 0
    static rePrintsTotal = 0
    static arrPrintsRepPints = []

    static afterPrintFunction = () => { }
    static preguntaFuncion = (txt, callyes, callno) => { }

    static getInstance(): Printer {
        if (Printer.instance == null) {
            Printer.instance = new Printer();
        }

        return Printer.instance;
    }

    static printSimple(imprimirTxt) {
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

    static generateQrPreventaOffline(requestInfo, funcionCrearQr) {
        var content = ""

        var prodsTxt = "";
        requestInfo.products.forEach(prod => {
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

    static printFlat(imprimirTxt) {
        if (imprimirTxt.trim() == "") return
        // console.log("va a imprimir esto:")
        // console.log(imprimirTxt)
        // console.log("fin de imprimir")
        if (!Printer.popupwindow) {
            let newWin: any = window.open("about:blank", "printx", `scrollbars=no,resizable=no,` +
                `status=no,location=no,toolbar=no,menubar=no` +
                `,width=80,left=0,top=0`);
            Printer.popupwindow = newWin
        }

        Printer.popupwindow.document.querySelector("body").innerHTML = ""
        Printer.popupwindow.document.write(imprimirTxt)
        Printer.popupwindow.document.write(
            `<script>
                setTimeout(() => {
                    window.print();
                }, ` + (ModelConfig.get("delayCloseWindowPrints") * 1000) + `);
            <\/script>`
        );
    }

    static checkObjectIfNeed(objectInfo, functionAfter) {
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

                new LoopProperties(listadoPosible, (prop, value, looper) => {
                    // console.log("objectInfo[itPrint]", objectInfo[key][itPrint])
                    console.log("preparando para imprimir ", prop)


                    if (prop == "imprimirComanda") {
                        if (
                            trabajaConComanda
                            && imprimirPapelComanda != EmitirDetalle.NUNCA
                            && impresoraComanda == ModosImpresion.IMPRESORA_PREDETERMINADA
                        ) {

                            if (imprimirPapelComanda == EmitirDetalle.SIEMPRE) {
                                listadoFiltrado[prop] = value
                                looper.next()
                            } else if (imprimirPapelComanda == EmitirDetalle.PREGUNTAR) {
                                const txtTipo = (prop + "").replace("imprimir", "")
                                console.log("caso 3 comanda")
                                console.log("Printer.preguntaFuncion", Printer.preguntaFuncion)
                                Printer.preguntaFuncion("Emitir " + txtTipo + "?", () => {
                                    console.log("agrega..", value)
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
                        console.log("emiteDetalles", emiteDetalles)
                        console.log("esDetalle", esDetalle)
                        if (prop == "imprimirBoleta") {
                            listadoFiltrado[prop] = value
                            looper.next()
                        } else if (emiteDetalles == EmitirDetalle.SIEMPRE && esDetalle) {
                            listadoFiltrado[prop] = value
                            looper.next()
                        } else if (emiteDetalles == EmitirDetalle.PREGUNTAR && esDetalle) {
                            const txtTipo = (prop + "").replace("imprimir", "")
                            console.log("caso 3")
                            console.log("Printer.preguntaFuncion", Printer.preguntaFuncion)
                            Printer.preguntaFuncion("Emitir detalle para " + txtTipo + "?", () => {
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
                })
            }
        }
    }

    static printAll(respuestaServidor, rePrintsTotal = 1) {
        console.log("printAll de Printer predeterminada")
        this.checkObjectIfNeed(respuestaServidor, (objFiltred) => {
            // console.log("despues de checkObjectIfNeed..objFiltred", objFiltred)
            if (Object.keys(objFiltred).length > 0) {
                Printer.arrPrints = objFiltred
                Printer.arrPrintsRepPints = System.clone(objFiltred)

                Printer.rePrints = 0
                if (rePrintsTotal < 1) rePrintsTotal = 1
                Printer.rePrintsTotal = rePrintsTotal
                Printer.doPrints()
            }
        })



    }

    static doPrints() {
        var does = false
        // console.log("doPrints")
        // console.log(Object.keys(Printer.arrPrints))
        const keyItems = Object.keys(Printer.arrPrints)
        const hasToProcess = keyItems.length
        if (hasToProcess < 1) {
            // console.log("end to print")
            this.rePrints++
            if (this.rePrints < this.rePrintsTotal) {
                Printer.arrPrints = Printer.arrPrintsRepPints
                this.doPrints()
                return
            }
            if (Printer.popupwindow) {
                Printer.popupwindow.document.write(
                    `<script>
                    setTimeout(() => {
                        console.log("cerrando")
                        window.close();
                        }, ` + (ModelConfig.get("delayCloseWindowPrints") * 1000) + `);
                        <\/script>`
                );
            }

            Printer.popupwindow = null
            // window.focus()

            return
        }



        keyItems.forEach((itPrint) => {
            if (itPrint != undefined && !does) {
                does = true
                // console.log("do print item: ")
                // console.log(itPrint)


                Printer.printFlat(Printer.arrPrints[itPrint])
                delete Printer.arrPrints[itPrint]
                setTimeout(() => {
                    Printer.doPrints()
                }, ModelConfig.get("delayBetwenPrints") * 1000);
                return


            }
        })
    }


    static prepareContent(requestInfo, createQrString) {
        console.log("adminContent")
        console.log("content", requestInfo)
        const trabajaConComanda = ModelConfig.get("trabajarConComanda")
        const pp = PrinterPaper.getInstance()
        const esBoleta = PagoBoleta.analizarSiHaceBoleta(requestInfo)

        const toPrint: any = {
            imprimir: {
            }
        }

        if (esBoleta) {
            pp.infoToFill["Ticket.NFolio"] = requestInfo.nFolioBoleta
            toPrint.imprimir["imprimirBoleta"] = pp.getHtmlDetalles("Boleta", requestInfo)
        } else {
            pp.infoToFill["Ticket.NFolio"] = requestInfo.nFolioTicket
            toPrint.imprimir["imprimirTicket"] = pp.getHtmlDetalles("Ticket", requestInfo)
        }

        if (trabajaConComanda) {
            pp.infoToFill["Ticket.NombreComanda"] = requestInfo.nombreClienteComanda
            toPrint.imprimir["imprimirComanda"] = pp.getHtmlComanda("TicketComanda", requestInfo)
        }
        pp.infoToFill["Ticket.NFolio"] = requestInfo.hashEnvase
        toPrint.imprimir["imprimirEnvase"] = pp.getHtmlEnvases("Envase", requestInfo, createQrString)

        return toPrint
    }


    static printContent(contenido, functionConfirm, showAlert) {
        const queImpresoraUsa = ModelConfig.get("modoImpresion")
        console.log("printContent")
        console.log("contenido", contenido)

        //adapto el response a una venta offline
        if (!contenido.imprimir && contenido.imprimirResponse) contenido.imprimir = contenido.imprimirResponse

        if (queImpresoraUsa == ModosImpresion.IMPRESORA_PREDETERMINADA) {
            console.log("imprimiendo por IMPRESORA_PREDETERMINADA")

            Printer.preguntaFuncion = functionConfirm
            Printer.printAll(contenido)

            const impresoraComanda = ModelConfig.get("modoImpresionComanda")
            console.log("reviso comanda", impresoraComanda)
            if (
                contenido.imprimir.imprimirComanda
                && impresoraComanda == ModosImpresion.SERVIDOR
            ) {
                console.log("reviso comanda2")
                PrinterServer.preguntaFuncion = functionConfirm
                setTimeout(() => {
                    PrinterServer.printAll({
                        imprimirComanda: contenido.imprimir.imprimirComanda
                    }, (a) => {
                    }, showAlert)
                }, 3000);
            }
        } else {
            console.log("imprimiendo por servidor")
            PrinterServer.preguntaFuncion = functionConfirm
            PrinterServer.printAll(contenido.imprimir, (a) => {
            }, showAlert)

            const impresoraComanda = ModelConfig.get("modoImpresionComanda")
            const cantAImprimir = parseInt(ModelConfig.get("cantidadTicketImprimir"))

            if (
                contenido.imprimir.imprimirComanda
                && impresoraComanda == ModosImpresion.IMPRESORA_PREDETERMINADA
            ) {
                Printer.preguntaFuncion = functionConfirm
                setTimeout(() => {
                    Printer.printAll({
                        imprimir: {
                            imprimirComanda: contenido.imprimir.imprimirComanda
                        }
                    }, cantAImprimir)
                }, 3000);
            }
        }
    }

    static adminContent({
        showAlert,
        functionConfirm,
        content,
        createQrString
    }) {
        const toPrint: any = this.prepareContent(content, createQrString)
        this.printContent(toPrint, functionConfirm, showAlert)
    }

};

export default Printer;