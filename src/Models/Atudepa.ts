import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import ProductSold from './ProductSold.ts';
import Sales from './Sales.ts';
import System from '../Helpers/System.ts';
import EndPoint from './EndPoint.ts';
import ModelSingleton from './ModelSingleton.ts';
import SoporteTicket from './SoporteTicket.ts';
import User from './User.ts';
import Comercio from './Comercio.ts';
import dayjs from 'dayjs';
import PrinterIframe from './PrinterIframe.ts';


class Atudepa extends ModelSingleton {

    static data: any = null
    static listo: any = false

    static ultimoIdPedido = 0;
    static tiempoIntervaloChequeoPedidos = 5;//en segundos
    static checkNuevosPedidos = true;
    static ultimoTurno: any = null;
    static intervaloFuncion: any = null;
    static nuevoPedidoFuncion = (nuevosPedidos:any) => { };

    static async preparar(callbackOk:any, alertFunction:any) {

        var me = this;

        await Comercio.getServerAllConfigs((info:any) => {
            // console.log("info", info)
            const cnf: any = Comercio.buscarConfig("ImpresionTicket", "Nro_Rut", info)
            if (!cnf) {
                alertFunction("Rut del comercio no encontrado")
                return
            }
            const userData = User.getInstance().getFromSesion()
            me.data = {
                name: userData.nombres + " " + userData.apellidos,
                rut: cnf.valor,
                extras: JSON.stringify({
                    codigoUsuario: userData.codigoUsuario,
                    codigoSucursal: ModelConfig.get("sucursal"),
                    puntoVenta: ModelConfig.get("sucursal")
                })
            }

            // console.log("todo listo para enviar", me.data)
            callbackOk(me.data)
        }, () => { })

    }

    static iniciarCiclo() {
        console.log("Atudepa.iniciarCiclo")
        console.log("Atudepa.intervaloFuncion", Atudepa.intervaloFuncion)
        if (!Atudepa.intervaloFuncion) {
            Atudepa.intervaloFuncion = setInterval(() => {
                console.log(" atudepa intervalo")

                Atudepa.buscarNuevosPedidos()
            }, Atudepa.tiempoIntervaloChequeoPedidos * 1000);
        }
    }

