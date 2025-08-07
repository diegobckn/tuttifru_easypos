import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class Client{
  constructor(){
    this.sesion = new StorageSesion("client");
  }

  static getInstance(){
    if(Client.instance == null){
        Client.instance = new Client();
    }

    return Client.instance;
  }

  saveInSesion(data){
    this.sesion.guardar(data)
    // localStorage.setItem('userData', JSON.stringify(data));
    return data;
  }

  getFromSesion(){
      return this.sesion.cargar(1)
      // var dt = localStorage.getItem('userData') || "{}";
      // return JSON.parse(dt);
  }

  fill(values){
    for(var campo in values){
        const valor = values[campo]
        this[campo] = valor;
    }
  }

  getFillables(){
      var values = {};
      for(var prop in this){
          if(typeof(this[prop]) != 'object'
              && this[prop] != undefined
          ){
              values[prop] = this[prop]
          }
      }
      return values
  }

  async searchInServer({
    searchText,
    codigoSucursal,
    puntoVenta
  },callbackOk, callbackWrong){
      
    const configs = ModelConfig.get()
    var url = configs.urlBase
    + `/api/Clientes/GetClientesByNombreApellido?nombreApellido=${searchText}`
    if(!codigoSucursal){
      url += "&codigoSucursal=" + ModelConfig.get("sucursal")
    }else{
      url += "&codigoSucursal=" + codigoSucursal
    }

    if(!puntoVenta){
      url += "&puntoVenta=" + ModelConfig.get("puntoVenta")
    }else{
      url += "&puntoVenta=" + puntoVenta
    }

    EndPoint.sendGet(url,(responseData, response)=>{
      if (Array.isArray(response.data.clienteSucursal)) {
        callbackOk(responseData.clienteSucursal);
      } else {
        callbackOk([]);
      }
    },callbackWrong)
  }

  async getAllFromServer(callbackOk, callbackWrong){
    const configs = ModelConfig.get()
    var url = configs.urlBase + "/api/Clientes/GetAllClientes"
    
    url += "?codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")
          
    EndPoint.sendGet(url,(responseData, response)=>{
      callbackOk(responseData.cliente);
    },callbackWrong)
  }

  async findById(id,callbackOk, callbackWrong){
    this.getAllFromServer((clientes)=>{
      var clienteEncontrado = null
      clientes.forEach((cl)=>{
        if(cl.codigoCliente == id){
          clienteEncontrado = cl
          return
        }else{
          // console.log("no coincide con " + cl.codigoCliente)
        }
      })
      if(clienteEncontrado){
        callbackOk(clienteEncontrado)
      }else{
        callbackWrong("No hay coincidencia")
      }
    },callbackWrong)
  }

  async getDeudasByMyId(callbackOk, callbackWrong){
    if(!this.id){
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

    EndPoint.sendGet(url,(responseData, response)=>{
      callbackOk(responseData.clienteDeuda);
    },callbackWrong)       
  }

  async pagarFiado(callbackOk, callbackWrong){
    if(!this.data){
        console.log("falta asignar la data para enviar")
        return
    }
    
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/Clientes/PostClientePagarDeudaByIdClienteFlujoCaja"

    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url,this.data,(responseData, response)=>{
      callbackOk(responseData);
    },callbackWrong)
  }

  async getLastSale(callbackOk, callbackWrong){
    if(!this.codigoClienteSucursal && this.clienteSucursal)
        this.codigoClienteSucursal = this.clienteSucursal
    if(
        this.codigoClienteSucursal == undefined
        || this.codigoCliente == undefined
        ){
        console.log("Modelo Client.definir clienteSucursal y codigo cliente como propiedad");
        return
    }

    if(!this.puntoVenta && !this.puntoVenta){
        this.puntoVenta = ModelConfig.get("puntoVenta") 
    }

    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/Clientes/GetClienteUltimaVentaByIdCliente" + 
    "?codigoClienteSucursal=" + this.codigoClienteSucursal + 
    "&codigoCliente=" +this.codigoCliente +
    "&puntoVenta=" +this.puntoVenta

    EndPoint.sendGet(url,(responseData, response)=>{
      const { ticketBusqueda } = response.data; // Extraer la sección de ticket de la respuesta
      var result = []
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
    },callbackWrong)
  }

  async getRegions (callbackOk,callbackWrong){
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/RegionComuna/GetAllRegiones"
    url += "?codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url,(responseData, response)=>{
      callbackOk(response.data.regiones)
    },callbackWrong)
  };


  async getComunasFromRegion(regionId, callbackOk, callbackWrong){
   
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/RegionComuna/GetComunaByIDRegion?IdRegion=" + regionId

    url += "&codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url,(responseData, response)=>{
      callbackOk(response.data.comunas)
    },callbackWrong)
  }


  async create(data,callbackOk,callbackWrong){
    data.usaCuentaCorriente = 0
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/Clientes/AddCliente"
    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")
    EndPoint.sendPost(url,data,(responseData, response)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  };

  async update(data,callbackOk,callbackWrong){
    data.usaCuentaCorriente = 0
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/Clientes/PutClienteCliente"
    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")
    EndPoint.sendPut(url,data,(responseData, response)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  };

  async existByRut(rut,callbackOk,callbackWrong){
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/Clientes/GetClientesByRut?rut=" + rut

    url += "&codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url,(responseData, response)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  };

  static completoParaFactura(info){
    // console.log("revisando si esta para facturar")
    // console.log(info)
    return (
      info.rutResponsable && info.rutResponsable.length>0 &&
      info.razonSocial && info.razonSocial.length>0 &&
      info.nombreResponsable && info.nombreResponsable.length>0 &&
      info.apellidoResponsable && info.apellidoResponsable.length>0 &&
      info.direccion && info.direccion.length>0 &&
      info.region && info.region.length>0 &&
      info.comuna && info.comuna.length>0 &&
      info.giro && info.giro.length>0
    )
  }
};

export default Client;