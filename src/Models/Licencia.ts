import dayjs from 'dayjs';
import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import EndPoint from './EndPoint.ts';
import ModelConfig from './ModelConfig.ts';


class Licencia {
    sesionLicenciaServer: StorageSesion;
    sesionLicenciaLocal: StorageSesion;

    //cantidad de postergaciones permitidas
    static limitePostergaciones = 0

    //en segundos
    static intervaloRevision = 180//60 * 60



    static intervalRepeat: any = null

    constructor() {
        this.sesionLicenciaServer = new StorageSesion("licenciaServidor");
        this.sesionLicenciaLocal = new StorageSesion("licenciaLocal");
    }

    static estaVencida(licencia) {
        const venceFechaHora = licencia.expireDateTime.substr(0, 16)
        const hoy = dayjs().format("YYYY-MM-DD HH:mm")
        return (hoy > venceFechaHora)
    }

    static mostrarVencimiento(diferenciasDias, showMessageUser) {
        switch (diferenciasDias) {
            case 1:
                showMessageUser("Licencia vencida. El sistema se bloqueará mañana.")
                break

            case 2:
            case 3:
            case 4:
                showMessageUser("Licencia vencida. El sistema se bloqueará muy pronto.")
                break

            case 5:
            case 6:
            case 7:
                showMessageUser("Licencia vencida. El sistema se bloqueará pronto.")
                break

            default:
                // showMessageUser("Licencia vencida. El sistema se bloqueará en pocos dias.")
                showMessageUser("Se ha detectado licencia vencida por falta de pago. Comuniquese con administracion.")
                break
        }
    }

    static async check(showMessageUser, callbackLicenciaVencida) {
        // console.log("licencias.. check")
        if (Licencia.intervalRepeat === null) {
            Licencia.intervalRepeat = setInterval(() => {
                this.checkCiclo(showMessageUser, callbackLicenciaVencida)
            }, 1 * 1000 * this.intervaloRevision)
        }

        this.checkCiclo(showMessageUser, callbackLicenciaVencida)
    }

    static async checkCiclo(showMessageUser, callbackLicenciaVencida) {
        console.log("licencias..checkCiclo")

        const data = {
            "clientName": ModelConfig.get("licencia"),
            "unitName": import.meta.env.VITE_UNIDAD_NEGOCIO
        }
        console.log("licencia, data a enviar", data)
        const url = "https://softus.com.ar/easypos/get-licence"
        EndPoint.sendPost(url, data, (responseData, response) => {
            if (responseData.license) {
                let me = new Licencia()
                // console.log("respuesta licencia", responseData)
                const licenciaServer = responseData.license
                me.sesionLicenciaServer.guardar(licenciaServer)

                this.updateAllWithLicense(licenciaServer, showMessageUser, callbackLicenciaVencida)
                // callbackOk(responseData, response)
            } else {
                this.updateAllWithoutLicense(showMessageUser, callbackLicenciaVencida)
            }
        }, () => {
            // revisar si supero el limite de postergaciones
            this.updateAllWithoutLicense(showMessageUser, callbackLicenciaVencida)
        })
    }

    //devuelve los datos locales, si no existe los crea
    static checkLocal = () => {
        var licenciaLocal: any = null
        let me = new Licencia()
        const guardadosLocal = me.sesionLicenciaLocal.cargarGuardados()
        if (guardadosLocal.length < 1) {
            licenciaLocal = {
                id: 1,
                lastCheckDate: dayjs().format("DD/MM/YYYY"),
                // lastCheckDate: "02/12/2024",
                lastCheckTime: dayjs().format("HH:mm"),
                lastCheckTimeFull: dayjs().format("HH:mm:ss"),
                postergaciones: 0,
            }
            me.sesionLicenciaLocal.guardar(licenciaLocal)
        } else {
            licenciaLocal = guardadosLocal[0]
        }

        return licenciaLocal
    }

    static updateAllWithoutLicense(showMessageUser = null, callbackLicenciaVencida) {
        let me = new Licencia()
        const license = {
            expireDateTime: dayjs().format("YYYY-MM-DD HH:mm")
        }

        me.sesionLicenciaServer.guardar(license)
        me.checkPostergaciones(license, showMessageUser, callbackLicenciaVencida)
    }

    static updateAllWithLicense(license, showMessageUser: any = () => { }, callbackLicenciaVencida) {
        let me = new Licencia()
        me.sesionLicenciaServer.guardar(license)
        me.checkPostergaciones(license, showMessageUser, callbackLicenciaVencida)
    }

    checkPostergaciones(license, showMessageUser: any = () => { }, callbackLicenciaVencida) {
        var licenciaLocal: any = Licencia.checkLocal()
        var me = this

        const hoy = dayjs().format("DD/MM/YYYY")
        // const hoy = "08/12/2024"

        if (Licencia.estaVencida(license)) {
            if (hoy != licenciaLocal.lastCheckDate) {
                // console.log("es distinto hoy a lastcheckdate")
                licenciaLocal.lastCheckDate = dayjs().format("DD/MM/YYYY")
                // licenciaLocal.lastCheckDate = "08/12/2024"
                licenciaLocal.postergaciones++
                me.sesionLicenciaLocal.guardar(licenciaLocal)
            }

            if (licenciaLocal.postergaciones < Licencia.limitePostergaciones) {
                const difDias = Licencia.limitePostergaciones - licenciaLocal.postergaciones
                // console.log("difDias", difDias)
                Licencia.mostrarVencimiento(difDias, showMessageUser)
            } else {
                callbackLicenciaVencida()
            }
        } else {
            // console.log("licencia correcta")
            licenciaLocal.postergaciones = 0
            me.sesionLicenciaLocal.guardar(licenciaLocal)

        }
    }

};

export default Licencia;