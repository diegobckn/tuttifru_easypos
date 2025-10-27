import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import MovimientoCaja from "../Types/MovimientoCaja.ts";
import Model from './Model';
import ModelConfig from './ModelConfig.ts';
import System from '../Helpers/System.ts';
import LoopProperties from '../Helpers/LoopProperties.ts';
import ModelSingleton from './ModelSingleton.ts';
import User from './User.ts';
import Comercio from './Comercio.ts';


class PrinterPaper extends ModelSingleton {
    templates: any[] = []
    infoToFill: any = {}
    width: any = null

    infoDummy: any[] = []

    getDummy() {
        const sesDummy = new StorageSesion("printerInfoDummy")
        if (sesDummy.hasOne()) {
            return sesDummy.cargar(1)
        }
        return []
    }

    saveDummy(infoDummy: any) {
        const sesDummy = new StorageSesion("printerInfoDummy")
        sesDummy.guardar(infoDummy)
    }

    static getInstance(): PrinterPaper { return super.getInstance() }

    static loadTeamplatesFromServer(configs: any, callbackOk = (x: any) => { }) {
        console.log("loadTeamplatesFromServer")
        var me = PrinterPaper.getInstance()
        me.templates = []
        configs.forEach((serverConfig: any) => {
            const empiezaConImprimir = serverConfig.entrada.indexOf("Imprimir") === 0
            const invertido = System.invertirStr(serverConfig.entrada + "")
            const terminaConMM = invertido.indexOf("mm") === 0

            if (serverConfig.grupo == "Ticket" && empiezaConImprimir && terminaConMM) {
                me.templates.push(serverConfig)
            } else if (
                serverConfig.grupo == "Ticket"
                || serverConfig.grupo == "ImpresionTicket"
            ) {
                me.infoToFill[serverConfig.entrada] = serverConfig.valor
            } else {
                me.infoToFill[serverConfig.grupo.trim() + "." + serverConfig.entrada] = serverConfig.valor
            }
        })

        callbackOk(me.templates)

        // console.log("carga completa de info PrinterPaper", me)
    }

    loadWidthFromSesion() {
        const user = User.getInstance()
        const infoSesion = user.sesion.cargar(1)
        // console.log("infoSesion", infoSesion)
        if (!infoSesion) {
            console.log("No se pudo cargar el ancho de impresion de la sesion")
            return
        }

        this.width = infoSesion.estilo
    }

    static recolectInfo(callbackOk = () => { }) {
        const userData = User.getInstance().getFromSesion()
        var me = PrinterPaper.getInstance()
        me.loadWidthFromSesion()

        const procesarItems = (serverConfigs: any, callbackOk: any) => {
            PrinterPaper.loadTeamplatesFromServer(serverConfigs, () => {
                PrinterPaper.addInfoToFill("Usuario", userData.codigoUsuario)
                PrinterPaper.addInfoToFill("CodSucursal", ModelConfig.get("sucursal"))
                PrinterPaper.addInfoToFill("PuntoVenta", ModelConfig.get("puntoVenta"))
                PrinterPaper.addInfoToFill("AnchoTicket", me.width)
                PrinterPaper.addInfoToFill("Padding", "0px")
                PrinterPaper.addInfoToFill("user", userData.codigoUsuario)
                PrinterPaper.addInfoToFill("nomRazonSocial", serverConfigs.Nom_RazonSocial)
                callbackOk()
            })
        }

        if (Comercio.sesionServerAllConfig.hasOne()) {
            const ses = Comercio.sesionServerAllConfig.cargar(1)
            procesarItems(ses, callbackOk)
        } else {
            Comercio.getServerAllConfigs((serverConfigs: any) => {
                procesarItems(serverConfigs, callbackOk)
            }, () => { })
        }
    }

    static addInfoToFill(propName: string, propValue: any) {
        // console.log("....addInfoToFill....")
        // console.log("addInfoToFill---->propName", propName)
        // console.log("addInfoToFill---->propValue", propValue)
        // console.log("----addInfoToFill----")
        var me = PrinterPaper.getInstance()
        me.infoToFill[propName] = propValue
    }

