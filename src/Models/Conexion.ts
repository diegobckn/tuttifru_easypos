import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import ModelSingleton from './ModelSingleton.js';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';
import System from '../Helpers/System.ts';
import SoporteTicket from './SoporteTicket.ts';


class Conexion extends ModelSingleton {
  static gettingConection = false

  static getInstance(): Conexion { return super.getInstance() }

  constructor() {
    super()
    this.sesion = new StorageSesion("estadoconexiones");
  }

  static getEstadoConexiones(reset = false) {
    var gen = Conexion.getInstance().sesion.cargar(1)
    if (!gen || reset) {
      gen = {
        id: 1,
        correctas: 0,
        incorrectas: 0,
      }
      Conexion.getInstance().sesion.guardar(gen)
    }
    return gen
  }

  static getCorrects() {
    var gen = this.getEstadoConexiones()
    return gen.correctas
  }
  static getInCorrects() {
    var gen = this.getEstadoConexiones()
    return gen.incorrectas
  }

  static addCorrect() {
    var gen = this.getEstadoConexiones()
    gen.correctas++
    Conexion.getInstance().sesion.guardar(gen)
  }

  static addInCorrect() {
    var gen = this.getEstadoConexiones()
    gen.incorrectas++
    Conexion.getInstance().sesion.guardar(gen)
  }

  static resetEstadoConexiones() {
    this.getEstadoConexiones(true)
  }


  static async getFromServer(callbackOk: () => void, callbackWrong: (err: string) => void) {
    if (this.gettingConection) return
    this.gettingConection = true
    const url = ModelConfig.get("urlBase") + "/api/Cajas/EstadoApi"
    const reportarErrorAntes = SoporteTicket.reportarError
    SoporteTicket.reportarError = false
    EndPoint.sendGet(url, (responseData: any, response: any) => {
      SoporteTicket.reportarError = reportarErrorAntes
      Conexion.addCorrect()
      callbackOk()
      this.gettingConection = false
    }, (x: string) => {
      SoporteTicket.reportarError = reportarErrorAntes
      Conexion.addInCorrect()
      callbackWrong(x)
      this.gettingConection = false
    })


  }

};

export default Conexion;