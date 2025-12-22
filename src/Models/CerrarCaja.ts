import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import SoporteTicket from './SoporteTicket.ts';
import EndPoint from './EndPoint.ts';
import User from './User.ts';

class CerrarCaja extends Model {
  async enviar(data: any, callbackOk: any, callbackWrong: any) {
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Cajas/AddCajaArqueo";

    if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url, data, (responseData: any, response: any) => {
      this.informeEmail(responseData, () => {
        callbackOk(responseData, response);
      }, () => {
        callbackOk(responseData, response);
      })
    }, callbackWrong)
  }

  async informeEmail(responseData: any, callbackOk: any, callbackWrong: any) {
    const configs = ModelConfig.get()

    if (!configs.enviarEmailCierreCaja) {
      callbackWrong("mal configuracion")
      return
    }
    if (configs.aQuienEnviaEmails == "") {
      callbackWrong("mal configuracion")
      return
    }

    var url = "https://softus.com.ar/easypos/info-cierre-caja";

    const infoUser = User.getInstance().getFromSesion()
    const txtUser = infoUser && infoUser.nombres + " " + infoUser.apellidos


    const info = {
      sucursal: configs.sucursalNombre,
      puntoVenta: configs.puntoVentaNombre,
      infoCaja: responseData.imprimirResponse.imprimir,
      para: configs.aQuienEnviaEmails,
      usuario: txtUser
    }

    EndPoint.sendPost(url, info, (responseData: any, response: any) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  }
};

export default CerrarCaja;