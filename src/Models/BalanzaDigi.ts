import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig, { ModosLecturaDigi } from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.js';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';
import Singleton from './Singleton.ts';
import dayjs from 'dayjs';
import SoporteTicket from './SoporteTicket.ts';
import Env from '../definitions/Env.ts';
import ModelSingleton from './ModelSingleton.ts';
import Product from './Product.ts';
import ProductSold from './ProductSold.ts';
import System from '../Helpers/System.ts';
import LoopProperties from '../Helpers/LoopProperties.ts';


class BalanzaDigi extends ModelSingleton {

  socket: WebSocket | null = null

  static detectandoConexion = false
  static primeraConexion = false
  static antiInfinito = 0

  constructor() {
    super()
    this.sesion = new StorageSesion("balanza");
  }

  resetSesion() {
    this.sesion.guardar({
      id: 1,
      fecha: dayjs().format('YYYY-MM-DD'),
      hora: dayjs().format('HH:mm'),
      usados: [],
      todos: {}
    })
  }

  checkAfterLogin() {
    if (this.sesion.hasOne()) {
      var antes = this.sesion.cargar(1)
      const hoy = dayjs().format('YYYY-MM-DD')
      if (antes.fecha != hoy) {
        this.resetSesion()
        this.vaciarBufferVales(() => { }, () => { })
      }
    } else {
      this.resetSesion()
    }
  }

  guardarEnSesionTodos(infoBalanza: any) {
    if (!this.sesion.hasOne()) {
      this.resetSesion()
    }
    var antes = this.sesion.cargar(1)
    console.log("guardarEnSesionTodos..infoBalanza", System.clone(infoBalanza))
    console.log("guardarEnSesionTodos..antes", System.clone(antes))


    antes.todos = infoBalanza
    console.log("guardarEnSesionTodos..queda asi", System.clone(antes))
    this.sesion.guardar(antes)
  }

  agregarEnSesion(infoBalanza: any) {
    var antes: any = {}
    if (this.sesion.hasOne()) {
      antes = this.sesion.cargar(1)
    }
    console.log("agregarEnSesion..infoBalanza", System.clone(infoBalanza))
    console.log("agregarEnSesion..antes", System.clone(antes))

    if (antes.todos && antes.todos.info51 && antes.todos.info51.length > 0) {
      if (infoBalanza && infoBalanza.info51 && infoBalanza.info51.length > 0) {
        antes.todos.info51 = antes.todos.info51.concat(infoBalanza.info51)
      }

      if (infoBalanza && infoBalanza.info52 && infoBalanza.info52.length > 0) {
        antes.todos.info52 = antes.todos.info52.concat(infoBalanza.info52)
      }
    }
    antes.actualizacion = dayjs().format('YYYY-MM-DD HH:mm')
    console.log("agregarEnSesion..queda asi", System.clone(antes))
    this.sesion.guardar(antes)
  }

  obtenerDeSesionTodos(callbackOk: any) {
    if (!this.sesion.hasOne()) {
      callbackOk(null)
      return
    }
    var antes = this.sesion.cargar(1)
    // console.log("antes")
    if (antes.todos.info51 && antes.todos.info51.length > 0) {
      callbackOk(antes.todos)
      return
    }
    callbackOk(null)
  }

  agregarUsado(usado: string, dondeLoEncontro: any) {
    console.log("agregarUsado..usado", usado)
    var antes = this.sesion.cargar(1)
    var cualBalanza = "0"
    if (dondeLoEncontro.length > 0) {
      cualBalanza = dondeLoEncontro[0].balanza
    }
    console.log("agregarUsado..", dondeLoEncontro)
    antes.usados.push(usado + "/" + cualBalanza)
    this.sesion.guardar(antes)
  }

  static agregarUsadoAProducto(producto: any, nroVale: any, balanzaIndex: any) {
    console.log("agregarUsadoAProducto..producto", producto)
    console.log("agregarUsadoAProducto..nroVale", nroVale)
    console.log("agregarUsadoAProducto..balanzaIndex", balanzaIndex)
    producto.nroValeDigi = nroVale + "/" + balanzaIndex
    return producto
  }

