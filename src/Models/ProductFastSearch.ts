import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Model from './Model';
import BaseConfig, { ModosTrabajoConexion } from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';
import ModelSingleton from './ModelSingleton.ts';
import Product from './Product.ts';


class ProductFastSearch extends ModelSingleton {
    productosOffline: Product[] = []

    async getProductsFastSearch(callbackOk, callbackWrong, forzarDescarga = false) {
        // console.log("getProductsFastSearch")

        const me = this
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/ProductosTmp/ProductosVentaRapidaGet"
        url += "?codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")


        const modo = ModelConfig.get("modoTrabajoConexion")
        // console.log("modo", modo)
        if (
            !forzarDescarga && (
                modo == ModosTrabajoConexion.SOLO_OFFLINE
                || modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
                || modo == ModosTrabajoConexion.PREGUNTAR
            )
        ) {
            // console.log("intentando cargar offline")
            const cargado = me.sesion.cargar(1)
            if (cargado) {
                // console.log("tiene algo intentando cargar offline")
                callbackOk(cargado.productos)
                return
            }
        }

        // console.log("carga normal online")

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.productosVentaRapidas, response);
        }, (err) => {
            // si esta offline cargamos desde la sesion
            const modo = ModelConfig.get("modoTrabajoConexion")
            // console.log("modo", modo)
            if (
                !forzarDescarga && (
                    modo == ModosTrabajoConexion.SOLO_OFFLINE
                    || modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
                    || modo == ModosTrabajoConexion.PREGUNTAR
                )
            ) {
                const cargado = me.sesion.cargar(1)
                if (cargado) {
                    callbackOk(cargado.productos)
                } else {
                    callbackWrong(err)
                }

            } else {
                callbackWrong(err)
            }
        })
    }

    async addProductFastSearch(product, callbackOk, callbackWrong) {
        var me = this
        const configs = ModelConfig.get()
        var url = configs.urlBase + "/api/ProductosTmp/ProductosVentaRapidaPost"

        if (!product.codigoSucursal) product.codigoSucursal = ModelConfig.get("sucursal")
        if (!product.puntoVenta) product.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPost(url, product, (responseData, response) => {
            const modo = ModelConfig.get("modoTrabajoConexion")
            // console.log("modo", modo)
            if (modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR) {
                me.almacenarParaOffline(() => {
                    callbackOk(responseData, response);
                }, callbackWrong)
            }
        }, callbackWrong)
    }

    async changeProductFastSearch(product, callbackOk, callbackWrong) {
        var me = this
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/ProductosTmp/ProductosVentaRapidaPut"

        if (!product.codigoSucursal) product.codigoSucursal = ModelConfig.get("sucursal")
        if (!product.puntoVenta) product.puntoVenta = ModelConfig.get("puntoVenta")
        EndPoint.sendPut(url, product, (responseData, response) => {
            const modo = ModelConfig.get("modoTrabajoConexion")
            // console.log("modo", modo)
            if (modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR) {
                me.almacenarParaOffline(() => {
                    callbackOk(responseData, response);
                }, callbackWrong)
            }
        }, callbackWrong)
    }

    async removeProductFastSearch(product, callbackOk, callbackWrong) {
        var me = this
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/ProductosTmp/ProductosVentaRapidaDelete"

        if (!product.codigoSucursal) product.codigoSucursal = ModelConfig.get("sucursal")
        if (!product.puntoVenta) product.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendDelete(url, {
            params: product
        }, (responseData, response) => {
            const modo = ModelConfig.get("modoTrabajoConexion")
            // console.log("modo", modo)
            if (modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR) {
                me.almacenarParaOffline(() => {
                    callbackOk(responseData, response);
                }, callbackWrong)
            }
        }, callbackWrong)
    }

    async almacenarParaOffline(callbackOk, callbackWrong) {
        var me = this
        this.getProductsFastSearch((prods, resp) => {
            me.sesion.guardar({
                id: 1,
                productos: prods
            })
            me.productosOffline = prods
            callbackOk(prods, resp)
        }, callbackWrong, true)
    }

};



export default ProductFastSearch;