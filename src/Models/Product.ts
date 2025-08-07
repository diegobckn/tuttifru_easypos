import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Model from './Model';
import BaseConfig, { ModosTrabajoConexion } from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';
import ModelSingleton from './ModelSingleton.ts';
import ParaEnviar from './ParaEnviar.ts';
import System from '../Helpers/System.ts';


class Product extends ModelSingleton {

    idProducto: number
    description: string | null
    nombre: string | null
    price: number | undefined
    priceVenta: number | undefined

    precioCosto: string | null | undefined;

    static enviando = false

    productosOffline: Product[] = []

    static logicaRedondeoUltimoDigito(valor) {
        const totalStr = valor + ""
        var ultTotalStr = ""
        if (totalStr.indexOf(".") > -1) {
            // es decimal
            const entYDeci = totalStr.split(".")
            const entero = entYDeci[0]
            const deci = "0." + (entYDeci[1])


            ultTotalStr = entero.substring(entero.length - 1, entero.length)
            ultTotalStr = parseFloat(ultTotalStr) + parseFloat(deci) + ""
        } else {
            ultTotalStr = totalStr.substring(totalStr.length - 1, totalStr.length)
        }

        if (parseFloat(ultTotalStr) == 0) return (0)
        if (parseFloat(ultTotalStr) <= 5) {
            return (-1 * parseFloat(ultTotalStr))
        } else {
            return (10 - parseFloat(ultTotalStr))
        }
    }

    //para redondear el vuelto por ejemplo
    static logicaInversaRedondeoUltimoDigito(valor) {
        const totalStr = valor + ""
        var ultTotalStr = ""
        if (totalStr.indexOf(".") > -1) {
            // es decimal
            const entYDeci = totalStr.split(".")
            const entero = entYDeci[0]
            const deci = "0." + (entYDeci[1])
            ultTotalStr = entero.substring(entero.length - 1, entero.length)
            ultTotalStr = parseFloat(ultTotalStr) + parseFloat(deci) + ""
        } else {
            ultTotalStr = totalStr.substring(totalStr.length - 1, totalStr.length)
        }

        if (parseFloat(ultTotalStr) == 0) return (0)
        if (parseFloat(ultTotalStr) <= 4) {
            return (-1 * parseFloat(ultTotalStr))
        } else {
            return (10 - parseFloat(ultTotalStr))
        }
    }

