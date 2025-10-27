import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Typography,
  DialogTitle,
  Box,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import BoxOptionList from "../BoxOptionsLite/BoxOptionList";
import ModelConfig from "../../Models/ModelConfig";
import Validator from "../../Helpers/Validator";
import Sucursal from "../../Models/Sucursal";
import TiposPasarela from "../../definitions/TiposPasarela";
import BoxBat from "../BoxOptionsLite/BoxBat";
import IngresarTexto from "./IngresarTexto";
import IngresarNumeroORut from "./IngresarNumeroORut";
import BoxOptionListMulti from "../BoxOptionsLite/BoxOptionListMulti";
import MetodosPago from "../../definitions/MetodosPago";
import System from "../../Helpers/System";
import TouchInputPage from "../TouchElements/TouchInputPage";
import TouchInputNumber from "../TouchElements/TouchInputNumber";
import InputCheckbox from "../Elements/Compuestos/InputCheckbox";
import InputCheckboxAutorizar from "../Elements/Compuestos/InputCheckboxAutorizar";
import BoxIngresoTabFiado from "../BoxOptionsLite/Ingreso/BoxIngresoTabFiado";
import BoxIngresoTabUsuario from "../BoxOptionsLite/Ingreso/BoxIngresoTabUsuario";
import TabIngresoOtro from "../BoxOptionsLite/Ingreso/BoxIngresoTabOtro";
import Tabs, { Position, Tab } from "../Elements/Tabs";
import TabGeneral from "../BoxOptionsLite/Config/TabGeneral";
import TabImpresion from "../BoxOptionsLite/Config/TabImpresion";
import TabBalanza from "../BoxOptionsLite/Config/TabBalanza";
import TabBalanzaUnidad from "../BoxOptionsLite/Config/TabBalanzaUnidad";
import TabBoleta from "../BoxOptionsLite/Config/TabEmitirBoleta";
import TabComidaRapida from "../BoxOptionsLite/Config/TabComidaRapida";
import TabBotones from "../BoxOptionsLite/Config/TabBotones";
import TabProductos from "../BoxOptionsLite/Config/TabProductos";
import OrdenListado from "../../definitions/OrdenesListado";

