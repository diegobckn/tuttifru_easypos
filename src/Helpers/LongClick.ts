class LongClick {
    //in seconds
    limit: number = 0
    goInterval: number = 0

    myInterval: any = null

    clickAction: any = null
    longclickAction: any = null

    longActionDone = false

    canceled = false

    myCount = 0

    static count: number = 0
    static list: any = []
    static selectedObj = 0
    static isTouch = false

    static ocupado = false

    constructor(limitInSeconds) {
        LongClick.count++
        this.myCount = LongClick.count
        LongClick.list[this.myCount] = (this)
        this.limit = limitInSeconds
    }

    intervalAction() {
        this.goInterval += 1
        // console.log("checkinterval.." + this.goInterval)
        if (this.goInterval >= this.limit) {
            // console.log("llego al limite")
            this.goInterval = 0
            this.longActionDone = true
            if (this.longclickAction)
                this.longclickAction()
            this.cancel()
        }
    }

    onStart(touchOrMouse = "") {
        const tlc = touchOrMouse.toLocaleLowerCase()

        console.log("onStart")
        // console.log("touchOrMouse", tlc)
        // console.log("LongClick.isTouch",LongClick.isTouch)
        if (tlc != "" && tlc != "touch" && LongClick.isTouch) {
            LongClick.isTouch = false
            return false
        }
        if (tlc == "touch") {
            LongClick.isTouch = true
        } else {
            LongClick.isTouch = false
        }
        LongClick.selectedObj = this.myCount
        this.longActionDone = false
        this.canceled = false
        this.myInterval = setInterval(() => this.intervalAction(), 900)
    }

    onEnd(touchOrMouse = "") {
        console.log("LongClick.onEnd")
        const tlc = touchOrMouse.toLocaleLowerCase()

        if (LongClick.ocupado) {
            console.log("LongClick.ocupado true")
            return
        }
        LongClick.ocupado = true
        console.log("cambio LongClick.ocupado a true")
        // setTimeout(() => {
        //     LongClick.ocupado = false
        // }, 1000);
        // console.log("onEnd")
        // console.log("touchOrMouse",tlc)
        // console.log("LongClick.isTouch",LongClick.isTouch)

        if (tlc != "" && tlc != "touch" && LongClick.isTouch) {
            LongClick.isTouch = false
            LongClick.ocupado = false
            console.log("cambio LongClick.ocupado a false")
            // console.log("sale1")
            return false
        }
        if (tlc == "touch") {
            LongClick.isTouch = true
        } else {
            LongClick.isTouch = false
        }
        var me = LongClick.list[LongClick.selectedObj]
        me.goInterval = 0
        if (me.myInterval != null) {
            clearInterval(me.myInterval)
        }
        me.myInterval = null
        if (me.longActionDone) {
            // console.log("longActionDone")
            console.log("cambio LongClick.ocupado a false")
            LongClick.ocupado = false
            return
        }
        if (me.canceled) {
            // console.log("canceled")
            console.log("cambio LongClick.ocupado a false")
            LongClick.ocupado = false
            return
        }
        if (me.clickAction) me.clickAction()
        setTimeout(() => {
            console.log("cambio LongClick.ocupado a false")
            LongClick.ocupado = false
        }, 300);
        console.log("paso de largo")
    }

    cancel() {
        this.goInterval = 0
        if (this.myInterval != null) {
            clearInterval(this.myInterval)
        }
        this.myInterval = null
        this.canceled = true
    }

    onClick(callbackAction) {
        this.clickAction = callbackAction
    }

    onLongClick(callbackAction) {
        this.longclickAction = callbackAction
    }

}


export default LongClick;