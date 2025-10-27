import StorageSesion from '../Helpers/StorageSesion.ts';
import axios from "axios";
import ModelConfig from './ModelConfig.ts';
import SoporteTicket from './SoporteTicket.ts';
import EndPoint from './EndPoint.ts';
import Singleton from './Singleton.ts';
import User from './User.ts';
import ModelSingleton from './ModelSingleton.ts';

export default class UserEvent extends ModelSingleton {
    constructor() {
        super()
        this.sesion = new StorageSesion("UserEvent");
    }

    static async send({
        name,
        info = ""
    }: any, callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = "https://softus.com.ar/" +
            "easypos/add-event"
        /* + 
        "?name=agregar%20producto" + 
        "&user=1414diego" + 
        "&info=informacion%20del%20producto%20o%20productos" + 
        "&project=" + window.location.href
        */

        var data: any = {
            configs: JSON.stringify(configs),
            name: name,
            info: info,
            project: window.location.href
        }

        const userInfo = User.getInstance().getFromSesion()
        // console.log("userInfo", userInfo)
        if (userInfo) {
            data.user = JSON.stringify(userInfo)
        }

        // console.log("se enviara esta info como evento", data)

        try {
            const response = await axios.post(url, data);
            if (response.data.statusCode === 200 || response.data.statusCode === 201) {
                if (callbackOk != undefined) callbackOk(response.data, response)
            } else {
                //deberia guardar para enviar mas tarde
            }
        } catch (error) {
        }

    }

};