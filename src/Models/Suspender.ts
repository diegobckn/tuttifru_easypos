import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class Suspender extends Model {
  usuario = null
  descripcion = "string"
  ventaSuspenderDetalle: any
  // [
  // {
  // "cantidad": 0,
  // "codProducto": "string"
  // }
  // ]



  static instance: Suspender | null = null;

  static getInstance(): Suspender {
    if (Suspender.instance == null) {
      Suspender.instance = new Suspender();
    }

    return Suspender.instance;
  }

  preSuspender(data: {
    usuario:any,
    descripcion:string,
    listado:any
  }) {
    this.usuario = data.usuario
    this.descripcion = data.descripcion
    this.ventaSuspenderDetalle = data.listado
  }

  async suspender(callbackOk:any, callbackWrong:any) {
    if (
      !this.usuario
      || !this.descripcion
      || !this.ventaSuspenderDetalle
    ) {
      console.log("faltan datos");
      return
    }

    const data:any = this.getFillables()
    data["ventaSuspenderDetalle"] = this.ventaSuspenderDetalle
    const configs = ModelConfig.get()
    var url = configs.urlBase +
      "/api/Ventas/SuspenderVentaAdd"
    console.log(url)

    if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url, data, (responseData:any, response:any) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  }

  async listarVentas(userId:number, callbackOk:any, callbackWrong:any) {
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Ventas/SuspenderVentaGetByIdUsuario?idusuario=" + userId;
    url += "&codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url, (responseData:any, response:any) => {
      callbackOk(response.data.ventaSuspenderCabeceras, response)
    }, callbackWrong)
  } 
  
  async listarVentasDeTodos(callbackOk:any, callbackWrong:any) {
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Ventas/SuspenderVentaGetAll";
    url += "?codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url, (responseData:any, response:any) => {
      callbackOk(response.data.ventaSuspenderCabeceras, response)
    }, callbackWrong)
  }

  async recuperar(id:number, callbackOk:any, callbackWrong:any) {
    const data: any = {
      id: id
    }

    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Ventas/SuspenderVentaDelete"

    if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url, data, (responseData:any, response:any) => {
      callbackOk(response, responseData);
    }, callbackWrong)
  }
};

export default Suspender;