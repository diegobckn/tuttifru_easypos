import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.js';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';
import Singleton from './Singleton.ts';


class Comercio {
  static sesionServerAllConfig = new StorageSesion("ComercioServerAllConfig")
  static sesionServerImpresion = new StorageSesion("ComercioServerImpresion")
  static sesionServerAnchos = new StorageSesion("ComercioServerAnchos")

  almacenarOfflineGeneral(
    callbackOk = () => { },
    callbackWrong = (x: string) => { }) {

    const urlBase = ModelConfig.get("urlBase") + "/api/Configuracion"
    var url = urlBase + "/GetAllConfiguracionCliente"

    EndPoint.sendGet(url, (responseData: any) => {
      Comercio.sesionServerAllConfig.guardar(responseData.configuracion)
      callbackOk()
    }, (er: string) => {
      callbackWrong(er)
    })
  }

  almacenarOfflineImpresion(
    callbackOk = () => { },
    callbackWrong = (x: string) => { }) {

    const urlBase = ModelConfig.get("urlBase") + "/api/Configuracion"
    var url = urlBase + "/GetAllConfiguracionImpresion"

    EndPoint.sendGet(url, (responseData: any) => {
      Comercio.sesionServerImpresion.guardar(responseData.configuracion)
      callbackOk()
    }, (er: string) => {
      callbackWrong(er)
    })
  }
  
  almacenarOfflineAnchos(
    callbackOk = () => { },
    callbackWrong = (x: string) => { }) {

    const urlBase = ModelConfig.get("urlBase") + "/api/Configuracion"
    var url = urlBase + "/GetAllConfiguracionTamañoImpresion"

    EndPoint.sendGet(url, (responseData: any) => {
      Comercio.sesionServerAnchos.guardar(responseData.configuracion)
      callbackOk()
    }, (er: string) => {
      callbackWrong(er)
    })
  }

  static async getServerImpresionConfigs(callbackOk: any, callbackWrong: any) {
    const url = ModelConfig.get("urlBase") + "/api/Configuracion/GetAllConfiguracionImpresion"
    EndPoint.sendGet(url, (responseData: any, response: any) => {
      callbackOk(responseData.configuracion, response)
    }, (er: any) => {
      callbackWrong(er)
    })
  }

  static async getServerAllConfigs(callbackOk: any, callbackWrong: any) {
    const url = ModelConfig.get("urlBase") + "/api/Configuracion/GetAllConfiguracionCliente"
    EndPoint.sendGet(url, (responseData: any, response: any) => {
      callbackOk(responseData.configuracion, response)
    }, (er: any) => {
      callbackWrong(er)
    })
  }

  static async getServerAnchosTickets(callbackOk: any, callbackWrong: any) {
    const url = ModelConfig.get("urlBase") + "/api/Configuracion/GetAllConfiguracionTamañoImpresion"
    EndPoint.sendGet(url, (responseData: any, response: any) => {
      callbackOk(responseData.configuracion, response)
    }, (er: any) => {
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