  static agregarNroValeProductoExistente(indexProductoExistente: any, nuevoProducto: any, todosLosProductos: any) {
    const productoExistente = todosLosProductos[indexProductoExistente]

    if (
      nuevoProducto.nroValeDigi
      && productoExistente.nroValeDigi
      && (nuevoProducto.nroValeDigi + "").indexOf(productoExistente.nroValeDigi) === -1
    ) {
      // console.log("revisamos has preventa")
      const updatedSalesData = [...todosLosProductos];
      updatedSalesData[indexProductoExistente].nroValeDigi += "," + nuevoProducto.nroValeDigi
      todosLosProductos = updatedSalesData;
      // console.log("finc de has preventa")
    }
    return todosLosProductos
  }

  quitarUsado(usadon: any) {
    console.log("quitarUsado..", usadon)
    const usado = (usadon + "")
    var antes = this.sesion.cargar(1)
    var nuevoUsados: any = []
    console.log("antes.usados", antes.usados)
    antes.usados.forEach((nUsado: string) => {
      const usadoArr = usado.split(",")
      if (usadoArr.indexOf(nUsado + "") < 0) {
        console.log("el nro vale", nUsado, "no esta en el listado de usados", usadoArr)
        nuevoUsados.push(nUsado + "")
      }
    })
    console.log("nuevoUsados", nuevoUsados)
    antes.usados = (nuevoUsados)
    this.sesion.guardar(antes)
  }

  yaEstaUsado(nroVale: string) {
    console.log("yaEstaUsado??el #", nroVale)
    var antes = this.sesion.cargar(1)

    console.log("sesion", antes)
    var encontrado = false
    antes.usados.forEach((usadoConBalanza: any) => {
      const nUsado = usadoConBalanza.split("/")[0]
      console.log("nusado", nUsado)
      if (nUsado == nroVale) {
        encontrado = true
      } else {
        console.log("son distintos", nroVale, "..y ..", nUsado.nroVale)
      }
    })

    console.log(encontrado ? "si, esta usado" : "no, no esta usado", nroVale)
    return encontrado
  }

  hacerAccionSimple(accion: string, callbackOk: any, objetoAEnviar: any = {}, callbackWrong: any = () => { }) {
    var me = BalanzaDigi.getInstance();
    BalanzaDigi.antiInfinito++
    // if (BalanzaDigi.antiInfinito > 30) {
    //   console.log("evitando ciclo infinito")
    //   return
    // }

    objetoAEnviar.accion = accion
    // console.log("haciendo hacerAccionSimple con esta info", System.clone(objetoAEnviar))
    me.socket = new WebSocket(ModelConfig.get("urlServicioBalanzaDigi"));
    me.socket.onopen = () => {
      // console.log("Conectado al servidor WebSocket");
      try {
        me.socket.send(JSON.stringify(objetoAEnviar));
      } catch (e: any) {
        if (e.message.indexOf("CONNECTING") > -1) {
          setTimeout(() => {
            this.hacerAccion(accion, callbackOk, objetoAEnviar, callbackWrong)
          }, 300);
          return
        }
        console.log("error al intentar enviar ", e)
      }
    };

    me.socket.onmessage = (event: any) => {
      const formatResponse = JSON.parse(event.data)
      // console.log("Mensaje recibido:", formatResponse);
      callbackOk(formatResponse)
    };

    me.socket.onerror = (error: any) => {
      // console.error(" Error en WebSocket:", error);
      callbackWrong("La balanza no responde. Revisar conexion o software de control.")
    };

    me.socket.onclose = (event: any) => {
      // console.log(" Conexión WebSocket cerrada");
      // console.warn('Codigo de conexión cerrada:', event.code);
      // console.warn('Motivo de conexión cerrada:', event.reason);
    };
  }

