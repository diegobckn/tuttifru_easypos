import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import SoporteTicket from './SoporteTicket.ts';
import EndPoint from './EndPoint.ts';
import User from './User.ts';
import AperturaCierreOffline from './AperturaCierreOffline.ts';

class CerrarCaja extends Model {
  async enviar(data: any, callbackOk: any, callbackWrong: any, forzarEnvio = false) {
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Cajas/AddCajaArqueo";

    if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    if (!forzarEnvio
      && AperturaCierreOffline.last()
      && !AperturaCierreOffline.lastWasSent()) {
      AperturaCierreOffline.addCierre(data)
      callbackOk({
        statusCode: 200
      }, {
        data: {
          statusCode: 200
        }
      })
      return
    }

    EndPoint.sendPost(url, data, (responseData: any, response: any) => {
      AperturaCierreOffline.addCierre(data, false)
      this.informeEmail(responseData, () => {
        callbackOk(responseData, response);
      }, () => {
        callbackOk(responseData, response);
      })
      // }, callbackWrong)
    }, (err: any) => {
      if (!forzarEnvio) {
        AperturaCierreOffline.addCierre(data)
        callbackOk({
          statusCode: 200
        }, {
          data: {
            statusCode: 200
          }
        })
      } else {
        callbackWrong(err)
      }
    })
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