const AdminConfig = ({
  openDialog,
  setOpenDialog
}: any) => {
  const [urlBase, setUrlBase] = useState("");
  const [cantBusqRap, setCantBusqRap] = useState(20);

  const [showPrintButtonC, setShowPrintButtonC] = useState(false)
  const [widthPrint, setWidthPrint] = useState("")
  const [delayBetwenPrints, setDelayBetwenPrints] = useState("")
  const [delayCloseWindowPrints, setdelayCloseWindowPrints] = useState("")

  const [puntoVenta, setPuntoVenta] = useState("")
  const [sucursal, setSucursal] = useState("")
  const [afterLogin, setAfterLogin] = useState(null)

  const [balanzaCod, setBalanzaCod] = useState("")
  const [balanzaIdProd, setBalanzaIdProd] = useState("")
  const [balanzaPesaje, setBalanzaPesaje] = useState("")
  const [balanzaDigitosPesoEnteros, setBalanzaDigitosPesoEnteros] = useState("")


  const [balanzaVentaUnidadCod, setBalanzaVentaUnidadCod] = useState("")
  const [balanzaVentaUnidadIdProd, setBalanzaVentaUnidadIdProd] = useState("")
  const [balanzaVentaUnidadPesaje, setBalanzaVentaUnidadPesaje] = useState("")

  const [showBalanzaCod, setshowBalanzaCod] = useState(false)
  const [showBalanzaLargoProd, setshowBalanzaLargoProd] = useState(false)
  const [showBalanzaLargoPeso, setshowBalanzaLargoPeso] = useState(false)
  const [showBalanzaLargoEnteros, setshowBalanzaLargoEnteros] = useState(false)

  const [showBalanzaUnidadCod, setshowBalanzaUnidadCod] = useState(false)
  const [showBalanzaUnidadLargoProd, setshowBalanzaUnidadLargoProd] = useState(false)
  const [showBalanzaUnidadLargoPeso, setshowBalanzaUnidadLargoPeso] = useState(false)


  const [sucursalesInfo, setSucursalesInfo] = useState([])
  const [sucursales, setSucursales] = useState([])
  const [seleccionables, setSeleccionables] = useState([])
  const [cajas, setCajas] = useState([])

  const [esPantallaLogin, setEsPantallaLogin] = useState(false)
  const [suspenderYRecuperarx, setSuspenderYRecuperarx] = useState(false)
  const [pedirDatosTransferencia, setPedirDatosTransferencia] = useState(false)
  const [pagarConCuentaCorriente, setPagarConCuentaCorriente] = useState(false)
  const [pedirPermisoBorrarProducto, setPedirPermisoBorrarProducto] = useState(false)
  const [cantidadTicketImprimir, setcantidadTicketImprimir] = useState(1)
  const [permitirVentaPrecio0, setPermitirVentaPrecio0] = useState(false)
  const [ordenMostrarListado, setOrdenMostrarListado] = useState(null)

  const [ordenesMostrarListado, setOrdenesMostrarListado] = useState([])
  const [verBotonPreventa, setVerBotonPreventa] = useState(false)
  const [verBotonEnvases, setVerBotonEnvases] = useState(false)
  const [verBotonPagarFactura, setVerBotonPagarFactura] = useState(false)

  const [permitirAgregarYQuitarExtras, setpermitirAgregarYQuitarExtras] = useState(false)
  const [agruparProductoLinea, setAgruparProductoLinea] = useState(false)
  const [fijarBusquedaRapida, setFijarBusquedaRapida] = useState(false)
  const [fijarFamilia, setFijarFamilia] = useState(false)

  const [showIngresoTextoUrlBase, setshowIngresoTextoUrlBase] = useState(false)
  const [showIngresoCantidadBusquedaRapida, setshowIngresoCantidadBusquedaRapida] = useState(false)
  const [showIngresoImprimirTickets, setshowIngresoImprimirTickets] = useState(false)

  const [showAnchoImpresion, setshowAnchoImpresion] = useState(false)
  const [showTiempoImpresiones, setshowTiempoImpresiones] = useState(false)
  const [showTiempoCierreImpresion, setshowTiempoCierreImpresion] = useState(false)

  const [emitirBoleta, setEmitirBoleta] = useState(false)
  const [tienePasarelaPago, setTienePasarelaPago] = useState(false)
  const [excluirMediosEnBoleta, setExcluirMediosEnBoleta] = useState([])


  const {
    showPrintButton,
    setShowPrintButton,
    suspenderYRecuperar,
    setSuspenderYRecuperar,
    showAlert,
    showConfirm,
    setModoAvion
  } = useContext(SelectedOptionsContext);


  useEffect(() => {
    if (!openDialog) return
    // console.log("cargando config")

    setEsPantallaLogin(window.location.href.indexOf("/login") > -1)

    setSucursal("0")
    setPuntoVenta("0")
    cargarTiposSeleccionables()
    cargarOrdenesListados()
    setTimeout(() => {
      cargarSucursales()
    }, 100);
  }, [openDialog])


  useEffect(() => {
    // console.log("cambio sucursales")
    loadConfigSesion()
  }, [sucursales])

  useEffect(() => {
    cargarCajas(sucursal)
    // console.log("cambio sucursal", sucursal)

  }, [sucursal])

  //FIN OBSERVERS







  const loadConfigSesion = () => {
    // console.log("loadConfigSesion")
    setUrlBase(ModelConfig.get("urlBase"))
    setCantBusqRap(ModelConfig.get("cantidadProductosBusquedaRapida"))

    setShowPrintButtonC(ModelConfig.get("showPrintButton"))
    setWidthPrint(ModelConfig.get("widthPrint"))

    setDelayBetwenPrints(ModelConfig.get("delayBetwenPrints"))
    setdelayCloseWindowPrints(ModelConfig.get("delayCloseWindowPrints"))
    // setSucursal(ModelConfig.get("sucursal"))
    // setPuntoVenta(ModelConfig.get("puntoVenta"))

    setSucursal(ModelConfig.get("sucursal"))
    setPuntoVenta(ModelConfig.get("puntoVenta"))
    setAfterLogin(ModelConfig.get("afterLogin"))


    setBalanzaCod(ModelConfig.get("codBalanza"))
    setBalanzaIdProd(ModelConfig.get("largoIdProdBalanza"))
    setBalanzaPesaje(ModelConfig.get("largoPesoBalanza"))
    setBalanzaDigitosPesoEnteros(ModelConfig.get("digitosPesoEnterosBalanza"))

    setBalanzaVentaUnidadCod(ModelConfig.get("codBalanzaVentaUnidad"))
    setBalanzaVentaUnidadIdProd(ModelConfig.get("largoIdProdBalanzaVentaUnidad"))
    setBalanzaVentaUnidadPesaje(ModelConfig.get("largoPesoBalanzaVentaUnidad"))

    setSuspenderYRecuperarx(ModelConfig.get("suspenderYRecuperar"))
    setPedirDatosTransferencia(ModelConfig.get("pedirDatosTransferencia"))
    setPagarConCuentaCorriente(ModelConfig.get("pagarConCuentaCorriente"))
    setPedirPermisoBorrarProducto(ModelConfig.get("pedirPermisoBorrarProducto"))
    setcantidadTicketImprimir(ModelConfig.get("cantidadTicketImprimir"))
    setPermitirVentaPrecio0(ModelConfig.get("permitirVentaPrecio0"))
    setOrdenMostrarListado(ModelConfig.get("ordenMostrarListado"))

    setVerBotonPreventa(ModelConfig.get("verBotonPreventa"))
    setVerBotonEnvases(ModelConfig.get("verBotonEnvases"))
    setVerBotonPagarFactura(ModelConfig.get("verBotonPagarFactura"))

    setpermitirAgregarYQuitarExtras(ModelConfig.get("permitirAgregarYQuitarExtras"))
    setAgruparProductoLinea(ModelConfig.get("agruparProductoLinea"))
    setFijarFamilia(ModelConfig.get("fijarFamilia"))
    setFijarBusquedaRapida(ModelConfig.get("fijarBusquedaRapida"))

    setEmitirBoleta(ModelConfig.get("emitirBoleta"))
    setTienePasarelaPago(ModelConfig.get("tienePasarelaPago"))
    setExcluirMediosEnBoleta(ModelConfig.get("excluirMediosEnBoleta"))
  }



  const handlerSaveAction = () => {
    ModelConfig.change("urlBase", urlBase);
    ModelConfig.change("cantidadProductosBusquedaRapida", cantBusqRap)
    ModelConfig.change("showPrintButton", showPrintButtonC)
    ModelConfig.change("widthPrint", widthPrint)

    ModelConfig.change("delayBetwenPrints", delayBetwenPrints)
    ModelConfig.change("delayCloseWindowPrints", delayCloseWindowPrints)
    // ModelConfig.change("sucursal", sucursal)
    // ModelConfig.change("puntoVenta", puntoVenta)
    ModelConfig.change("afterLogin", afterLogin)

    // ModelConfig.change("sucursalAuto", sucursalSelect)
    // ModelConfig.change("puntoVentaAuto", puntoVenta)

    ModelConfig.change("sucursal", sucursal)
    ModelConfig.change("sucursalNombre", buscarNombreSucursal(sucursal))
    ModelConfig.change("puntoVenta", puntoVenta)
    ModelConfig.change("puntoVentaNombre", buscarNombreCaja(puntoVenta))

    ModelConfig.change("codBalanza", balanzaCod)
    ModelConfig.change("largoIdProdBalanza", balanzaIdProd)
    ModelConfig.change("largoPesoBalanza", balanzaPesaje)
    ModelConfig.change("digitosPesoEnterosBalanza", balanzaDigitosPesoEnteros)


    ModelConfig.change("codBalanzaVentaUnidad", balanzaVentaUnidadCod)
    ModelConfig.change("largoIdProdBalanzaVentaUnidad", balanzaVentaUnidadIdProd)
    ModelConfig.change("largoPesoBalanzaVentaUnidad", balanzaVentaUnidadPesaje)
    ModelConfig.change("suspenderYRecuperar", suspenderYRecuperarx)
    ModelConfig.change("pedirDatosTransferencia", pedirDatosTransferencia)
    ModelConfig.change("pagarConCuentaCorriente", pagarConCuentaCorriente)
    ModelConfig.change("pedirPermisoBorrarProducto", pedirPermisoBorrarProducto)
    ModelConfig.change("cantidadTicketImprimir", cantidadTicketImprimir)
    ModelConfig.change("permitirVentaPrecio0", permitirVentaPrecio0)


    setShowPrintButton(showPrintButtonC)
    setSuspenderYRecuperar(suspenderYRecuperarx)
    setOpenDialog(false)

    if (
      !ModelConfig.isEqual("ordenMostrarListado", ordenMostrarListado)
      || !ModelConfig.isEqual("verBotonPreventa", verBotonPreventa)
      || !ModelConfig.isEqual("verBotonEnvases", verBotonEnvases)
      || !ModelConfig.isEqual("verBotonPagarFactura", verBotonPagarFactura)

      || !ModelConfig.isEqual("permitirAgregarYQuitarExtras", permitirAgregarYQuitarExtras)
      || !ModelConfig.isEqual("agruparProductoLinea", agruparProductoLinea)
      || !ModelConfig.isEqual("fijarBusquedaRapida", fijarBusquedaRapida)
      || !ModelConfig.isEqual("fijarFamilia", fijarFamilia)
    ) {
      showConfirm("Hay que recargar la pantalla principal para aplicar los cambios. Desea hacerlo ahora?", () => {
        window.location.href = window.location.href
      })
    }

    ModelConfig.change("ordenMostrarListado", ordenMostrarListado)
    ModelConfig.change("verBotonPreventa", verBotonPreventa)
    ModelConfig.change("verBotonEnvases", verBotonEnvases)
    ModelConfig.change("verBotonPagarFactura", verBotonPagarFactura)

    ModelConfig.change("permitirAgregarYQuitarExtras", permitirAgregarYQuitarExtras)
    ModelConfig.change("agruparProductoLinea", agruparProductoLinea)
    ModelConfig.change("fijarBusquedaRapida", fijarBusquedaRapida)
    ModelConfig.change("fijarFamilia", fijarFamilia)

    ModelConfig.change("tienePasarelaPago", tienePasarelaPago)
    ModelConfig.change("excluirMediosEnBoleta", excluirMediosEnBoleta)

    if (!ModelConfig.isEqual("emitirBoleta", emitirBoleta)) {
      setModoAvion(!emitirBoleta)
      console.log("cambiando modo avion a", !emitirBoleta)
    }
    ModelConfig.change("emitirBoleta", emitirBoleta)
  }

  const buscarNombreSucursal = (idSucursal:any) => {
    var nombre = ""
    sucursalesInfo.forEach((sucItem: any, ix) => {
      if (sucItem.idSucursal == idSucursal) {
        nombre = sucItem.descripcionSucursal
      }
    })

    return nombre
  }

  const buscarNombreCaja = (idCaja: string) => {
    var nombre = ""
    cajas.forEach((cajaItem: any, ix) => {
      if (cajaItem.id == idCaja) {
        nombre = cajaItem.value
      }
    })

    return nombre
  }

  const cargarSucursales = () => {
    Sucursal.getAll((responseData: any) => {
      setSucursalesInfo(responseData)
      separarSucursales(responseData)
    }, (error: any) => {

    })
  }

  const cargarOrdenesListados = () => {
    var seleccionables: any[] = []
    const keys:string[] = Object.keys(OrdenListado)

    keys.forEach((key:string, ix:number) => {
      var idx:number = OrdenListado[key]
      if (esSeleccionableTipo(idx)) {
        seleccionables.push({
          id: idx,
          value: key.replaceAll("_", " ")
        })
      }
    })

    setOrdenesMostrarListado(seleccionables as [])
  }

  const cargarTiposSeleccionables = () => {
    var seleccionables: any[] = []
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

    setSeleccionables(seleccionables as [])
  }

  const separarSucursales = (info:any) => {
    var sucursalesx: any[] = []
    info.forEach((infoItem:any, ix:number) => {
      sucursalesx.push({
        id: infoItem.idSucursal + "",
        value: infoItem.descripcionSucursal
      })
    })

    setSucursales(sucursalesx as [])
  }

  const esSeleccionableTipo = (tipo:any) => {
    return (
      tipo >= TiposPasarela.CAJA &&
      tipo <= TiposPasarela.CONSULTA_PRECIO
      || tipo == TiposPasarela.ESPEJO_PUNTO_VENTA
    )
  }

  const cargarCajas = (idSucursal:any) => {
    var cajasx: any[] = []
    if (!sucursalesInfo) return
    sucursalesInfo.forEach((sucursalItem: any, ix) => {
      if (sucursalItem.idSucursal == idSucursal) {
        sucursalItem.puntoVenta.forEach((cajaItem:any, ix2:number) => {
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
    setCajas(cajasx as [])
  }

  const checkSeleccionCaja = (caja:any) => {
    cajas.forEach((cajaItem: any, ix) => {
      if (cajaItem.id == caja) {
        setAfterLogin(cajaItem.tipo)
      }
    })
    setPuntoVenta(caja)
  }

  useEffect(() => {
    if (showAnchoImpresion) {
      setWidthPrint(widthPrint.replace("px", ""))
    } else {
      setWidthPrint(widthPrint + "px")
    }
  }, [showAnchoImpresion])

  const [tabNumber, setTabNumber] = useState(0)
  const [info, setInfo] = useState('')
  const handleChange = (even:any, newValue:number) => {
    setTabNumber(newValue);
  };


  const onFinish = () => {
    setOpenDialog(false)
  }

  return (
    <Dialog open={openDialog} maxWidth="lg" onClose={() => {
      setOpenDialog(false)
    }}
    >
      <DialogTitle>
        Configuraciones {System.getInstance().getAppName()}
      </DialogTitle>
      <DialogContent>

        <Tabs
          tabsItems={[
            {
              title: "General",
              content: (
                <TabGeneral onFinish={onFinish} />
              )
            } as Tab,
            {
              title: "Impresion",
              content: (
                <TabImpresion onFinish={onFinish} />
              )
            } as Tab,

            {
              title: "Balanza",
              content: (
                <TabBalanza onFinish={onFinish} />
              )
            } as Tab,

            {
              title: "Balanza unidad",
              content: (
                <TabBalanzaUnidad onFinish={onFinish} />
              )
            } as Tab,

            {
              title: "Emitir Boleta",
              content: (
                <TabBoleta onFinish={onFinish} />
              )
            } as Tab,

            {
              title: "Comida Rapida",
              content: (
                <TabComidaRapida onFinish={onFinish} />
              )
            } as Tab,

            {
              title: "Botones",
              content: (
                <TabBotones onFinish={onFinish} />
              )
            } as Tab,

            {
              title: "Productos",
              content: (
                <TabProductos onFinish={onFinish} />
              )
            } as Tab

          ]}
        />

      </DialogContent>
      <DialogActions>

      </DialogActions>
    </Dialog>
  );
};

export default AdminConfig;
