
import axios from "axios";
import Model from "./Model";
import ModelConfig from "./ModelConfig.ts";
import EndPoint from "./EndPoint.ts";
import System from "../Helpers/System.ts";
import StorageSesion from "../Helpers/StorageSesion.ts";

class Sucursal extends Model {
  static sesion = new StorageSesion("sucursales")


  static instance: Sucursal | null = null;
  static getInstance(): Sucursal {
    if (Sucursal.instance == null) {
      Sucursal.instance = new Sucursal();
    }

    return Sucursal.instance;
  }

  async add(data: any, callbackOk: any, callbackWrong: any) {
    try {
      const configs = ModelConfig.get()
      var url = configs.urlBase
        + "/api/Sucursales/AddSucursal"
      const response = await axios.post(url, data);
      if (
        response.status === 200
        || response.status === 201
      ) {
        // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
        callbackOk(response.data, response)
      } else {
        callbackWrong("Respuesta desconocida del servidor")
      }
    } catch (error: any) {
      if (error.response && error.response.status && error.response.status === 409) {
        callbackWrong(error.response.descripcion)
      } else {
        callbackWrong(error.message)
      }
    }
  }

  static async getAll(callbackOk: any, callbackWrong: any) {
    if (this.sesion.hasOne()) {
      callbackOk(this.sesion.cargarGuardados()[0])
    } else {
      callbackOk([])
    }
  }


  static almacenarParaOffline(callbackOk: any, callbackWrong: any) {
    var me = this
    const url = ModelConfig.get("urlBase") + "/api/Sucursales/GetAllSucursales"
    EndPoint.sendGet(url, (responseData: any, response: any) => {
      console.log("devuelve servidor sucursales", responseData.sucursals)
      callbackOk(responseData.sucursals, response)
      me.sesion.guardar(responseData.sucursals)

      // console.log("voy a guardar ", System.clone(responseData.sucursals))
    }, (er: any) => {
      callbackWrong(er)
    })
  }
}

export default Sucursal;
