import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.js';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';
import Singleton from './Singleton.ts';


class Comercio {

  static sesionServerAllConfig: StorageSesion = new StorageSesion("ComercioServerAllConfig")
  static sesionServerImpresion: StorageSesion = new StorageSesion("ComercioServerImpresion")
  static sesionServerAnchos: StorageSesion = new StorageSesion("ComercioServerAnchos")

  static async getServerImpresionConfigs(callbackOk, callbackWrong) {
    var me = this
    const url = ModelConfig.get("urlBase") + "/api/Configuracion/GetAllConfiguracionImpresion"
    EndPoint.sendGet(url, (responseData, response) => {
      me.sesionServerImpresion.guardar(responseData.configuracion)
      callbackOk(responseData.configuracion, response)
    }, (er) => {
      if (me.sesionServerImpresion.hasOne()) {
        callbackOk(me.sesionServerImpresion.cargar(1), {})
        return
      }
      callbackWrong(er)
    })
  }

  static async getServerAllConfigs(callbackOk, callbackWrong) {
    var me = this
    const url = ModelConfig.get("urlBase") + "/api/Configuracion/GetAllConfiguracionCliente"
    EndPoint.sendGet(url, (responseData, response) => {
      me.sesionServerAllConfig.guardar(responseData.configuracion)
      callbackOk(responseData.configuracion, response)
    }, (er) => {
      if (me.sesionServerAllConfig.hasOne()) {
        callbackOk(me.sesionServerAllConfig.cargar(1), {})
        return
      }
      callbackWrong(er)
    })
  }

  static async getServerAnchosTickets(callbackOk, callbackWrong) {
    var me = this
    const url = ModelConfig.get("urlBase") + "/api/Configuracion/GetAllConfiguracionTamañoImpresion"
    EndPoint.sendGet(url, (responseData, response) => {
      me.sesionServerAnchos.guardar(responseData.configuracion)
      callbackOk(responseData.configuracion, response)
    }, (er) => {
      if (me.sesionServerAnchos.hasOne()) {
        callbackOk(me.sesionServerAnchos.cargar(1), {})
        return
      }
      callbackWrong(er)
    })
  }

};

export default Comercio;