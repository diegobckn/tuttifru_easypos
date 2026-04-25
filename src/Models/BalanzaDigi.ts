import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
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


class BalanzaDigi extends ModelSingleton {

  socket: WebSocket | null = null

  static detectandoConexion = false
  static primeraConexion = false

  constructor() {
    super()
    this.sesion = new StorageSesion("balanza");
  }

  resetSesion() {
    this.sesion.guardar({
      id: 1,
      fecha: dayjs().format('YYYY-MM-DD'),
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
    antes.todos = infoBalanza
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

  agregarUsado(usado: string) {
    var antes = this.sesion.cargar(1)
    antes.usados.push(usado)
    this.sesion.guardar(antes)
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
    // console.log("yaEstaUsado??", nroVale)
    var antes = this.sesion.cargar(1)

    // console.log("antes", antes)
    var encontrado = false
    antes.usados.forEach((nUsado: any) => {
      // console.log("nusado", nUsado)
      if (nUsado == nroVale) {
        encontrado = true
      } else {
        // console.log("son distintos", nroVale, "..y ..", nUsado.nroVale)
      }
    })

    // console.log(encontrado ? "si, esta usado" : "no, no esta usado", nroVale)
    return encontrado
  }

  hacerAccion(accion: string, callbackOk: any, objetoAEnviar: any = {}, callbackWrong: any = () => { }) {
    // console.log("BalanzaDigi model: hacerAccion", accion)
    var me = BalanzaDigi.getInstance();

    objetoAEnviar.accion = accion
    objetoAEnviar.ip = ModelConfig.get("ipBalanzaDigi")
    objetoAEnviar.puerta = ModelConfig.get("puertaBalanzaDigi")
    objetoAEnviar.modelo = ModelConfig.get("modeloBalanzaDigi")
    objetoAEnviar.user = ModelConfig.get("usuarioBalanzaDigi")
    objetoAEnviar.password = ModelConfig.get("claveBalanzaDigi")


    me.socket = new WebSocket(ModelConfig.get("urlServicioBalanzaDigi"));
    me.socket.onopen = () => {
      // console.log("Conectado al servidor WebSocket");
      try{
        me.socket.send(JSON.stringify(objetoAEnviar));
      }catch(e:any){
        if(e.message.indexOf("CONNECTING")>-1){
          setTimeout(() => {
            this.hacerAccion(accion,callbackOk,objetoAEnviar,callbackWrong)
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

};

export default BalanzaDigi;