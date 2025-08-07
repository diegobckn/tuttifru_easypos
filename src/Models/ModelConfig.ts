import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig";


class ModelConfig {
    static instance: ModelConfig | null = null;
    sesion: StorageSesion;

    constructor(){
        this.sesion = new StorageSesion("config");
    }

    static getInstance():ModelConfig{
        if(ModelConfig.instance == null){
            ModelConfig.instance = new ModelConfig();
        }

        return ModelConfig.instance;
    }

    static get(propName = ""){
        try{
            var rs = ModelConfig.getInstance().sesion.cargar(1)
        }catch(err){

        }

        if(!rs){
            this.getInstance().sesion.guardar(BaseConfig);
        }
        rs = ModelConfig.getInstance().sesion.cargar(1)

        if(propName != ""){
            if( rs[propName] != undefined ){
                return rs[propName]
            }else{
                console.log("no esta creada")
                rs[propName] = BaseConfig[propName]
                this.getInstance().sesion.guardar(rs);
                return rs[propName]
            }
        }

        // console.log("get..")
        // console.log(rs)
        return rs;
    }

    static change(propName, propValue){
        var all = ModelConfig.get();
        all[propName] = propValue;
        ModelConfig.getInstance().sesion.guardar(all); 
    }

    static isEqual(name, value){
        const current = ModelConfig.get(name)
        return current == value
    }


    getAll(){
        return this.sesion.cargarGuardados();
    }

    getFirst(){
        if(!this.sesion.hasOne()){
            this.sesion.guardar(BaseConfig);
        }
        return(this.sesion.getFirst())
    }

};

export default ModelConfig;