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
import TouchInputPage from "../../TouchElements/TouchInputPage";
import ModelConfig from "../../../Models/ModelConfig";
import SmallButton from "../../Elements/SmallButton";
import TouchInputNumber from "../../TouchElements/TouchInputNumber";
import InputCheckbox from "../../Elements/Compuestos/InputCheckbox";
import IngresarNumeroORut from "../../ScreenDialog/IngresarNumeroORut";
import LastSale from "../../../Models/LastSale";
import PrinterServer from "../../../Models/PrinterServer";
import BoxOptionList from "../BoxOptionList";
import { EmitirDetalle } from "../../../definitions/EmisionesDetalle";
import System from "../../../Helpers/System";
import ConfigPlantillas from "../../ScreenDialog/ConfigPlantillas";
import ModosImpresion from "../../../definitions/ModosImpresion";

const TabImpresion = ({
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
    showConfirm,
    showDialogSelectClient,
    setShowDialogSelectClient,
    modoAvion,
    ultimoVuelto,
    setUltimoVuelto,

    showPrintButton,
    setShowPrintButton,
    suspenderYRecuperar,
    setSuspenderYRecuperar,
    showAlert
  } = useContext(SelectedOptionsContext);


  const [cantidadTicketImprimir, setcantidadTicketImprimir] = useState(1)

  const [modoImpresion, setModoImpresion] = useState(null)

  const [showPrintButtonC, setShowPrintButtonC] = useState(false)
  const [widthPrint, setWidthPrint] = useState("")
  const [delayBetwenPrints, setDelayBetwenPrints] = useState("")
  const [delayCloseWindowPrints, setdelayCloseWindowPrints] = useState("")

  const [showAnchoImpresion, setshowAnchoImpresion] = useState(false)

  const [urlServicioImpresion, setUrlServicioImpresion] = useState(false)
  const [puertoImpresiones, setPuertoImpresiones] = useState(false)
  const [zoomImpresiones, setZoomImpresiones] = useState("")

  const [emitirDetalle, setEmitirDetalle] = useState(false)
  const [showConfigPlantillas, setShowConfigPlantillas] = useState(false)

  const loadConfigSesion = () => {


    setShowPrintButtonC(ModelConfig.get("showPrintButton"))
    setWidthPrint(ModelConfig.get("widthPrint"))

    setDelayBetwenPrints(ModelConfig.get("delayBetwenPrints"))
    setdelayCloseWindowPrints(ModelConfig.get("delayCloseWindowPrints"))

    setcantidadTicketImprimir(ModelConfig.get("cantidadTicketImprimir"))
    setUrlServicioImpresion(ModelConfig.get("urlServicioImpresion"))
    setPuertoImpresiones(ModelConfig.get("puertoImpresiones"))
    setModoImpresion(ModelConfig.get("modoImpresion"))
    setZoomImpresiones(ModelConfig.get("zoomImpresiones"))

    setEmitirDetalle(ModelConfig.get("emitirDetalle"))


  }

  const handlerSaveAction = () => {
    ModelConfig.change("modoImpresion", modoImpresion)
    ModelConfig.change("showPrintButton", showPrintButtonC)
    ModelConfig.change("widthPrint", widthPrint)

    ModelConfig.change("delayBetwenPrints", delayBetwenPrints)
    ModelConfig.change("delayCloseWindowPrints", delayCloseWindowPrints)

    ModelConfig.change("cantidadTicketImprimir", cantidadTicketImprimir)
    ModelConfig.change("urlServicioImpresion", urlServicioImpresion)
    ModelConfig.change("puertoImpresiones", puertoImpresiones)
    ModelConfig.change("zoomImpresiones", zoomImpresiones)
    ModelConfig.change("emitirDetalle", emitirDetalle)

    setShowPrintButton(showPrintButtonC)

    showMessage("Guardado correctamente")
    // onFinish()
  }

  useEffect(() => {
    loadConfigSesion()
  }, [])

  useEffect(() => {

    if (widthPrint == '') return
    if (showAnchoImpresion) {
      setWidthPrint(widthPrint.replaceAll("px", ""))
    } else {
      setWidthPrint((widthPrint + "px").replaceAll("px", "") + "px")
    }
  }, [showAnchoImpresion])


  return (
    <Grid container spacing={2}>

      <IngresarNumeroORut
        title="Ancho impresora"
        openDialog={showAnchoImpresion}
        setOpenDialog={setshowAnchoImpresion}
        varChanger={setWidthPrint}
        varValue={widthPrint}
      />

      <Grid item xs={12} sm={12} md={12} lg={12} sx={{
        border: "1px solid #C5C3C3",
        backgroundColor: "#f6f6f6",
        borderRadius: "4px",
        padding: "20px",
        marginTop: "20px"
      }}>

        <Typography sx={{
          fontWeight: "bold",
          marginBottom: "20px"
        }}>
          Impresion
        </Typography>

        <Grid container spacing={2} sx={{
        }}>


          <Grid item xs={12} sm={12} md={12} lg={12}>
            <label
              style={{
                userSelect: "none",
                fontSize: "19px",
                display: "inline-block",
                margin: "10px 0"
              }}>
              Impresora
            </label>
            <BoxOptionList
              optionSelected={modoImpresion}
              setOptionSelected={setModoImpresion}
              options={System.arrayIdValueFromObject(ModosImpresion, true)}
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
              Emitir detalles
            </label>
            <BoxOptionList
              optionSelected={emitirDetalle}
              setOptionSelected={setEmitirDetalle}
              options={System.arrayIdValueFromObject(EmitirDetalle, true)}
            />

          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <ConfigPlantillas
              openDialog={showConfigPlantillas}
              setOpenDialog={setShowConfigPlantillas}
            />
            <SmallButton textButton={"Configurar Plantillas"} actionButton={() => {
              setShowConfigPlantillas(true)
            }} />
            <br />
            <br />
            <br />
          </Grid>




          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography sx={{
              fontSize: "18px",
              color: "#7E7E7E",
              marginBottom: "8px"
            }}>Ancho impresora</Typography>
            <TextField
              margin="normal"
              fullWidth
              type="text" // Cambia dinámicamente el tipo del campo de contraseña
              value={widthPrint}
              onChange={(e) => setWidthPrint(e.target.value)}
              onClick={(e) => setshowAnchoImpresion(true)}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TouchInputNumber
              inputState={[cantidadTicketImprimir, setcantidadTicketImprimir]}
              label="Cantidad de tickets a imprimir"
            />
          </Grid>


          <Grid item xs={12} sm={12} md={6} lg={6}>

            <TouchInputNumber
              inputState={[delayBetwenPrints, setDelayBetwenPrints]}
              label="Demora entre impresiones(segundos)"
              isDecimal={true}
            />

          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TouchInputNumber
              inputState={[delayCloseWindowPrints, setdelayCloseWindowPrints]}
              label="Demora cierre ventana(segundos)"
              isDecimal={true}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>

            <InputCheckbox
              inputState={[showPrintButtonC, setShowPrintButtonC]}
              label={"Mostrar Botones de pruebas"}
            />
          </Grid>


        </Grid>
      </Grid>





      <Grid item xs={12} sm={12} md={12} lg={12} sx={{
        border: "1px solid #C5C3C3",
        backgroundColor: "#f6f6f6",
        borderRadius: "4px",
        padding: "20px",
        marginTop: "20px"
      }}>

        <Typography>Servidor de impresiones</Typography>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <br />
            <br />
            <TouchInputPage
              inputState={[urlServicioImpresion, setUrlServicioImpresion]}
              fieldName="Url servidor"
              onEnter={() => {
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3}>
            <br />
            <br />
            <TouchInputPage
              inputState={[puertoImpresiones, setPuertoImpresiones]}
              fieldName="Puerto"
              onEnter={() => {
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3}>
            <br />
            <br />
            <TouchInputPage
              inputState={[zoomImpresiones, setZoomImpresiones]}
              fieldName="Zoom"
              onEnter={() => {
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <SmallButton textButton="listado" actionButton={() => {

              PrinterServer.getPrinters((res) => {
                const listado = res.listado.length > 0 ? "Impresoras disponibles: " + res.listado.join(", ") : " No se encontraron impresoras conectadas."
                showAlert(listado)
              }, showAlert)

            }} />

            <SmallButton textButton="prueba" actionButton={() => {

              console.log("antes de enviar..", dayjs().format("HH:mm:ss"))
              PrinterServer.printTest((res) => {
                console.log("finaliza..", dayjs().format("HH:mm:ss"))
                showAlert("Realizado correctamente")
              }, showAlert)

            }} />

            <SmallButton textButton="Ticket" actionButton={() => {
              // console.log("antes de enviar..", dayjs().format("HH:mm:ss"))
              PrinterServer.print({
                "idUsuario": 1313,
                "fechaIngreso": "2025-04-08T23:40:19.000Z",
                "codigoCliente": 0,
                "codigoUsuarioVenta": 0,
                "subtotal": 1501,
                "totalPagado": 1500,
                "totalRedondeado": 1500,
                "vuelto": 0,
                "redondeo": -1,
                "products": [
                  {
                    "codProducto": 0,
                    "codbarra": "4302",
                    "cantidad": 0.3,
                    "precioUnidad": 5004,
                    "descripcion": "PAN DE MESA",
                  }
                ],
              }, (res) => {
                // console.log("finaliza..", dayjs().format("HH:mm:ss"))
                showAlert("Realizado correctamente")
              }, showAlert)



            }} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12}>
        <SmallButton textButton="Reiniciar sistema" actionButton={() => {
          window.location.href = window.location.href
        }} style={{
          backgroundColor: "blueviolet",
          width: "inherit"
        }} />

        <SmallButton textButton="Guardar" actionButton={handlerSaveAction} />
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

export default TabImpresion;
