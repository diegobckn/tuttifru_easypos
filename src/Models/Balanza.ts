import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.js';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';
import Singleton from './Singleton.ts';


class Balanza extends Singleton {

  static codigoConfig = null

  ultimoPesoDetectado = null

  static instance = null

  sesion: StorageSesion | null = null

  constructor() {
    super()
    this.sesion = new StorageSesion("balanza");
  }

  static getCodigo() {
    return ModelConfig.get("codBalanza")
  }

  static contieneCodigo(valor) {
    return (valor.indexOf(this.codigoConfig) > -1)
  }


  deteccionPeso(onChange = (e)=>{}) {

    const socket = new WebSocket(ModelConfig.get("urlServicioDeteccionPeso"));

    socket.onopen = () => {
      console.log("Conectado al servidor WebSocket");
    };

    socket.onmessage = (event) => {
      console.log("Mensaje recibido:", event.data);
      onChange(event.data);
      this.ultimoPesoDetectado = event.data
    };

    socket.onerror = (error) => {
      console.error(" Error en WebSocket:", error);
    };

    socket.onclose = () => {
      console.log(" Conexión WebSocket cerrada");
    };

  }

};

export default Balanza;