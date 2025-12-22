import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import Singleton from './Singleton.ts';
import User from './User';
import SoporteTicket from './SoporteTicket.ts';


class EndPoint extends Singleton {

  static admError(error: any, callbackWrong: any) {
    console.log("arranca admError", error)
    console.log("arranca admError..callbackWrong", callbackWrong)

    if (SoporteTicket.reportarError) console.log("admError", error)
    if (SoporteTicket.reportarError) console.log("admError2", callbackWrong)
    if (callbackWrong == undefined) {
      console.log("salgo porque no tiene callbackwrong")
      SoporteTicket.catchRequestError(error)
      return
    }

    console.log("preparando para ir al callbackWrong")

    if (error.response) {
      if (error.response.data && error.response.data.descripcion) {
        console.log("llama callbackwrong con.." + error.response.data.descripcion, error.response);
        callbackWrong(error.response.data.descripcion, error.response);
      } else if (error.response.status === 500) {
        console.log("llama callbackwrong con.." + "Error interno del servidor. Por favor, inténtalo de nuevo más tarde.", error.response);
        callbackWrong("Error interno del servidor. Por favor, inténtalo de nuevo más tarde.", error.response);
      } else {
        console.log("llama callbackwrong con.." + error.message, error.response);
        callbackWrong(error.message, error.response);
      }
    } else if (error.data && error.data.descripcion) {
      console.log("llama callbackwrong con.." + error.data.descripcion, error);
      callbackWrong(error.data.descripcion, error);
    } else if (error.message != "") {

      console.log("llama callbackwrong con.." + error.message, error)
      callbackWrong(error.message, error)
    } else {
      console.log("llama callbackwrong con.." + "Error de comunicacion con el servidor", error);
      callbackWrong("Error de comunicacion con el servidor", error);
    }

    SoporteTicket.catchRequestError(error)
  }

  static async sendGet(url: string, callbackOk: any, callbackWrong: any) {
    try {
      const response = await axios.get(url);
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        if (callbackOk != undefined) callbackOk(response.data, response)
      } else {
        var msgError = "Error de servidor"
        // callbackWrong(response.data.descripcion);
        if (response.data && response.data.descripcion) msgError = response.data.descripcion
        if (callbackWrong != undefined) callbackWrong(msgError)
        SoporteTicket.catchRequest(response)
      }
    } catch (error) {
      this.admError(error, callbackWrong)
    }
  }


  static async sendPost(url: string, data: any, callbackOk: any, callbackWrong: any, headers: any = undefined) {
    try {
      const response = await axios.post(url, data, headers);

      if (
        (!response.data.statusCode && (response.status === 200 || response.status === 201))
        || (response.data.statusCode === 200 || response.data.statusCode === 201)
      ) {
        if (callbackOk != undefined) callbackOk(response.data, response)
      } else {
        console.log("else de statuscode 200")
        this.admError(response, callbackWrong)
        // if(callbackWrong != undefined) callbackWrong("Error de servidor")
        // SoporteTicket.catchRequest(response)
      }
    } catch (error) {
      console.log("catch")
      this.admError(error, callbackWrong)
    }
  }

  static async sendPut(url: string, data: any, callbackOk: any, callbackWrong: any) {
    try {
      const response = await axios.put(url, data);
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        if (callbackOk != undefined) callbackOk(response.data, response)
      } else {
        if (callbackWrong != undefined) callbackWrong("Error de servidor")
        SoporteTicket.catchRequest(response)
      }
    } catch (error) {
      this.admError(error, callbackWrong)
    }
  }

  static async sendDelete(url: string, data: any, callbackOk: any, callbackWrong: any) {
    try {
      const response = await axios.delete(url, data);
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        if (callbackOk != undefined) callbackOk(response.data, response)
      } else {
        if (callbackWrong != undefined) callbackWrong("Error de servidor")
        SoporteTicket.catchRequest(response)
      }
    } catch (error) {
      this.admError(error, callbackWrong)
    }
  }
};

export default EndPoint;