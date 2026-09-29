import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  Grid,
  Typography,
  TextField,
  Chip
} from "@mui/material";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import MainButton from "../Elements/MainButton";
import TableSelecSubFamily from "../BoxOptionsLite/TableSelect/TableSelecSubFamily";
import TableSelecProductNML from "../BoxOptionsLite/TableSelect/TableSelecProductNML";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { extraDefault, extraDefaultLlevar } from "../../Types/TExtra";
import Product from "../../Models/Product";
import TableSelecProductFromList from "../BoxOptionsLite/TableSelect/TableSelecProductFromList";
import SmallGrayButton from "../Elements/SmallGrayButton";
import SmallDangerButton from "../Elements/SmallDangerButton";
import Client from "../../Models/Client";
import ModelConfig from "../../Models/ModelConfig";
import TouchInputName from "../TouchElements/TouchInputName";
import TouchInputGenerico from "../TouchElements/TouchInputGenerico";
import InputCheckbox from "../Elements/Compuestos/InputCheckbox";
import PasarelaPago from "../../Models/PasarelaPago";
import TransaccionesPasarelaPago from "./TransaccionesPasarelaPago";



export default ({
  openDialog,
  setOpenDialog,
}) => {

  const {
    cliente,
    setCliente,
    showPrintButton,
    setShowPrintButton,
    suspenderYRecuperar,
    setSuspenderYRecuperar,
    showAlert,
    showLoading,
    hideLoading,
    showConfirm,
    showMessage,
    sales,
    salesData,
    setAskLastSale,
    clearSalesData,
    addToSalesData,
    setShowDialogSelectClient,
    setSalesData
  } = useContext(SelectedOptionsContext);

  const [pasarelaClientId, setPasarelaClientId] = useState("")
  const [pasarelaSecret, setPasarelaSecret] = useState("")

  const [pasarelaTerminalId, setPasarelaTerminalId] = useState("")
  const [pasarelaSucursalId, setPasarelaSucursalId] = useState(0)
  const [pasarelaSerialNumber, setPasarelaSerialNumber] = useState("")

  const [pasarelaPrint, setPasarelaPrint] = useState(false)
  const [verTransacciones, setVerTransacciones] = useState(false)
  const [pasarelaEnProduccion, setPasarelaEnProduccion] = useState(false)

  const loadConfigSesion = () => {
    setPasarelaClientId(ModelConfig.get("pasarelaClientId"))
    setPasarelaSecret(ModelConfig.get("pasarelaSecret"))

    setPasarelaTerminalId(ModelConfig.get("pasarelaTerminalId"))
    setPasarelaSucursalId(ModelConfig.get("pasarelaSucursalId"))
    setPasarelaSerialNumber(ModelConfig.get("pasarelaSerialNumber"))
    setPasarelaPrint(ModelConfig.get("pasarelaPrint"))
    setPasarelaEnProduccion(ModelConfig.get("pasarelaEnProduccion"))
  }

  const handlerSaveAction = () => {
    ModelConfig.change("pasarelaClientId", pasarelaClientId)
    ModelConfig.change("pasarelaSecret", pasarelaSecret)

    ModelConfig.change("pasarelaTerminalId", pasarelaTerminalId)
    ModelConfig.change("pasarelaSucursalId", pasarelaSucursalId)
    ModelConfig.change("pasarelaSerialNumber", pasarelaSerialNumber)
    ModelConfig.change("pasarelaPrint", pasarelaPrint)
    ModelConfig.change("pasarelaEnProduccion", pasarelaEnProduccion)

    showMessage("Guardado")
    setOpenDialog(false)
  }

  useEffect(() => {
    loadConfigSesion()
  }, [])

  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        setOpenDialog(false)
      }}
      maxWidth="lg"
    >
      <DialogTitle>
        Pasarela de pago
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} sm={12} md={12} lg={12}>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TouchInputGenerico
              inputState={[pasarelaClientId, setPasarelaClientId]}
              label={"Client id"}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TouchInputGenerico
              inputState={[pasarelaSecret, setPasarelaSecret]}
              label={"Secret"}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TouchInputGenerico
              inputState={[pasarelaTerminalId, setPasarelaTerminalId]}
              label={"Terminal id"}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TouchInputGenerico
              inputState={[pasarelaSucursalId, setPasarelaSucursalId]}
              label={"Sucursal id"}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TouchInputGenerico
              inputState={[pasarelaSerialNumber, setPasarelaSerialNumber]}
              label={"Numero serial"}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <InputCheckbox
              inputState={[pasarelaPrint, setPasarelaPrint]}
              label={"Imprimir en pasarela"}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <InputCheckbox
              inputState={[pasarelaEnProduccion, setPasarelaEnProduccion]}
              label={"Imprimir en produccion"}
            />
          </Grid>


          <Grid item xs={12} sm={12} md={12} lg={12}>
            <br />
            <SmallButton
              textButton={"Conexion"}
              actionButton={() => {
                PasarelaPago.conexion(() => {
                  showMessage("realizado correctamente")
                }, showMessage)
              }}
            />


            <SmallButton
              style={{
                width: "inherit"
              }}
              textButton={"Prueba Imprimir"}

              actionButton={() => {
                PasarelaPago.imprimir([
                  {
                    "printSeq": 1,
                    "type": "text",
                    "encode": "",
                    "data": "Este texto debe ser de maximo -48- caractere",
                    "align": "left"
                  },
                  {
                    "printSeq": 2,
                    "type": "text",
                    "encode": "",
                    "data": "Este text2 debe ser de maximo -48- caractere",
                    "align": "left"
                  },
                  {
                    "printSeq": 3,
                    "type": "text",
                    "encode": "",
                    "data": "Ct Descrip.            SKU         P/U",
                    "align": "left"
                  },
                  {
                    "printSeq": 4,
                    "type": "array",
                    "encode": "",
                    "data": [
                      { "item0": "99 Producto en venta 0 12345678901 $ 999.999.999" },
                      { "item1": "99 Producto en venta 1 12345678901 $ 999.999.999" },
                      { "item2": "99 Producto en venta 2 12345678901 $ 999.999.999" }
                    ],
                    "align": "left"
                  },
                  {
                    "printSeq": 5,
                    "type": "barcode",
                    "encode": "ean13",
                    "data": "123456789012",
                    "align": "center"
                  },
                  {
                    "printSeq": 6,
                    "type": "printcode",
                    "encode": "qr",
                    "data": "Este es un código QR",
                    "align": "center"
                  },
                  {
                    "printSeq": 7,
                    "type": "printcode",
                    "encode": "pdf417",
                    "data": "Este es un código PDF417 del SII",
                    "align": "center"
                  }
                ], () => {
                  showMessage("realizado correctamente")
                }, showMessage)
              }}

            />

            <SmallButton
              textButton={"Transacciones"}
              actionButton={() => {
                setVerTransacciones(true)
              }}
            />

            <SmallButton
              textButton={"Cerrar"}
              actionButton={() => {
                showLoading("Cerrando...")
                PasarelaPago.hacerCierre(() => {
                  hideLoading()
                  showMessage("realizado correctamente")
                }, (err) => {
                  showMessage(err)
                  hideLoading()
                })
              }}
            />

            <TransaccionesPasarelaPago
              openDialog={verTransacciones}
              setOpenDialog={setVerTransacciones}
            />

          </Grid>


        </Grid>

      </DialogContent>
      <DialogActions>
        <SmallButton
          textButton="Guardar"
          actionButton={handlerSaveAction} />
        <Button onClick={() => {
          setOpenDialog(false)
        }}>Volver</Button>
      </DialogActions>
    </Dialog>
  );
};

