import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AddHome, AddHomeOutlined, AddHomeWork, AirplaneTicketOutlined, Autorenew, BuildCircle, Circle, DateRangeOutlined, GMobiledata, Inventory, LocalOffer, LocalPrintshop, Margin, MobileFriendly, Person, Person3, PointOfSale, ProductionQuantityLimits, ProductionQuantityLimitsRounded, Settings, SettingsSystemDaydream, Shop, Shop2, SupervisedUserCircle, SupervisedUserCircleOutlined, SupervisorAccount, SystemSecurityUpdate, Traffic, VerifiedUserOutlined, WifiOff } from "@mui/icons-material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import dayjs from "dayjs";

import System from "../../Helpers/System";
import SmallGrayButton from "./../Elements/SmallGrayButton"
import SmallDangerButton from "./../Elements/SmallDangerButton"
import ScreenBuscarCliente from "./../ScreenDialog/BuscarCliente"
import User from "../../Models/User";
import Client from "../../Models/Client";
import ModelConfig from "../../Models/ModelConfig";
import Atudepa from "../../Models/Atudepa";
import VentasOffline from "../ScreenDialog/VentasOffline"
import PrinterPaper from "../../Models/PrinterPaper";
import StockCriticos from "../ScreenDialog/StockCriticos";
import Product from "../../Models/Product";
import SalesOffline from "../../Models/SalesOffline";
import ScreenCloseSession from "./../ScreenDialog/CloseSession"


import IconButtonBadge from "../Elements/IconButtonBadge";
import AdminApp from "../ScreenDialog/AdminApp";
import AdmPedidosProgramadosApp from "../ScreenDialog/AdmPedidosProgramadosApp";
import TarjetaMenu from "../Elements/TarjetaMenu";
import TarjetaCliente from "../ScreenDialog/TarjetaCliente";
import Ofertas from "../../Models/Ofertas";

