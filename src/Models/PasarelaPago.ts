import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import IPagoBoleta, { IProductoPagoBoleta, ITransferencia } from '../Types/IPagoBoleta.ts';
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';
import MetodosPago from '../definitions/MetodosPago.ts';
import System from '../Helpers/System.ts';
import ModelSingleton from './ModelSingleton.ts';
import dayjs from 'dayjs';


class PasarelaPago extends ModelSingleton {

  // static urlBase = "https://api-uat-getnet-posintegrado.ione.cl/api/postxs"
  // static isProduction = false

  static urlBase = "https://softus.com.ar/easypos/getnet"
  static isProduction = false

  // static urlBase = "https://api-gcp2-getnet-posintegrado.ione.cl/api/postxs"
  // static isProduction = true

  static token = ""
  static extrasHeaders = {
    "xapikey-easypos": "Vr$$e].fP6r8(G2wX_v=:9xn;(.J+0"
  }

  sesionRequests: StorageSesion | undefined
  sesionResponses: StorageSesion | undefined

  constructor() {
    super()
    this.sesion = new StorageSesion("pasarelapago");
    this.sesionRequests = new StorageSesion("pasarela_sesionRequests");
    this.sesionResponses = new StorageSesion("pasarelaa_esionResponses");
  }

  static async obtenerToken(callbackOk: any, callbackWrong: any) {
    if (!ModelConfig.get("tienePasarelaPago")) return
    if (ModelConfig.get("pasarelaTerminalId") == "") return
    console.log("obtenerToken")
    var url = PasarelaPago.urlBase + "/auth"

    const info = new URLSearchParams({
      clientId: ModelConfig.get("pasarelaClientId"),
      clientSecret: ModelConfig.get("pasarelaSecret"),
      isProduction: ModelConfig.get("pasarelaEnProduccion") ? "true" : "false"
    }).toString();

    EndPoint.sendPost(url, info, (responseData: any, response: any) => {
      console.log("respuesta de token", response)
      if (responseData.status == "OK") {
        PasarelaPago.token = responseData.data.token
        callbackOk(response.data.token);
      } else {
        callbackWrong("respuesta incorrecta")
      }
    }, (err: any) => {
      callbackWrong(err)
    }, {
      headers: {
        ...PasarelaPago.extrasHeaders
      }
    })
  }


  static async conexion(callbackOk: any, callbackWrong: any) {
    if (!ModelConfig.get("tienePasarelaPago")) return
    if (ModelConfig.get("pasarelaTerminalId") == "") return

    if (PasarelaPago.token == "") {
      console.log("no hay token..")
      PasarelaPago.obtenerToken(() => {
        PasarelaPago.conexion(callbackOk, callbackWrong)
      }, () => {
        callbackWrong("No se pudo obtener token")
      })
      return
    }

    var url = PasarelaPago.urlBase + "/poll"

    const info = ({
      "idTerminal": ModelConfig.get("pasarelaTerminalId"),
      "idSucursal": parseInt(ModelConfig.get("pasarelaSucursalId")),
      "serialNumber": ModelConfig.get("pasarelaSerialNumber"),
      "command": 106,
      "customId": "1234",
      isProduction: ModelConfig.get("pasarelaEnProduccion") ? "true" : "false",
      // "webhook": "https://webhook.site/5c54ffd5-c252-4ccc-b870-b5caa84fc237"
    });

    console.log("a enviar", info)
    // return
    EndPoint.sendPost(url, info, (responseData: any, response: any) => {
      console.log("respuesta de pasarela", response)

      if (responseData.status == "OK") {
        callbackOk(responseData, response)
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      } else {
        callbackWrong("respuesta incorrecta")
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      }
    }, (err: any) => {
      callbackWrong(err)
      if (PasarelaPago.isProduction) PasarelaPago.token = ""
    }, {
      headers: {
        ...{
          'Authorization': "Bearer " + PasarelaPago.token,
          'Content-Type': 'application/json'
        }, ...PasarelaPago.extrasHeaders
      }
    })
  }

  static agregarRequest(url: string, info: any = null, operacion: string) {
    const me = new PasarelaPago()
    var antes: any = { id: 1, requests: [] }
    if (me.sesionRequests?.hasOne()) {
      antes = me.sesionRequests.cargar(1)
    }

    antes.requests.push({
      url, info, operacion
    })

    me.sesionRequests?.guardar(antes)
  }

