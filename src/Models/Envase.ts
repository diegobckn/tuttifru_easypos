import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Sale from './Sale.ts';
import Sales from './Sales.ts';

import BaseConfig from "../definitions/BaseConfig.ts";
import ModelConfig from './ModelConfig.ts';
import axios from 'axios';
import EndPoint from './EndPoint.ts';


class Envase{
    sesion: StorageSesion;

    constructor(){
      this.sesion = new StorageSesion("Envase");
    }

  fill(values){
      for(var campo in values){
          const valor = values[campo]
          this[campo] = valor;
      }
  }

  getFillables(){
      var values:any = {};
      for(var prop in this){
          if(typeof(this[prop]) != 'object'
              && this[prop] != undefined
          ){
              values[prop] = this[prop]
          }
      }
      return values
  }

  static async buscar({
    folio,
    qr
  },callbackOk, callbackWrong){
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/ProductosTmp/GetEnvases?"
    + "nfolio=" + folio
    + "&qr=" + qr

    url += "&codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url,(responseData, response)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  }


  static async devolver(data,callbackOk, callbackWrong){
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/ProductosTmp/PostEnvasesByNFolio"
    
    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url,data,(responseData, response)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  }
};

export default Envase;