  hacerAccion(accion: string, callbackOk: any, objetoAEnviar: any = {}, callbackWrong: any = () => { }) {

    // console.log("BalanzaDigi model: hacerAccion", accion)
    var balanzasSesion = ModelConfig.get("balanzasDigi")
    if (balanzasSesion.length < 1) {
      objetoAEnviar.ip = ModelConfig.get("ipBalanzaDigi")
      objetoAEnviar.puerta = ModelConfig.get("puertaBalanzaDigi")
      objetoAEnviar.modelo = ModelConfig.get("modeloBalanzaDigi")
      objetoAEnviar.user = ModelConfig.get("usuarioBalanzaDigi")
      objetoAEnviar.password = ModelConfig.get("claveBalanzaDigi")
      objetoAEnviar.flag = ModelConfig.get("codigoValeBalanzaDigi")
      this.hacerAccionSimple(accion, callbackOk, objetoAEnviar, callbackWrong)
    } else {
      // ciclamos las balanzas
      // console.log("ciclamos las balanzas..balanzasSesion", balanzasSesion)
      var allResults: any = []
      new LoopProperties(balanzasSesion, (balanzasSesionIndex, balanzasSesionItem, looper) => {
        objetoAEnviar.ip = balanzasSesionItem["ipBalanzaDigi"]
        objetoAEnviar.puerta = balanzasSesionItem["puertaBalanzaDigi"]
        objetoAEnviar.modelo = balanzasSesionItem["modeloBalanzaDigi"]
        objetoAEnviar.user = balanzasSesionItem["usuarioBalanzaDigi"]
        objetoAEnviar.password = balanzasSesionItem["claveBalanzaDigi"]
        objetoAEnviar.flag = balanzasSesionItem["codigoValeBalanzaDigi"]
        objetoAEnviar.accion = accion
        // console.log("va a hacer una accion con estos datos:", System.clone(objetoAEnviar))
        this.hacerAccionSimple(accion, (respuestaBalanza: any) => {
          console.log("capturando la respuesta de accion simple", respuestaBalanza)
          if (respuestaBalanza.status && Array.isArray(respuestaBalanza.info)) {
            const keys = Object.keys(respuestaBalanza.info)
            keys.forEach((key) => {
              respuestaBalanza.info[key].balanza = balanzasSesionIndex + ""
            })
            console.log("modificado queda asi", respuestaBalanza)
            allResults.push(respuestaBalanza)
            looper.next()
            console.log("haciendo next")

          } else if (respuestaBalanza.status && respuestaBalanza.info) {
            console.log("respuesta con info para procesar", respuestaBalanza)
            const keys = Object.keys(respuestaBalanza.info)
            console.log("hay keys", keys)
            keys.forEach((key) => {
              console.log("va key", key)
              const infoItem = respuestaBalanza.info[key]
              console.log("va infoItem", infoItem)
              if (Array.isArray(infoItem)) {
                infoItem.forEach((subItem, subItemKey) => {
                  respuestaBalanza.info[key][subItemKey].balanza = balanzasSesionIndex + ""
                })
              }
            })
            console.log("modificado queda asi", respuestaBalanza)
            allResults.push(respuestaBalanza)
            looper.next()
            console.log("haciendo next")
          } else {
            console.log("modificado queda asi", respuestaBalanza)
            allResults.push(respuestaBalanza)
            looper.next()
            console.log("haciendo next")

          }
          // }, objetoAEnviar, callbackWrong)
        }, objetoAEnviar, () => {
          console.log("interceptando callbackWrong de ", objetoAEnviar)
          looper.next()
          console.log("haciendo next")
        })

      }, () => {
        // termino de ciclar las balanzas
        var statuses = 0
        var response: any = {
        }
        console.log("allResults", allResults)
        if(allResults.length>0){
        new LoopProperties(allResults, (ix, result, looper) => {
          if (result.status) statuses++
          if (result.info) {
            if (!response.info) {
              response.info = result.info
            } else {
              // response.info = { ...result.info, ...response.info }
              response = System.concatObject(result, response)
            }
          }
          looper.next()
        }, () => {
          console.log("queda finalmente", response)
          if (statuses == allResults.length) {
            response.status = true
          }
          callbackOk(response)
        })
      }else{
        callbackWrong("Sin resultados o las balanzas no responden.")
      }


      })
    }
  }

