import axios from 'axios';
import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig";
import System from '../Helpers/System.ts';


class ModelConfig {
    static instance: ModelConfig | null = null;
    sesion: StorageSesion;

    static anyChange = false
    static lastReaded: any = null

    constructor() {
        this.sesion = new StorageSesion("config");
    }

    static getInstance(): ModelConfig {
        if (ModelConfig.instance == null) {
            ModelConfig.instance = new ModelConfig();
        }

        return ModelConfig.instance;
    }

    static getAllMixed() {
        // console.log("getAllMixed")
        var all: any = {}
        try {
            all = ModelConfig.getInstance().sesion.cargar(1)
        } catch (err) { }

        all = Object.assign(BaseConfig, all)
        // console.log("devuelve mixed", System.clone(all))
        return all
    }

    static get(propName = "") {
        if (!this.lastReaded || this.anyChange) {
            this.lastReaded = this.getAllMixed()
        }

        this.anyChange = false

        if (propName != "") {
            return this.lastReaded[propName]
        } else {
            return this.lastReaded
        }
    }

    static change(propName: string, propValue: any) {
        this.anyChange = true
        var all = ModelConfig.get();
        all[propName] = propValue;
        ModelConfig.getInstance().sesion.guardar(all);
    }

    static changeAll(namesValueArr: any) {
        var all = this.get();

        all = Object.assign(all, namesValueArr)

        ModelConfig.getInstance().sesion.guardar(all);
        this.anyChange = true
    }

    static isEqual(name: string, value: any) {
        const current = ModelConfig.get(name)
        return current == value
    }

    getAll() {
        return this.sesion.cargarGuardados();
    }

    getFirst() {
        if (!this.sesion.hasOne()) {
            this.sesion.guardar(BaseConfig);
        }
        return (this.sesion.getFirst())
    }

    static async getAllComercio(callbackOk: any, callbackWrong: any) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase

            url += "/api/Configuracion/GetAllConfiguracionCliente"

            const response = await axios.get(url);
            if (response.data.statusCode === 200) {
                // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
                callbackOk(response.data)
            } else {
                callbackWrong("Error del servidor")
            }
        } catch (error) {
            callbackWrong(error)
        }
    }

};

export default ModelConfig;