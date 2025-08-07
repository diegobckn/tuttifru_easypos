import { Height } from "@mui/icons-material";
import CONSTANTS from "../definitions/Constants";
import dayjs from "dayjs";
import ModelConfig from "../Models/ModelConfig";
import System from "./System";


class LoopProperties {
    myObject: any = null
    currentProp: any = null
    functionLoop: any = null
    functionEnd: any = null

    constructor(objectProperties, functionToLoop, functionToEnd) {
        this.functionLoop = functionToLoop
        this.functionEnd = functionToEnd
        this.myObject = System.clone(objectProperties)
        this.do()
    }

    do() {
        const props = Object.keys(this.myObject)
        if (props.length > 0) {
            this.currentProp = props[0]
            this.functionLoop(this.currentProp, this.myObject[this.currentProp], this)
        } else {
            this.functionEnd()
        }
    }

    next() {
        delete this.myObject[this.currentProp]
        this.do()
    }
}




export default LoopProperties;