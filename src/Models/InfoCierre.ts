import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import IPagoBoleta, { IProductoPagoBoleta, ITransferencia } from '../Types/IPagoBoleta.ts';
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class InfoCierre extends Model {
    info: any;


  async obtenerDeServidor(idUsuario,callbackOk, callbackWrong){
    const configs = ModelConfig.get()
    var url = configs.urlBase + "/api/Cajas/GetArqueoCajaByIdUsuario?idusuario=" + idUsuario

    url += "&codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url,(responseData, response)=>{
      callbackOk(responseData,response);
      this.info = response.data;
    },callbackWrong)
  }
};

export default InfoCierre;