  static agregarResponse(url: string, info: any = null, operacion: string) {
    const me = new PasarelaPago()
    var antes: any = { id: 1, responses: [] }
    if (me.sesionResponses?.hasOne()) {
      antes = me.sesionResponses.cargar(1)
    }

    antes.responses.push({
      url, info, operacion
    })

    me.sesionResponses?.guardar(antes)
  }

  static async devolver(monto: any, codigoAutorizacion: any, callbackOk: any, callbackWrong: any) {
    if (!ModelConfig.get("tienePasarelaPago")) return
    if (ModelConfig.get("pasarelaTerminalId") == "") return

    if (PasarelaPago.token == "") {
      console.log("no hay token..")
      PasarelaPago.obtenerToken(() => {
        PasarelaPago.devolver(monto, codigoAutorizacion, callbackOk, callbackWrong)
      }, () => {
        callbackWrong("No se pudo obtener token")
      })
      return
    }

    var url = PasarelaPago.urlBase + "/return"

    const info = ({
      "idTerminal": ModelConfig.get("pasarelaTerminalId"),
      "idSucursal": parseInt(ModelConfig.get("pasarelaSucursalId")),
      "serialNumber": ModelConfig.get("pasarelaSerialNumber"),
      "command": 108,
      "authorizationCode": codigoAutorizacion,
      "amount": parseFloat(monto),
      "printOnPos": ModelConfig.get("pasarelaPrint"),
      "customId": "1234",
      isProduction: ModelConfig.get("pasarelaEnProduccion") ? "true" : "false"
      // "webhook": "https://webhook.site/d1f0bc71-0f60-48f2-b56c-0493b7dea927"
    });

    console.log("a enviar", info)
    // return
    PasarelaPago.agregarRequest(url, info, "devolver")
    EndPoint.sendPost(url, info, (responseData: any, response: any) => {
      PasarelaPago.agregarResponse(url, responseData, "devolver")

      console.log("respuesta de pasarela", response)

      if (responseData.status == "OK") {
        callbackOk(responseData, response)
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      } else {
        callbackWrong("respuesta incorrecta")
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      }
    }, (err: any) => {
      callbackWrong(err)
      if (PasarelaPago.isProduction) PasarelaPago.token = ""
      PasarelaPago.agregarResponse(url, err, "devolver")
    }, {
      headers: {
        ...{
          'Authorization': "Bearer " + PasarelaPago.token,
          'Content-Type': 'application/json'
        }, ...PasarelaPago.extrasHeaders
      }
    })
  }

  static async anular(idTransaccion: any, callbackOk: any, callbackWrong: any) {
    if (!ModelConfig.get("tienePasarelaPago")) return
    if (ModelConfig.get("pasarelaTerminalId") == "") return

    if (PasarelaPago.token == "") {
      console.log("no hay token..")
      PasarelaPago.obtenerToken(() => {
        PasarelaPago.anular(idTransaccion, callbackOk, callbackWrong)
      }, () => {
        callbackWrong("No se pudo obtener token")
      })
      return
    }

    var url = PasarelaPago.urlBase + "/refund"

    const info = ({
      "idTerminal": ModelConfig.get("pasarelaTerminalId"),
      "idSucursal": parseInt(ModelConfig.get("pasarelaSucursalId")),
      "serialNumber": ModelConfig.get("pasarelaSerialNumber"),
      "command": 102,
      "operationId": idTransaccion,
      "printOnPos": ModelConfig.get("pasarelaPrint"),
      "customId": "1234",
      isProduction: ModelConfig.get("pasarelaEnProduccion") ? "true" : "false"
      // "webhook": "https://webhook.site/d1f0bc71-0f60-48f2-b56c-0493b7dea927"
    });

    console.log("a enviar", info)
    // return
    PasarelaPago.agregarRequest(url, info, "anular")
    EndPoint.sendPost(url, info, (responseData: any, response: any) => {
      console.log("respuesta de pasarela", response)
      PasarelaPago.agregarResponse(url, responseData, "anular")

      if (responseData.status == "OK") {
        callbackOk(responseData, response)
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      } else {
        callbackWrong("respuesta incorrecta")
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      }
    }, (err: any) => {
      PasarelaPago.agregarResponse(url, err, "anular")

      callbackWrong(err)
      if (PasarelaPago.isProduction) PasarelaPago.token = ""
    }, {
      headers: {
        ...{
          'Authorization': "Bearer " + PasarelaPago.token,
          'Content-Type': 'application/json'
        }, ...PasarelaPago.extrasHeaders
      }
    })
  }

