import StorageSesion from '../Helpers/StorageSesion.ts';
import axios from "axios";
import ModelConfig from './ModelConfig.ts';
import SoporteTicket from './SoporteTicket.ts';
import EndPoint from './EndPoint.ts';
import User from './User.js';
import ModelSingleton from './ModelSingleton.ts';


class UsersOffline extends ModelSingleton {
    static users: User[] = []
    static usersInSesion = new StorageSesion("xusersOffline")

    static checkLocalUsers() {
        if (UsersOffline.users.length < 1 && UsersOffline.usersInSesion.hasOne()) {
            UsersOffline.users = UsersOffline.usersInSesion.cargar(1).users
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

    static doLoginInLocal(user, callbackOk, callbackWrong) {
        console.log("doLoginInLocal")
        this.checkLocalUsers()
        var logged: any = null
        UsersOffline.users.forEach((us) => {
            console.log("comparando ", user, "con", us)
            if (
                (
                    us.codigoUsuario == user.codigoUsuario
                    || us.rut == user.rut
                )
                && us.clave == user.clave) {
                logged = us
            }
        })

        if (logged) {
            callbackOk(logged)
        } else {
            callbackWrong("Usuario incorrecto")
        }
    }


};

export default UsersOffline;