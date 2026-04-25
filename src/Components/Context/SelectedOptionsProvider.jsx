/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import ModelConfig from "../../Models/ModelConfig";
import User from "../../Models/User";
import Sale from "../../Models/Sale";
import ModelSales from "../../Models/Sales";
import ProductSold from "../../Models/ProductSold";
import LoadingDialog from "../Dialogs/LoadingDialog";
import AsignarPrecio from "../ScreenDialog/AsignarPrecio";

import TecladoAlfaNumerico from "../Teclados/TecladoAlfaNumerico";

import QRCode from "react-qr-code";
import ReactDOM from "react-dom/server";

import {
  Typography,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import Product from "../../Models/Product";
import System from "../../Helpers/System";
import NuevoProductoExpress from "../ScreenDialog/NuevoProductoExpress";
import AsignarPeso from "../ScreenDialog/AsignarPeso";
import Confirm from "../Dialogs/Confirm";
import Client from "../../Models/Client";
import Alert from "../Dialogs/Alert";
import UserEvent from "../../Models/UserEvent";
import ScreenDialogBuscarCliente from "../ScreenDialog/BuscarCliente";
import Log from "../../Models/Log";
import SalesOffline from "../../Models/SalesOffline";
import Model from "../../Models/Model";

import { ProviderModalesContext } from "../Context/ProviderModales";
import Ofertas from "../../Models/Ofertas";
import StorageSesion from "../../Helpers/StorageSesion";
import Conexion from "../../Models/Conexion";
import BalanzaDigi from "../../Models/BalanzaDigi";
import FocosPrincipales from "../../definitions/FocosPrincipales";

export const SelectedOptionsContext = React.createContext();

export const SelectedOptionsProvider = ({ children }) => {
  //init configs values


  const {
    showAsignarPeso,
    setShowAsignarPeso,
    productoSinPeso,
    setProductoSinPeso,
    setonAsignWeight,
    onConfirmAsignWeight,

    setShowNuevoExpress,
    setCodigoNuevoExpress,
    setHandleGuardarNuevoProducto,
    codigoNuevoExpress,

    setShowConfirmDialog,
    textConfirm,
    setTextConfirm,
    setHandleConfirm,
    setHandleNotConfirm,

    setOpenSnackbar,
    snackMessage,
    setSnackMessage,


    setShowAlert,
    setTitleMsg,
    textMsg,
    setTextMsg,

    showDialogSelectClientModal,
    setShowDialogSelectClientModal,
    setClienteModal,
    clienteModal,
    setAskLastSaleModal,
    setAddToSalesDataModal,

  } = useContext(ProviderModalesContext);


  const [sales, setSales] = useState(new ModelSales())
  const [ofertas, setOfertas] = useState([])
  const [ultimoVuelto, setUltimoVuelto] = useState(null)
  const [descuentos, setDescuentos] = useState(0)



  const [showDialogSelectClient, setShowDialogSelectClient] = useState(false)
  const [cliente, setCliente] = useState(null)
  const [clienteValidoFactura, setClienteValidoFactura] = useState(null)
  const [askLastSale, setAskLastSale] = useState(true)

  const [mayusTecladoProductos, setMayusTecladoProductos] = useState(false);
  const [verBotonesPanel, setVerBotonesPanel] = useState(true);
  const [darFocoEnLeerDigi, setDarFocoEnLeerDigi] = useState(false);

  const searchInputRef = useRef(null)

  const focusSearchInput = (inputRef) => {
    console.log("focusSearchInput")

    const fpVal = ModelConfig.get("darFocoPrincipalEn")
    const fp = System.getPropertyByValue(fpVal, FocosPrincipales)
    console.log("foco principal en", fp)

    if (ModelConfig.get("trabajarConBalanzaDigi")) {
      // console.log("darFocoEnLeerDigi", darFocoEnLeerDigi)
      if (fpVal == FocosPrincipales.LEER_TICKET_DIGI) {
        if (darFocoEnLeerDigi) {
          setDarFocoEnLeerDigi(false)
          // console.log("setDarFocoEnLeerDigi a", false)
          setTimeout(() => {
            setDarFocoEnLeerDigi(true)
            // console.log("setDarFocoEnLeerDigi a", true)
          }, 300);
          return
        }
        setDarFocoEnLeerDigi(true)
        // console.log("setDarFocoEnLeerDigi a", true)
        return
      }
    }
    if (fpVal == FocosPrincipales.INPUT_BUSCAR_PRODUCTOS) {
      console.log("en input buscar", inputRef)
      System.darFocoEnBuscar(inputRef)
    }
  }

  //set general dialog variables
  const [showLoadingDialog, setShowLoadingDialogx] = useState(false)
  const [loadingDialogText, setLoadingDialogText] = useState("")

  const [showPrintButton, setShowPrintButton] = useState(ModelConfig.get("showPrintButton"))

  const [suspenderYRecuperar, setSuspenderYRecuperar] = useState(ModelConfig.get("suspenderYRecuperar"));

  const [productInfo, setProductInfo] = useState(/* initial value */);

  const [description, setDescription] = useState(/* initial value */);
  const [precioData, setPrecioData] = useState(null);
  const [ventaData, setVentaData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [salesDataTimestamp, setSalesDataTimestamp] = useState(Date.now());

  const [selectedUser, setSelectedUser] = useState([]);

  const [searchResults, setSearchResults] = useState([]);
  const [textSearchProducts, setTextSearchProducts] = useState("");//variable del cuadro de busqueda
  const [buscarCodigoProducto, setBuscarCodigoProducto] = useState(false)
  const [showTecladoBuscar, setShowTecladoBuscar] = useState(false);

  const [productoSinPrecio, setProductoSinPrecio] = useState(null)
  const [showAsignarPrecio, setShowAsignarPrecio] = useState(false)

  const sePuedeVenderPrecio0 = ModelConfig.get("permitirVentaPrecio0")

  const [modoAvion, setModoAvion] = useState(!ModelConfig.get("emitirBoleta"))

  const [solicitaRetiro, setSolicitaRetiro] = useState("");
  const [numeroAtencion, setNumeroAtencion] = useState(0);
  const [listSalesOffline, setListSalesOffline] = useState(SalesOffline.getInstance().loadFromSesion());

  const [ultimoFolioPreventa, setUltimoFolioPreventa] = useState("");

  const [tieneInternet, setTieneInternet] = useState(null);
  // const [conexionesOkInternet, setConexionesOkInternet] = useState(0);
  // const [conexionesMalInternet, setConexionesMalInternet] = useState(0);

  //mostrar un dialog con la animacion del cargando
  const setShowLoadingDialog = (value) => {
    setShowLoadingDialogx(value);
  }

  const checkInternet = () => {
    // console.log("checkInternet")

    if (window.location.href.indexOf("espejo") === -1) {
      Conexion.getFromServer(() => {
        setTieneInternet(true)

        // console.log("getCorrects", Conexion.getCorrects())
        // setConexionesOkInternet(Conexion.getCorrects())
        // setConexionesOkInternet((prev) => { return prev + 1 })
      }, () => {
        setTieneInternet(false)
        // setConexionesOkInternet(Conexion.getInCorrects())
        //     setConexionesMalInternet((prev) => { return prev + 1 })
      })
    }
  }

  const setShowLoadingDialogWithTitle = (textToShow = "", value) => {
    setLoadingDialogText(textToShow)
    setShowLoadingDialogx(value);
  }

  const showLoading = (textToShow = "") => {
    setLoadingDialogText(textToShow)
    setShowLoadingDialogx(true);
  }

  //ocultar el dialog en x milisegundos
  const hideLoadingDialog = (timeOut = 200) => {
    setTimeout(function () {
      setShowLoadingDialog(false);
    }, timeOut);
  }

  const hideLoading = (timeOut = 200) => {
    setTimeout(function () {
      setShowLoadingDialog(false);
    }, timeOut);
  }

  useEffect(() => {
    if (textConfirm != "") {
      setShowConfirmDialog(true)
    }
  }, [textConfirm])

  const showConfirm = (text, callbackYes, callbackNo = () => { }) => {
    setHandleConfirm(() => callbackYes)
    const callbackNox = () => {
      setTextConfirm("")
      setShowConfirmDialog(false)
      callbackNo()
    }
    setHandleNotConfirm(() => callbackNox)
    setTextConfirm(text)
  }

  const [actionPostAcceptAlert, setActionPostAcceptAlert] = useState(() => { })

  useEffect(() => {
    if (textMsg != "") {
      setShowAlert(true)
    } else {
      setShowAlert(false)
      if (actionPostAcceptAlert) actionPostAcceptAlert()
    }
  }, [textMsg])

  const showAlert = (title, text, actionPost = () => { }) => {
    if (text) {
      setTitleMsg(title)
      setTextMsg(text)
    } else {
      setTitleMsg("")
      setTextMsg(title)
    }

    setActionPostAcceptAlert(() => actionPost)
  }

  const updateSearchResults = (results) => {
    setSearchResults(results);
  };

  const [userData, setUserData] = useState(null);
  const updateUserData = (data) => {
    setUserData(User.getInstance().saveInSesion(data));
  };

  const getUserData = () => {
    if (User.getInstance().sesion.hasOne())
      setUserData(User.getInstance().getFromSesion());
  };



  // const cargarOfertasCorrectas = () => {
  // console.log("cargarOfertasCorrectas")
  //   Ofertas.cargarSoloCorrectas((ofers) => {
  //     setOfertas(ofers)
  //   })
  // }


  useEffect(() => {

    if (productoSinPeso) {
      const realOnAsignWeight = (newPeso) => {
        // console.log("realOnAsignWeight")
        // console.log("realOnAsignWeight..newPeso", newPeso)
        // console.log("realOnAsignWeight..productoSinPeso", productoSinPeso)
        addToSalesData(productoSinPeso, newPeso)
        setProductoSinPeso(null)
        setShowAsignarPeso(false)
      }
      // console.log("setonAsignWeight", realOnAsignWeight)
      setonAsignWeight((x) => realOnAsignWeight)
      setShowAsignarPeso(true)
      // setHandleConfirm(() => callbackYes)
    } else {
      setShowAsignarPeso(false)
    }
  }, [productoSinPeso]);

  useEffect(() => {
    // console.log("cambio salesData", salesData)
    setGrandTotal(sales.getTotal() + 0);
    if (tieneInternet === null) {
      checkInternet()
      setInterval(checkInternet, 10 * 1000);
    }
  }, [salesData]);

  useEffect(() => {
    setSalesDataTimestamp(Date.now());
  }, [salesData, grandTotal]); // Add other dependencies as needed

  useEffect(() => {
    if (
      salesData.length == 0
      && sales.sesionProducts.hasOne()
      && window.location.href.indexOf("espejo") === -1
      && sales.sesionProducts.getFirst().length > 0
    ) {
      setSalesData(sales.loadFromSesion())
    }
  }, [salesData]);

  useEffect(() => {
    const clientStatic = Client.getInstance()
    if (clientStatic.sesion.hasOne()) {
      setCliente(clientStatic.getFromSesion())
    }

    setDarFocoEnLeerDigi(ModelConfig.get("darFocoEnLeerDigi"))
    // cargarOfertasCorrectas()
  }, []);

  useEffect(() => {
    // console.log("cliente", cliente)
    setClienteModal(null)
    if (cliente) {
      if (cliente.validacionFactura && cliente.validacionFactura.esValidoFactura) {
        setClienteValidoFactura(true)
      } else {
        setClienteValidoFactura(false)
      }
    }
  }, [cliente])

  useEffect(() => {
    if (!cliente && clienteModal) {
      setCliente(clienteModal)
      if (clienteModal.validacionFactura && clienteModal.validacionFactura.esValidoFactura) {
        setClienteValidoFactura(true)
      } else {
        setClienteValidoFactura(false)
      }
    }
  }, [clienteModal])

  useEffect(() => {
    setAskLastSaleModal(askLastSale)
  }, [askLastSale])

  useEffect(() => {
    if (showDialogSelectClient != undefined && showDialogSelectClient != setShowDialogSelectClientModal) {
      setTimeout(() => {
        setShowDialogSelectClientModal(showDialogSelectClient)
      }, 300);
    }
  }, [showDialogSelectClient])

  useEffect(() => {
    if (showDialogSelectClientModal != undefined && showDialogSelectClient != showDialogSelectClientModal) {
      setTimeout(() => {
        setShowDialogSelectClient(showDialogSelectClientModal)
      }, 300);
    }
  }, [showDialogSelectClientModal])


  useEffect(() => {
    if (snackMessage != "") {
      setOpenSnackbar(true)
    } else {
      setOpenSnackbar(false)
    }
  }, [snackMessage])

  const showMessage = (message) => {
    if (snackMessage == message) {
      setTimeout(() => {
        setSnackMessage("")
        setTimeout(() => {
          setSnackMessage(message)
        }, 300);
      }, 300);
    }
    setSnackMessage(message)
  }


  const addToSalesData = (product, quantity) => {
    // console.log("")
    // console.log("")
    // console.log("")
    // console.log("")
    // console.log("addToSalesData", product, "..cantidad", quantity)
    if (!quantity && product.cantidad) quantity = product.cantidad

    if (!quantity && ProductSold.esPesable(product)) {
      // console.log("es pesable..a pesar producto", product)
      setProductoSinPeso(product)
      return
    }
    if (!quantity) quantity = 1

    if (solicitaRetiro !== '') {
      showAlert(solicitaRetiro)
    }


    if (parseFloat(product.precioVenta) <= 0 && !sePuedeVenderPrecio0) {
      // console.log("sin precio..a poner precio..producto", product)
      setShowAsignarPrecio(true)
      setProductoSinPrecio(product)
      return
    }

    var totalAntesPrecio = sales.getTotal() + 0
    var totalAntesCantidad = sales.getTotalCantidad() + 0

    sales.addProduct(product, quantity);

    var totalDespuesPrecio = sales.getTotal() + 0
    var totalDespuesCantidad = sales.getTotalCantidad() + 0

    // console.log("totalAntesPrecio", totalAntesPrecio)
    // console.log("totalAntesCantidad", totalAntesCantidad)

    // console.log("totalDespuesPrecio", totalDespuesPrecio)
    // console.log("totalDespuesCantidad", totalDespuesCantidad)
    // if (
    //   totalAntesPrecio != totalDespuesPrecio
    //   || totalAntesCantidad != totalDespuesCantidad
    // )
    showMessage("Agregado correctamente")
    setGrandTotal(sales.getTotal())
    setSalesData(sales.products)

    setUltimoVuelto(null)

    UserEvent.send({
      name: "agrega producto " + product.nombre,
    })

    focusSearchInput(searchInputRef)
  };

  useEffect(() => {
    // setAddToSalesDataModal((a, b, c, d, e, f) => {
    //   return addToSalesData
    // })
  }, [])


  const replaceToSalesData = (keyProductRemove, productPut) => {
    sales.replaceProduct(keyProductRemove, productPut);
    setSalesData(sales.products)
    setGrandTotal(sales.getTotal())
  }



  const onAsignPrice = (newPrice) => {
    productoSinPrecio.fechaIngreso = System.getInstance().getDateForServer()
    productoSinPrecio.precioVenta = newPrice

    Product.getInstance().assignPrice(productoSinPrecio, (response) => {
      addToSalesData(productoSinPrecio)
      setProductoSinPrecio(null)
      setShowAsignarPrecio(false)
      showMessage(response.descripcion)
    }, () => {
      showMessage("No se pudo actualizar el precio")
    })
  }

  useEffect(() => {
    if (codigoNuevoExpress != 0) {
      setHandleGuardarNuevoProducto((x) => handleGuardarNuevoProducto)
      setShowNuevoExpress(true)
    } else {
      setShowNuevoExpress(false)
    }
  }, [codigoNuevoExpress])

  const addNewProductFromCode = (code) => {
    if (code < 0) code = code * -1
    setCodigoNuevoExpress(code)
  }

  const handleGuardarNuevoProducto = (nuevoProducto) => {
    // console.log("nuevoProducto", nuevoProducto)
    nuevoProducto.fechaIngreso = System.getInstance().getDateForServer()

    Product.getInstance().newProductFromCode(nuevoProducto, (serverInfo) => {
      // console.log(serverInfo)
      nuevoProducto.idProducto = (nuevoProducto.codSacanner)
      addToSalesData(nuevoProducto)
      setCodigoNuevoExpress(0)
      showMessage(serverInfo.descripcion)
    }, () => {
      showMessage("No se pudo realizar")
    })
  }

  const clearSessionData = () => {
    User.getInstance().sesion.truncate();
    setUserData(null)
    setCliente(null)
    Client.getInstance().sesion.truncate();
    clearSalesData()
  };

  const clearSalesData = () => {
    // console.log("clearSalesData...", System.clone(sales))
    if (sales.products.length > 0) {
      // console.log("revisando si tiene vale digi")
      sales.products.forEach((saledItem) => {
        if (saledItem.nroValeDigi) {
          var bdigi = new BalanzaDigi()
          bdigi.quitarUsado(saledItem.nroValeDigi)
          // console.log(saledItem, "tiene vale digi")
        } else {
          // console.log(saledItem, "no tiene vale digi")
        }
      })
    }
    setSalesData([]);
    sales.products = [];
    sales.sesionProducts.truncate()
    setDescuentos(0)
    setGrandTotal(0);
    setTimeout(() => {
      setSalesDataTimestamp(Date.now());
    }, 400);
  };

  const calculateTotalPrice = (quantity, price) => {
    var pr = new ProductSold();
    pr.cantidad = quantity;
    pr.precioVenta = price;
    // console.log("calculateTotalPrice..");
    // console.log(pr.getSubTotal());
    return pr.getSubTotal();
  };


  const removeFromSalesData = (index) => {
    UserEvent.send({
      name: "quita producto " + sales.products[index].description,
    })

    const hayOtro = (nroVale) => {
      // console.log("hayOtro con ", nroVale, ".. con el index", index)
      if (sales.products.length > 1) {
        var alguno = false
        // console.log("sales.products", System.clone(sales.products))
        sales.products.forEach((prodSaled, ix) => {
          if (ix != index) {
            // console.log("es distinto index..", ix, "..con..", index)
            if (prodSaled.nroValeDigi) {
              const valesArr = prodSaled.nroValeDigi.split(",")
              if (valesArr.indexOf(nroVale) > -1) {
                // console.log("el vale ", nroVale, " esta en", valesArr)
                alguno = true
              } else {
                // console.log("no esta ", nroVale, "..en", valesArr)
              }
            }
          } else {
            // console.log("es el mismo index..", ix, "..con..", index)
          }
        })
        return alguno
      } else {
        return false
      }
    }

    if (sales.products[index].nroValeDigi) {
      var bdigi = new BalanzaDigi()


      const valesArr = (sales.products[index].nroValeDigi + "").split(",")
      valesArr.forEach((vale) => {
        if (!hayOtro(vale)) {
          bdigi.quitarUsado(vale)
        }
      })
    }
    setSalesData(sales.removeFromIndex(index));
    focusSearchInput(searchInputRef)
  };


  const incrementQuantity = (index, productInfo) => {
    setSalesData(sales.incrementQuantityByIndex(index, 1));
  };

  const decrementQuantity = (index, productInfo) => {
    sales.products = sales.decrementQuantityByIndex(index, 1)
    sales.actualizarSesion()
    sales.loadFromSesion()
    setSalesData(sales.products)
    setGrandTotal(sales.getTotal())

  };

  const createQrString = (value, styles = { height: "100px", width: "100px" }) => {
    return ReactDOM.renderToString(<QRCode
      size={256}
      style={styles}
      value={value}
    />)
  }

  const GeneralElements = () => {
    return (
      <>
        <TecladoAlfaNumerico
          mayus={mayusTecladoProductos}
          setMayus={setMayusTecladoProductos}
          onEnter={() => {
            setBuscarCodigoProducto(true)
          }}
          showFlag={showTecladoBuscar}
          varChanger={setTextSearchProducts}
          varValue={textSearchProducts}
        />
        <div onClick={() => {
          setShowTecladoBuscar(false)
          setOpenSnackbar(false)
        }}
          style={{
            width: "100%",
            height: "100%",
            display: (showTecladoBuscar ? "block" : "none"),
            position: "fixed",

            top: 0,
            left: 0
          }}
        ></div>

        <LoadingDialog openDialog={showLoadingDialog} text={loadingDialogText} />
        <AsignarPrecio
          openDialog={showAsignarPrecio}
          setOpenDialog={setShowAsignarPrecio}
          product={productoSinPrecio}
          onAsignPrice={onAsignPrice}
        />
      </>
    )
  }

  return (
    <SelectedOptionsContext.Provider
      value={{
        GeneralElements,
        snackMessage,
        showMessage,

        showConfirm,
        showAlert,

        showLoadingDialog,
        setShowLoadingDialog,
        setShowLoadingDialogWithTitle,
        hideLoadingDialog,
        hideLoading,
        loadingDialogText,
        setLoadingDialogText,
        showLoading,


        sales,
        salesData,
        setSalesData,
        grandTotal,
        setGrandTotal,

        addToSalesData,
        replaceToSalesData,

        removeFromSalesData,
        incrementQuantity,
        decrementQuantity,
        clearSalesData,
        products,
        setProducts,
        salesDataTimestamp,
        // suspenderVenta,
        productInfo,
        setProductInfo,
        selectedUser,
        setSelectedUser,
        clearSessionData,
        calculateTotalPrice,
        description,
        setDescription,
        userData,
        updateUserData,
        getUserData,
        precioData,
        setPrecioData,
        ventaData,
        setVentaData,
        searchResults,
        setSearchResults,
        updateSearchResults,

        ultimoVuelto,
        setUltimoVuelto,

        textSearchProducts,
        searchInputRef,
        focusSearchInput,

        setTextSearchProducts,
        buscarCodigoProducto,
        setBuscarCodigoProducto,
        showTecladoBuscar,
        setShowTecladoBuscar,

        addNewProductFromCode,

        cliente,
        setCliente,
        askLastSale,
        setAskLastSale,
        showDialogSelectClient,
        setShowDialogSelectClient,
        clienteValidoFactura,

        modoAvion,
        setModoAvion,

        showPrintButton,
        setShowPrintButton,

        suspenderYRecuperar,
        setSuspenderYRecuperar,

        setSolicitaRetiro,

        numeroAtencion,
        setNumeroAtencion,

        listSalesOffline,
        setListSalesOffline,

        tieneInternet,
        // conexionesOkInternet,
        // conexionesMalInternet,

        createQrString,
        ultimoFolioPreventa,
        setUltimoFolioPreventa,

        // ofertas,
        // setOfertas,
        // cargarOfertasCorrectas,

        descuentos,
        setDescuentos,

        verBotonesPanel,
        setVerBotonesPanel,

        darFocoEnLeerDigi,
        setDarFocoEnLeerDigi
      }}
    >
      {children}
    </SelectedOptionsContext.Provider>
  );
};

export default SelectedOptionsProvider;