  // consultar estado al pos directo
  static async consultaPos(idTransaccion: any, callbackOk: any, callbackWrong: any) {
    if (!ModelConfig.get("tienePasarelaPago")) return
    if (ModelConfig.get("pasarelaTerminalId") == "") return

    if (PasarelaPago.token == "") {
      console.log("no hay token..")
      PasarelaPago.obtenerToken(() => {
        PasarelaPago.consultaPos(idTransaccion, callbackOk, callbackWrong)
      }, () => {
        callbackWrong("No se pudo obtener token")
      })
      return
    }

    var url = PasarelaPago.urlBase + "/get_transaction"

    const info = ({
      "idTerminal": ModelConfig.get("pasarelaTerminalId"),
      "idSucursal": parseInt(ModelConfig.get("pasarelaSucursalId")),
      "serialNumber": ModelConfig.get("pasarelaSerialNumber"),
      "command": 99,
      "idPosTxs": parseInt(idTransaccion),
      "customId": "1234",
      isProduction: ModelConfig.get("pasarelaEnProduccion") ? "true" : "false"
    });

    console.log("a enviar", info)
    // return
    PasarelaPago.agregarRequest(url, info, "get transaction")

    EndPoint.sendPost(url, info, (responseData: any, response: any) => {
      console.log("respuesta de pasarela", response)
      PasarelaPago.agregarResponse(url, responseData, "get transaction")

      if (responseData.status == "OK") {
        callbackOk(responseData, response)
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      } else {
        callbackWrong("respuesta incorrecta")
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      }
    }, (err: any) => {
      PasarelaPago.agregarResponse(url, err, "get transaction")

      callbackWrong(err)
      if (PasarelaPago.isProduction) PasarelaPago.token = ""
    }, {
      headers: {
        ...{
          'Authorization': "Bearer " + PasarelaPago.token,
          'Content-Type': 'application/json'
        }, ...PasarelaPago.extrasHeaders
      }
    })
  }

  // consultar estado al servidor


  // ej de respuesta ok

