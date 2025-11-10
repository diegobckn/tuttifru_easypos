import CONSTANTS from "../definitions/Constants";
import dayjs from "dayjs";
import ModelConfig from "../Models/ModelConfig";
import * as CryptoJS from 'crypto-js'


class System {
    static instance: System | null = null;

    getAppName() {
        return CONSTANTS.appName + " " + CONSTANTS.appVersion
    }

    static getInstance(): System {
        if (System.instance == null) {
            System.instance = new System();
        }

        return System.instance;
    }


    getWindowWidth() {
        return window.innerWidth;
    }

    getWindowHeight() {
        return window.innerHeight;
    }

    getCenterStyle(widthPercent = 80, heightPercent = 80) {
        return {
            width: (widthPercent * (System.getInstance().getWindowWidth()) / 100) + "px",
            height: (heightPercent * (System.getInstance().getWindowHeight()) / 100) + "px",
            overflow: "auto"
        };
    }

    getMiddleHeigth() {
        return this.getWindowHeight() - 212 - 92 - 300 - 20
    }

    fechaYMD() {
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, "0");
        const day = fecha.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    bancosChile() {
        return [
            { id: 1, nombre: "Banco de Chile" },
            { id: 2, nombre: "Banco Santander Chile" },
            { id: 3, nombre: "Banco Estado" },
            { id: 4, nombre: "Scotiabank Chile" },
            { id: 5, nombre: "Banco BCI" },
            { id: 6, nombre: "Banco Itaú Chile" },
            { id: 7, nombre: "Banco Security" },
            { id: 8, nombre: "Banco Falabella" },
            { id: 9, nombre: "Banco Ripley" },
            { id: 10, nombre: "Banco Consorcio" },
            { id: 11, nombre: "Banco Internacional" },
            { id: 12, nombre: "Banco Edwards Citi" },
            { id: 13, nombre: "Banco de Crédito e Inversiones" },
            { id: 14, nombre: "Banco Paris" },
            { id: 15, nombre: "Banco Corpbanca" },
            { id: 16, nombre: "Banco BICE" },
            // Agrega más bancos según sea necesario
        ]
    }

    tiposDeCuenta() {
        return {
            "Cuenta Corriente": "Cuenta Corriente",
            "Cuenta de Ahorro": "Cuenta de Ahorro",
            "Cuenta Vista": "Cuenta Vista",
            "Cuenta Rut": "Cuenta Rut",
            "Cuenta de Depósito a Plazo (CDP)": "Cuenta de Depósito a Plazo (CDP)",
            "Cuenta de Inversión": "Cuenta de Inversión",
        }
    }

    //fechaactual con formato: 2024-05-12T02:06:22.000Z
    getDateForServer(date: null | undefined | string) {
        return (dayjs(date).format('YYYY-MM-DD HH:mm:ss') + ".000Z").replace(" ", "T")
    }

    en2Decimales(valor: any) {
        return Math.round(parseFloat(valor) * 100) / 100
    }

    typeIntFloat(value: any) {
        if ((value + "").indexOf(".") > -1) {
            return parseFloat(value + "")
        } else {
            return parseInt(value + "")
        }
    }

    static clone(obj: any) {
        return JSON.parse(JSON.stringify(obj))
    }

    static getUrlVars() {
        var allStr = window.location.href
        if (allStr.indexOf("?") == -1) {
            return {}
        }
        var [location, allLast] = allStr.split("?")
        var vars: any = {}
        allLast.split("&").forEach((nameValue) => {
            const [name, value] = nameValue.split("=")
            vars[name] = value
        })
        return vars
    }

    static addInObj(setFunction: any, fieldName: any, fieldValue: any) {
        setFunction((oldProduct: any) => {
            const newProduct = { ...oldProduct };
            newProduct[fieldName] = fieldValue
            return newProduct;
        });
    }

    static addAllInObj(setFunction: any, objValues: any) {
        setFunction((oldProduct: any) => {
            const newProduct = { ...oldProduct, ...objValues };
            return newProduct;
        });
    }

    static addAllInArr(setFunction: any, arrayOriginal: any, index: any, objValues: any) {
        const newArr = [...arrayOriginal]
        newArr[index] = objValues
        setFunction(newArr)
    }

    static allValidationOk = (validators: any, showMessageFunction: any) => {
        // console.log("allValidationOk:", validators)
        var allOk = true
        // const keys = Object.keys(validators)
        Object.values(validators).forEach((validation: any, ix) => {
            // console.log("validation de  " + keys[ix] + " :", validation)
            if (validation[0].message != "" && allOk) {
                showMessageFunction(validation[0].message)
                allOk = false
            }
        })
        return allOk
    }