    static abrirTurno(abrirA:any, cerrarA:any, cantidadPersonas:any, callbackOk:any, callbackWrong:any) {
        var me = this;

        me.data.open = abrirA
        me.data.close = cerrarA
        me.data.staffQuantity = cantidadPersonas


        // console.log("a enviar ", me.data);

        const url = "https://softus.com.ar/easypos/open-attention-atudepa"

        const vl = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, me.data, (responseData:any, response:any) => {
            callbackOk(responseData)
            Atudepa.ultimoTurno = responseData.info;

            SoporteTicket.reportarError = vl
        }, (err:any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = vl
        })
    }

    static buscarNuevosPedidos() {
        if (!Atudepa.checkNuevosPedidos) {
            console.log("Atudepa.buscarNuevosPedidos..saliendo !checkNuevosPedidos")
            return
        }
        console.log("Atudepa.buscarNuevosPedidos..")
        var me = this;

        me.data.lastPurchaseId = Atudepa.ultimoIdPedido
        // console.log("a enviar ", me.data);
        const url = "https://softus.com.ar/easypos/check-news-purchases-atudepa"

        console.log("buscarNuevosPedidos..")
        const vl = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, me.data, (responseData:any, response:any) => {
            if (responseData.purchases.length > 0) {
                Atudepa.nuevoPedidoFuncion(responseData.purchases)
            }
            SoporteTicket.reportarError = vl
        }, (err:any) => {
            SoporteTicket.reportarError = vl
        })
    }

    static cerrarTurno(turno:any, callbackOk:any, callbackWrong:any) {
        var me = this;

        me.data.id = turno.id
        // console.log("a enviar ", me.data);
        const url = "https://softus.com.ar/easypos/close-attention-atudepa"

        const vl = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, me.data, (responseData:any, response:any) => {
            callbackOk(responseData)
            SoporteTicket.reportarError = vl
        }, (err:any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = vl
        })
    }

    static pausarTurno(turno:any, callbackOk:any, callbackWrong:any) {
        var me = this;

        me.data.id = turno.id
        // console.log("a enviar ", me.data);
        const url = "https://softus.com.ar/easypos/pause-attention-atudepa"

        const vl = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, me.data, (responseData:any, response:any) => {
            callbackOk(responseData)
            SoporteTicket.reportarError = vl
        }, (err:any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = vl
        })
    }

    static despausarTurno(turno:any, callbackOk:any, callbackWrong:any) {
        var me = this;

        me.data.id = turno.id
        // console.log("a enviar ", me.data);
        const url = "https://softus.com.ar/easypos/continue-attention-atudepa"

        const vl = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, me.data, (responseData:any, response:any) => {
            callbackOk(responseData)
            SoporteTicket.reportarError = vl
        }, (err:any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = vl
        })
    }

    static checkTurno(callbackOk:any, callbackWrong:any) {
        var me = this;

        // console.log("a enviar ", me.data);

        const url = "https://softus.com.ar/easypos/check-attention-atudepa"

        me.data.date = dayjs().format("YYYY-MM-DD")

        const vl = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, me.data, (responseData:any, response:any) => {
            callbackOk(responseData)
            Atudepa.ultimoTurno = responseData.info;

            SoporteTicket.reportarError = vl
        }, (err:any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = vl
        })
    }

    static obtenerPedidos(callbackOk:any, callbackWrong:any) {
        var me = this;

        // console.log("a enviar ", me.data);

        const url = "https://softus.com.ar/easypos/get-purchases-atudepa"

        me.data.date = dayjs().format("YYYY-MM-DD")

        const vl = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, me.data, (responseData:any, response:any) => {
            callbackOk(responseData)

            var maxId = -1
            responseData.purchases.forEach((pur:any) => {
                if (maxId === -1 || pur.id > maxId) maxId = pur.id
            });
            Atudepa.ultimoIdPedido = maxId
            SoporteTicket.reportarError = vl
        }, (err:any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = vl
        })
    }

    static cambiarEstadosPedidos(ids:any, status:any, callbackOk:any, callbackWrong:any) {
        var me = this;

        // console.log("a enviar ", me.data);

        const url = "https://softus.com.ar/easypos/change-status-atudepa"

        me.data.listToChange = ids
        me.data.status = status

        const vl = SoporteTicket.reportarError
        SoporteTicket.reportarError = false
        EndPoint.sendPost(url, me.data, (responseData:any, response:any) => {
            callbackOk(responseData)
            SoporteTicket.reportarError = vl
        }, (err:any) => {
            callbackWrong(err)
            SoporteTicket.reportarError = vl
        })
    }


    static imprimir(pedido: any, createQrString: any, userData: any, showAlert: any, showConfirm: any, callbackEnd: any) {
        pedido.shipping = JSON.parse(pedido.shipping_data)
        var tipoEntregaTxt = "";
        if (pedido.shipping.tipoEntrega == 1) {
            tipoEntregaTxt = "RETIRA"
        } else if (pedido.shipping.tipoEntrega == 2) {
            tipoEntregaTxt = "ENTREGA PROGRAMADA"
        } else if (pedido.shipping.tipoEntrega == 3) {
            tipoEntregaTxt = "ENTREGA DOMICILIO"
        } else {
            tipoEntregaTxt = "DESCONOCIDO"
        }

        var origs: any = []
        pedido.items.forEach((item: any, ix: number) => {
            var origInfo = JSON.parse(item.extras)
            // console.log("origInfo", origInfo)
            origInfo.price = parseFloat(origInfo.precioVenta)
            origInfo.quantity = parseFloat(origInfo.cantidad)
            origInfo.description = (origInfo.nombre)

            if (origInfo.extras) {
                origInfo.extras.entrega = tipoEntregaTxt
            }
            origs.push(origInfo)
        })

        const totalFinal = pedido.total;
        const productos = origs;

        // adaptar ticket
        var algunaPreventa = ""
        var hashEnvase = ""
        const requestBody: any = {
            idUsuario: userData.codigoUsuario,
            fechaIngreso: pedido.created_at.replace(" ", "T"),
            // codigoClienteSucursal: 0,
            codigoCliente: 0, // despues abajo se cambia si es necesario
            codigoUsuarioVenta: 0, // despues abajo se cambia si es necesario
            // total: (grandTotal - descuentoEnvases + redondeo),
            subtotal: totalFinal,
            totalPagado: totalFinal,
            totalRedondeado: totalFinal,
            vuelto: 0,
            descuento: 0,
            // redondeo: (aplicaRedondeo ? redondeo + redondeoTolerancia : 0),
            redondeo: 0,
            products: [],
            pagos: [{
                "montoMetodoPago": totalFinal,
                "metodoPago": "PAGO APP"
            }],
            preVentaID: algunaPreventa,
            nombreClienteComanda: pedido.client.name,

            esVentaApp: true,//para imprimir comanda
            pedidoId: pedido.id,
            pedidoInfoEntrega: pedido.shipping,
            pedidoExtras: pedido.extras
        };

        //agregamos los productos

        requestBody.products =
            Sales.prepararProductosParaPagar(productos, requestBody)

        // console.log("prods adaptados", requestBody.products)
        // return

        var transferenciaDatos = {}
        requestBody.transferencias = transferenciaDatos

        requestBody.queOperacionHace = "Ticket"
        requestBody.nFolioTicket = pedido.id
        requestBody.hashEnvase = hashEnvase

        const imprimirOffline = () => {
            // console.log("imprimirOffline")
            PrinterIframe.adminContent({
                showAlert: null,
                createQrString,
                content: requestBody,
                functionConfirm: showConfirm,
                adicionalInfo: requestBody,
                callbackEnd: callbackEnd
            })
        }


        imprimirOffline()
        // fin adaptar ticket

    }

};



export default Atudepa;