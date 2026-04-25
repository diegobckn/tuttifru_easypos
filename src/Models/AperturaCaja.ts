import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import MovimientoCaja from "../Types/MovimientoCaja.ts";
import axios from "axios";
import Model from './Model';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';
import User from './User.ts';
import AperturaCierreOffline from './AperturaCierreOffline.ts';
import System from '../Helpers/System.ts';


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

    saveInSesion(data: any) {
        this.sesion.guardar(data)
        // localStorage.setItem('userData', JSON.stringify(data));
        return data;
    }

    getFromSesion() {
        return this.sesion.cargar(1)
        // var dt = localStorage.getItem('userData') || "{}";
        // return JSON.parse(dt);
    }

    async sendToServer(callbackOk: any, callbackWrong: any, forzarEnvio = false) {
        var data: any = this.getFillables();
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/Cajas/AddCajaFlujo"

        if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        if (!forzarEnvio
            && AperturaCierreOffline.last()
            && !AperturaCierreOffline.lastWasSent()) {
            const last = AperturaCierreOffline.last()
            var debeRecargarIdTurno = false
            if (!last.sended) {
                if (last.tipo == "cierre") {
                    data.idTurno = last.idTurno + 1
                    console.log("va a guardar en apertura", System.clone(data))

                    const us = new User()
                    const usSes = us.getFromSesion()
                    usSes.idTurno = data.idTurno
                    console.log("va a guardar en usuario", System.clone(usSes))
                    us.sesion.guardar(usSes)

                    debeRecargarIdTurno = true
                }
                AperturaCierreOffline.addApertura(data)
                callbackOk({
                    statusCode: 200,
                    debeRecargarIdTurno
                }, {
                    data: {
                        statusCode: 200,
                        debeRecargarIdTurno
                    }
                })
                return
            }
        }
        EndPoint.sendPost(url, data, (responseData: any, response: any) => {
            AperturaCierreOffline.addApertura(data, false)
            this.informeEmail(() => {
                callbackOk(responseData, response);
            }, () => {
                callbackOk(responseData, response);
            })
            // }, callbackWrong)
        }, (err: any) => {
            if (!forzarEnvio) {
                AperturaCierreOffline.addApertura(data)
                callbackOk({
                    statusCode: 200
                }, {
                    data: {
                        statusCode: 200
                    }
                })
            } else {
                callbackWrong(err)
            }
        })

    }

    async informeEmail(callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()

        if (!configs.enviarEmailInicioCaja) {
            callbackWrong("mal configuracion")
            return
        }
        if (configs.aQuienEnviaEmails == "") {
            callbackWrong("mal configuracion")
            return
        }

        var url = "https://softus.com.ar/easypos/info-inicio-caja";

        const infoUser = User.getInstance().getFromSesion()
        const txtUser = infoUser && infoUser.nombres + " " + infoUser.apellidos


        const info = {
            sucursal: configs.sucursalNombre,
            puntoVenta: configs.puntoVentaNombre,
            para: configs.aQuienEnviaEmails,
            usuario: txtUser
        }

        EndPoint.sendPost(url, info, (responseData: any, response: any) => {
            callbackOk(responseData, response);
        }, callbackWrong)
    }


};

export default AperturaCaja;