  /*
  {
    "code": 1,
    "status": "OK",
    "message": "TRANSACCION FINALIZADA",
    "data": {
        "idPosTxs": 936081,
        "customId": "1234",
        "response": {
            "functionCode": 100,
            "responseCode": 0,
            "responseMessage": "Aprobado",
            "commerceCode": 15062,
            "terminalId": "80000926",
            "ticket": "1235",
            "authorizationCode": "725835",
            "amount": 1300,
            "sharesNumber": 0,
            "sharesAmount": 0,
            "last4Digits": "5547",
            "operationId": 3,
            "cardType": "CR",
            "accountingDate": "2026-06-11 22:40:22",
            "cardBrand": "MC",
            "realDate": "2026-06-11 22:40:22",
            "employeeId": 0,
            "tip": 0,
            "saleType": 0,
            "posMode": 1,
            "cashback": 0,
            "transToken": "8000092615062320260611224022",
            "expiryDate": "3001",
            "entryMode": "16",
            "aid": "A0000000041010",
            "commerceRut": "16268985-1",
            "commerceName": "Matias Hormazabal",
            "branchName": "EasyPOS",
            "branchAddress": "Mario miño 5471",
            "branchDistrict": "SAN JOAQUIN",
            "bin": "55920221",
            "paymentId": null,
            "paymentMethod": 0,
            "integrationType": 0,
            "softwareName": null,
            "softwareVersion": null,
            "rutToValidate": null,
            "rutRead": null,
            "rutMatch": false,
            "rutCheckResult": 0
          }
      }
  }





  ej de respuesta sin pagar

  {
    "code": 1,
    "status": "OK",
    "message": "TRANSACCION FINALIZADA",
    "data": {
        "idPosTxs": 936088,
        "customId": "1234",
        "response": {
            "functionCode": 100,
            "responseCode": 1006,
            "responseMessage": "Tiempo de espera excedido",
            "commerceCode": 0,
            "terminalId": "",
            "ticket": null,
            "authorizationCode": "",
            "amount": 1500,
            "sharesNumber": 0,
            "sharesAmount": 0,
            "last4Digits": "",
            "operationId": 0,
            "cardType": "",
            "accountingDate": "2026-06-11 23:02:09",
            "cardBrand": "",
            "realDate": "2026-06-11 23:02:09",
            "employeeId": 0,
            "tip": 0,
            "saleType": 0,
            "posMode": 0,
            "cashback": 0,
            "transToken": "8000092615062720260611230209",
            "expiryDate": "",
            "entryMode": "09",
            "aid": "",
            "commerceRut": "16268985-1",
            "commerceName": "Matias Hormazabal",
            "branchName": "EasyPOS",
            "branchAddress": "Mario miño 5471",
            "branchDistrict": "SAN JOAQUIN",
            "bin": "",
            "paymentId": null,
            "paymentMethod": 0,
            "integrationType": 0,
            "softwareName": null,
            "softwareVersion": null,
            "rutToValidate": null,
            "rutRead": null,
            "rutMatch": false,
            "rutCheckResult": 0
        }
    }
}
     */
  static async consultar(idTransaccion: any, callbackOk: any, callbackWrong: any) {
    if (!ModelConfig.get("tienePasarelaPago")) return
    if (ModelConfig.get("pasarelaTerminalId") == "") return

    if (PasarelaPago.token == "") {
      console.log("no hay token..")
      PasarelaPago.obtenerToken(() => {
        PasarelaPago.consultar(idTransaccion, callbackOk, callbackWrong)
      }, () => {
        callbackWrong("No se pudo obtener token")
      })
      return
    }

    var url = PasarelaPago.urlBase + "/" + idTransaccion
    PasarelaPago.agregarRequest(url, { idTransaccion }, "get transaction por url")

    EndPoint.sendGet(url +"isProduction=" + ModelConfig.get("pasarelaEnProduccion") ? "true" : "false", (responseData: any, response: any) => {
      console.log("respuesta de pasarela", response)
      PasarelaPago.agregarResponse(url, responseData, "get transaction por url")

      if (responseData.status == "OK" ||
        responseData.status == 200) {
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
        callbackOk(response.data)
      } else {
        callbackWrong("respuesta incorrecta")
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      }
    }, (err: any) => {
      PasarelaPago.agregarResponse(url, err, "get transaction por url")

      callbackWrong(err)
      if (PasarelaPago.isProduction) PasarelaPago.token = ""
    },
      {
        headers: {
          ...{
            'Authorization': "Bearer " + PasarelaPago.token,
            'Content-Type': 'application/json'
          }, ...PasarelaPago.extrasHeaders
        }
      })
  }

  static async imprimir(infoAImprimir: any, callbackOk: any, callbackWrong: any) {
    if (!ModelConfig.get("tienePasarelaPago")) return
    if (ModelConfig.get("pasarelaTerminalId") == "") return

    if (PasarelaPago.token == "") {
      console.log("no hay token..")
      PasarelaPago.obtenerToken(() => {
        PasarelaPago.imprimir(infoAImprimir, callbackOk, callbackWrong)
      }, () => {
        callbackWrong("No se pudo obtener token")
      })
      return
    }

    var url = PasarelaPago.urlBase + "/printservice"

    const info = ({
      "idTerminal": ModelConfig.get("pasarelaTerminalId"),
      "idSucursal": parseInt(ModelConfig.get("pasarelaSucursalId")),
      "serialNumber": ModelConfig.get("pasarelaSerialNumber"),
      "command": 117,
      "customId": "1234",
      // "webhook": "https://webhook.site/d1f0bc71-0f60-48f2-b56c-0493b7dea927",
      "details": infoAImprimir,
      isProduction: ModelConfig.get("pasarelaEnProduccion") ? "true" : "false"
    });

    console.log("a enviar", info)
    // return
    PasarelaPago.agregarRequest(url, infoAImprimir, "imprimir")

    EndPoint.sendPost(url, info, (responseData: any, response: any) => {
      console.log("respuesta de pasarela", response)
      PasarelaPago.agregarResponse(url, responseData, "imprimir")

      if (responseData.status == "OK") {
        callbackOk(responseData, response)
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      } else {
        callbackWrong("respuesta incorrecta")
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      }
    }, (err: any) => {
      PasarelaPago.agregarResponse(url, err, "imprimir")

      callbackWrong(err)
      if (PasarelaPago.isProduction) PasarelaPago.token = ""
    }, {
      headers: {
        ...{
          'Authorization': "Bearer " + PasarelaPago.token,
          'Content-Type': 'application/json'
        }, ...PasarelaPago.extrasHeaders
      }
    })
  }

