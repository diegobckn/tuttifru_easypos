import { Height } from "@mui/icons-material";
import CONSTANTS from "../definitions/Constants";
import dayjs from "dayjs";
import Singleton from "../Models/Singleton";


class UniqueVal extends Singleton {
    static values:any = []

    static reset(name, value = undefined){
        if(name){
            UniqueVal.values[name] = value
        }else{
            UniqueVal.values = []
        }
    }

    static check(name){
        const val = UniqueVal.values[name] === undefined
        UniqueVal.values[name] = 1
        return val
    }
}


export default UniqueVal;