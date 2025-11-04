import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Paper,
  Avatar,
  Box,
  Grid,
  Stack,
  InputLabel,
  Typography,
  CircularProgress,
  Snackbar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  MenuItem,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import { ProviderModalesContext } from "../../Context/ProviderModales";
import TouchInputPage from "../../TouchElements/TouchInputPage";
import ModelConfig from "../../../Models/ModelConfig";
import SmallButton from "../../Elements/SmallButton";
import Sucursal from "../../../Models/Sucursal";
import TiposPasarela from "../../../definitions/TiposPasarela";
import BaseConfig from "../../../definitions/BaseConfig";
import BoxOptionList from "../BoxOptionList";
import InputCheckbox from "../../Elements/Compuestos/InputCheckbox";
import InputCheckboxAutorizar from "../../Elements/Compuestos/InputCheckboxAutorizar";
import BoxBat from "../BoxBat";
import MainButton from "../../Elements/MainButton";
import TouchInputNumber from "../../TouchElements/TouchInputNumber";
import System from "../../../Helpers/System";
import InputFile from "../../Elements/Compuestos/InputFile";
import ProductFastSearch from "../../../Models/ProductFastSearch";
import Product from "../../../Models/Product";
import AdminStorage from "../../ScreenDialog/AdminStorage";
import TouchInputName from "../../TouchElements/TouchInputName";
import ModosTrabajoConexion from "../../../definitions/ModosConexion";