  static actualizarEstadoVenta(idTransaccion: any, nuevoEstado: string, callbackOk = () => { }, callbackWrong = () => { }) {
    const pp = new PasarelaPago()
    console.log("haciendo actualizarEstadoVenta..con nuevoEstado", nuevoEstado)

    if (pp.sesion.hasOne()) {
      var actualizados: any = []
      const antes = pp.sesion.cargar(1)
      antes.ventas.forEach((ven: any) => {
        if (ven.idPosTxs == idTransaccion) {
          ven.estado = nuevoEstado
          actualizados.push(ven)
        } else {
          actualizados.push(ven)
        }
      })
      pp.sesion.guardar({
        id: 1,
        ventas: actualizados
      })

      callbackOk()
    } else {
      callbackWrong()
    }
  }

  static actualizarMontoVenta(idTransaccion: any, nuevoMonto: string, callbackOk = () => { }, callbackWrong = () => { }) {
    const pp = new PasarelaPago()
    console.log("haciendo actualizarMontoVenta..con nuevoMonto", nuevoMonto)

    if (pp.sesion.hasOne()) {
      var actualizados: any = []
      const antes = pp.sesion.cargar(1)
      antes.ventas.forEach((ven: any) => {
        if (ven.idPosTxs == idTransaccion) {
          ven.monto = nuevoMonto
          actualizados.push(ven)
        } else {
          actualizados.push(ven)
        }
      })
      pp.sesion.guardar({
        id: 1,
        ventas: actualizados
      })

      callbackOk()
    } else {
      callbackWrong()
    }
  }
  static actualizarCodAutorizaVenta(idTransaccion: any, nuevoCodigo: string, callbackOk = () => { }, callbackWrong = () => { }) {
    console.log("haciendo actualizarCodAutorizaVenta..con codigo", nuevoCodigo)
    const pp = new PasarelaPago()

    if (pp.sesion.hasOne()) {
      var actualizados: any = []
      const antes = pp.sesion.cargar(1)
      antes.ventas.forEach((ven: any) => {
        if (ven.idPosTxs == idTransaccion) {
          ven.codigoAutorizacion = nuevoCodigo
          actualizados.push(ven)
        } else {
          actualizados.push(ven)
        }
      })
      pp.sesion.guardar({
        id: 1,
        ventas: actualizados
      })

      callbackOk()
    } else {
      callbackWrong()
    }
  }

  static agregarVentaEnSesion(respuestaEnvio: any) {
    const pp = new PasarelaPago()

    const hoy = dayjs().format("YYYY-MM-DD")
    var vents: any = []
    respuestaEnvio.fechaOperacion = hoy
    respuestaEnvio.horaOperacion = dayjs().format("HH:mm:ss")


    if (pp.sesion.hasOne()) {
      const antes = pp.sesion.cargar(1)

      var ventasHoy: any = []
      antes.ventas.forEach((ven: any) => {
        if (ven.fechaOperacion == hoy) {
          ventasHoy.push(ven)
        }
      })
      vents = ventasHoy
      vents.push(respuestaEnvio)
      pp.sesion.guardar({
        id: 1,
        ventas: vents
      })
    } else {
      vents.push(respuestaEnvio)
      pp.sesion.guardar({
        id: 1,
        ventas: vents
      })
    }
  }

