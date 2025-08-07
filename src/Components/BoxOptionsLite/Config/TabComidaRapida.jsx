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
import BoxOptionListMulti from "../BoxOptionListMulti";
import System from "../../../Helpers/System";
import MetodosPago from "../../../definitions/MetodosPago";
import { EmitirDetalle, ModosImpresion } from "../../../definitions/BaseConfig";
import BoxOptionList from "../BoxOptionList";

const TabComidaRapida = ({
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

    setModoAvion
  } = useContext(SelectedOptionsContext);

  const [permitirAgregarYQuitarExtras, setpermitirAgregarYQuitarExtras] = useState(false)
  const [agruparProductoLinea, setAgruparProductoLinea] = useState(false)
  const [fijarBusquedaRapida, setFijarBusquedaRapida] = useState(false)
  const [fijarFamilia, setFijarFamilia] = useState(false)
  const [trabajarConComanda, setTrabajarConComanda] = useState(false)

  const [puertoImpresionComanda, setPuertoImpresionComanda] = useState(false)
  const [urlServicioImpresionComanda, setUrlServicioImpresionComanda] = useState(false)
  const [imprimirPapelComanda, setImprimirPapelComanda] = useState(false)

  const [modoImpresionComanda, setModoImpresionComanda] = useState(null)
  const [zoomImpresionComanda, setZoomImpresionComanda] = useState("")

  const loadConfigSesion = () => {
    setpermitirAgregarYQuitarExtras(ModelConfig.get("permitirAgregarYQuitarExtras"))
    setAgruparProductoLinea(ModelConfig.get("agruparProductoLinea"))
    setFijarFamilia(ModelConfig.get("fijarFamilia"))
    setFijarBusquedaRapida(ModelConfig.get("fijarBusquedaRapida"))
    setTrabajarConComanda(ModelConfig.get("trabajarConComanda"))
    setPuertoImpresionComanda(ModelConfig.get("puertoImpresionComanda"))
    setUrlServicioImpresionComanda(ModelConfig.get("urlServicioImpresionComanda"))
    setImprimirPapelComanda(ModelConfig.get("imprimirPapelComanda"))

    setModoImpresionComanda(ModelConfig.get("modoImpresionComanda"))
    setZoomImpresionComanda(ModelConfig.get("zoomImpresionComanda"))


  }

  const handlerSaveAction = () => {
    if (
      !ModelConfig.isEqual("permitirAgregarYQuitarExtras", permitirAgregarYQuitarExtras)
      || !ModelConfig.isEqual("agruparProductoLinea", agruparProductoLinea)
      || !ModelConfig.isEqual("fijarBusquedaRapida", fijarBusquedaRapida)
      || !ModelConfig.isEqual("fijarFamilia", fijarFamilia)
    ) {
      showConfirm("Hay que recargar la pantalla principal para aplicar los cambios. Desea hacerlo ahora?", () => {
        window.location.href = window.location.href
      })
    }


    ModelConfig.change("permitirAgregarYQuitarExtras", permitirAgregarYQuitarExtras)
    ModelConfig.change("agruparProductoLinea", agruparProductoLinea)
    ModelConfig.change("fijarBusquedaRapida", fijarBusquedaRapida)
    ModelConfig.change("fijarFamilia", fijarFamilia)
    ModelConfig.change("trabajarConComanda", trabajarConComanda)
    ModelConfig.change("puertoImpresionComanda", puertoImpresionComanda)
    ModelConfig.change("urlServicioImpresionComanda", urlServicioImpresionComanda)
    ModelConfig.change("imprimirPapelComanda", imprimirPapelComanda)
    ModelConfig.change("modoImpresionComanda", modoImpresionComanda)
    ModelConfig.change("zoomImpresionComanda", zoomImpresionComanda)

    showMessage("Guardado correctamente")
    // onFinish()
  }

  useEffect(() => {
    loadConfigSesion()
  }, [])


  return (
    <Grid container spacing={2}>

      <Grid item xs={12} md={12} lg={12}>
        <h3>Comida rapida</h3>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>

        <InputCheckbox
          inputState={[permitirAgregarYQuitarExtras, setpermitirAgregarYQuitarExtras]}
          label={"Permitir Agregar/Quitar extras en productos"}
        />

      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[agruparProductoLinea, setAgruparProductoLinea]}
          label={"Agrupar Producto Linea"}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[fijarFamilia, setFijarFamilia]}
          label={"Fijar Familia"}
        />
      </Grid>



      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[fijarBusquedaRapida, setFijarBusquedaRapida]}
          label={"Fijar Busqueda Rapida"}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={2} sx={{
          backgroundColor: "#f2f2f2",
          padding: "10px"
        }}>

          <Grid item xs={12} md={12} lg={12}>
            <InputCheckbox
              inputState={[trabajarConComanda, setTrabajarConComanda]}
              label={"Trabajar con comanda"}
            />
          </Grid>

          {trabajarConComanda && (
            <>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TouchInputPage
                  inputState={[urlServicioImpresionComanda, setUrlServicioImpresionComanda]}
                  fieldName="Url servidor comanda"
                  onEnter={() => {
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={3} lg={3}>
                <TouchInputPage
                  inputState={[puertoImpresionComanda, setPuertoImpresionComanda]}
                  fieldName="puerto comanda"
                  onEnter={() => {
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={3} lg={3}>
                <TouchInputPage
                  inputState={[zoomImpresionComanda, setZoomImpresionComanda]}
                  fieldName="Zoom"
                  onEnter={() => {
                  }}
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
                  Impresion del papel
                </label>
                <BoxOptionList
                  optionSelected={imprimirPapelComanda}
                  setOptionSelected={setImprimirPapelComanda}
                  options={System.arrayIdValueFromObject(EmitirDetalle, true)}
                />

              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <label
                  style={{
                    userSelect: "none",
                    fontSize: "19px",
                    display: "inline-block",
                    margin: "10px 0"
                  }}>
                  Impresora de la comanda
                </label>
                <BoxOptionList
                  optionSelected={modoImpresionComanda}
                  setOptionSelected={setModoImpresionComanda}
                  options={System.arrayIdValueFromObject(ModosImpresion, true)}
                />

              </Grid>

            </>
          )}
        </Grid>
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <br />
        <br />
        <br />
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

export default TabComidaRapida;