    getTemplate(entrada: string) {
        var enc = ""
        this.templates.forEach((temp) => {
            if (temp.entrada == entrada || temp.entrada == "Imprimir" + entrada) {
                enc = temp.valor
            }
        })
        return enc
    }

    getFilled(entrada: string) {
        const template = this.getTemplate(entrada)
        if (!template) return ""
        var copiaTemplate = template + ""
        const keysInfo = Object.keys(this.infoToFill)

        keysInfo.forEach((infoProp) => {
            copiaTemplate = copiaTemplate.replaceAll("{{" + infoProp + "}}", this.infoToFill[infoProp])
        })

        return copiaTemplate
    }

    prepare(entrada: string) {
        return this.getFilled(entrada)
    }



    getHtmlDetalles(entrada: string, datosfinales: any) {
        entrada = entrada + this.width
        // console.log("getHtmlDetalles.. de " + entrada, "..datos", datosfinales)
        var pre = this.prepare(entrada)

        const rowTemplate = `<tr>
            <td>{{Cod_Scanner}}</td>
            <td>{{num_Cant}}</td>
            <td>{{Desc_Prod}}</td>
            <td>\${{Valor_Unit}}</td>
            <td>\${{Valor_Total}}</td>
        </tr>`

        //rellenar lo ultimo
        var html = pre

        var rowsHtml = ""

        var totalEnvases = 0

        const formatoMonto = (m: string | number): string => { return System.isInt(m) ? m + "" : parseFloat(m + "").toFixed(2) }
        datosfinales.products.forEach((prod: any) => {
            if (prod.codbarra == "0" && prod.descripcion == "Envase") {
                // es un envase
                totalEnvases += prod.cantidad * prod.precioUnidad
            } else {

                var rowHtml = rowTemplate + ""
                var totalItem = (prod.cantidad * prod.precioUnidad)

                const txtCantidad = formatoMonto(prod.cantidad)

                rowHtml = rowHtml.replaceAll("{{Cod_Scanner}}", System.partirCada(prod.codbarra + "", 5).join(" "))
                rowHtml = rowHtml.replaceAll("{{num_Cant}}", txtCantidad)
                rowHtml = rowHtml.replaceAll("{{Desc_Prod}}", prod.descripcion)
                rowHtml = rowHtml.replaceAll("{{Valor_Unit}}", formatoMonto(prod.precioUnidad))
                rowHtml = rowHtml.replaceAll("{{Valor_Total}}", formatoMonto(totalItem))

                rowsHtml += rowHtml
            }
        })

        html = html.replaceAll("{{NumFolio}}", this.infoToFill["Ticket.NFolio"])
        html = html.replaceAll("{{PDFQR}}", "")//boleta
        html = html.replaceAll("{{Fecha_Hora}}", System.formatDateServer(datosfinales.fechaIngreso))

        var metodoPago = datosfinales.pagos[0].metodoPago
        if (datosfinales.pagos.length > 1) metodoPago = "varios"
        html = html.replaceAll("{{Nom_MetodoPago}}", metodoPago)

        // console.log("metodo pago", metodoPago)
        var descuento = "0"
        if (datosfinales.descuento) descuento = datosfinales.descuento


        html = html.replaceAll("{{imprimirItems}}", rowsHtml)
        html = html.replaceAll("{{TotalGeneral}}", datosfinales.totalRedondeado)
        html = html.replaceAll("{{Total}}", datosfinales.totalPagado)
        html = html.replaceAll("{{Redondeo}}", datosfinales.redondeo)
        html = html.replaceAll("{{Vuelto}}", datosfinales.vuelto)
        html = html.replaceAll("{{Descuento}}", descuento)

        if (totalEnvases > 0) {
            html = html.replaceAll("{{EnvaseTotal}}", "<strong>Envases:  $" + formatoMonto(totalEnvases) + "</strong><br>")
        } else {
            html = html.replaceAll("{{EnvaseTotal}}", "")
        }

        // console.log("html de ticket", html)


        if (datosfinales.esVentaApp) {
            var addApp = ""
            addApp += "<div class=\"footer\">";
            // console.log("agregando datos de entrega", datosfinales)

            if (datosfinales.pedidoInfoEntrega && datosfinales.pedidoInfoEntrega.tipoEntrega) {
                if (
                    datosfinales.pedidoInfoEntrega.tipoEntrega == "2"
                    || datosfinales.pedidoInfoEntrega.tipoEntrega == "3"

                ) {

                    if (datosfinales.pedidoInfoEntrega.direccion) {
                        addApp += "      Domicilio:";
                        addApp += "<br/>";
                        addApp += datosfinales.pedidoInfoEntrega.direccion;
                    }

                    if (datosfinales.pedidoInfoEntrega.aclaracion) {
                        addApp += "<br/>";
                        addApp += "      Aclaraciones:";
                        addApp += "<br/>";
                        addApp += datosfinales.pedidoInfoEntrega.aclaracion;
                    }
                    if (datosfinales.pedidoInfoEntrega.hora) {
                        addApp += "<br/>";
                        addApp += "      Hora:";
                        addApp += "<br/>";
                        addApp += datosfinales.pedidoInfoEntrega.hora;
                    }
                } else {
                    addApp += "      Retira en caja del Comercio";
                }
                if (datosfinales.pedidoInfoEntrega.codigoRepartidor) {
                    addApp += "<br/>";
                    addApp += "      Codigo Repartidor:";
                    addApp += "<br/>";
                    addApp += datosfinales.pedidoInfoEntrega.codigoRepartidor;
                }
            }


            addApp += "</div><div class=\"footer\">";
            html = html.replace("<div class=\"footer\">", addApp)
        }


        return html
    }

