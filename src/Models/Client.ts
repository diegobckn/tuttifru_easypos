import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import ModelSingleton from './ModelSingleton.js';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class Client extends ModelSingleton {
  id: number = 0
  data: any = null
  codigoClienteSucursal: number = 0
  clienteSucursal: number = 0
  codigoCliente: number = 0
  puntoVenta: string = ""

  static instance: Client
  constructor() {
    super()
    this.sesion = new StorageSesion("client");
  }

  async searchInServer({
    searchText,
    codigoSucursal,
    puntoVenta
  }: any, callbackOk: any, callbackWrong: any) {

    const configs = ModelConfig.get()
    var url = configs.urlBase
      + `/api/Clientes/GetClientesByNombreApellido?nombreApellido=${searchText}`
    if (!codigoSucursal) {
      url += "&codigoSucursal=" + ModelConfig.get("sucursal")
    } else {
      url += "&codigoSucursal=" + codigoSucursal
    }

    if (!puntoVenta) {
      url += "&puntoVenta=" + ModelConfig.get("puntoVenta")
    } else {
      url += "&puntoVenta=" + puntoVenta
    }

    EndPoint.sendGet(url, (responseData: any, response: any) => {
      if (Array.isArray(response.data.clienteSucursal)) {
        callbackOk(responseData.clienteSucursal);
      } else {
        callbackOk([]);
      }
    }, callbackWrong)
  }

  async getAllFromServer(callbackOk: any, callbackWrong: any) {
    const configs = ModelConfig.get()
    var url = configs.urlBase + "/api/Clientes/GetAllClientes"

    url += "?codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url, (responseData: any, response: any) => {
      callbackOk(responseData.cliente);
    }, callbackWrong)
  }

  async findById(id: number, callbackOk: any, callbackWrong: any) {
    this.getAllFromServer((clientes: any) => {
      var clienteEncontrado = null
      clientes.forEach((cl: any) => {
        if (cl.codigoCliente == id) {
          clienteEncontrado = cl
          return
        } else {
          // console.log("no coincide con " + cl.codigoCliente)
        }
      })
      if (clienteEncontrado) {
        callbackOk(clienteEncontrado)
      } else {
        callbackWrong("No hay coincidencia")
      }
    }, callbackWrong)
  }

  async getDeudasByMyId(callbackOk: any, callbackWrong: any) {
    if (!this.id) {
      console.log("Client. getDeudasByMyId. No se asigno un id para buscar deudas del cliente");
      return
    }
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Clientes/GetClientesDeudasByIdCliente"
      + "?codigoClienteSucursal=" + ModelConfig.get("sucursal")
      + "&codigoCliente=" + this.id

    url += "&codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url, (responseData: any, response: any) => {
      callbackOk(responseData.clienteDeuda);
    }, callbackWrong)
  }

  async pagarFiado(callbackOk: any, callbackWrong: any) {
    if (!this.data) {
      console.log("falta asignar la data para enviar")
      return
    }

    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Clientes/PostClientePagarDeudaByIdClienteFlujoCaja"

    if (!this.data.codigoSucursal) this.data.codigoSucursal = ModelConfig.get("sucursal")
    if (!this.data.puntoVenta) this.data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url, this.data, (responseData: any, response: any) => {
      callbackOk(responseData);
    }, callbackWrong)
  }


  async getLastSale(callbackOk: any, callbackWrong: any) {
    if (!this.codigoClienteSucursal && this.clienteSucursal)
      this.codigoClienteSucursal = this.clienteSucursal
    if (
      this.codigoClienteSucursal == undefined
      || this.codigoCliente == undefined
    ) {
      console.log("Modelo Client.definir clienteSucursal y codigo cliente como propiedad");
      return
    }

    if (!this.puntoVenta && !this.puntoVenta) {
      this.puntoVenta = ModelConfig.get("puntoVenta")
    }

    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Clientes/GetClienteUltimaVentaByIdCliente" +
      "?codigoClienteSucursal=" + this.codigoClienteSucursal +
      "&codigoCliente=" + this.codigoCliente +
      "&puntoVenta=" + this.puntoVenta

    EndPoint.sendGet(url, (responseData:any, response:any) => {
      const { ticketBusqueda } = response.data; // Extraer la sección de ticket de la respuesta
      var result:any = []
      // Verificar si hay información de tickets antes de procesarla
      if (Array.isArray(ticketBusqueda) && ticketBusqueda.length > 0) {
        ticketBusqueda.forEach((ticket) => {
          const products = ticket.products; // Extraer la matriz de productos del ticket

          // Verificar si hay productos antes de enviarlos a addToSalesData
          if (Array.isArray(products) && products.length > 0) {
            products.forEach((product) => {
              result.push(product);
            });
          }
        });

        callbackOk(result)
      } else {
        callbackWrong("Formato erroneo del servidor")
      }
    }, callbackWrong)
  }

  async getRegions(callbackOk:any, callbackWrong:any) {
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/RegionComuna/GetAllRegiones"
    url += "?codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url, (responseData:any, response:any) => {
      callbackOk(response.data.regiones)
    }, callbackWrong)
  };


  async getComunasFromRegion(regionId:number|string, callbackOk:any, callbackWrong:any) {

    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/RegionComuna/GetComunaByIDRegion?IdRegion=" + regionId

    url += "&codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url, (responseData:any, response:any) => {
      callbackOk(response.data.comunas)
    }, callbackWrong)
  }


  async create(data:any, callbackOk:any, callbackWrong:any) {
    data.usaCuentaCorriente = 0
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Clientes/AddCliente"
    if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")
    EndPoint.sendPost(url, data, (responseData:any, response:any) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  };

  async update(data:any, callbackOk:any, callbackWrong:any) {
    data.usaCuentaCorriente = 0
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Clientes/PutClienteCliente"
    if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")
    EndPoint.sendPut(url, data, (responseData:any, response:any) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  };

  async existByRut(rut:string, callbackOk:any, callbackWrong:any) {
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Clientes/GetClientesByRut?rut=" + rut

    url += "&codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url, (responseData:any, response:any) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  };

  static completoParaFactura(info:any) {
    // console.log("revisando si esta para facturar")
    // console.log(info)
    return (
      info.rutResponsable && info.rutResponsable.length > 0 &&
      info.razonSocial && info.razonSocial.length > 0 &&
      info.nombreResponsable && info.nombreResponsable.length > 0 &&
      info.apellidoResponsable && info.apellidoResponsable.length > 0 &&
      info.direccion && info.direccion.length > 0 &&
      info.region && info.region.length > 0 &&
      info.comuna && info.comuna.length > 0 &&
      info.giro && info.giro.length > 0
    )
  }
};

export default Client;