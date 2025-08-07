import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import EndPoint from './EndPoint.ts';
import ModelConfig from './ModelConfig.ts';
import axios from 'axios';
import SoporteTicket from './SoporteTicket.ts';


class Model {
  // sesion: StorageSesion;

  constructor() {
    this.sesion = new StorageSesion(eval("this.__proto__.constructor.name"));
  }

  fill(values) {
    for (var campo in values) {
      const valor = values[campo]
      this[campo] = valor;
    }
  }

  getFillables() {
    var values = {};
    for (var prop in this) {
      if (typeof (this[prop]) != 'object'
        && this[prop] != undefined
      ) {
        values[prop] = this[prop]
      }
    }
    return values
  }


  static async pruebaImpresion(callbackOk, callbackWrong) {
    try {
      const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/api/Ventas/ImprimirTicketEjemplo"
      var data = {}
      if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
      if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

      const response = await axios.post(url, data);
      if (
        response.data.statusCode === 200
        || response.data.statusCode === 201

      ) {
        // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
        callbackOk(response.data)
      } else {
        callbackWrong("Error de servidor")
      }
    } catch (error) {
      callbackWrong(error)
    }
  }

  static async pruebaImpresionEspecial(data, callbackOk, callbackWrong) {
    try {
      const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/api/Ventas/ImprimirTicketEjemploDatos"

      if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
      if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

      const response = await axios.post(url, data);
      if (
        response.data.statusCode === 200
        || response.data.statusCode === 201

      ) {
        // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
        callbackOk(response.data)
      } else {
        callbackWrong("Error de servidor")
      }
    } catch (error) {
      callbackWrong(error)
    }
  }

  static async getConexion(callbackOk, callbackWrong) {
    const url = ModelConfig.get("urlBase") + "/api/Cajas/EstadoApi"
    const reportarErrorAntes = SoporteTicket.reportarError
    SoporteTicket.reportarError = false
    EndPoint.sendGet(url, (responseData, response) => {
      SoporteTicket.reportarError = reportarErrorAntes
      callbackOk(responseData.sucursals, response)
    }, (x) => {
      SoporteTicket.reportarError = reportarErrorAntes
      callbackWrong(x)
    })


  }

  static async getSupervision(data, callbackOk, callbackWrong) {
    const url = ModelConfig.get("urlBase") + "/api/Ventas/AutorizarAccion?fechaIngreso=" + data.fechaIngreso
      + "&idUsuario=" + data.idUsuario + "&CodeAutorizacion=" + data.CodeAutorizacion + "&Accion=" + data.Accion
    EndPoint.sendPost(url, data.body, (responseData, response) => {
      callbackOk(responseData.sucursals, response)
    }, callbackWrong)
  }


  static async getOfertas(callbackOk, callbackWrong) {
    const url = ModelConfig.get("urlBase") + "/api/Ofertas/GetOfertas"
    EndPoint.sendGet(url, (responseData, response) => {
      callbackOk(responseData.ofertas, response)
    }, callbackWrong)
  }
};

export default Model;