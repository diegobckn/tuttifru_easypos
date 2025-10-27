import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import ProductSold from './ProductSold.ts';
import Sales from './Sales.ts';
import System from '../Helpers/System.ts';
import EndPoint from './EndPoint.ts';


class Preventa extends Model {
    static instance: Preventa | null = null;
    static getInstance(): Preventa {
        if (Preventa.instance == null) {
            Preventa.instance = new Preventa();
        }

        return Preventa.instance;
    }

    static adaptarLecturaProductos(productosDePreventa: any): ProductSold[] {
        // console.log("adaptarLecturaProductos..")
        // console.log("antes..", System.clone(productosDePreventa))
        var prods: any = []

        productosDePreventa.forEach((prodPreVenta: any, ix: number) => {
            if (prodPreVenta.descripcion === "Envase") {
                prods[prods.length - 1].envase = []
                prods[prods.length - 1].envase.push({
                    ...prodPreVenta,
                    costo: prodPreVenta.precioUnidad
                })
            } else {
                prods.push(prodPreVenta)
            }
        })

        // console.log("despues..", System.clone(prods))
        return prods
    }

    static yaFueUsada(hashPreventa: any, listaProductos: any) {
        var ya = false
        listaProductos.forEach((prod: any) => {
            if (prod.preVenta && prod.preVenta.indexOf(hashPreventa) > -1) {
                ya = true
            }
        })

        return ya
    }


    static buscarPorFolio(data: any, callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        url += "/api/Ventas/PreVentaGET"

        if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")


        EndPoint.sendPost(url, data, (responseData: any, response: any) => {
            if (responseData.preventa.length > 0) {
                callbackOk(responseData.preventa[0].products, responseData);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }

        }, (err: any) => {
            callbackWrong(err)
        })
    }

    async searchPreventasInServer(data: {
        fechadesde: string,
        fechahasta: string,
    }, callbackOk: any, callbackWrong: any) {

        var url = ModelConfig.get("urlBase")
            + "/api/ReporteVentas/ReportePreventa?"
            + "fechadesde=" + data.fechadesde
            + "&fechahasta=" + data.fechahasta

        EndPoint.sendGet(url, (responseData: any, response: any) => {
            callbackOk(responseData, response);
        }, callbackWrong)
    }

};



export default Preventa;