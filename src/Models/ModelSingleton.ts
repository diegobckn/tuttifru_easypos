import StorageSesion from '../Helpers/StorageSesion.ts';
import System from '../Helpers/System.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import EndPoint from './EndPoint.ts';
import ModelConfig from './ModelConfig.ts';
import axios from 'axios';


class ModelSingleton {
  sesion: StorageSesion;

  static instances: any = {};

  constructor() {
    this.sesion = new StorageSesion(eval("this.__proto__.constructor.name"));
  }

  fill(values: any) {
    for (var campo in values) {
      const valor: any = values[campo]
      System.setProp(this, campo, valor)
    }
  }

  getFillables() {
    var values: any = {};
    for (var prop in this) {
      if (typeof (this[prop]) != 'object'
        && this[prop] != undefined
      ) {
        values[prop] = this[prop]
      }
    }
    return values
  }

  static getInstance() {
    if (this.instances[this.name] === undefined) {
      this.instances[this.name] = new this();
    }
    return this.instances[this.name];
  }

  saveInSesion(data: any) {
    this.sesion.guardar(data)
    // localStorage.setItem('userData', JSON.stringify(data));
    return data;
  }

  getFromSesion() {
    return this.sesion.cargar(1)
    // var dt = localStorage.getItem('userData') || "{}";
    // return JSON.parse(dt);
  }
};

export default ModelSingleton;