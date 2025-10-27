import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import MovimientoCaja from "../Types/MovimientoCaja.ts";
import axios from "axios";
import Model from './Model';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class AperturaCaja extends Model implements MovimientoCaja {
    motivo: string | null = "";
    rutProveedor: string | null = "";
    idUsuario: string | number | null = 0;
    codigoUsuario: number = 0;
    codigoSucursal: number = 0;
    puntoVenta: string = "";
    fechaIngreso: string = "";
    tipo: string = "";
    detalleTipo: string = "";
    observacion: string = "";
    monto: number = 0;
    idTurno: number = 0;

    static instance: AperturaCaja | null = null;

    static getInstance(): AperturaCaja {
        if (AperturaCaja.instance == null) {
            AperturaCaja.instance = new AperturaCaja();
        }

        return AperturaCaja.instance;
    }

    saveInSesion(data:any) {
        this.sesion.guardar(data)
        // localStorage.setItem('userData', JSON.stringify(data));
        return data;
    }

    getFromSesion() {
        return this.sesion.cargar(1)
        // var dt = localStorage.getItem('userData') || "{}";
        // return JSON.parse(dt);
    }

    async sendToServer(callbackOk:any, callbackWrong:any) {
        var data:any = this.getFillables();
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/Cajas/AddCajaFlujo"

        if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPost(url, data, (responseData:any, response:any) => {
            callbackOk(responseData, response);
        }, callbackWrong)

    }


};

export default AperturaCaja;