  static cargarVales() {
    if (!ModelConfig.get("trabajarConBalanzaDigi")) return
    if (ModelConfig.get("modoLecturaBalanzaDigi") != ModosLecturaDigi.TICKET_VALE) return

    const balanzaDigi = new BalanzaDigi()
    console.log("cargarVales")
    var primeraVuelta = true
    balanzaDigi.estadoVales((res: any) => {
      console.log("resultado estadoVales balanza digi", res)
      if (res.status && res.info) {
        // setInfoBalanza(res.info.info51)
        // console.log("setInfoBalanza1 con ", res.info.info51)
        if (primeraVuelta) {
          balanzaDigi.guardarEnSesionTodos(res.info)
        } else {
          balanzaDigi.agregarEnSesion(res.info)
        }
        primeraVuelta = false
      } else {
        // showAlert("No se pudo leer los tickets de la balanza.")
      }
      setTimeout(() => {
        BalanzaDigi.cargarVales()
      }, ModelConfig.get("refreshValeBalanzaDigi") * 1000);
      console.log("se cargará los vales nuevamente en " + (ModelConfig.get("refreshValeBalanzaDigi") * 1000) + " segundos")
      // hideLoading()
    }, () => {
      console.log("no se pudo cargar. se intentará cargar los vales nuevamente en " + (ModelConfig.get("refreshValeBalanzaDigi") * 1000) + " segundos")
      setTimeout(() => {
        BalanzaDigi.cargarVales()
      }, ModelConfig.get("refreshValeBalanzaDigi") * 1000);
    })
  }

  static buscarProductosEnVale(codigoBarrasTicket: any, callbackOk: any, callbackMal: any) {
    console.log("buscarProductosEnVale")
    if (
      !ModelConfig.get("trabajarConBalanzaDigi")
      || ModelConfig.get("modoLecturaBalanzaDigi") != ModosLecturaDigi.TICKET_VALE
    ) {
      console.log("config no apta para trabajar con vales..saliendo")
      callbackMal("");
      return
    }
    console.log("config apta para trabajar con vales")

    const balanzaDigi = new BalanzaDigi()
    var valesBalanzaDigi: any = []
    if (balanzaDigi.sesion.hasOne()) {
      balanzaDigi.obtenerDeSesionTodos((inf: any) => {
        console.log("de sesion digi viene", inf)
        if (inf && inf.info51) {
          // console.log("asignando los vales:", inf.info51)
          valesBalanzaDigi = inf.info51
        }
      })
    }

    if (valesBalanzaDigi.length < 1) {
      callbackMal("No se pudo leer los tickets de la balanza")
      return
    }

    const CODBALANZADIGI: any = parseInt(ModelConfig.get("codigoValeBalanzaDigi"))
    const codigoBuscado = codigoBarrasTicket + ""
    if (codigoBuscado.indexOf(CODBALANZADIGI) !== 0) {
      callbackMal("")
      return
    }


    var valeDigiBuscado: any = parseInt(codigoBuscado.substring(2, 6))

    if (ModelConfig.get("revisarValeRepeditoBalanzaDigi") && balanzaDigi.yaEstaUsado(valeDigiBuscado)) {
      callbackMal("El vale ya fue usado")
      return
    }

    var coinciden: any = []
    var noEncontrados: any = []

    const hay = valesBalanzaDigi.length
    var va = 0


    const revisarSiTermino = () => {
      if (va == hay) {
        // setProductos(coinciden)
        // console.log("coinciden", coinciden)
        // console.log("noEncontrados", noEncontrados)



        if (noEncontrados.length > 0) {
          if (noEncontrados.length == 1) {
            callbackMal("El producto con codigo "
              + noEncontrados[0].pluItem
              + " no existe en el pos. Crearlo y volver a leer el vale.")
            return
          } else {
            callbackMal("Los productos con los codigos "
              + noEncontrados.join(", ")
              + " no existen en el pos. Crearlos y volver a leer el vale.")
            return
          }
        }

        if (coinciden.length < 1) {
          callbackMal("No se encontro el ticket " + valeDigiBuscado)
          return
        }

        // coinciden.forEach((prod) => {
        //   prod.nroValeDigi = valeDigiBuscado
        //   addToSalesData(prod)
        // })
        callbackOk(coinciden, valeDigiBuscado, coinciden[0].balanza)
        balanzaDigi.agregarUsado(valeDigiBuscado, coinciden)
      }
    }


    console.log("buscando coincidencias con los vales", valesBalanzaDigi, "..con el vale buscado '" + valeDigiBuscado + "'")
    valesBalanzaDigi.forEach((item: any) => {
      // console.log("item.nroVale", item.nroVale)
      if (
        parseInt(item.nroVale) == valeDigiBuscado
        // && item.status == "6C40"
      ) {
        console.log("coincide..buscamos el producto '" + parseInt(item.pluItem) + "' en el pos")
        // coinciden.push(item)

        Product.getInstance().findByCodigoBarras({
          codigoProducto: parseInt(item.pluItem)
        }, (prods: any) => {
          // console.log("prods", prods)
          // console.log("prods.length", prods.length)

          if (prods.length > 0) {
            console.log("tiene resultados para", item)

            var prodPos: any = new ProductSold()
            prodPos.fill(prods[0])
            // console.log("tiene resultados2")
            if (ProductSold.esPesable(prodPos)) {
              prodPos.cantidad = parseFloat(item.pesoItem) / 1000
            } else {
              // console.log("tiene resultados3")
              prodPos.cantidad = parseFloat(item.cantidadItem)
            }
            // console.log("tiene resultados4")
            prodPos.updateSubtotal()
            // console.log("tiene resultados5")
            prodPos.total = parseFloat(item.precioTotalItem)
            // console.log("tiene resultados6")

            prodPos = System.clone(prodPos)
            prodPos.balanza = item.balanza
            console.log("haciendo push en coincide", prodPos)
            coinciden.push(prodPos)
            // console.log("tiene resultados7")
          } else {
            console.log("no esta en el pos", item)
            noEncontrados.push(parseInt(item.pluItem))
          }
          va++
          revisarSiTermino()
        }, (er: any) => {
          // console.log("error: no esta en el pos", item)
          noEncontrados.push(parseInt(item.pluItem))
          va++
          revisarSiTermino()
        })
      } else {
        // console.log("no coincide")
        va++
        revisarSiTermino()
      }
    })


  }