    async getAll(callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase") + "/api/ProductosTmp/GetProductos"

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.productos, response);
        }, callbackWrong)
    }

    async almacenarParaOffline(callbackOk, callbackWrong) {
        var me = this
        this.getAll((prods, resp) => {
            me.sesion.guardar({
                id: 1,
                productos: prods
            })
            me.productosOffline = prods
            callbackOk(prods, resp)
        }, callbackWrong)
    }

    loadFromSesion() {
        const hay = this.sesion.cargar(1)
        if (hay && hay.productos && hay.productos.length > 0) {
            this.productosOffline = hay.productos
            return this.productosOffline
        }
        return []
    }

    async buscarPorNombreOffline(nombreBuscar, callbackOk, callbackWrong) {
        if (nombreBuscar.length < 3) {
            callbackOk([])
            return
        }
        if (Product.enviando) {
            console.log("enviando en true.. saliendo")
            return
        }

        console.log("buscarPorNombreOffline")
        if (this.productosOffline.length < 1 && this.sesion.hasOne()) {
            this.loadFromSesion()
        }

        if (this.productosOffline.length > 0) {
            console.log("hay productos")
            const coinciden: any[] = []
            Product.enviando = true
            const buscarLower = nombreBuscar.toLocaleLowerCase()
            this.productosOffline.forEach((prodOffline) => {
                if (
                    prodOffline.nombre
                    &&
                    prodOffline.nombre.toLocaleLowerCase().indexOf(buscarLower) > -1) {
                    coinciden.push(prodOffline)
                }
            })
            Product.enviando = false
            console.log("coinciden", coinciden)
            callbackOk(coinciden)
        } else {
            console.log("no hay productos")
            callbackWrong("No hay productos descargados para trabajar offline")
        }
    }

    async buscarPorCodBarraOffline(codigoBuscar, callbackOk, callbackWrong) {
        // console.log("buscarPorCodBarraOffline")
        // console.log("Product.enviando", Product.enviando)
        if (Product.enviando) {
            console.log("enviando en true.. saliendo")
            return
        }
        // console.log("buscarPorCodBarraOffline2")
        if (this.productosOffline.length < 1 && this.sesion.hasOne()) {
            this.loadFromSesion()
        }

        if (this.productosOffline.length > 0) {
            // console.log("hay productos")
            const coinciden: any[] = []

            Product.enviando = true
            this.productosOffline.forEach((prodOffline) => {
                if (
                    prodOffline.idProducto == codigoBuscar
                ) {
                    // console.log("coinciden ", prodOffline.idProducto, "..con..", codigoBuscar)
                    coinciden.push(prodOffline)
                }
            })
            setTimeout(() => {
                Product.enviando = false
                console.log("listo")
            }, 300);
            // console.log("coinciden", coinciden)
            callbackOk(coinciden)
        } else {
            // console.log("no hay productos")
            callbackWrong("No hay productos descargados para trabajar offline")
        }
    }


    async findByDescription({ description, codigoCliente }, callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase +
            "/api/ProductosTmp/GetProductosByDescripcion?descripcion=" + (description + "")
        if (codigoCliente) {
            url += "&codigoCliente=" + codigoCliente
        }
        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(response.data.productos, response);
        }, callbackWrong)
    }

    async findByDescriptionPaginado({
        description,
        codigoCliente,
        canPorPagina = 10,
        pagina = 1
    }, callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase +
            "/api/ProductosTmp/GetProductosByDescripcionPaginado?descripcion=" + (description + "")
        if (codigoCliente) {
            url += "&codigoCliente=" + codigoCliente
        }
        url += "&pageNumber=" + pagina
        url += "&rowPage=" + canPorPagina
        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")
        // console.log("findByDescriptionPaginado")

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(response.data.productos, response);
        }, (err) => {
            // buscamos offline
            const modo = ModelConfig.get("modoTrabajoConexion")
            console.log("modo", modo)

            if (
                modo == ModosTrabajoConexion.SOLO_OFFLINE
                || modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
                || modo == ModosTrabajoConexion.PREGUNTAR
            ) {
                console.log("buscar offline")
                this.buscarPorNombreOffline(description, (dataProds) => {
                    callbackOk(dataProds, {
                        data: {
                            cantidadRegistros: dataProds.length,
                            productos: dataProds
                        }
                    })
                }, callbackWrong)
            } else {
                callbackWrong(err)
            }
        })
    }

    async findPreVenta(data, callbackOk, callbackWrong) {
        if (Product.enviando) return

        Product.enviando = true
        const configs = ModelConfig.get()
        var url = configs.urlBase
        url += "/api/Ventas/PreVentaGET"

        if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")


        EndPoint.sendPost(url, data, (responseData, response) => {
            if (response.data.preventa.length > 0) {
                callbackOk(response.data.preventa[0].products, response.data);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
            Product.enviando = false
        }, (err) => {
            Product.enviando = false
            callbackWrong(err)
        })
    }

    async findByCodigo({ codigoProducto, codigoCliente }, callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase +
            "/api/ProductosTmp/GetProductosByCodigo?idproducto=" + codigoProducto
        if (codigoCliente) {
            url += "&codigoCliente=" + codigoCliente
        }

        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")


        const modo = ModelConfig.get("modoTrabajoConexion")
        console.log("modo", modo)

        if (
            modo == ModosTrabajoConexion.SOLO_OFFLINE
            || modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
        ) {
            console.log("buscar offline")
            this.buscarPorCodBarraOffline(codigoProducto, (dataProds) => {
                callbackOk(dataProds, {
                    data: {
                        cantidadRegistros: dataProds.length,
                        productos: dataProds
                    }
                })
            }, () => { })
        }

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(response.data.productos, response);
        }, (err) => {
            // buscamos offline
            const modo = ModelConfig.get("modoTrabajoConexion")
            console.log("modo", modo)

            if (
                modo == ModosTrabajoConexion.SOLO_OFFLINE
                || modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
            ) {
                console.log("buscar offline")
                this.buscarPorCodBarraOffline(codigoProducto, (dataProds) => {
                    callbackOk(dataProds, {
                        data: {
                            cantidadRegistros: dataProds.length,
                            productos: dataProds
                        }
                    })
                }, callbackWrong)
            } else {
                callbackWrong(err)
            }
        })
    }

    async findByCodigoBarras({ codigoProducto, codigoCliente }, callbackOk, callbackWrong, soloOnline = false) {
        console.log("findByCodigoBarras codigoProducto", codigoProducto + "")
        if (Product.enviando) {
            console.log("saliendo porque ya esta enviando")
            return
        }


        Product.enviando = true

        const configs = ModelConfig.get()
        var url = configs.urlBase +
            "/api/ProductosTmp/GetProductosByCodigoBarra?codbarra=" + codigoProducto
        if (codigoCliente) {
            url += "&codigoCliente=" + codigoCliente
        }

        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")


        if (!soloOnline) {
            Product.enviando = false
            const modo = ModelConfig.get("modoTrabajoConexion")
            console.log("modo", modo)

            if (
                modo == ModosTrabajoConexion.SOLO_OFFLINE
                || modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
            ) {
                console.log("buscar offline")
                var encontroOffline = false
                await this.buscarPorCodBarraOffline(codigoProducto, (dataProds) => {
                    callbackOk(dataProds, {
                        data: {
                            cantidadRegistros: dataProds.length,
                            productos: dataProds
                        }
                    })
                    // console.log("encontro cosas offline..salgo")
                    encontroOffline = true
                }, () => {
                    // console.log("falla busqueda offline")
                },)

                if (encontroOffline) {
                    console.log("return de find by codigo barras..encontro algo con ", codigoProducto)
                    return
                }

            }
        }

        console.log("sigo con busqueda con conexion")

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.productos, response);
            Product.enviando = false
        }, (err) => {
            // buscamos offline
            Product.enviando = false
            const modo = ModelConfig.get("modoTrabajoConexion")
            // console.log("modo", modo)

            if (
                modo == ModosTrabajoConexion.SOLO_OFFLINE
                || modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
            ) {
                console.log("buscar offline")
                this.buscarPorCodBarraOffline(codigoProducto, (dataProds) => {
                    callbackOk(dataProds, {
                        data: {
                            cantidadRegistros: dataProds.length,
                            productos: dataProds
                        }
                    })
                }, callbackWrong)
            } else {
                callbackWrong(err)
            }
        })
    }


    async getCategories(callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/NivelMercadoLogicos/GetAllCategorias"

        url += "?codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")


        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(response.data.categorias, response);
        }, callbackWrong)
    }


    async getSubCategories(categoriaId, callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=" + categoriaId

        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")
        const response = await axios.get(
            url
        );

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.subCategorias, response);
        }, callbackWrong)

    }


    async getFamiliaBySubCat({
        categoryId,
        subcategoryId
    }, callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?" +
            "CategoriaID=" + categoryId +
            "&SubCategoriaID=" + subcategoryId

        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")


        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.familias, response);
        }, callbackWrong)
    }

    async getSubFamilia({
        categoryId,
        subcategoryId,
        familyId
    }, callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?" +
            "CategoriaID=" + categoryId +
            "&SubCategoriaID=" + subcategoryId +
            "&FamiliaID=" + familyId

        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(response.data.subFamilias, response);
        }, callbackWrong)
    }

    async getProductsNML({
        catId,
        subcatId,
        famId,
        subFamId
    }, callbackOk, callbackWrong) {

        if (!catId) catId = 1
        if (!subcatId) subcatId = 1

        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/ProductosTmp/GetProductosByIdNML?idcategoria=" + catId
            + "&idsubcategoria=" + subcatId
            + "&idfamilia=" + famId
            + "&idsubfamilia=" + subFamId
        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.productos, response);
        }, callbackWrong)
    }

    async assignPrice(product, callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/ProductosTmp/UpdateProductoPrecio"

        if (!product.codigoSucursal) product.codigoSucursal = ModelConfig.get("sucursal")
        if (!product.puntoVenta) product.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPut(url, product, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)

    }

    async newProductFromCode(product, callbackOk, callbackWrong) {
        var url = ModelConfig.get("urlBase")
            + "/api/ProductosTmp/AddProductoNoEncontrado"

        if (!product.codigoSucursal) product.codigoSucursal = ModelConfig.get("sucursal")
        if (!product.puntoVenta) product.puntoVenta = ModelConfig.get("puntoVenta")

        const modo = ModelConfig.get("modoTrabajoConexion")
        // console.log("modo", modo)
        if (modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR) {
            var me = this
            var prods = me.sesion.cargar(1) || { productos: [] }
            var antes: any[] = prods.productos
            product.precioVenta = parseFloat(product.precioVenta)
            product.idProducto = product.codSacanner
            antes = [product].concat(antes)
            me.sesion.guardar({
                id: 1,
                productos: antes
            })
            me.productosOffline = antes

            ParaEnviar.agregar(url,
                {
                    ...product,
                    precioVenta: product.precioVenta + ""
                },
                "post",
                "nuevoProductoExpress"
            )

            setTimeout(() => {
                ParaEnviar.enviar()
            }, ParaEnviar.reintentoTiempoSincro * 1000);
            const response = {
                data: {
                    "statusCode": 201,
                    "descripcion": "Producto creado correctamente.",
                    "codigoProducto": product.codSacanner
                }
            }
            callbackOk(response.data, response)
        } else {
            EndPoint.sendPost(url, product, (responseData, response) => {
                callbackOk(responseData, response);
            }, callbackWrong)
        }
    }

    async getTipos(callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/ProductosTmp/GetProductoTipos"
        url += "?codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")



        EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.productoTipos, response);
        }, callbackWrong)
    }


    async getCriticosPaginate({
        pageNumber = 1,
        rowPage = 10
    }, callbackOk, callbackWrong) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase + "/api/ProductosTmp/GetProductosStockCriticoPaginados"
            url += "?pageNumber=" + pageNumber
            url += "&rowPage=" + rowPage

            const response = await axios.get(url);
            // console.log("API Response:", response.data);

            if (
                response.data.statusCode == 200
                || response.data.statusCode == 201

            ) {
                callbackOk(response.data.productos, response);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }

        } catch (error) {
            console.error("Error fetching products:", error);
            callbackWrong(error)
        }
    }

};



export default Product;