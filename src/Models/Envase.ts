import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Sale from './Sale.ts';
import Sales from './Sales.ts';

import BaseConfig from "../definitions/BaseConfig.ts";
import ModelConfig from './ModelConfig.ts';
import axios from 'axios';
import EndPoint from './EndPoint.ts';
import ModelSingleton from './ModelSingleton.ts';


class Envase extends ModelSingleton{
    sesion: StorageSesion;

    constructor(){
      super()
      this.sesion = new StorageSesion("Envase");
    }

  static async buscar({
    folio,
    qr
  }:any,callbackOk:any, callbackWrong:any){
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/ProductosTmp/GetEnvases?"
    + "nfolio=" + folio
    + "&qr=" + qr

    url += "&codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url,(responseData:any, response:any)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  }


  static async devolver(data:any,callbackOk:any, callbackWrong:any){
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/ProductosTmp/PostEnvasesByNFolio"
    
    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url,data,(responseData:any, response:any)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  }
};

export default Envase;