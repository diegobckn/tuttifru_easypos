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


class PagoBoleta extends Model implements IPagoBoleta {
  idUsuario: number = 0;
  codigoClienteSucursal: number = 0;
  codigoCliente: number = 0;
  total: number = 0;
  products: IProductoPagoBoleta[] = [];
  metodoPago: string = "";
  transferencias: ITransferencia | null = null;



  static medioExcluido(infoAEnviar:any) {
    const excluirMediosEnBoleta = (ModelConfig.get("excluirMediosEnBoleta"))

    const metodosArr: any = System.arrayFromObject(MetodosPago, true)

    var algunExcluido = false
    infoAEnviar.pagos.forEach((pago:any) => {

      var metodoAdaptado = pago.metodoPago
      if (pago.metodoPago == "TARJETA") {
        metodoAdaptado = pago.tipoTarjeta
      }

      if (pago.metodoPago == "CUENTACORRIENTE") {
        metodoAdaptado = "CUENTA_CORRIENTE"
      }

      var index = metodosArr.indexOf(metodoAdaptado)
      if (index != -1 && excluirMediosEnBoleta.includes(index)) {
        algunExcluido = true
      }
    })

    return algunExcluido

  }
  //devuelve lo opuesto a modo avion..
  static analizarSiHaceBoleta(infoAEnviar:any) {
    if (!ModelConfig.get("emitirBoleta")) {
      return false
    }

    if (!ModelConfig.get("tienePasarelaPago")) {
      return true
    }

    return !(this.medioExcluido(infoAEnviar))
  }

  async hacerPago(data:any, callbackOk:any, callbackWrong:any, esOffline = false) {
    const emitirBoleta = (ModelConfig.get("emitirBoleta"))

    const configs = ModelConfig.get()
    var url = configs.urlBase

    if (esOffline) {
      if (data.queOperacionHace == "Boleta") {
        url += "/api/Ventas/GrabarVentaBoleta"
      } else {
        url += "/api/Ventas/GrabarVentaTicket"
      }
    } else {//online
      const haceBoleta = PagoBoleta.analizarSiHaceBoleta(data)
      if (haceBoleta) {
        url += "/api/Imprimir/Boleta"
      } else {
        url += "/api/Imprimir/TicketNew"
      }
    }

    if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal") + ""
    if (!data.codigoClienteSucursal) data.codigoClienteSucursal = "0"
    if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta") + ""


    EndPoint.sendPost(url, data, (responseData:any, response:any) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  }
};

export default PagoBoleta;