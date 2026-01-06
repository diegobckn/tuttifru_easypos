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
  CircularProgress,
  DialogTitle
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";
import Suspender from "../../Models/Suspender";
import Validator from "../../Helpers/Validator";
import IngresarTexto from "./IngresarTexto";
import LastSale from "../../Models/LastSale";
import Printer from "../../Models/Printer";
import ProductSold from "../../Models/ProductSold";
import PrinterServer from "../../Models/PrinterServer";
import dayjs from "dayjs";
import GrillaProductosVendidos from "../BoxOptionsLite/GrillaProductosVendidos";
import TouchInputNumber from "../TouchElements/TouchInputNumber";
import Model from "../../Models/Model";
import SmallPrimaryButton from "../Elements/SmallPrimaryButton";
import System from "../../Helpers/System";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import SelectSucursal from "../Elements/Compuestos/SelectSucursal";
import SelectCaja from "../Elements/Compuestos/SelectCaja";

var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

export default ({
  openDialog,
  setOpenDialog
}) => {
  const {
    userData,
    salesData,
    sales,
    clearSalesData,
    showMessage,
    showAlert,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [folio, setFolio] = useState("")
  const [codigoSucursal, setCodigoSucursal] = useState("")
  const [codigoCaja, setCodigoCaja] = useState("")
  const [comprobanteServidor, setComprobanteServidor] = useState(null)

  const [sucursales, setSucursales] = useState([])
  const [sucursalInfo, setSucursalInfo] = useState(null)

  const buscarComprobante = () => {
    console.log("buscarComprobante")
    Model.getComprobante({
      nroFolio: folio,
      codigoSucursal,
      codigoCaja
    }, (dataServidor) => {
      if (dataServidor.cantidadRegistros > 0) {
        setComprobanteServidor(dataServidor.comprobanteHTML)
      } else {
        showMessage("No se encontro el comprobante")
      }
    }, showMessage)
  }

  const imprimir = () => {
    var tipo = "imprimirTicket"
    if (comprobanteServidor.descripcionComprobante.toLowerCase() == "boleta") {
      tipo = "imprimirBoleta"
    }

    const formatoImprimir = {
      imprimir: {}
    }

    formatoImprimir.imprimir[tipo] = comprobanteServidor.htmlImprimir

    console.log("comprobanteServidor", comprobanteServidor)
    console.log("formatoImprimir", formatoImprimir)
    Printer.printContent(formatoImprimir, showConfirm, showAlert)
  }

  useEffect(() => {
    if (!openDialog) {
      return
    }
    setCodigoSucursal(ModelConfig.get("sucursal"))
    setCodigoCaja(ModelConfig.get("puntoVenta"))

    setFolio("")
    setComprobanteServidor(null)
  }, [openDialog])

  useEffect(() => {
    console.log("cambio codigoSucursal", codigoSucursal)
  }, [codigoSucursal])


  return (
    <Dialog open={openDialog} maxWidth="md" onClose={() => setOpenDialog(false)} fullWidth>
      <DialogTitle>
        Reimprimir Comprobante
      </DialogTitle>
      <DialogContent>

        <Grid container spacing={2}>

          {!comprobanteServidor ? (
            <>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <SelectSucursal
                  withLabel={false}
                  inputState={[codigoSucursal, setCodigoSucursal]}
                  label="Sucursal"
                  setSucursalSelected={(sel) => {
                    console.log("sel ", sel)
                    setSucursalInfo(sel)
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={5} lg={5}>
                {/* <TouchInputNumber
                  withLabel={false}
                  inputState={[codigoCaja, setCodigoCaja]}
                  label="Caja"
                /> */}
                <SelectCaja
                  withLabel={false}
                  sucursalInfo={sucursalInfo}
                  inputState={[codigoCaja, setCodigoCaja]}
                  label="Caja"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TouchInputNumber
                  withLabel={false}
                  inputState={[folio, setFolio]}
                  label="Nro Folio"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={5} lg={5}>
                <SmallButton
                  style={{
                    width: "100%",
                    position: "relative",
                    marginTop: "20px",
                    height: "50px"
                  }}
                  textButton={"Buscar"}
                  actionButton={buscarComprobante}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography>Numero de folio: {folio}</Typography>
                <Typography>Tipo de comprobante: {comprobanteServidor.descripcionComprobante}</Typography>
                <Typography>Fecha: {System.formatDateServer(comprobanteServidor.fechaIngreso)}</Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <SmallPrimaryButton
                  style={{
                    width: "100%",
                    position: "relative",
                    marginTop: "20px",
                    height: "50px"
                  }}
                  textButton={"Imprimir"}
                  actionButton={imprimir}
                />

              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <SmallSecondaryButton
                  style={{
                    width: "100%",
                    position: "relative",
                    marginTop: "20px",
                    height: "50px"
                  }}
                  textButton={"buscar otro comprobante"}
                  actionButton={() => {
                    setComprobanteServidor(null)
                  }}
                />
              </Grid>

            </>
          )}

        </Grid>
      </DialogContent>
      <DialogActions>

        <Button onClick={() => {
          setOpenDialog(false)
        }}>Cerrar</Button>
      </DialogActions>
    </Dialog >
  );
};