  eliminarProductos(callbackOk: any, callbackWrong: any) {
    this.hacerAccion("eliminarTodos", callbackOk, {}, callbackWrong)
  }

  enviarProductos(prods: any, callbackOk: any, callbackWrong: any) {
    this.hacerAccion("enviarTodos", callbackOk, prods, callbackWrong)
  }

  recibirProductos(callbackOk: any) {
    this.hacerAccion("recibirTodos", callbackOk)
  }

  leerProductos(callbackOk: any) {
    this.hacerAccion("leerTodosProductos", callbackOk)
  }

  recibirYLeerProductos(callbackOk: any, callbackWrong: any) {
    this.hacerAccion("recibirYLeerProductos", callbackOk, {}, callbackWrong)
  }

  enviarProductosFormatoBalanza(productosBalanza: any, callbackOk: any, callbackWrong: any) {
    this.hacerAccion("enviarProductosFormatoBalanza", callbackOk, {
      productosBalanza,
      formatoBalanza: true
    }, callbackWrong)
  }

  estadoVales(callbackOk: any, callbackWrong: any) {
    this.hacerAccion("estadoCapturaVales", callbackOk, {}, callbackWrong)
  }

  anularVale(nroVale: string, callbackOk: any, callbackWrong: any = () => { }) {
    this.hacerAccion("anularUnVale", callbackOk, {
      nroVale
    }, callbackWrong)
  }

  obtenerReporteZ(callbackOk: any) {
    this.hacerAccion("reporteZ", callbackOk)
  }

  obtenerVendedores(callbackOk: any, callbackWrong: any = () => { }) {
    // console.log("obtenerVendedores de modelo balanza digi")
    this.hacerAccion("obtenerVendedores", callbackOk, {}, callbackWrong)
  }

  enviarVendedores(vendedores: any, callbackOk: any, callbackWrong: any = () => { }) {
    this.hacerAccion("enviarVendedores", callbackOk, {
      vendedores
    }, callbackWrong)
  }

  enviarObtenerTeclasRapidas(callbackOk: any, callbackWrong: any = () => { }) {
    this.hacerAccion("obtenerTeclasRapidas", callbackOk, {
    }, callbackWrong)
  }

  enviarTeclasRapidas(teclas: any, callbackOk: any, callbackWrong: any = () => { }) {
    this.hacerAccion("enviarTeclasRapidas", callbackOk, {
      teclas
    }, callbackWrong)
  }

  vaciarBufferVales(callbackOk: any, callbackWrong: any) {
    this.hacerAccion("vaciarBufferVales", callbackOk, {}, callbackWrong)
  }

  cambiarSpecVales(callbackOk: any, callbackWrong: any) {
    this.hacerAccion("specVales", callbackOk, {}, callbackWrong)
  }
  cambiarSpecProductos(callbackOk: any, callbackWrong: any) {
    this.hacerAccion("specProductos", callbackOk, {}, callbackWrong)
  }

};

export default BalanzaDigi;