import StorageSesion from '../Helpers/StorageSesion.ts';
import axios from "axios";
import ModelConfig from './ModelConfig.ts';
import SoporteTicket from './SoporteTicket.ts';
import EndPoint from './EndPoint.ts';
import User from './User.ts';
import ModelSingleton from './ModelSingleton.ts';
import bcrypt from 'bcryptjs'
import LoopProperties from '../Helpers/LoopProperties.ts';
import dayjs from 'dayjs';

class UsersOffline extends ModelSingleton {
    static users: User[] = []
    static usersInSesion = new StorageSesion("xusersOffline")
    static activosCajasSesion = new StorageSesion("cajasusuariosactivos")


    static almacenarParaOffline(callbackOk: any, callbackWrong: any) {
        const usModel = new User();

        usModel.getAllFromServer((usus: any) => {
            UsersOffline.users = usus
            UsersOffline.usersInSesion.guardar({
                "fecha": dayjs().format("DD/MM/YYYY"),
                "hora": dayjs().format("HH:mm"),
                "users": UsersOffline.users
            })

            callbackOk(usus)
        }, callbackWrong)
    }

    static checkLocalUsers() {
        if (UsersOffline.users.length < 1 && UsersOffline.usersInSesion.hasOne()) {
            UsersOffline.users = UsersOffline.usersInSesion.cargar(1).users
        }
    }

    static async checkLogin(
        user: string,
        pass: string,
        callbackOk: any,
        callbackWrong: any
    ) {
        const claveHash = "$2a$11$P6lr/MQoyth/Q9Dieb/yQ.juNnCeQxArqNqLSUu2ifx32.p/ypzO."
        this.checkLocalUsers()

        if (UsersOffline.users.length < 1) {
            callbackWrong("El sistema no pudo descargar los usuarios. "
                + "Revisar problemas de conexion.")
            return
        }
        try {
            var found: any = null
            new LoopProperties(UsersOffline.users, async (index, userOffline, looper) => {
                console.log("revisando usuario", userOffline)
                const concod = userOffline.codigoUsuario + "" == user + ""
                const conrut = userOffline.rut == user

                console.log("coincide con codigo de usuario?", concod)
                console.log("coincide con rut de usuario?", conrut)
                if (
                    userOffline.codigoUsuario + "" == user + ""
                    || userOffline.rut == user
                ) {
                    console.log("comprobando pass=", pass, "...pass de servidor=", userOffline.pass)
                    const coincide = await bcrypt.compare("POS" + pass + "EASY", userOffline.pass);
                    console.log("resultado comprobacion ", coincide)

                    if (coincide) {
                        found = userOffline
                    }
                }
                looper.next()
            }, () => {
                console.log("fin de checkLogin offline")
                console.log("found", found)
                if (found) {
                    callbackOk(found)
                } else {
                    callbackWrong("usuario incorrecto")
                }
            })


            // bcrypt.compare devuelve una promesa que resuelve a true o false
        } catch (error) {
            console.error("Error al checkLogin offline:", error);
            callbackWrong(error)
        }
    }

    static add(user: User) {
        console.log("add de user offline info", user)
        this.checkLocalUsers()
        var yaEsta = false
        UsersOffline.users.forEach((us) => {
            if (us.codigoUsuario == user.codigoUsuario && us.clave == user.clave) {
                yaEsta = true
            }
        })

        if (yaEsta) return

        UsersOffline.users.push(user)
        UsersOffline.usersInSesion.guardar({
            "users": UsersOffline.users
        })
    }


    async getAllActivos(callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/GetUsuariosActivos"

        url += "?codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        EndPoint.sendGet(url, (responseData: any, response: any) => {
            callbackOk(responseData.usuariosActivos, response);
        }, callbackWrong)
    }

    static almacenarActivosParaOffline(callbackOk: any, callbackWrong: any) {
        const usModel = new UsersOffline();

        usModel.getAllActivos((info: any) => {
            UsersOffline.activosCajasSesion.guardar({
                "fecha": dayjs().format("DD/MM/YYYY"),
                "hora": dayjs().format("HH:mm"),
                "info": info
            })
            callbackOk(info)
        }, callbackWrong)
    }
};

export default UsersOffline;