const TabGeneral = ({
  onFinish = () => { }
}) => {
  const {
    userData,
    salesData,
    sales,
    addToSalesData,
    setPrecioData,
    grandTotal,
    ventaData,
    setVentaData,
    searchResults,
    // setSearchResults,
    updateSearchResults,
    selectedUser,
    setSelectedUser,
    // selectedCodigoCliente,
    // setSelectedCodigoCliente,
    // selectedCodigoClienteSucursal,
    // setSelectedCodigoClienteSucursal,
    // setSelectedChipIndex,
    // selectedChipIndex,
    searchText,
    setTextSearchProducts,
    clearSalesData,

    cliente,
    setCliente,
    askLastSale,
    setAskLastSale,
    showMessage,
    showAlert,
    showConfirm,
    showLoading,
    hideLoading,
    showDialogSelectClient,
    setShowDialogSelectClient,
    modoAvion,
    ultimoVuelto,
    setUltimoVuelto,
  } = useContext(SelectedOptionsContext);

  const {
    pedirSupervision,
  } = useContext(ProviderModalesContext);

  const [urlBase, setUrlBase] = useState("");
  const [licencia, setLicencia] = useState("");

  const [puntoVenta, setPuntoVenta] = useState("-1")
  const [sucursal, setSucursal] = useState("-1")
  const [afterLogin, setAfterLogin] = useState(null)

  const [sucursalesInfo, setSucursalesInfo] = useState([])
  const [sucursales, setSucursales] = useState([])
  const [cargoSucursales, setCargoSucursales] = useState(false)
  const [seleccionables, setSeleccionables] = useState([])
  const [cajas, setCajas] = useState([])
  const [cargoCajas, setCargoCajas] = useState(false)

  const [esPantallaLogin, setEsPantallaLogin] = useState(false)
  const [esPantallaVendedorVolante, setEsPantallaVendedorVolante] = useState(false)

  const [pedirDatosTransferencia, setPedirDatosTransferencia] = useState(false)
  const [pagarConCuentaCorriente, setPagarConCuentaCorriente] = useState(false)

  const [cantidadProductosBusquedaRapida, setCantidadProductosBusquedaRapida] = useState(20)

  const [estaEnVendedoresVolantes, setEstaEnVendedoresVolantes] = useState(false)
  const [conNumeroAtencion, setConNumeroAtencion] = useState(false)

  const [modoTrabajoConexion, setModoTrabajoConexion] = useState(null)
  const [checkOfertas, setCheckOfertas] = useState(false)
  const [trabajarConApp, setTrabajarConApp] = useState(false)

  const [crearProductoNoEncontrado, setCrearProductoNoEncontrado] = useState(false)
  const [pedirAutorizacionParaAplicarDescuentos, setPedirAutorizacionParaAplicarDescuentos] = useState(false)
  const [reflejarInfoEspejo, setReflejarInfoEspejo] = useState(false)

  const [verSucursalesMype, setVerSucursalesMype] = useState(false)


  const buscarNombreSucursal = (idSucursal) => {
    var nombre = ""
    sucursalesInfo.forEach((sucItem, ix) => {
      if (sucItem.idSucursal == idSucursal) {
        nombre = sucItem.descripcionSucursal
      }
    })

    return nombre
  }

  const buscarNombreCaja = (idCaja) => {
    var nombre = ""
    cajas.forEach((cajaItem, ix) => {
      if (cajaItem.id == idCaja) {
        nombre = cajaItem.value
      }
    })

    return nombre
  }

  const cargarSucursales = () => {
    Sucursal.getAll((responseData) => {
      setSucursalesInfo(responseData)
      separarSucursales(responseData)

      if (sucursal === "-1") setSucursal(ModelConfig.get("sucursal"))
      setCargoSucursales(true)
    }, (error) => {
      setCargoSucursales(true)
    })
  }

  const cargarTiposSeleccionables = () => {
    var seleccionables = []
    const keys = Object.keys(TiposPasarela)

    keys.forEach((key, ix) => {
      var idx = TiposPasarela[key]
      if (esSeleccionableTipo(idx)) {
        seleccionables.push({
          id: idx,
          value: key.replaceAll("_", " ")
        })
      }
    })

    setSeleccionables(seleccionables)
  }

  const separarSucursales = (info) => {
    // console.log("separarSucursales")
    var sucursalesx = []
    info.forEach((infoItem, ix) => {
      var esMype = (infoItem.descripcionSucursal.toLowerCase().indexOf("mype") > -1)
      if (!esMype || verSucursalesMype) {
        sucursalesx.push({
          id: infoItem.idSucursal + "",
          value: infoItem.descripcionSucursal
        })
      } else {
        // console.log("no agrego sucursal de mype", infoItem)
      }
    })
    setSucursales(sucursalesx)
  }

  const esSeleccionableTipo = (tipo) => {
    return (
      tipo == TiposPasarela.CAJA
      || tipo == TiposPasarela.PREVENTA
    )
  }

  const cargarCajas = (idSucursal) => {
    // console.log("cargarCajas")
    var cajasx = []
    if (!sucursalesInfo) return
    sucursalesInfo.forEach((sucursalItem, ix) => {
      if (sucursalItem.idSucursal == idSucursal) {
        sucursalItem.puntoVenta.forEach((cajaItem, ix2) => {
          if (
            esSeleccionableTipo(cajaItem.idSucursalPvTipo)

          ) {
            cajasx.push({
              id: cajaItem.idCaja + "",
              value: cajaItem.sPuntoVenta,
              tipo: cajaItem.idSucursalPvTipo
            })
          }
        })
      }
    })
    setCajas(cajasx)
    setCargoCajas(true)
  }

  const checkSeleccionCaja = (caja) => {
    cajas.forEach((cajaItem, ix) => {
      if (cajaItem.id == caja) {
        setAfterLogin(cajaItem.tipo)
      }
    })
    setPuntoVenta(caja)
  }



  const loadConfigSesion = () => {
    // console.log("loadConfigSesion")
    setUrlBase(ModelConfig.get("urlBase"))
    setLicencia(ModelConfig.get("licencia"))

    // setSucursal(ModelConfig.get("sucursal"))
    // setPuntoVenta(ModelConfig.get("puntoVenta"))

    setAfterLogin(ModelConfig.get("afterLogin"))

    setPedirDatosTransferencia(ModelConfig.get("pedirDatosTransferencia"))
    setPagarConCuentaCorriente(ModelConfig.get("pagarConCuentaCorriente"))
    setCantidadProductosBusquedaRapida(ModelConfig.get("cantidadProductosBusquedaRapida"))

    console.log("get cant bus rapida ", ModelConfig.get("cantidadProductosBusquedaRapida"))
    setConNumeroAtencion(ModelConfig.get("conNumeroAtencion"))
    setModoTrabajoConexion(ModelConfig.get("modoTrabajoConexion"))
    setCheckOfertas(ModelConfig.get("checkOfertas"))
    setTrabajarConApp(ModelConfig.get("trabajarConApp"))

    setCrearProductoNoEncontrado(ModelConfig.get("crearProductoNoEncontrado"))
    setPedirAutorizacionParaAplicarDescuentos(ModelConfig.get("pedirAutorizacionParaAplicarDescuentos"))
    setReflejarInfoEspejo(ModelConfig.get("reflejarInfoEspejo"))

  }

  const handlerSaveAction = () => {
    var changes = {
      "urlBase": urlBase,
      "licencia": licencia,
      "pedirDatosTransferencia": pedirDatosTransferencia,
      "pagarConCuentaCorriente": pagarConCuentaCorriente,
      "cantidadProductosBusquedaRapida": cantidadProductosBusquedaRapida,
      "afterLogin": afterLogin,
      "conNumeroAtencion": conNumeroAtencion,
      "modoTrabajoConexion": modoTrabajoConexion,
      "checkOfertas": checkOfertas,
      "trabajarConApp": trabajarConApp,
      "crearProductoNoEncontrado": crearProductoNoEncontrado,
      "pedirAutorizacionParaAplicarDescuentos": pedirAutorizacionParaAplicarDescuentos,
      "reflejarInfoEspejo": reflejarInfoEspejo,
    }

    const estamosEnPantallaLogin = window.location.href.indexOf("/login") > -1
    if (estamosEnPantallaLogin) {
      changes["sucursal"] = sucursal
      changes["sucursalNombre"] = buscarNombreSucursal(sucursal)
      changes["puntoVenta"] = puntoVenta
      changes["puntoVentaNombre"] = buscarNombreCaja(puntoVenta)
    }

    if (!ModelConfig.isEqual("conNumeroAtencion", conNumeroAtencion)) {
      showConfirm("Hay que recargar la pantalla para aplicar los cambios. Desea hacerlo ahora?", () => {
        window.location.href = window.location.href
      })
    }

    ModelConfig.changeAll(changes)

    showMessage("Guardado correctamente")
    // onFinish()
  }



  const descargarProductos = () => {
    showLoading("Descargando productos del servidor...")
    Product.getInstance().almacenarParaOffline((prods, resp) => {
      hideLoading()
      // showAlert("Se descargaron " + prods.length + " productos")
      descargarProductosBusquedaRapida()
    }, () => {
      hideLoading()
      showMessage("No se pudo realizar")
    })
  }

  const descargarProductosBusquedaRapida = () => {
    showLoading("Descargando busqueda rapida del servidor...")
    ProductFastSearch.getInstance().almacenarParaOffline((prods, resp) => {
      hideLoading()
      showAlert("Descargado correctamente")
    }, () => {
      hideLoading()
      showMessage("No se pudo realizar")
    })
  }


  const cambioTrabajoConexion = (nuevo) => {
    if (
      modoTrabajoConexion == ModosTrabajoConexion.SOLO_ONLINE
      && nuevo != ModosTrabajoConexion.SOLO_ONLINE
    ) {
      showConfirm("Desea descargar los productos para trabajar sin conexion?", () => {
        descargarProductos()
      })
    }
    setModoTrabajoConexion(nuevo)
  }

  useEffect(() => {
    // console.log("carga inicial")
    loadConfigSesion()

    const estamosEnPantallaVenVolantes = window.location.href.indexOf("/vendedores-volantes") > -1
    setEstaEnVendedoresVolantes(estamosEnPantallaVenVolantes)

    const estamosEnPantallaLogin = window.location.href.indexOf("/login") > -1
    setEsPantallaLogin(estamosEnPantallaLogin)

    const estamosEnPantallaVenVolante = window.location.href.indexOf("/vendedores-volantes") > -1
    setEsPantallaVendedorVolante(estamosEnPantallaVenVolante)

    if (estamosEnPantallaLogin || estamosEnPantallaVenVolante || ModelConfig.get("sucursal") == -1) {
      cargarTiposSeleccionables()
      setTimeout(() => {
        cargarSucursales()
      }, 100);
    }
  }, [])

  useEffect(() => {
    cargarCajas(sucursal)
  }, [sucursal])

  useEffect(() => {
    if (puntoVenta === "-1" && ModelConfig.get("puntoVenta") != "-1" && cajas.length > 0) {
      setPuntoVenta(ModelConfig.get("puntoVenta"))
    }
    if (sucursal === "-1" && ModelConfig.get("sucursal") != "-1" && sucursales.length > 0) {
      setSucursal(ModelConfig.get("sucursal"))
    }
  }, [sucursales, cajas])

  const [showAdminMem, setShowAdminMem] = useState(false)


  useEffect(() => {
    cargarSucursales()
  }, [verSucursalesMype])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <TouchInputPage
          inputState={[urlBase, setUrlBase]}
          label="url base"
          onEnter={() => {
            handlerSaveAction()
          }}
        />
      </Grid>


      <BoxBat />


      {(esPantallaLogin || esPantallaVendedorVolante || ModelConfig.get("sucursal") == -1) && (
        <>
          <Grid item xs={12} lg={12}>
            <Typography>Elegir Sucursal</Typography>
            <BoxOptionList
              optionSelected={sucursal}
              setOptionSelected={(x) => {
                setSucursal(x)
                if (!window.sucursalClicked) window.sucursalClicked = 0
                window.sucursalClicked++

                if (window.sucursalClicked % 3 == 0) {
                  window.sucursalClicked = 0
                  setVerSucursalesMype(!verSucursalesMype)
                }

                console.log("window.sucursalClicked", window.sucursalClicked)
              }}
              // options = {[{
              //   "id": 1,
              //   "value":"Punto de venta"
              // },{
              //   "id": 2,
              //   "value":"Pre Venta"
              // }]}
              options={sucursales}
            />
          </Grid>

          <Grid item xs={12} lg={12}>
            <Typography>Elegir caja</Typography>
            <BoxOptionList
              optionSelected={puntoVenta}
              setOptionSelected={(e) => {
                checkSeleccionCaja(e)
              }}
              // options = {[{
              //   "id": 1,
              //   "value":"Punto de venta"
              // },{
              //   "id": 2,
              //   "value":"Pre Venta"
              // }]}
              options={cajas}
            />
          </Grid>

          <Grid item xs={12} lg={12}>
            <Typography>Iniciar en</Typography>
            <BoxOptionList
              optionSelected={afterLogin}
              // setOptionSelected={setAfterLogin}
              setOptionSelected={() => { }}
              options={seleccionables}
            />
          </Grid>
        </>
      )}


      <Grid item xs={12} md={6} lg={6}>
        <TouchInputNumber
          inputState={[cantidadProductosBusquedaRapida, setCantidadProductosBusquedaRapida]}
          label="Cantidad Productos BusquedaRapida"
        />
      </Grid>


      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[conNumeroAtencion, setConNumeroAtencion]}
          label={"Trabajar con numero de atencion"}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <InputCheckboxAutorizar
          inputState={[pedirDatosTransferencia, setPedirDatosTransferencia]}
          label={"Pedir datos para pagos con transferencia"}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <InputCheckboxAutorizar
          inputState={[pagarConCuentaCorriente, setPagarConCuentaCorriente]}
          label={"Permitir pagar con cuenta corriente"}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[checkOfertas, setCheckOfertas]}
          label={"Ofertas"}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[trabajarConApp, setTrabajarConApp]}
          label={"Trabajar con App"}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[crearProductoNoEncontrado, setCrearProductoNoEncontrado]}
          label={"Crear Producto No Encontrado"}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[pedirAutorizacionParaAplicarDescuentos, setPedirAutorizacionParaAplicarDescuentos]}
          label={"Pedir Autorizacion Para Aplicar Descuentos"}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[reflejarInfoEspejo, setReflejarInfoEspejo]}
          label={"Reflejar en espejo"}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <label
          style={{
            userSelect: "none",
            fontSize: "19px",
            display: "inline-block",
            margin: "10px 0"
          }}>
          Trabajar con conexion
        </label>
        <BoxOptionList
          optionSelected={modoTrabajoConexion}
          setOptionSelected={cambioTrabajoConexion}
          options={System.arrayIdValueFromObject(ModosTrabajoConexion, true)}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        {/* {modoTrabajoConexion != ModosTrabajoConexion.SOLO_ONLINE && (
          <InputFile
            inputState={[null, () => { }]}
            validationState={[null, () => { }]}
            extensions={"json"}
            fieldName="Contenido Offline"
            fileInputLabel={"Cargar contenido"}
            onRead={(readed) => {
              console.log("leido", readed)
            }}
          />
        )} */}

        <br />
        <br />
        <br />
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12}>
        <TouchInputName
          inputState={[licencia, setLicencia]}
          label="Licencia"
          onEnter={() => {
            handlerSaveAction()
          }}
        />

        <SmallButton textButton={"Resetear licencia"} actionButton={() => {
          setLicencia(BaseConfig.licencia)
        }} />
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12}>

        <Box sx={{
          padding: "10px",
          border: "1px solid blue",
          borderRadius: "2px",
          backgroundColor: "whitesmoke"
        }}>

          <Typography>Abrir otras pantallas</Typography>

          {!esPantallaLogin && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <MainButton xs={12} sm={12} md={12} lg={12} textButton="Espejo" actionButton={() => {
                  window.location.href = "./espejo-punto-venta" +
                    "?puntoVenta=" +
                    ModelConfig.get("puntoVenta") +
                    "&sucursal=" +
                    ModelConfig.get("sucursal")
                }} style={{
                  backgroundColor: "skyblue",
                }} />
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4}>
                <MainButton xs={12} sm={12} md={12} lg={12} textButton="Estados de pedidos" actionButton={() => {
                  window.location.href = "./estados-pedidos"
                }} style={{
                  backgroundColor: "limegreen",
                }} />
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4}>
                <MainButton xs={12} sm={12} md={12} lg={12} textButton="Preparacion de pedidos" actionButton={() => {
                  window.location.href = "./preparacion-pedidos"
                }} style={{
                  backgroundColor: "blueviolet",
                }} />
              </Grid>
            </Grid>
          )}



          {!estaEnVendedoresVolantes && !userData && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <MainButton xs={12} sm={12} md={12} lg={12} textButton="Vendedores Volantes" actionButton={() => {
                  window.location.href = "./vendedores-volantes"
                }} style={{
                  backgroundColor: "skyblue",
                }} />
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4}>
                <MainButton xs={12} sm={12} md={12} lg={12} textButton="Numero de atencion" actionButton={() => {
                  window.location.href = "./generar-numero-atencion"
                }} style={{
                  backgroundColor: "purple",
                }} />
              </Grid>
            </Grid>

          )}

          {estaEnVendedoresVolantes && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <MainButton xs={12} sm={12} md={12} lg={12} textButton="EasyPos Lite" actionButton={() => {
                  window.location.href = "./punto-venta"
                }} style={{
                  backgroundColor: "midnightblue",
                }} />
              </Grid>
            </Grid>

          )}


        </Box>
      </Grid>




      <Grid item xs={12} sm={12} md={12} lg={12}>

        <AdminStorage
          openDialog={showAdminMem}
          setOpenDialog={setShowAdminMem}
        />

        <SmallButton textButton="Admin memoria" actionButton={() => {
          pedirSupervision("administrar memoria", () => {
            setShowAdminMem(true)
          }, {})
        }} />


        <SmallButton textButton="Actualizar Version" actionButton={() => {
          window.location.href = window.location.href
        }} style={{
          backgroundColor: "blueviolet",
          width: "inherit"
        }} />




        <SmallButton textButton="Guardar" actionButton={() => {
          handlerSaveAction()
          cargarSucursales()
        }} />
        <SmallButton textButton="Guardar y Salir" actionButton={() => {
          handlerSaveAction()
          setTimeout(() => {
            onFinish()
          }, 300);
        }} />



      </Grid>


    </Grid>
  );
};

export default TabGeneral;
