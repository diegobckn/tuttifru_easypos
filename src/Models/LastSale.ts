import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import ProductSold from './ProductSold.ts';
import Sales from './Sales.ts';


class LastSale{

    static instance: LastSale | null = null;
    sesion: StorageSesion;

    constructor(){
        this.sesion = new StorageSesion(eval("this.__proto__.constructor.name"));
    }

    static getInstance():LastSale{
        if(LastSale.instance == null){
            LastSale.instance = new LastSale();
        }
  
        return LastSale.instance;
      }

    fill(values:any){
        for(var campo in values){
            const valor = values[campo]
            this[campo] = valor;
        }
    }

    getFillables(){
        var values:any = {};
        for(var prop in this){
            if(typeof(this[prop]) != 'object'
                && this[prop] != undefined
            ){
                values[prop] = this[prop]
            }
        }
        return values
    }

    static prepare(requestData){
        LastSale.getInstance().sesion.guardar({
            id:1,
            data: requestData
        })
    }

    static confirm(dataResponse){
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