const BoxTop = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const {
    cliente,
    setCliente,
    askLastSale,
    setAskLastSale,
    showDialogSelectClient,
    setShowDialogSelectClient,


    userData,
    addToSalesData,
    clearSessionData,
    getUserData,
    listSalesOffline,
    setListSalesOffline,
    showAlert,
    showConfirm,
    showLoading,
    hideLoading,
    tieneInternet,
    conexionesOkInternet,
    conexionesMalInternet,
    searchInputRef,
    ofertas
  } = useContext(SelectedOptionsContext);

  const navigate = useNavigate();
  const [showSalesOffline, setShowSalesOffline] = useState(false);
  const [showAdminApp, setShowAdminApp] = useState(false);
  const [showCritics, setShowCritics] = useState(false);

  const [date, setDate] = useState(null);
  const [sucursal, setSucursal] = useState("");
  const [caja, setCaja] = useState("");
  const [time, setTime] = useState(null);

  const [widthPrinter, setWidthPrinter] = useState(null);
  const [stockCriticoSuperados, setStockCriticoSuperados] = useState(0);
  const [showAdmPedidosProgramados, setShowAdmPedidosProgramados] = useState(false);
  const [showFoliosFacturas, setShowFoliosFacturas] = useState(false);
  const [foliosMostrar, setFoliosMostrar] = useState("");

  const [verTarjetaCliente, setVerTarjetaCliente] = useState(false);
  const [trabajaConApp, setTrabajaConApp] = useState(false);

  const [showCloseSessionDialog, setShowCloseSessionDialog] = useState(false);
  const [urlApi, setUrlApi] = useState("");


  const focusSearchInput = () => {
    System.darFocoEnBuscar(searchInputRef)
  }

  const cargarStockCriticoSuperados = () => {
    var superados = 0
    setStockCriticoSuperados(superados)


    Product.getInstance().getCriticosPaginate({
      pageNumber: 1,
      rowPage: 101
    }, (prods, response) => {
      if (Array.isArray(response.data.productos)) {
        response.data.productos.forEach((prod) => {
          if (prod.stockActual < prod.stockCritico) {
            superados++
          }
        })
      }
      setStockCriticoSuperados(superados)
    }, (error) => {
    })

  }


  const cargarVentasOfllines = (preguntar = true) => {
    var ventas = []
    const so = SalesOffline.getInstance()
    const vos = so.loadFromSesion()
    // console.log("cargarVentasOfllines")
    // console.log("vos", vos)

    if (vos.length > 0) {
      ventas = vos
      if (preguntar) {
        showConfirm("Hay ventas sin guardar, quiere intentar enviarlas ahora?", () => {
          SalesOffline.sincronizar(() => { }, () => { cargarVentasOfllines(false) })
        }, () => { })
      }
    }

    // console.log("ventas", ventas)

    // listSalesOffline
    setListSalesOffline(ventas)

  }

  useEffect(() => {
    // console.log("cambio trabajaConApp", trabajaConApp)
  }, [trabajaConApp])

  useEffect(() => {
    setDate(dayjs().format('DD/MM/YYYY'))
    setSucursal(ModelConfig.get("sucursalNombre"))
    setCaja(ModelConfig.get("puntoVentaNombre"))

    setTrabajaConApp(ModelConfig.get("trabajarConApp"))


    setInterval(() => {
      setTime(dayjs().format('HH:mm:ss'))

    }, 1000)

    const buscarUrlApi = function () {
      var urlBase = ModelConfig.get("urlBase")
      urlBase = urlBase.toLowerCase()
      urlBase = urlBase.replace("https://", "")
      urlBase = urlBase.replace("http://", "")
      urlBase = urlBase.replace("easypos", "")
      urlBase = urlBase.replace(".somee.com", "")
      setUrlApi(urlBase)
    }

    setInterval(() => {
      buscarUrlApi()
    }, 5000)
    buscarUrlApi()

    if (!PrinterPaper.getInstance().width) {
      PrinterPaper.getInstance().loadWidthFromSesion()
      setWidthPrinter(PrinterPaper.getInstance().width)
    }

    cargarStockCriticoSuperados()
    cargarVentasOfllines()


    // console.log("listSalesOffline", listSalesOffline)
  }, [])

  useEffect(() => {
    // Simulación de obtención de datos del usuario después de un tiempo de espera
    if (!User.getInstance().sesion.hasOne()) {
      // alert("Usuario no logueado");

      if (Atudepa.intervaloFuncion) {
        clearInterval(Atudepa.intervaloFuncion)
      }
      Atudepa.checkNuevosPedidos = false
      Atudepa.nuevoPedidoFuncion = null

      clearSessionData();
      navigate("/login");
    } else {
      if (ModelConfig.get("verBotonPagarFactura")) {
        setShowFoliosFacturas(true)
        const userInfo = User.getInstance().getFromSesion()

        setFoliosMostrar("Folios de facturas \n Desde: " + userInfo.nFolioFactura + ".. Hasta:" + userInfo.nFolioFacturaHasta)
      }
    }
  }, [userData]);


  const descargarProductos = () => {
    showLoading("Descargando productos del servidor...")
    Product.getInstance().almacenarParaOffline((prods, resp) => {
      hideLoading()
      showAlert("Actualizado correctamente", "", () => {
        focusSearchInput()
      })
    }, () => {
      hideLoading()
      showMessage("No se pudo realizar")
      focusSearchInput()
    })
  }



  return (
    <Paper
      elevation={3}
      style={{ backgroundColor: "#283048", padding: "10px", width: "100%", marginTop: "2px" }}
    >
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Grid container spacing={2}>

            <Grid item xs={12} sm={12} md={12} lg={12} sx={{
              padding: "0",
              textAlign: "center"
            }}>

              <TarjetaMenu
                title={System.getInstance().getAppNameOnly()}
                text={System.getInstance().getAppVersion()}
                icon={null}
                actionClick={() => {
                }}
              />

              {userData && (
                <TarjetaMenu
                  title={"operador"}
                  text={userData.nombres + " " + userData.apellidos}
                  icon={null}

                  actionClick={() => {
                    setShowCloseSessionDialog(true)
                  }}
                />
              )}

              <TarjetaMenu
                title={date}
                text={(time)}
                icon={null}
                // icon={<DateRangeOutlined sx={{
                //   color: "#fff"
                // }} fontSize="medium" />}

                actionClick={() => {
                }}
              />

              <TarjetaMenu
                title={"Api"}
                text={(urlApi)}
                icon={null}
                // icon={<DateRangeOutlined sx={{
                //   color: "#fff"
                // }} fontSize="medium" />}

                actionClick={() => {
                }}
              />

              <ScreenCloseSession openDialog={showCloseSessionDialog} setOpenDialog={setShowCloseSessionDialog} />


              <TarjetaMenu
                title={"Cliente"}
                text={(cliente ? (cliente.nombreResponsable + " " + cliente.apellidoResponsable) : "Seleccionar")}
                icon={<Person sx={{
                  color: "#fff"
                }} fontSize="medium" />}

                actionClick={() => {
                  setVerTarjetaCliente(true)
                }}
              />

              <TarjetaMenu
                title={"Sucursal"}
                text={sucursal}
                icon={<Shop2 sx={{
                  color: "#fff"
                }} fontSize="medium" />}

                actionClick={() => {
                }}
              />

              <TarjetaMenu
                title={"Caja"}
                text={caja}
                icon={<Shop sx={{
                  color: "#fff"
                }} fontSize="medium" />}

                actionClick={() => {
                }}
              />
              {widthPrinter && (
                <TarjetaMenu
                  title={"Impresora"}
                  text={widthPrinter}
                  icon={<LocalPrintshop sx={{
                    color: "#fff"
                  }} fontSize="medium" />}

                  actionClick={() => {
                    showAlert("Impresora de " + widthPrinter, "", () => {
                      focusSearchInput()
                    })
                  }}
                />
              )}

              {showFoliosFacturas && (
                <TarjetaMenu
                  title={"Folios"}
                  text={"Facturas"}
                  icon={<AirplaneTicketOutlined sx={{
                    color: "#fff"
                  }} fontSize="medium" />}

                  actionClick={() => {
                    showAlert(foliosMostrar, "", () => {
                      focusSearchInput()
                    })
                  }}
                />

              )}

              <TarjetaCliente openDialog={verTarjetaCliente} setOpenDialog={setVerTarjetaCliente} />

              <VentasOffline
                openDialog={showSalesOffline}
                setOpenDialog={(v) => {
                  setShowSalesOffline(v)

                  if (!v) {
                    focusSearchInput()
                  }
                }}
              />


              <AdmPedidosProgramadosApp
                openDialog={showAdmPedidosProgramados}
                setOpenDialog={(v) => {
                  setShowAdmPedidosProgramados(v)
                  if (!v) {
                    focusSearchInput()
                  }
                }}
              />
              <AdminApp
                openDialog={showAdminApp}
                setOpenDialog={(v) => {
                  setShowAdminApp(v)

                  if (!v) {
                    focusSearchInput()
                  }
                }}
              />

              <StockCriticos
                openDialog={showCritics}
                setOpenDialog={(x) => {
                  setShowCritics(x)
                  if (!x) {
                    focusSearchInput()
                  }
                }}
              />


              {trabajaConApp && (
                <>

                  <TarjetaMenu
                    title={"App"}
                    text={("Programados")}
                    icon={<MobileFriendly sx={{
                      color: "#fff"
                    }} fontSize="medium" />}

                    actionClick={() => {
                      setShowAdmPedidosProgramados(true)
                    }}
                  />

                  <TarjetaMenu
                    title={"App"}
                    text={("Pedidos")}
                    icon={<MobileFriendly sx={{
                      color: "#fbdb12"
                    }} fontSize="medium" />}

                    actionClick={() => {
                      setShowAdminApp(true)
                    }}
                  />

                </>

              )}

              <TarjetaMenu
                title={"Productos"}
                text={"offline"}
                icon={<Autorenew sx={{
                  color: "#fff"
                }} fontSize="medium" />}

                actionClick={() => {
                  descargarProductos()
                  focusSearchInput()
                }}
              />


              <TarjetaMenu
                title={"Ofertas"}
                text={ofertas.length}
                icon={<LocalOffer sx={{
                  color: "#DF9620",
                }} fontSize="medium" />}

                actionClick={() => {
                }}
              />

              <TarjetaMenu
                title={"Conexion"}
                text={null}
                icon={<Circle sx={{
                  color: (tieneInternet === null ? "#C0DA03" : tieneInternet ? "#00ff00" : "#FF0000"),
                }} fontSize="medium" />}

                actionClick={() => {
                  var txt = "";

                  txt += "Las conexiones correctas son " + conexionesOkInternet
                  txt += " y las incorrectas " + conexionesMalInternet + "."

                  showAlert("Estado de conexiones a internet", txt, () => {
                    focusSearchInput()
                  })
                }}
              />

              {listSalesOffline.length > 0 && (
                <TarjetaMenu
                  title={"Offline"}
                  text={listSalesOffline.length}
                  icon={<WifiOff sx={{
                    color: "#fff"
                  }} fontSize="medium" />}

                  actionClick={() => {
                    setShowSalesOffline(true)
                  }}
                />
              )}

              <TarjetaMenu
                title={"Stock critico"}
                text={stockCriticoSuperados > 100 ? "100+" : stockCriticoSuperados}
                icon={<Inventory sx={{
                  color: "#fff"
                }} fontSize="medium" />}

                actionClick={() => {
                  setShowCritics(true)
                }}
              />

            </Grid>

          </Grid>
        </Grid>
      </Grid>
    </Paper >
  );
};

export default BoxTop;
