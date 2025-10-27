import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.js';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';
import Singleton from './Singleton.ts';
import dayjs from 'dayjs';


class Balanza extends Singleton {

  static codigoConfig = null

  ultimoPesoDetectado = null

  static instance = null

  sesion: StorageSesion | null = null
  socket: WebSocket | null = null


  refrescaConexion: any = null

  interval = null
  terminoAnterior = null

  cicloVa = 0
  ciclando = false
  cicloCantidad = 30
  ciclarTiempo = 1000// en milisegundos
  ultimoCheck = ""

  pasoElPrimero = false

  onChangeFn = null

  static onNeedReconect = () => { }

  static detectandoConexion = false
  static primeraConexion = false

  constructor() {
    super()
    this.sesion = new StorageSesion("balanza");
  }


  static getCodigo() {
    return ModelConfig.get("codBalanza")
  }

  // static contieneCodigo(valor) {
  //   return (valor.indexOf(this.codigoConfig) > -1)
  // }


  deteccionPeso(onChange = (e: any) => { }) {
    var me = Balanza.getInstance()
    me.onChangeFn = onChange
    console.log("Balanza.deteccionPeso()")

    this.iniciarCiclo()
  }

  iniciarCiclo() {
    console.log("iniciarCiclo")
    var me = Balanza.getInstance();
    if (me.ciclando && this.cicloVa < 10) return
    me.cicloVa = 0
    me.ciclando = true
    me.interval = setInterval(() => { me.ciclar() }, me.ciclarTiempo);
  }
  ciclar() {
    var me = Balanza.getInstance();

    if (me.cicloVa > 10) {
      me.cancelarCiclo()
    }
    if (me.cicloVa == 1 && Balanza.detectandoConexion) {
      Balanza.detectandoConexion = false
      console.log("Balanza.detectandoConexion = false")
      me.cancelarCiclo()
      return
    }
    const now = dayjs().format("ss")
    if (me.terminoAnterior !== null && !me.terminoAnterior) {
      if (parseInt(now) - parseInt(this.ultimoCheck) > 3) {
        me.terminoAnterior = true
      }
      return
    }
    me.terminoAnterior = false


    console.log("ciclando.. va", me.cicloVa)
    console.log("ciclando..", dayjs().format("ss"))
    console.log("ciclando.. me", me)
    console.log('Balanza.detectandoConexion', Balanza.detectandoConexion);


    if (me.ultimoCheck == now) {
      if (me.pasoElPrimero) return
      me.pasoElPrimero = true
      // setTimeout(() => { me.ciclar() }, 4 * 1000);
      console.log("pausando")
      return
    } else {
      me.pasoElPrimero = false
    }

    me.ultimoCheck = now

    if (!me.ciclando) {
      console.log("fin ciclo")
      return
    }

    // if (!me.cicloVa) {
    //   me.cicloVa = 0
    //   setTimeout(me.ciclar, 1000);
    //   return
    // }

    if (me.socket && me.socket.readyState === WebSocket.OPEN) {
      me.socket.send(' '); // Envía un mensaje para mantener la conexión viva
      setTimeout(() => { me.terminoAnterior = true; }, me.ciclarTiempo);
    } else {

      if (
        me.socket && (
          me.socket.readyState === WebSocket.CONNECTING
          || me.socket.readyState === WebSocket.CLOSING
        )
      ) {
        console.log("cerrando conexion..reintentando")
        setTimeout(() => { me.terminoAnterior = true; }, me.ciclarTiempo);
        return
      }


      me.socket = new WebSocket(ModelConfig.get("urlServicioDeteccionPeso"));
      me.socket.onopen = () => {
        console.log("Conectado al servidor WebSocket");
        Balanza.primeraConexion = true
        if (me.socket && me.socket.readyState === WebSocket.OPEN) me.socket.send(' '); // Envía un mensaje para mantener la conexión viva
        setTimeout(() => { me.terminoAnterior = true; }, me.ciclarTiempo);
      };

      me.socket.onmessage = (event: any) => {

        const formatResponse = JSON.parse(event.data)
        console.log("Mensaje recibido:", formatResponse);
        if (formatResponse.status) {
          me.onChangeFn(formatResponse.info);
          me.ultimoPesoDetectado = formatResponse.info
          setTimeout(() => { me.terminoAnterior = true; }, me.ciclarTiempo);
        } else {
          Balanza.onNeedReconect()
        }
      };

      me.socket.onerror = (error: any) => {
        if (Balanza.primeraConexion == false) {
          Balanza.onNeedReconect()
        }
        console.error(" Error en WebSocket:", error);
        setTimeout(() => { me.terminoAnterior = true; }, me.ciclarTiempo);
      };

      me.socket.onclose = (event: any) => {

        console.log(" Conexión WebSocket cerrada");
        console.warn('Codigo de conexión cerrada:', event.code);
        console.warn('Motivo de conexión cerrada:', event.reason);
        setTimeout(() => { me.terminoAnterior = true; }, me.ciclarTiempo);
      };

    }

    // if (me.socket && me.socket.readyState === WebSocket.OPEN) {
    //   console.log("refrescando conexion")
    //   me.socket.send(' '); // Envía un mensaje para mantener la conexión viva
    // } else {
    // me.socket = new WebSocket(ModelConfig.get("urlServicioDeteccionPeso"));
    // }

    me.cicloVa++

    // if (me.cicloVa < me.cicloCantidad) {
    //   console.log("sigo siclo en tiempo ", me.cicloCantidad)
    //   setTimeout(() => { me.ciclar() }, me.ciclarTiempo);
    // } else {
    //   console.log("llego al limite de ", me.cicloCantidad)

    // }
    // if (me.ciclando) {
    //   setTimeout(() => { me.ciclar() }, me.ciclarTiempo);
    // } else {
    //   console.log("fin ciclando")
    // }
  }

  cancelarCiclo() {
    console.log("cancelarciclo")
    var me = this;
    me.cicloVa = me.cicloCantidad
    me.ciclando = false
    if (me.interval) clearInterval(me.interval)
  }

};

export default Balanza;