
import axios from "axios";
import Model from "./Model";
import ModelConfig from "./ModelConfig.ts";
import EndPoint from "./EndPoint.ts";
import System from "../Helpers/System.ts";

class Sucursal extends Model {


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
    const url = ModelConfig.get("urlBase") + "/api/Sucursales/GetAllSucursales"
    EndPoint.sendGet(url, (responseData: any, response: any) => {
      callbackOk(responseData.sucursals, response)
      // console.log("voy a guardar ", System.clone(responseData.sucursals))
    }, (er: any) => {
      callbackWrong(er)
    })
  }
}

export default Sucursal;