    static intentarFoco(textInfoRef: any) {
        // console.log("..intentarFoco", textInfoRef)
        console.log(textInfoRef)
        if (!textInfoRef || textInfoRef.current == null) {
            // console.log("no tiene valor ref")
            setTimeout(() => {
                this.intentarFoco(textInfoRef)
            }, 300);
        } else {
            // console.log("ya tiene no es null")
            const contInput = textInfoRef.current
            // console.log("input encontrado:", contInput)
            // console.log(contInput.querySelector("input"))
            var inp = null
            if (contInput.localName && contInput.localName == "input") {
                // console.log("if 1")
                // console.log("resp blur", contInput.blur())
                setTimeout(() => {
                    contInput.focus()
                }, 300);
                inp = contInput
            } else {
                // console.log("else 2")
                // console.log("contInput", contInput)
                // console.log("contInput.localName", contInput.localName)
                inp = contInput.querySelector("input")
                // console.log("inp", inp)
                // console.log("inp.localName", inp.localName)
                if (inp) {
                    inp.focus()
                } else {
                    setTimeout(() => {
                        this.intentarFoco(textInfoRef)
                    }, 300);
                }
            }
        }
    }

    static directFocus(inpRef: any) {
        inpRef.current.focus()
    }

    static agoDatetime(dateServer: any) {
        var agos = ""

        const v1 = dateServer.split("T")
        const dt = v1[0]

        var cur = dayjs()
        var currentDate: any[] = cur.format("YYYY-MM-DD HH:mm:ss").split(" ")
        var currentYMD = currentDate[0]
        if (dt == currentYMD) {
            const dateServerFormatted = (dateServer + "").replace("T", " ").replace(".000Z", "")
            var curServer = dayjs(dateServerFormatted)
            let hours = cur.diff(curServer, 'hours');
            let minutes = cur.diff(curServer, 'minutes');
            let seconds = cur.diff(curServer, 'seconds');

            if (hours > 0) {
                agos += hours + " " + (hours > 1 ? "horas" : "hora")
            }
            if (minutes > 0) {
                if (minutes > 59) minutes = minutes - 60
                if (agos != "") agos += ", "
                agos += minutes + " " + (minutes > 1 ? "minutos" : "minuto")
            }

            if (agos != "") {
                agos = " hace " + agos
            } else {
                agos = " recien"
            }
        }
        return agos
    }

    static formatDateServer(dateServer: any, withAgo = false) {
        const v1 = dateServer.split("T")
        const dt = v1[0]
        const hrs = v1[1]

        const [year, month, day] = dt.split("-")
        const [hr, mn] = hrs.split(":")

        var agos = ""
        if (withAgo) {
            agos = this.agoDatetime(dateServer)


        }

        return day + "/" + month + "/" + year + " " + hr + ":" + mn + agos
    }

    static maxStr(str: string, max: number, completarConPuntos = true) {
        var txt = str
        console.log("original largo", txt.length)

        //max = 10..str=carambolazo..11 deberia quedar asi 'carambo...'
        if (str.length > max) {
            if (completarConPuntos) {
                txt = txt.substring(0, max - 3) + "..."
            } else {
                txt = txt.substring(0, max)
            }
        }
        console.log("devuelve cortado", txt)
        console.log("largo cortado", txt.length)
        return txt
    }

    static camelToUnderscore(key: string) {
        return key.replace(/([A-Z])/g, "_$1").toLowerCase();
    }

    static partirCada(elString: string, cantidadACortar: number) {
        const stringToRegex = (str: string) => {
            // Main regex
            const mainArr = str.match(/\/(.+)\/.*/)
            const main = (mainArr && mainArr.length > 0) ? mainArr[1] : ""

            // Regex options
            const optionsArr = str.match(/\/.+\/(.*)/)
            const options = (optionsArr && optionsArr.length > 0) ? optionsArr[1] : ""

            // Compiled regex
            return new RegExp(main, options)
        }

        var rs: any = elString.match(stringToRegex("/.{1," + cantidadACortar + "}/g"))
        if (!rs) rs = []

        return rs
    }

    static pagaConEfectivo = (pagos: any) => {
        var conEfectivo = false
        pagos.forEach((pago: any) => {
            if (pago.metodoPago == "EFECTIVO") {
                conEfectivo = true
            }
        })
        return conEfectivo
    }