  static async enviarVenta(infoVenta: any, callbackOk: any, callbackWrong: any) {
    if (!ModelConfig.get("tienePasarelaPago")) return
    if (ModelConfig.get("pasarelaTerminalId") == "") return

    if (PasarelaPago.token == "") {
      console.log("no hay token..")
      PasarelaPago.obtenerToken(() => {
        PasarelaPago.enviarVenta(infoVenta, callbackOk, callbackWrong)
      }, () => {
        callbackWrong("No se pudo obtener token")
      })
      return
    }

    var url = PasarelaPago.urlBase + "/sale"

    console.log("enviarVenta.. infoVenta", infoVenta)

    const info = ({
      "idTerminal": ModelConfig.get("pasarelaTerminalId"),
      "idSucursal": parseInt(ModelConfig.get("pasarelaSucursalId")),
      "serialNumber": ModelConfig.get("pasarelaSerialNumber"),
      "command": "100",
      "amount": infoVenta.montoMetodoPago,
      "ticketNumber": "1235",
      "printOnPos": ModelConfig.get("pasarelaPrint"),
      "saleType": "1",
      "employeeId": "1",
      "customId": "1234",
      // "webhook": "https://webhook.site/d5e09c03-098b-4a33-8a4f-77b27b2f56f3"
      isProduction: ModelConfig.get("pasarelaEnProduccion") ? "true" : "false"
    });

    console.log("a enviar", info)
    // return
    PasarelaPago.agregarRequest(url, infoVenta, "venta")

    EndPoint.sendPost(url, info, (responseData: any, response: any) => {
      console.log("respuesta de pasarela", response)
      PasarelaPago.agregarResponse(url, responseData, "venta")

      if (responseData.status == "OK") {
        callbackOk(responseData, response)
        if (PasarelaPago.isProduction) PasarelaPago.token = ""

        PasarelaPago.agregarVentaEnSesion(responseData.data)
        callbackOk(responseData.data)
      } else {
        callbackWrong("respuesta incorrecta")
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      }
    }, (err: any) => {
      PasarelaPago.agregarResponse(url, err, "venta")

      console.log("respuesta error de pasarela", err)

      callbackWrong(err)
      if (PasarelaPago.isProduction) PasarelaPago.token = ""
    }, {
      headers: {
        ...{
          'Authorization': "Bearer " + PasarelaPago.token,
          'Content-Type': 'application/json'
        }, ...PasarelaPago.extrasHeaders
      }
    })
  }

  static vaciarSesion() {
    const pp = new PasarelaPago()
    pp.sesion.truncate()
  }


  static async hacerCierre(callbackOk: any, callbackWrong: any) {
    if (!ModelConfig.get("tienePasarelaPago")) return
    if (ModelConfig.get("pasarelaTerminalId") == "") return

    if (PasarelaPago.token == "") {
      console.log("no hay token..")
      PasarelaPago.obtenerToken(() => {
        PasarelaPago.hacerCierre(callbackOk, callbackWrong)
      }, () => {
        callbackWrong("No se pudo obtener token")
      })
      return
    }

    var url = PasarelaPago.urlBase + "/close"

    const info = ({
      "idTerminal": ModelConfig.get("pasarelaTerminalId"),
      "idSucursal": parseInt(ModelConfig.get("pasarelaSucursalId")),
      "serialNumber": ModelConfig.get("pasarelaSerialNumber"),
      "command": 103,
      "printOnPos": ModelConfig.get("pasarelaPrint"),
      "customId": "1234",
      // "webhook": "https://webhook.site/d1f0bc71-0f60-48f2-b56c-0493b7dea927"
      isProduction: ModelConfig.get("pasarelaEnProduccion") ? "true" : "false"
    });

    console.log("a enviar", info)
    // return
    PasarelaPago.agregarRequest(url, {}, "cierre")

    EndPoint.sendPost(url, info, (responseData: any, response: any) => {
      console.log("respuesta de pasarela", response)
      PasarelaPago.agregarResponse(url, responseData, "cierre")

      if (responseData.status == "OK") {
        callbackOk(responseData, response)
        PasarelaPago.vaciarSesion()
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      } else {
        callbackWrong("respuesta incorrecta")
        if (PasarelaPago.isProduction) PasarelaPago.token = ""
      }
    }, (err: any) => {
      PasarelaPago.agregarResponse(url, err, "cierre")

      callbackWrong(err)
      if (PasarelaPago.isProduction) PasarelaPago.token = ""
    }, {
      headers: {
        ...{
          'Authorization': "Bearer " + PasarelaPago.token,
          'Content-Type': 'application/json'
        }, ...PasarelaPago.extrasHeaders
      }
    })
  }



};

export default PasarelaPago;