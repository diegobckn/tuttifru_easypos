import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';
import ModelSingleton from './ModelSingleton.ts';
import ParaEnviar from './ParaEnviar.ts';
import System from '../Helpers/System.ts';
import ModosTrabajoConexion from '../definitions/ModosConexion.ts';
import Shop from './Shop.ts';
import Client from './Client.ts';
import ProductFastSearch from './ProductFastSearch.ts';


class Product extends ModelSingleton {
    idProducto: number = 0
    description: string | null = ""
    nombre: string | null = ""

    sesionPrecios: any

    precioCosto: string | null | undefined;

    static enviando = false
    static instance: Product | null = null

    static enviandoPrecios = false

    productosOffline: Product[] = []

    constructor() {
        super()
        this.sesion = new StorageSesion("productos");
        this.sesionPrecios = new StorageSesion("preciosoffline");

    }

    static getInstance() {
        if (Product.instance == null) {
            Product.instance = new Product();
        }
        return Product.instance;
    }


    static logicaRedondeoUltimoDigito(valor: number) {
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
    static logicaInversaRedondeoUltimoDigito(valor: number) {
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


    agregarPrecioOffline(prod: any) {
        var sesionPrecios = Product.getInstance().sesionPrecios
        var valorSesion = []

        if (sesionPrecios.hasOne()) {
            valorSesion = sesionPrecios.cargar(1)
        }
        valorSesion.push(prod)
        sesionPrecios.guardar(valorSesion)
    }

    hayPreciosOffline() {
        var sesionPrecios = Product.getInstance().sesionPrecios
        return sesionPrecios.hasOne()
    }

    enviarPreciosOffline() {
        console.log("enviarPreciosOffline")
        var sesionPrecios = new StorageSesion("preciosoffline");
        var valorSesion: any = []

        if (!sesionPrecios.hasOne()) return
        if (Product.enviandoPrecios) return

        Product.enviandoPrecios = true
        valorSesion = sesionPrecios.cargar(1)

        const elPrimero = valorSesion[0]
        elPrimero.precioVenta = (elPrimero.precioVenta + "")
        Product.getInstance().updatePrecios(elPrimero, () => {
            valorSesion.splice(0, 1)
            if (valorSesion.length == 0) {
                sesionPrecios.truncate()
            } else {
                sesionPrecios.guardar(valorSesion)
            }
            Product.enviandoPrecios = false
        }, () => {
            Product.enviandoPrecios = false
        }, true)

    }

    updatePreciosOffline(prCambio: any) {
        prCambio.precioVenta = parseFloat(prCambio.precioVenta)
        prCambio.precioCosto = parseFloat(prCambio.precioCosto)

        var pr = Product.getInstance()
        var ses = pr.loadFromSesion()

        var copiaOff: any = []

        var founded = null
        var foundedIx = null
        ses.forEach((prodSes, ix) => {
            // console.log("prodSes", prodSes)
            if (prodSes.idProducto == prCambio.idProducto) {
                // console.log("encontrado!!!!!!!!!!!!!!!!!!!!!!!")
                founded = prodSes
                foundedIx = ix
                copiaOff.push(prCambio)
            } else {
                copiaOff.push(prodSes)
            }
        })
        // console.log("editedProduct", editedProduct)
        // console.log("founded", founded)
        // console.log("foundedIx", foundedIx)
        // console.log("copia", copia)
        pr.saveSesion(copiaOff)
        pr.loadFromSesion()

        ProductFastSearch.getInstance().cambioPrecio(prCambio)
    }

    async updatePrecios(data: any, callbackOk: any, callbackWrong: any, forzarOnline = false) {
        const configs = ModelConfig.get()
        var url = configs.urlBase +
            "/api/ProductosTmp/UpdateProductoPrecio"
        // url += "?idEmpresa=" + configs.idEmpresa
        url += "?idEmpresa=0"

        data.codigoSucursal = ModelConfig.get("sucursal")
        data.puntoVenta = ModelConfig.get("puntoVenta")

        data.codbarra = data.idProducto
        data.fechaIngreso = System.getInstance().getDateForServer()

        var me = this
        const hacerOffline = () => {
            me.agregarPrecioOffline(data)
            me.updatePreciosOffline(data)
        }

        EndPoint.sendPut(url, data, (a: any, e: any) => {
            callbackOk(a, e)
        }, (e: any) => {
            if (forzarOnline) {
                callbackWrong(e)
            } else {
                hacerOffline()
            }
        })



    }



    async getAll(callbackOk: any, callbackWrong: any) {
        var url = ModelConfig.get("urlBase") + "/api/ProductosTmp/GetProductos"

        EndPoint.sendGet(url, (responseData: any, response: any) => {
            callbackOk(responseData.productos, response);
        }, callbackWrong)
    }

    async getAllPaginate({
        pageNumber = 1,
        rowPage = 10,
        sucursal = 0
    }, callbackOk: any, callbackWrong: any) {
        try {
            const configs = ModelConfig.get()
            var url = configs.urlBase + "/api/ProductosTmp/GetProductosPaginados"
            url += "?pageNumber=" + pageNumber
            url += "&rowPage=" + rowPage
            url += "&codigoSucursal=" + sucursal
            // url += "&idEmpresa=" + configs.idEmpresa
            url += "&idEmpresa=0"

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

            const modo = ModelConfig.get("modoTrabajoConexion")
            if (
                modo == ModosTrabajoConexion.SOLO_OFFLINE
                || modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
                || modo == ModosTrabajoConexion.PREGUNTAR
            ) {
                console.log("buscar offline")
                this.buscarPorNombreOffline("***", (dataProds: any) => {
                    callbackOk(dataProds, {
                        data: {
                            cantidadRegistros: dataProds.length,
                            productos: dataProds
                        }
                    })
                }, callbackWrong, rowPage)
            } else {
                callbackWrong(error)
            }
        }
    }

    async almacenarParaOffline(
        callbackOk: any = () => { },
        callbackWrong: any = () => { }) {
        console.log("almacenarParaOffline")
        var me = this
        // console.log("me.sesion", me.sesion)
        this.getAll((prods: any, resp: any) => {
            me.saveSesion(prods)
            me.productosOffline = prods
            // console.log("obtenido ok")
            if (callbackOk) callbackOk(prods, resp)
        }, (er: string) => {
            // console.log("no se pudo obtener")
            if (callbackWrong) callbackWrong(er)
        })
    }

    saveSesion(prods: any) {
        this.sesion.guardar({
            id: 1,
            productos: prods
        })
    }

    loadFromSesion() {
        const hay = this.sesion.cargar(1)
        console.log("hay", hay)
        if (hay && hay.productos && hay.productos.length > 0) {
            console.log("actualizando la sesion con los productos", System.clone(hay.productos))
            Product.getInstance().productosOffline = System.clone(hay.productos)
            return this.productosOffline
        }
        return []
    }

    async buscarPorNombreOffline(
        nombreBuscar: any,
        callbackOk: any,
        callbackWrong: any,
        limit = 0
    ) {
        console.log("buscarPorNombreOffline")
        if (nombreBuscar.length < 3) {
            callbackOk([])
            return
        }
        console.log("buscarPorNombreOffline2")
        // console.log("Product.enviando", Product.enviando)
        if (Product.enviando) {
            console.log("enviando en true.. saliendo")
            return
        }

        // console.log("buscarPorNombreOffline")
        if (this.productosOffline.length < 1 && this.sesion.hasOne()) {
            this.loadFromSesion()
        }

        console.log("this.productosOffline", System.clone(this.productosOffline))
        if (this.productosOffline.length > 0) {
            // console.log("hay productos")
            const coinciden: any[] = []
            Product.enviando = true
            // console.log("Product.enviando = true")
            const buscarLower = nombreBuscar.toLowerCase()

            var va = 0
            this.productosOffline.forEach((prodOffline, ix) => {
                va++;
                if (limit != 0 && va > limit) return
                if (
                    prodOffline.nombre
                    &&
                    (
                        buscarLower == "***"
                        ||
                        prodOffline.nombre.toLowerCase().indexOf(buscarLower) > -1
                        // ||(prodOffline.idProducto + "") == buscarLower
                    )
                ) {
                    coinciden.push(prodOffline)
                    // } else {
                    // console.log("no coincide con la busqueda", prodOffline, "--con ix ", ix, "..busqueda:", buscarLower)
                }
            })
            Product.enviando = false
            // console.log("Product.enviando = false")
            console.log("coinciden", coinciden)
            callbackOk(coinciden)
        } else {
            // console.log("no hay productos")
            callbackWrong("No hay productos descargados para trabajar offline")
        }
    }

    async buscarPorCodBarraOffline(codigoBuscar: number, callbackOk: any, callbackWrong: any) {
        // console.log("buscarPorCodBarraOffline")
        // console.log("codigoBuscar", codigoBuscar)
        // console.log("Product.enviando", Product.enviando)
        if (Product.enviando) {
            // console.log("enviando en true.. saliendo")
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
            // console.log("Product.enviando", Product.enviando)
            this.productosOffline.forEach((prodOffline) => {
                if (
                    prodOffline.idProducto == codigoBuscar
                ) {
                    // console.log("coinciden ", prodOffline.idProducto, "..con..", codigoBuscar)
                    coinciden.push(prodOffline)
                }
            })
            Product.enviando = false
            // console.log("Product.enviando", Product.enviando)

            // console.log("coinciden", coinciden)
            callbackOk(coinciden)
        } else {
            // console.log("no hay productos")
            callbackWrong("No hay productos descargados para trabajar offline")
        }
    }


    async findByDescription({ description, codigoCliente }: any, callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = configs.urlBase +
            "/api/ProductosTmp/GetProductosByDescripcion?descripcion=" + (description + "")
        if (codigoCliente) {
            url += "&codigoCliente=" + codigoCliente
        }
        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        EndPoint.sendGet(url, (responseData: any, response: any) => {
            callbackOk(response.data.productos, response);
        }, callbackWrong)
    }

    async findByDescriptionPaginado({
        description,
        codigoCliente,
        canPorPagina = 10,
        pagina = 1
    }: any, callbackOk: any, callbackWrong: any) {
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

        const modo = ModelConfig.get("modoTrabajoConexion")

        const revisarOff = (err: any) => {
            // buscamos offline
            // console.log("modo", modo)

            if (
                modo == ModosTrabajoConexion.SOLO_OFFLINE
                || modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
                || modo == ModosTrabajoConexion.PREGUNTAR
            ) {
                // console.log("buscar offline")
                this.buscarPorNombreOffline(description, (dataProds: any) => {
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
        }

        if (modo == ModosTrabajoConexion.SOLO_OFFLINE) {
            // console.log("buscar offline")
            this.buscarPorNombreOffline(description, (dataProds: any) => {
                callbackOk(dataProds, {
                    data: {
                        cantidadRegistros: dataProds.length,
                        productos: dataProds
                    }
                })
            }, (err: any) => {
                EndPoint.sendGet(url, (responseData: any, response: any) => {
                    callbackOk(response.data.productos, response);
                }, revisarOff)
            })
        } else {
            EndPoint.sendGet(url, (responseData: any, response: any) => {
                callbackOk(response.data.productos, response);
            }, (err: any) => {
                revisarOff(err)
            })
        }
    }

    async findPreVenta(data: any, callbackOk: any, callbackWrong: any) {
        if (Product.enviando) return

        Product.enviando = true
        // console.log("Product.enviando", Product.enviando)

        const configs = ModelConfig.get()
        var url = configs.urlBase
        url += "/api/Ventas/PreVentaGET"

        if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")


        EndPoint.sendPost(url, data, (responseData: any, response: any) => {
            if (response.data.preventa.length > 0) {
                callbackOk(response.data.preventa[0].products, response.data);
            } else {
                callbackWrong("respuesta incorrecta del servidor")
            }
            Product.enviando = false
            // console.log("Product.enviando", Product.enviando)
        }, (err: any) => {
            Product.enviando = false
            // console.log("Product.enviando", Product.enviando)
            callbackWrong(err)
        })
    }

    async findByCodigoBarras(
        { codigoProducto, codigoCliente }: any,
        callbackOk: any,
        callbackWrong: any,
        soloOnline = false
    ) {

        // console.log("findByCodigoBarras codigoProducto", codigoProducto + "")
        // console.log("Product.enviando", Product.enviando)
        if (Product.enviando) {
            // console.log("saliendo porque ya esta enviando")
            return
        }


        Product.enviando = true
        // console.log("Product.enviando", Product.enviando)


        const configs = ModelConfig.get()
        var url = configs.urlBase +
            "/api/ProductosTmp/GetProductosByCodigoBarra?codbarra=" + codigoProducto

        if (!codigoCliente && Client.getInstance().sesion.hasOne()) {
            const clt = Client.getInstance().getFromSesion()
            // console.log("clt", clt)
            codigoCliente = clt.codigoCliente
        }
        if (codigoCliente) {
            url += "&codigoCliente=" + codigoCliente
        }

        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")


        if (!soloOnline) {
            Product.enviando = false
            // console.log("Product.enviando", Product.enviando)
            const modo = ModelConfig.get("modoTrabajoConexion")
            // console.log("modo", modo)

            if (
                modo == ModosTrabajoConexion.SOLO_OFFLINE
                || modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
            ) {
                // console.log("buscar offline")
                var encontroOffline = false
                await this.buscarPorCodBarraOffline(codigoProducto, (dataProds: any) => {
                    callbackOk(dataProds, {
                        data: {
                            cantidadRegistros: dataProds.length,
                            productos: dataProds
                        }
                    })
                    // console.log("encontro cosas offline..salgo")
                    // console.log("devolviendo", dataProds, {
                    //     data: {
                    //         cantidadRegistros: dataProds.length,
                    //         productos: dataProds
                    //     }
                    // })
                    encontroOffline = true
                }, () => {
                    // console.log("falla busqueda offline")
                },)

                if (encontroOffline) {
                    // console.log("return de find by codigo barras..encontro algo con ", codigoProducto)
                    return
                }

            }
        }

        // console.log("sigo con busqueda con conexion")

        EndPoint.sendGet(url, (responseData: any, response: any) => {
            callbackOk(responseData.productos, response);
            Product.enviando = false
            // console.log("Product.enviando", Product.enviando)
        }, (err: any) => {
            // buscamos offline
            Product.enviando = false
            // console.log("Product.enviando", Product.enviando)
            const modo = ModelConfig.get("modoTrabajoConexion")
            // console.log("modo", modo)

            if (
                modo == ModosTrabajoConexion.SOLO_OFFLINE
                || modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
            ) {
                // console.log("buscar offline")
                this.buscarPorCodBarraOffline(codigoProducto, (dataProds: any) => {
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


    async getCategories(callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/NivelMercadoLogicos/GetAllCategorias"

        url += "?codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")


        EndPoint.sendGet(url, (responseData: any, response: any) => {
            callbackOk(response.data.categorias, response);
        }, callbackWrong)
    }


    async getSubCategories(categoriaId: number, callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=" + categoriaId

        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")
        const response = await axios.get(
            url
        );

        EndPoint.sendGet(url, (responseData: any, response: any) => {
            callbackOk(responseData.subCategorias, response);
        }, callbackWrong)

    }


    async getFamiliaBySubCat({
        categoryId,
        subcategoryId
    }: any, callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?" +
            "CategoriaID=" + categoryId +
            "&SubCategoriaID=" + subcategoryId

        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")


        EndPoint.sendGet(url, (responseData: any, response: any) => {
            callbackOk(responseData.familias, response);
        }, callbackWrong)
    }

    async getSubFamilia({
        categoryId,
        subcategoryId,
        familyId
    }: any, callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?" +
            "CategoriaID=" + categoryId +
            "&SubCategoriaID=" + subcategoryId +
            "&FamiliaID=" + familyId

        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        EndPoint.sendGet(url, (responseData: any, response: any) => {
            callbackOk(response.data.subFamilias, response);
        }, callbackWrong)
    }

    async getProductsNML({
        catId,
        subcatId,
        famId,
        subFamId
    }: any, callbackOk: any, callbackWrong: any) {

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


        const modo = ModelConfig.get("modoTrabajoConexion")
        // console.log("modo", modo)

        if (
            modo == ModosTrabajoConexion.SOLO_OFFLINE
            || modo == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
        ) {


            if (this.productosOffline.length > 0) {
                // console.log("hay productos")
                const coinciden: any[] = []

                Product.enviando = true
                // console.log("Product.enviando", Product.enviando)
                this.productosOffline.forEach((prodOffline: any) => {
                    if (
                        prodOffline.idCategoria == catId
                        && prodOffline.idFamilia == famId
                        && prodOffline.idSubCategoria == subcatId
                        && prodOffline.idSubFamilia == subFamId
                    ) {
                        // console.log("coinciden ", prodOffline.idProducto, "..con..", codigoBuscar)
                        coinciden.push(prodOffline)
                    }
                })
                setTimeout(() => {
                    Product.enviando = false
                    // console.log("Product.enviando", Product.enviando)
                    // console.log("listo")
                }, 300);
                // console.log("coinciden", coinciden)
                callbackOk(coinciden)
            } else {
                // console.log("no hay productos")
                callbackWrong("No hay productos descargados para trabajar offline")
            }
        } else {

            EndPoint.sendGet(url, (responseData: any, response: any) => {
                callbackOk(responseData.productos, response);
            }, callbackWrong)
        }
    }

    async assignPrice(product: any, callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/ProductosTmp/UpdateProductoPrecio"

        if (!product.codigoSucursal) product.codigoSucursal = ModelConfig.get("sucursal")
        if (!product.puntoVenta) product.puntoVenta = ModelConfig.get("puntoVenta")
        if (!product.codbarra && product.idProducto) product.codbarra = product.idProducto

        EndPoint.sendPut(url, product, (responseData: any, response: any) => {
            callbackOk(responseData, response);
        }, callbackWrong)

    }

    async newProductFromCode(product: any, callbackOk: any, callbackWrong: any) {
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
                ParaEnviar.TIPO.NUEVO_PRODUCTO_EXPRESS
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
            EndPoint.sendPost(url, product, (responseData: any, response: any) => {
                callbackOk(responseData, response);
            }, callbackWrong)
        }
    }

    async getTipos(callbackOk: any, callbackWrong: any) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
            + "/api/ProductosTmp/GetProductoTipos"
        url += "?codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")



        EndPoint.sendGet(url, (responseData: any, response: any) => {
            callbackOk(responseData.productoTipos, response);
        }, callbackWrong)
    }


    async getCriticosPaginate({
        pageNumber = 1,
        rowPage = 10
    }, callbackOk: any, callbackWrong: any) {
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
            // console.error("Error fetching products:", error);
            callbackWrong(error)
        }
    }

    static nombreImagen(producto: any, enElServidor = true, evitarCache = true) {
        // console.log("nombreImagen de ", producto)
        var nombreImg = ""
        //revisamos si es un producto, categoria, subcategoria, familia o subfamilia
        // segun que propiedad tiene
        if (producto.nombre) {
            nombreImg = (producto.nombre + ".jpg").toLowerCase()
        } else if (producto.descripcion) {
            nombreImg = (producto.descripcion + ".jpg").toLowerCase()
        }

        if (enElServidor) {
            nombreImg = ModelConfig.get("urlBase") + "/imagenes/" + nombreImg
            nombreImg = nombreImg.replace("/api/", "/")
        }

        if (evitarCache) {
            var dt = new Date()
            nombreImg = nombreImg + "?v=" + dt.getTime()
        }
        return nombreImg
    }

    static async cargarImagen(product: any, callbackOk: any) {
        var url = this.nombreImagen(product, true, true)

        try {
            const response = await axios.get(url);
            // console.log("response de cargarImagen", response)
            callbackOk(url)
        } catch (err) {
            callbackOk(BaseConfig.sinImagen)
        } finally {
        }
        // EndPoint.sendGet(url, (responseData: any, response: any) => {
        //     callbackOk(BaseConfig.productoSinImagen)
        // }, (err: any) => {
        //     callbackOk(BaseConfig.productoSinImagen)
        // })
    }

    static async getIngredientesExternos(prod: any, callbackOk: any, callbackWrong: any) {
        // console.log("buscando extras para ", prod)
        var comSes = new StorageSesion("comercio")
        if (!comSes.hasOne()) {
            // console.log("no tiene configurado el comercio en el back")
            callbackWrong("no tiene configurado el comercio en el back")
            return false
        }

        const infoComercio = comSes.cargar(1)

        Shop.getProperty("producto", prod.idProducto, "ingredientes", infoComercio, (resp: any) => {
            // console.log("respuesta del servidor", resp)
            if (resp.info != "") {
                callbackOk(JSON.parse(resp.info))
            } else if (resp.info == "[object Object]") {
                callbackWrong("problemas de formato")
            } else {
                callbackWrong("sin datos")
            }
        }, (er: string) => {
            callbackWrong(er)
        })

    }

    static async getAgregadosExternos(prod: any, callbackOk: any, callbackWrong: any) {
        // console.log("buscando extras para ", prod)
        var comSes = new StorageSesion("comercio")
        if (!comSes.hasOne()) {
            // console.log("no tiene configurado el comercio en el back")
            callbackWrong("no tiene configurado el comercio en el back")
            return false
        }

        const infoComercio = comSes.cargar(1)

        Shop.getProperty("producto",
            prod.idCategoria + "-" +
            prod.idSubCategoria + "-"
            + prod.idFamilia + "-"
            + prod.idSubFamilia,
            "agregados",
            infoComercio,
            (resp: any) => {
                // console.log("respuesta del servidor", resp)
                if (resp.info != "") {
                    callbackOk(JSON.parse(resp.info))
                } else if (resp.info == "[object Object]") {
                    callbackWrong("problemas de formato")
                } else {
                    callbackWrong("sin datos")
                }
            },
            (er: string) => {
                // console.log("cae por error")
                callbackWrong(er)
            }
        )

    }




    // LOGICA PARA PRECIOS DEL BACKOFFICE
    static calcularImpuestos(producto: any) {
        var impIva = producto.impuesto.toLowerCase()

        impIva = impIva.replace("iva", "")
        impIva = impIva.replace("%", "")
        impIva = impIva.trim()
        impIva = parseInt(impIva)

        return impIva
    }

    static iniciarLogicaPrecios(product: any) {
        const margenConfig = ModelConfig.get("porcentajeMargen")

        if (!product.gananciaPorcentaje) {
            if (product.precioNeto > 0 && product.precioCosto > 0) {
                product.gananciaPorcentaje = this.getGanPorByCostoYNeto(product.precioCosto, product.precioNeto)
            } else {
                product.gananciaPorcentaje = margenConfig
            }
        }

        if (!product.ivaPorcentaje) {
            product.ivaPorcentaje = 19
        }

        if (!product.precioNeto && product.precioCosto > 0) {
            product.precioNeto = Product.getNetoByCostoGanPor(product.precioCosto, product.gananciaPorcentaje)
        }

        if (!product.gananciaValor && product.precioNeto > 0 && product.precioCosto > 0) {
            product.gananciaValor = product.precioNeto - product.precioCosto
        }

        if (!product.ivaValor && product.precioNeto > 0 && product.precioVenta > 0) {
            product.ivaValor = product.precioVenta - product.precioNeto
        }

        if (!product.precioCosto && !product.precioVenta) {
            product.ivaValor = 0
            product.gananciaValor = 0
        }

        return product
    }

    //direccion indica si se calcula para el lado del costo o del precio final
    static logicaPrecios(product: any, direccion = "final") {
        // console.log("logicaPrecios " + direccion + " para ")
        // console.log("entra con:",System.clone(product))
        const margenConfig = ModelConfig.get("porcentajeMargen")

        if (!product.gananciaPorcentaje) product.gananciaPorcentaje = margenConfig
        if (product.ivaPorcentaje) product.ivaPorcentaje = ModelConfig.get().iva
        // if(product.precioVenta <= 0 && product.precioCosto > 0){
        if (direccion == 'final') {
            const sumGan = (product.precioCosto) * ((product.gananciaPorcentaje) / 100)
            const neto = parseFloat(product.precioCosto) + sumGan
            const sumIva = (neto) * ((product.ivaPorcentaje) / 100)
            const final = ((neto + sumIva))

            product.precioVenta = this.redondeo_precioVenta(final)
            product.precioNeto = this.redondeo_precioNeto(neto)
            product.gananciaValor = this.redondeo_gananciaValor(sumGan)
            product.ivaValor = this.redondeo_ivaValor(sumIva)
        } else if (direccion == "costo") {
            const neto = parseFloat(product.precioVenta) /
                (1 + (parseInt(product.ivaPorcentaje) / 100))
            const costo = neto / (1 + parseInt(product.gananciaPorcentaje) / 100)
            var sumGan = neto - costo
            var sumIva = product.precioVenta - neto

            product.precioCosto = this.redondeo_precioCosto(costo)
            product.precioNeto = this.redondeo_precioNeto(neto)
            product.gananciaValor = this.redondeo_gananciaValor(sumGan)
            product.ivaValor = this.redondeo_ivaValor(sumIva)
        }
        // console.log("sale con:",System.clone(product))
        return product
    }

    static calcularMargen(product: any) {
        const neto = parseFloat(product.precioVenta) / (1 + (parseInt(product.ivaPorcentaje) / 100))
        const sumGan = neto - product.precioCosto
        const porMar = ((neto - product.precioCosto) * 100) / product.precioCosto

        var sumIva = product.precioVenta - neto
        product.ivaValor = this.redondeo_ivaValor(sumIva)
        product.gananciaPorcentaje = this.redondeo_gananciaPorcentaje(porMar)
        product.precioNeto = this.redondeo_precioNeto(neto)
        product.gananciaValor = this.redondeo_gananciaValor(sumGan)

        return product
    }

    static getNetoByCostoGanPor(costo: number, gananciaPorcentaje: number) {
        const sumGan = (costo) * ((gananciaPorcentaje) / 100)
        return this.redondeo_precioNeto(parseFloat(costo + "") + sumGan)
    }

    static getGanPorByCostoYNeto(costo: number, neto: number) {
        return this.redondeo_gananciaPorcentaje(((neto - costo) * 100) / costo)
    }

    // REDONDEOS
    static redondeo_precioCosto(precio: number) {
        return parseInt(parseFloat(precio + "").toFixed(0))
    }

    static redondeo_gananciaPorcentaje(precio: number) {
        return parseInt(parseFloat(precio + "").toFixed(0))
    }

    static redondeo_gananciaValor(precio: number) {
        return parseInt(parseFloat(precio + "").toFixed(0))
    }

    static redondeo_ivaPorcentaje(precio: number) {
        return parseInt(parseFloat(precio + "").toFixed(0))
    }

    static redondeo_ivaValor(precio: number) {
        return parseInt(parseFloat(precio + "").toFixed(0))
    }

    static redondeo_precioNeto(precio: number) {
        return parseInt(parseFloat(precio + "").toFixed(0))
    }

    static redondeo_precioVenta(precio: number) {
        return parseInt(parseFloat(precio + "").toFixed(0))
    }
    // FIN LOGICA PARA PRECIOS DEL BACKOFFICE

};



export default Product;