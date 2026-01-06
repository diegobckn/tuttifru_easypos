import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";
import BoxOptionList from "./BoxOptionList";
import ModelConfig from "../../Models/ModelConfig";
import Sucursal from "../../Models/Sucursal";


export default ({
  visible,

  sucursal,
  setSucursal,
  nombreSucursal = "",
  setNombreSucursal = (nombre) => { },

  caja,
  setCaja,
  nombreCaja = "",
  setNombreCaja = (nombre) => { },

  onCargaSucursales = (sucs) => { },
  refreshSucursales = false,

  resetCambioManual = false,

}) => {
  const {
    userData,
    salesData,
    grandTotal,
    setSelectedUser,
    setTextSearchProducts,
    clearSalesData,

    cliente,
    setCliente,
    setAskLastSale,
    showMessage,
    showLoading,
    hideLoading,
    setShowDialogSelectClient,
    modoAvion,
    showAlert,
    setUltimoVuelto,
    sales,
    setSolicitaRetiro,
    showConfirm,
    setListSalesOffline,
    createQrString,
  } = useContext(SelectedOptionsContext);


  const [sucursales, setSucursales] = useState([])
  const [sucursalesInfo, setSucursalesInfo] = useState([])
  const [cargoCajas, setCargoCajas] = useState(false)
  const [cargoSucursales, setCargoSucursales] = useState(false)

  const [verSucursalesMype, setVerSucursalesMype] = useState(false)

  const [cajas, setCajas] = useState([])

  const [cambioManual, setCambioManual] = useState(false)


  const cargarSucursales = () => {
    // console.log("cargarSucursales")
    Sucursal.getAll((responseData) => {
      onCargaSucursales(responseData)

      separarSucursales(responseData)
      setSucursalesInfo(responseData)
      // console.log("setSucursalesInfo(responseData)")
      // console.log("setSucursalesInfo de ", System.clone(responseData))

      if (!cambioManual && sucursal === "-1") setSucursal(ModelConfig.get("sucursal"))
      setCargoSucursales(true)

    }, (error) => {
      setCargoSucursales(true)
    })
  }

  const separarSucursales = (sucursalesArr) => {
    // console.log("separarSucursales")
    var sucursalesx = []
    sucursalesArr.forEach((infoItem, ix) => {
      var esMype = (infoItem.descripcionSucursal.toLowerCase().indexOf("mype") > -1)
      if (!esMype || verSucursalesMype) {
        sucursalesx.push({
          id: infoItem.idSucursal + "",
          value: infoItem.descripcionSucursal
        })
      } else {
        console.log("no agrego sucursal de mype", infoItem)
      }
    })
    setSucursales(sucursalesx)
  }

  const cargarCajas = (idSucursal) => {
    // console.log("cargarCajas", idSucursal)
    // console.log("sucursalesInfo", System.clone(sucursalesInfo))
    var cajasx = []
    if (!sucursalesInfo) return
    sucursalesInfo.forEach((sucursalItem, ix) => {
      if (sucursalItem.idSucursal == idSucursal) {
        sucursalItem.puntoVenta.forEach((cajaItem, ix2) => {
          // if (
          //   esSeleccionableTipo(cajaItem.idSucursalPvTipo)

          // ) {
          cajasx.push({
            id: cajaItem.idCaja + "",
            value: cajaItem.sPuntoVenta,
            tipo: cajaItem.idSucursalPvTipo
          })
          // }
        })
      }
    })
    setCajas(cajasx)
    setCargoCajas(true)
  }

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

  const checkSeleccionCaja = (caja) => {
    setCaja(caja)
  }


  useEffect(() => {
    cargarCajas(sucursal)
  }, [sucursal])

  useEffect(() => {
    // if (!cambioManual) {
    // console.log("haciendo reset de sucursal y caja")
    if (sucursal === "-1" && ModelConfig.get("sucursal") != "-1") {
      // console.log("haciendo reset de sucursal..a", ModelConfig.get("sucursal"))
      setSucursal(ModelConfig.get("sucursal"))
      setNombreSucursal(ModelConfig.get("sucursalNombre"))
    }
    if (caja === "-1" && ModelConfig.get("puntoVenta") != "-1") {
      // console.log("haciendo reset de caja..a", ModelConfig.get("puntoVenta"))
      setCaja(ModelConfig.get("puntoVenta"))
      setNombreCaja(ModelConfig.get("puntoVentaNombre"))
    }
    // }
  }, [])

  useEffect(() => {
    if (cambioManual) {
      // console.log("cambio sucursal", sucursal)
      // console.log("caja", caja)
      setNombreSucursal(buscarNombreSucursal(sucursal))
      setCaja("-1")
      cargarCajas(sucursal)
    }
  }, [sucursal])
  useEffect(() => {
    if (cambioManual) {
      // console.log("cambio caja", caja)
      // console.log("sucursal", sucursal)
      setNombreCaja(buscarNombreCaja(caja))
    }
  }, [caja])

  useEffect(() => {
    if (sucursal != "-1") {
      cargarCajas(sucursal)
    }
  }, [sucursalesInfo])

  useEffect(() => {
    cargarSucursales()
  }, [verSucursalesMype])

  useEffect(() => {
    // console.log("cambio refreshSucursales", refreshSucursales)
    cargarSucursales()
  }, [refreshSucursales])

  // useEffect(() => {
  //   setCambioManual(false)
  // }, [resetCambioManual])

  return (
    <>
      <Grid item xs={12} lg={12}>
        <Typography>Elegir Sucursal</Typography>
        <BoxOptionList
          optionSelected={sucursal}
          setOptionSelected={(x) => {
            setCambioManual(true)
            // console.log("setOptionSelected", x)
            setSucursal(x)
            if (!window.sucursalClicked) window.sucursalClicked = 0
            window.sucursalClicked++

            if (window.sucursalClicked % 3 == 0) {
              window.sucursalClicked = 0
              setVerSucursalesMype(!verSucursalesMype)
            }

            // console.log("window.sucursalClicked", window.sucursalClicked)
            cargarCajas(x)
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
          optionSelected={caja}
          setOptionSelected={(e) => {
            setCambioManual(true)
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

    </>
  )
};