    getHtmlEnvases(entrada:string, datosfinales:any, createQrString:any) {
        entrada = entrada + this.width
        // console.log("getHtmlEnvases.. de " + entrada, "..datos", datosfinales)
        var pre = this.prepare(entrada)

        //rellenar lo ultimo
        var html = pre

        var rowsHtml = ""

        var totalEnvases = 0
        var cantidad = 0

        const formatoMonto = (m:number) => { return System.isInt(m) ? m : m.toFixed(2) }

        datosfinales.products.forEach((prod:any) => {
            if (prod.codbarra == "0" && prod.descripcion == "Envase") {
                // es un envase
                cantidad += prod.cantidad
                totalEnvases += prod.cantidad * prod.precioUnidad
            }
        })

        if (cantidad < 1) {
            return ""
        }


        const folioQr = this.infoToFill["Ticket.NFolio"]
        html = html.replace("{{QR_CODE}}", createQrString(folioQr, {
            height: "50px",
            width: "50px",
        }))

        html = html.replace("{{valor}}", System.formatMonedaLocal(formatoMonto(totalEnvases)) + "")
        html = html.replace("{{Cantidad}}", cantidad + "")
        html = html.replace("{{FECHA}}", System.formatDateServer(datosfinales.fechaIngreso))
        html = html.replace("{{HORA}}", "")

        // console.log("html de envases", html)
        return html
    }



