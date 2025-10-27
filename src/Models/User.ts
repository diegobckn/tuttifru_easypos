import StorageSesion from '../Helpers/StorageSesion.ts';
import axios from "axios";
import ModelConfig from './ModelConfig.ts';
import SoporteTicket from './SoporteTicket.ts';
import EndPoint from './EndPoint.ts';
import ModelSingleton from './ModelSingleton.ts';


class User extends ModelSingleton {

    rut: string = ""
    codigoUsuario: string | number = ""
    clave: string = ""
    codigoSucursal: string = ""
    puntoVenta: string = ""
    deudaIds: any = null

    constructor() {
        super()
        this.sesion = new StorageSesion("User");
    }

    getFromSesion() {
        return this.sesion.cargar(1)
        // var dt = localStorage.getItem('userData') || "{}";
        // return JSON.parse(dt);
    }

    setRutFrom = (input: string) => {
        if (input.indexOf("-") > -1) {
            this.rut = input;
        } else {
            this.rut = "";
        }
        return this.rut;
    }

    setUserCodeFrom = (input: string) => {
        if (input.indexOf("-") == -1) {
            this.codigoUsuario = parseInt(input);
        } else {
            this.codigoUsuario = 0;
        }
        return this.codigoUsuario;
    }

    setPassword = (input: string) => {
        this.clave = input
    }

    static async getByRut(rut: string, callbackOk: any, callbackWrong: any) {
        const configs = await ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/GetUsuarioByRut"

        url += "?codigoSucursal=" + await ModelConfig.get("sucursal")
        url += "&puntoVenta=" + await ModelConfig.get("puntoVenta")
        url += "&rutUsuario=" + rut

        // console.log("getByRut..")
        // console.log("url..", url)

        await EndPoint.sendGet(url, (responseData: any, response: any) => {
            callbackOk(responseData.usuarios, response);
        }, callbackWrong)
    }

    async doLoginInServer(callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/LoginUsuario"

        const data: any = {
            codigoUsuario: this.codigoUsuario,
            rut: this.rut,
            clave: this.clave,
        }

        if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPost(url, data, (responseData: any, response: any) => {
            if (response.data.responseUsuario
                && response.data.responseUsuario.codigoUsuario != -1
            ) {
                if (!response.data.responseUsuario.activo) {
                    callbackOk(responseData);
                } else {
                    callbackWrong("Usuario activo en otra sesión");
                }
            } else {
                console.log("aca debe enviar correo", response)
                SoporteTicket.catchRequest(response)
                callbackWrong(response.data.descripcion);
            }
        }, callbackWrong)
    }

    async doLogoutInServer(callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/LoginUsuarioSetInactivo"

        const data: any = {
            codigoUsuario: this.codigoUsuario,
        }

        if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPost(url, data, (responseData: any, response: any) => {
            callbackOk(response);
        }, callbackWrong)
    }

    async getAllFromServer(callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/GetAllUsuarios"

        url += "?codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        EndPoint.sendGet(url, (responseData: any, response: any) => {
            callbackOk(responseData.usuarios, response);
        }, callbackWrong)
    }

    async getUsuariosDeudas(callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/GetUsuariosDeudas"

        url += "?codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        EndPoint.sendGet(url, (responseData: any, response: any) => {
            callbackOk(responseData.usuarioDeudas, response);
        }, callbackWrong)
    }

    async pargarDeudas(callbackOk: any, callbackWrong: any) {
        const data: any = this.getFillables()
        if (data.idUsuario == undefined) { console.log("falta completar idUsuario"); return }
        if (data.montoPagado == undefined) { console.log("faltan completar montoPagado"); return }
        if (data.metodoPago == undefined) { console.log("faltan completar metodoPago"); return }
        if (this.deudaIds == undefined) { console.log("faltan completar deudaIds"); return }

        data.deudaIds = this.deudaIds

        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/PostUsuarioPagarDeudaByIdUsuario"

        if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPost(url, data, (responseData: any, response: any) => {
            callbackOk(responseData, response);
        }, callbackWrong)
    }

};

export default User;