    static showIfHasDecimal(valorMoneda: any, cantidadDecimales = 2) {
        if (isNaN(valorMoneda)) return "0"
        var monedaStr = valorMoneda + ""
        if (monedaStr.indexOf(".") > -1) {
            const partes = monedaStr.split(".")
            var parteEntera = partes[0]
            var parteDecimal = partes[1]

            if (parteDecimal.length == cantidadDecimales)
                return parteEntera + "." + parteDecimal

            if (parteDecimal.length < cantidadDecimales) {
                parteDecimal = parteDecimal + "0".repeat(cantidadDecimales - parteDecimal.length)
                return parteEntera + "." + parteDecimal
            }

            parteDecimal = parteDecimal.substring(0, cantidadDecimales)
            return parteEntera + "." + parteDecimal
        } else {
            return valorMoneda
        }
    }


    // ej 152000.157 ----> 152.000,15
    static formatMonedaLocal(valorMoneda: any, conDecimales = true) {
        if (isNaN(valorMoneda)) return "0,00"
        // console.log("formatMonedaLocal", valorMoneda)
        var monedaStr = valorMoneda + ""
        var parteEntera = monedaStr
        var parteDecimal = "00"
        if (monedaStr.indexOf(".") > -1) {
            const partes = monedaStr.split(".")
            parteEntera = partes[0]
            parteDecimal = partes[1]
        }

        if (parteDecimal.length < 2) parteDecimal += "0"
        if (parteDecimal.length > 2) {
            const x = parseFloat("0." + parteDecimal).toFixed(2)
            parteDecimal = x.split(".")[1]
        }

        if (parteEntera.length > 3) {
            // console.log("parteEntera.length>3")
            var parteEntera2 = ""
            for (let index = parteEntera.length; index > 0; index--) {
                const current = parteEntera.length - index + 1
                // console.log("current", current)
                const digitoEntero = parteEntera[index - 1];
                parteEntera2 = digitoEntero + parteEntera2
                // console.log("digitoEntero", digitoEntero)
                // console.log("index", index)
                if ((current) % 3 === 0) {
                    // console.log(index + " es divisor de 3")
                    parteEntera2 = "." + parteEntera2
                }
            }

            if (parteEntera2.substr(0, 1) === ".") {
                parteEntera2 = parteEntera2.substr(1)
            }

            parteEntera = parteEntera2
        }

        // console.log("formatMonedaLocal devuelve", parteEntera + "," + parteDecimal)
        if (conDecimales) {
            return parteEntera + "," + parteDecimal
        } else {
            return parteEntera
        }
    }

    static truncarMoneda(monto: any) {
        var montoArr = (monto + "").split(".")
        return parseInt(montoArr[0])
    }

    static formatoYTruncarMoneda(monto: any) {
        return this.formatMonedaLocal(this.truncarMoneda(monto), false)
    }

    static configBoletaOk() {
        const emitirBoleta = ModelConfig.get("emitirBoleta")
        const tienePasarelaPago = ModelConfig.get("tienePasarelaPago")

        return (emitirBoleta !== null && tienePasarelaPago !== null)
    }

    static invertirProps(objeto: any) {
        const objetoInvertido: any = {}

        const keys = Object.keys(objeto)

        keys.forEach((key) => {
            const value = objeto[key]
            objetoInvertido[value] = key
        })

        return objetoInvertido
    }

    static arrayFromObject(objeto: any, invert = false) {
        if (invert) objeto = this.invertirProps(objeto)
        const keys = Object.keys(objeto)
        var ar: any = []

        keys.forEach((key) => {
            if (objeto[key]) {
                ar[key] = objeto[key]
            }
        })

        return ar
    }

    static arrayIdValueFromObject(objeto: any, invert: any, idFieldName = "id", valueFieldName = "value") {
        // console.log("arrayIdValueFromObject", objeto)
        if (invert) objeto = this.invertirProps(objeto)
        const keys = Object.keys(objeto)
        var ar: any = []

        keys.forEach((key) => {

            var value = objeto[key]
            if (typeof (value) == "string") {
                value = value.replaceAll("_", " ")
            }
            const nob: any = {}
            nob[idFieldName] = key
            nob[valueFieldName] = value
            ar.push(nob)
        })
        // console.log("arrayIdValueFromObject..devuelve", ar)

        return ar
    }

    static objectPropValueFromIdValueArray(array: any, idFieldName = "id", valueFieldName = "value") {
        var obj: any = {}

        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            const name = element[idFieldName]
            const value = element[valueFieldName]
            obj[name] = value
        }

