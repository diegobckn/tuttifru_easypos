import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import ModelSingleton from './ModelSingleton.ts';
import ProductSold from './ProductSold.ts';
import Sales from './Sales.ts';


class LastSale extends ModelSingleton{

    static instance: LastSale | null = null;
    sesion: StorageSesion;

    constructor(){
        super()
        this.sesion = new StorageSesion(eval("this.__proto__.constructor.name"));
    }

    static prepare(requestData:any){
        LastSale.getInstance().sesion.guardar({
            id:1,
            data: requestData
        })
    }

    static confirm(dataResponse:any){
        var me = LastSale.getInstance()
        var carga1 = me.sesion.cargar(1)
        console.log("carga1")
        console.log(carga1)
        if(carga1){
            me.sesion.guardar({
                id:1,
                data: carga1.data,
                response: dataResponse
            })
        }
    }

    static loadFromSesion(){
        var me = LastSale.getInstance()
        if(!LastSale.getInstance().sesion.hasOne()) return null
        var carga1 = me.sesion.cargar(1)
        // console.log("carga1")
        // console.log(carga1)
        if(carga1){
            return carga1
        }else{
            return null
        }
    }


};

export default LastSale;