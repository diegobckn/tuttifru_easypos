import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class TicketPreventa extends Model {
  async hacerTicket(data:any,callbackOk:any, callbackWrong:any){
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/Ventas/PreVentaAdd"

    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url,data,(responseData:any, response:any)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  }
};

export default TicketPreventa;