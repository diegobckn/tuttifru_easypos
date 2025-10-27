import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import IPagoBoleta, { IProductoPagoBoleta, ITransferencia } from '../Types/IPagoBoleta.ts';
import axios from 'axios';
import MovimientoCaja from '../Types/MovimientoCaja.ts';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class Retiro extends Model implements MovimientoCaja {
  codigoUsuario: number = 0;
  codigoSucursal: number = 0;
  puntoVenta: string = ""
  fechaIngreso: string = ""
  idTurno: number = 0;
  tipo: string = ""
  detalleTipo: string = ""
  observacion: string = ""
  monto: number = 0

  motivo: string | null = ""
  rutProveedor: string | null = ""
  idUsuario: string | null = ""

  static TIPO = "EGRESO"



  async retiroDeCaja(callbackOk: any, callbackWrong: any) {
    if (!this.motivo) {
      console.log("Retiro. retiroDeCaja. Falta motivo");
      callbackWrong("Falta motivo");
      return
    }
    this.tipo = Retiro.TIPO
    this.detalleTipo = "RETIRODECAJA"
    this.observacion = this.motivo

    const data: any = this.getFillables()
    delete data.motivo


    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Cajas/AddCajaFlujo"

    if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url, data, (responseData: any, response: any) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  }


  async anticipoTrabajador(callbackOk: any, callbackWrong: any) {
    if (this.codigoUsuario == null) {
      console.log("Retiro. pago de factura. Falta codigoUsuario");
      return
    }
    this.tipo = Retiro.TIPO
    this.detalleTipo = "ANTICIPOTRABAJADOR"

    const data: any = this.getFillables()
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Cajas/AddCajaFlujo"

    if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url, data, (responseData: any, response: any) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  }

  static revisarSiDebeSolicitar(respuestaEndpoint: any, funcionAsignar: any, showAlert: any) {
    if (
      respuestaEndpoint.solicitaRetiro == undefined
      || respuestaEndpoint.solicitaRetiro == ""
    ) {
      funcionAsignar("")
      return
    }

    funcionAsignar(respuestaEndpoint.solicitaRetiro)

    if (respuestaEndpoint.solicitaRetiro != "")
      showAlert(respuestaEndpoint.solicitaRetiro)
  }
};

export default Retiro;