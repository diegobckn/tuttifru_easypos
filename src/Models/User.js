import StorageSesion from '../Helpers/StorageSesion.ts';
import axios from "axios";
import ModelConfig from './ModelConfig.ts';
import SoporteTicket from './SoporteTicket.ts';
import EndPoint from './EndPoint.ts';


class User {
    
    static getInstance() {
        if (User.instance == null) {
            User.instance = new User();
        }
        
        return User.instance;
    }
    
    constructor() {
        this.sesion = new StorageSesion("User");
    }

    fill(values) {
        for (var campo in values) {
            const valor = values[campo]
            this[campo] = valor;
        }
    }

    getFillables() {
        var values = {};
        for (var prop in this) {
            if (typeof (this[prop]) != 'object'
                && this[prop] != undefined
            ) {
                values[prop] = this[prop]
            }
        }
        return values
    }



    saveInSesion(data) {
        this.sesion.guardar(data)
        // localStorage.setItem('userData', JSON.stringify(data));
        return data;
    }

    getFromSesion() {
        return this.sesion.cargar(1)
        // var dt = localStorage.getItem('userData') || "{}";
        // return JSON.parse(dt);
    }

    setRutFrom = (input) => {
        if (input.indexOf("-") > -1) {
            this.rut = input;
        } else {
            this.rut = "";
        }
        return this.rut;
    }

    setUserCodeFrom = (input) => {
        if (input.indexOf("-") == -1) {
            this.codigoUsuario = parseInt(input);
        } else {
            this.codigoUsuario = 0;
        }
        return this.codigoUsuario;
    }

    setPassword = (input) => {
        this.clave = input
    }

    static async getByRut(rut, callbackOk, callbackWrong) {
        const configs = await ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/GetUsuarioByRut"

        url += "?codigoSucursal=" + await ModelConfig.get("sucursal")
        url += "&puntoVenta=" + await ModelConfig.get("puntoVenta")
        url += "&rutUsuario=" + rut

        // console.log("getByRut..")
        // console.log("url..", url)

        await EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.usuarios, response);
        }, callbackWrong)
    }

    async doLoginInServer(callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/LoginUsuario"

        const data = {
            codigoUsuario: this.codigoUsuario,
            rut: this.rut,
            clave: this.clave,
        }

        if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPost(url, data, (responseData, response) => {
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

    async doLogoutInServer(callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/LoginUsuarioSetInactivo"

        const data = {
            codigoUsuario: this.codigoUsuario,
        }

        if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPost(url, data, (responseData, response) => {
            callbackOk(response);
        }, callbackWrong)
    }

    async getAllFromServer(callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/GetAllUsuarios"

        url += "?codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.usuarios, response);
        }, callbackWrong)
    }

    async getUsuariosDeudas(callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/GetUsuariosDeudas"

        url += "?codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.usuarioDeudas, response);
        }, callbackWrong)
    }

    async pargarDeudas(callbackOk, callbackWrong) {
        const data = this.getFillables()
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

        EndPoint.sendPost(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)
    }

};

export default User;