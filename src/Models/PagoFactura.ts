import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import IPagoBoleta, { IProductoPagoBoleta, ITransferencia } from '../Types/IPagoBoleta.ts';
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class PagoFactura extends Model implements IPagoBoleta {
  idUsuario: number = 0;
  codigoClienteSucursal: number = 0;
  codigoCliente: number = 0;
  total: number = 0;
  products: IProductoPagoBoleta[] = [];
  metodoPago: string = "";
  transferencias: ITransferencia | {} = {};

  async hacerPagoFactura(data: any, callbackOk: any, callbackWrong: any) {

    const configs = ModelConfig.get()
    var url = configs.urlBase
    url += "/api/Imprimir/Factura"

    if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url, data, (responseData: any, response: any) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  }
};

export default PagoFactura;