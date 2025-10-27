import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class Proveedor extends Model {
  codigoProveedor: number = 0
  razonSocial: string = ""
  giro: string = ""
  rut: string = ""
  email: string = ""
  telefono: string = ""
  direccion: string = ""
  comuna: string = ""
  region: string | null = ""
  pagina: string = ""
  formaPago: string = ""
  nombreResponsable: string = ""
  correoResponsable: string = ""
  telefonoResponsable: string = ""
  sucursal: string = ""

  compraDeudaIds: any
  montoPagado: any
  metodoPago: any

  static instance: Proveedor | null = null;

  static getInstance(): Proveedor {
    if (Proveedor.instance == null) {
      Proveedor.instance = new Proveedor();
    }

    return Proveedor.instance;
  }

  async getAllFromServer(callbackOk:any, callbackWrong:any) {
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Proveedores/GetProveedorCompra"

    EndPoint.sendGet(url, (responseData:any, response:any) => {
      callbackOk(responseData.proveedorCompra.proveedorCompraCabeceras, response)
    }, callbackWrong)
  }


  async getAllDeudas(callbackOk:any, callbackWrong:any) {
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Proveedores/GetProveedorCompra"
    EndPoint.sendGet(url, (responseData:any, response:any) => {
      callbackOk(responseData.proveedorCompra.proveedorCompraCabeceras, response)
    }, callbackWrong)
  }

  filterByCodigo(all:any, funcCadaItem:any) {
    var result = []
    var me = this;
    result = all.filter((item:any) => {
      const coinciden = item.codigoProveedor == me.codigoProveedor
      if (coinciden && funcCadaItem != undefined) funcCadaItem(item)
      return coinciden
    })
    return result
  }


  async pagarDeuda(callbackOk:any, callbackWrong:any) {
    const data:any = this.getFillables()
    if (data.fechaIngreso == undefined) { console.log("faltan completar fechaIngreso"); return }
    if (data.codigoUsuario == undefined) { console.log("faltan completar codigoUsuario"); return }

    if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    if (this.compraDeudaIds == undefined) { console.log("faltan completar compraDeudaIds"); return }
    if (data.montoPagado == undefined) { console.log("faltan completar montoPagado"); return }
    if (data.metodoPago == undefined) { console.log("faltan completar metodoPago"); return }

    data.compraDeudaIds = this.compraDeudaIds

    const configs = ModelConfig.get()
    var url = configs.urlBase +
      "/api/Proveedores/AddProveedorCompraPagar"


    EndPoint.sendPost(url, data, (responseData:any, response:any) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  }
};

export default Proveedor;