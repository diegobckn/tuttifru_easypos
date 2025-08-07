import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class BalanzaUnidad{

  static codigoConfig = null

  constructor(){
    this.sesion = new StorageSesion("balanzaUnidad");
  }

  static getInstance(){
    if(BalanzaUnidad.instance == null){
        BalanzaUnidad.instance = new BalanzaUnidad();
    }

    return BalanzaUnidad.instance;
  }

  static getCodigo(){
    if(this.codigoConfig === null){
      this.codigoConfig = ModelConfig.get("codBalanzaVentaUnidad")
    }

    return this.codigoConfig
  }

  static contieneCodigo(valor){
    return (valor.indexOf(this.codigoConfig)>-1)
  }
};

export default BalanzaUnidad;