    getHtmlComanda(entrada:string, datosfinales:any) {
        entrada = entrada + this.width
        // console.log("getHtmlDetalles.. de " + entrada, "..datos", datosfinales)

        // console.log("se rellena con ", this.infoToFill)
        var pre = this.prepare(entrada)

        const rowTemplate = `<tr>
            <td>{{num_Cant}}</td>
            <td>{{Desc_Prod}}</td>
        </tr>`

        //rellenar lo ultimo
        var html = pre

        var rowsHtml = ""

        // var totalEnvases = 0

        const formatoMonto = (m:any) => { return System.isInt(m) ? m : m.toFixed(2) }
        datosfinales.products.forEach((prod:any) => {
            if (prod.codbarra == "0" && prod.descripcion == "Envase") {
                // es un envase
                // totalEnvases += prod.cantidad * prod.precioUnidad
            } else {

                var rowHtml = rowTemplate + ""
                var totalItem = (prod.cantidad * prod.precioUnidad)

                const txtCantidad = formatoMonto(prod.cantidad)

                rowHtml = rowHtml.replaceAll("{{Cod_Scanner}}", System.partirCada(prod.codbarra, 5).join(" "))
                rowHtml = rowHtml.replaceAll("{{num_Cant}}", txtCantidad)
                rowHtml = rowHtml.replaceAll("{{Desc_Prod}}", prod.descripcion)
                rowHtml = rowHtml.replaceAll("{{Valor_Unit}}", formatoMonto(prod.precioUnidad))
                rowHtml = rowHtml.replaceAll("{{Valor_Total}}", formatoMonto(totalItem))

                if (prod.extras) {
                    var agrega = ""
                    var quita = ""
                    if (prod.extras.agregar) {
                        prod.extras.agregar.forEach((agre:any) => {
                            if (agrega != "") agrega += ", "
                            agrega += agre.nombre
                        })
                    }

                    if (prod.extras.quitar) {
                        prod.extras.quitar.forEach((sin:any) => {
                            if (quita != "") quita += ", "
                            quita += sin.nombre
                        })
                    }


                    var rowExtras = "<tr><td colspan='10'>{{Agrega}}{{Quita}}{{Entrega}}</td></tr>"
                    if (agrega != "") {
                        agrega = "Agregar: " + agrega + "<br/>"
                    }
                    rowExtras = rowExtras.replaceAll("{{Agrega}}", agrega)

                    if (quita != "") {
                        quita = "Quitar: " + quita + "<br/>"
                    }
                    rowExtras = rowExtras.replaceAll("{{Quita}}", quita)
                    rowExtras = rowExtras.replaceAll("{{Entrega}}", "Entrega: " + prod.extras.entrega)
                    rowHtml += rowExtras
                }


                rowsHtml += rowHtml
            }
        })

        html = html.replaceAll("{{NumFolio}}", this.infoToFill["Ticket.NFolio"])
        html = html.replaceAll("{{PDFQR}}", "")//boleta
        html = html.replaceAll("{{Fecha_Hora}}", System.formatDateServer(datosfinales.fechaIngreso))
        html = html.replaceAll("{{NombreClienteComanda}}", this.infoToFill["Ticket.NombreComanda"])

        // console.log("metodo pago", metodoPago)

        html = html.replaceAll("{{imprimirItems}}", rowsHtml)
        html = html.replaceAll("<th>Metodo</th>", "")

        // if (totalEnvases > 0) {
        //     html = html.replaceAll("{{EnvaseTotal}}", "<strong>Envases:  $" + formatoMonto(totalEnvases) + "</strong><br>")
        // } else {
        //     html = html.replaceAll("{{EnvaseTotal}}", "")
        // }

        // console.log("html de ticket", html)


        if (datosfinales.esVentaApp && datosfinales.pedidoExtras) {
            var extras = JSON.parse(datosfinales.pedidoExtras)
            console.log("extras", extras)

            if (extras.aclaraciones) {

                var addApp = ""
                addApp += "<div class=\"receipt\">";
                addApp += "  <table class=\"details\">";
                addApp += "    <tr>";
                addApp += "      <td>";
                addApp += "         Aclaraciones:";
                addApp += "      </td>";
                addApp += "    </tr>";

                addApp += "    <tr>";
                addApp += "      <td>";
                addApp += extras.aclaraciones;
                addApp += "      </td>";
                addApp += "    </tr>";

                addApp += "  </table>";

                addApp += "</div></body>";
                html = html.replace("</body>", addApp)
            }
        }

        return html
    }
};

export default PrinterPaper;