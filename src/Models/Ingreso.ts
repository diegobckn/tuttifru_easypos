import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import IPagoBoleta, { IProductoPagoBoleta, ITransferencia } from '../Types/IPagoBoleta.ts';
import axios from 'axios';
import MovimientoCaja from '../Types/MovimientoCaja.ts';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class Ingreso extends Model implements MovimientoCaja{
  codigoUsuario: number;
  codigoSucursal: number;
  puntoVenta: string;
  fechaIngreso: string;
  idTurno: number;
  tipo: string;
  detalleTipo: string;
  observacion: string;
  monto: number;

  motivo: string | null | undefined;
  rutProveedor: string | null | undefined;
  idUsuario: string | null | undefined;
  
  static TIPO = "INGRESO"

  async otros(callbackOk, callbackWrong){
    if(!this.motivo){
      console.log("Ingreso. Otros ingresos. Falta motivo");
      return
    }
    this.tipo = Ingreso.TIPO
    this.detalleTipo = "OTROSINGRESOS"
    this.observacion = this.motivo

    const data = this.getFillables()
    delete data.motivo

    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/Cajas/AddCajaFlujo"
    
    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url,data,(responseData, response)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  }

};

export default Ingreso;