        return obj
    }


    static invertirStr(elStr: any) {
        return elStr.split("").reverse().join("");
    }

    static isInt(n: any) {
        if (typeof (n) == "string") n = parseFloat(n)
        return parseInt(n) === n
    }

    static encrypt(plainText: string) {
        const cipherText = CryptoJS.AES.encrypt(plainText, "123456").toString()
        return cipherText
    }

    static decrypt(cipherText: string) {
        const bytes = CryptoJS.AES.decrypt(cipherText, "123456")
        const plainText = bytes.toString(CryptoJS.enc.Utf8)
        return plainText
    }


    static sustraerVariablesDePlantilla(
        plantillaContenido: any,
        mascaraInicio = "{{",
        mascaraFin = "}}",
        defaultValues = null
    ) {
        const copiaHtml = plantillaContenido + ""
        var ini = false
        var fin = false
        var dsd = 0, hst = 0
        var variables: any = {}

        console.log("defaultValues", defaultValues)

        if (copiaHtml.length > (mascaraInicio + mascaraFin).length) {
            for (let ix = 0; ix < copiaHtml.length - 1; ix++) {
                const caracterHtml = copiaHtml[ix] + copiaHtml[ix + 1];
                // console.log("caracterHtml", caracterHtml)
                if (caracterHtml === mascaraInicio) {
                    ini = true
                    fin = false
                    dsd = ix + 2
                }

                if (caracterHtml === mascaraFin && ini) {
                    ini = false
                    fin = true
                    hst = ix
                    const nameDat = copiaHtml.substr(dsd, hst - dsd)
                    var value = ""
                    if (defaultValues && defaultValues[nameDat]) {
                        value = defaultValues[nameDat]
                    }
                    variables[nameDat] = value
                }
            }
        }

        return variables
    }


    // reemplazos inteligentes para probar plantillas de impresion
    static valorReemplazoPlantilla(datoPrueba: any, plantillaNombre = "") {
        var tipoContenido = plantillaNombre + ""
        tipoContenido = tipoContenido.replace("Imprimir", "")
        tipoContenido = tipoContenido.replace("58mm", "")
        tipoContenido = tipoContenido.replace("80mm", "")
        // console.log("valorReemplazoPlantilla..", datoPrueba)
        // console.log("valorReemplazoPlantilla..plantillaNombre", plantillaNombre)

        // generales
        if (
            datoPrueba.value.indexOf("gen ") === 0
        ) {
            //gen itemGenericoTicket
            try {
                var cnt = datoPrueba.value.split("gen ")[1]
                return eval("this." + cnt + "()")
            } catch (err) {
                return datoPrueba.value
            }
        }

        // particulares
        if (
            datoPrueba.value.indexOf("par ") === 0
        ) {
            //par itemGenericoTicket
            try {
                var cnt = datoPrueba.value.split("par ")[1]
                return eval("this." + cnt + tipoContenido + "()")
            } catch (err) {
                return datoPrueba.value
            }
        }
        return datoPrueba.value
    }

    static itemGenericoTicket() {
        return `<tr>
            <td>1234 1234</td>
            <td>2</td>
            <td>generico para pruebas</td>
            <td>$3500</td>
            <td>$7000</td>
            </tr>`
    }
    static itemGenericoBoleta() {
        return `<tr>
            <td>1234 1234</td>
            <td>2</td>
            <td>generico para pruebas</td>
            <td>$3500</td>
            <td>$7000</td>
            </tr>`
    }

    static itemGenericoBoletaExenta() {
        return `<tr>
            <td>1234 1234</td>
            <td>2</td>
            <td>generico para pruebas</td>
            <td>$3500</td>
            <td>$7000</td>
            </tr>`
    }

    static itemGenericoPreventa() {
        return `<tr>
            <td>1234 1234</td>
            <td>2</td>
            <td>generico para pruebas</td>
            <td>$3500</td>
            <td>$7000</td>
            </tr>`
    }

    static itemGenericoTicketComanda() {
        return `<tr>
            <td>efectivo</td>
            <td>2</td>
            <td>generico para pruebas</td>
        </tr>`
    }

    static QrBase() {
        return `<img width="50px" height="50px" src="./src/assets/qr.jpeg" />`
    }

    static ucfirst(txt: string) {
        if (!txt) {
            return '';
        }
        return txt.charAt(0).toUpperCase() + txt.slice(1);
    }

    static getProp(object: any, propName: string) {
        return object[propName]
    }

    static setProp(object: any, propName: string, propValue: any) {
        object[propName] = propValue
    }

}


export default System;