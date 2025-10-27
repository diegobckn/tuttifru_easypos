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

  static async getServerImpresionConfigs(callbackOk: any, callbackWrong: any) {
    var me = this
    const url = ModelConfig.get("urlBase") + "/api/Configuracion/GetAllConfiguracionImpresion"
    EndPoint.sendGet(url, (responseData: any, response: any) => {
      me.sesionServerImpresion.guardar(responseData.configuracion)
      callbackOk(responseData.configuracion, response)
    }, (er:any) => {
      if (me.sesionServerImpresion.hasOne()) {
        callbackOk(me.sesionServerImpresion.cargar(1), {})
        return
      }
      callbackWrong(er)
    })
  }

  static async getServerAllConfigs(callbackOk: any, callbackWrong: any) {
    var me = this
    const url = ModelConfig.get("urlBase") + "/api/Configuracion/GetAllConfiguracionCliente"
    EndPoint.sendGet(url, (responseData: any, response: any) => {
      me.sesionServerAllConfig.guardar(responseData.configuracion)
      callbackOk(responseData.configuracion, response)
    }, (er:any) => {
      if (me.sesionServerAllConfig.hasOne()) {
        callbackOk(me.sesionServerAllConfig.cargar(1), {})
        return
      }
      callbackWrong(er)
    })
  }

  static async getServerAnchosTickets(callbackOk: any, callbackWrong: any) {
    var me = this
    const url = ModelConfig.get("urlBase") + "/api/Configuracion/GetAllConfiguracionTamañoImpresion"
    EndPoint.sendGet(url, (responseData: any, response: any) => {
      me.sesionServerAnchos.guardar(responseData.configuracion)
      callbackOk(responseData.configuracion, response)
    }, (er:any) => {
      if (me.sesionServerAnchos.hasOne()) {
        callbackOk(me.sesionServerAnchos.cargar(1), {})
        return
      }
      callbackWrong(er)
    })
  }

  static buscarConfig(grupo: string, entrada: string, configs: any) {
    var found = null;
    configs.forEach((element: any) => {
      if (element.grupo == grupo && element.entrada == entrada) {
        found = element
      }
    });

    return found;
  }

};

export default Comercio;