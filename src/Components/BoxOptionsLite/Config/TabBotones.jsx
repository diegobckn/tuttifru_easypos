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
import Sucursal from "../../../Models/Sucursal";
import TiposPasarela from "../../../definitions/TiposPasarela";
import BoxOptionList from "../BoxOptionList";
import InputCheckbox from "../../Elements/Compuestos/InputCheckbox";
import InputCheckboxAutorizar from "../../Elements/Compuestos/InputCheckboxAutorizar";
import BoxBat from "../BoxBat";
import TouchInputNumber from "../../TouchElements/TouchInputNumber";
import BoxFamilias from "../BoxFamilias";
import ShowFamilies from "../../ScreenDialog/ShowFamilies";
import SmallGrayButton from "../../Elements/SmallGrayButton";
import SmallDangerButton from "../../Elements/SmallDangerButton";

const TabBotones = ({
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
    setUltimoVuelto
  } = useContext(SelectedOptionsContext);

  const [verBotonPreventa, setVerBotonPreventa] = useState(false)
  const [verBotonEnvases, setVerBotonEnvases] = useState(false)
  const [verBotonPagarFactura, setVerBotonPagarFactura] = useState(false)

  const [suspenderYRecuperarx, setSuspenderYRecuperarx] = useState(false)
  const [cantidadProductosBusquedaRapida, setCantidadProductosBusquedaRapida] = useState(20)
  const [botonesExtrasBusquedaRapida, setBotonesExtrasBusquedaRapida] = useState([])
  const [showFamily, setShowFamily] = useState(false)


  const loadConfigSesion = () => {
    // console.log("loadConfigSesion")

    setVerBotonPreventa(ModelConfig.get("verBotonPreventa"))
    setVerBotonEnvases(ModelConfig.get("verBotonEnvases"))
    setVerBotonPagarFactura(ModelConfig.get("verBotonPagarFactura"))
    setSuspenderYRecuperarx(ModelConfig.get("suspenderYRecuperar"))

    setCantidadProductosBusquedaRapida(ModelConfig.get("cantidadProductosBusquedaRapida"))
    setBotonesExtrasBusquedaRapida(ModelConfig.get("botonesExtrasBusquedaRapida"))

  }

  const handlerSaveAction = () => {
    if (
      !ModelConfig.isEqual("verBotonPreventa", verBotonPreventa)
      || !ModelConfig.isEqual("verBotonEnvases", verBotonEnvases)
      || !ModelConfig.isEqual("verBotonPagarFactura", verBotonPagarFactura)

    ) {
      showConfirm("Hay que recargar la pantalla principal para aplicar los cambios. Desea hacerlo ahora?", () => {
        window.location.href = window.location.href
      })
    }
    ModelConfig.change("verBotonPreventa", verBotonPreventa)
    ModelConfig.change("verBotonEnvases", verBotonEnvases)
    ModelConfig.change("verBotonPagarFactura", verBotonPagarFactura)
    ModelConfig.change("suspenderYRecuperar", suspenderYRecuperarx)
    ModelConfig.change("cantidadProductosBusquedaRapida", cantidadProductosBusquedaRapida)
    ModelConfig.change("botonesExtrasBusquedaRapida", botonesExtrasBusquedaRapida)


    showMessage("Guardado correctamente")
    // onFinish()
  }

  useEffect(() => {
    loadConfigSesion()
  }, [])



  return (
    <Grid container spacing={2}>

      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[verBotonPreventa, setVerBotonPreventa]}
          label={"Ver boton Preventa"}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>

        <InputCheckbox
          inputState={[verBotonPagarFactura, setVerBotonPagarFactura]}
          label={"Ver boton Pagar Factura"}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[verBotonEnvases, setVerBotonEnvases]}
          label={"Ver boton Envases"}
        />
      </Grid>


      <Grid item xs={12} md={12} lg={12}>
        <InputCheckboxAutorizar
          inputState={[suspenderYRecuperarx, setSuspenderYRecuperarx]}
          label={"Suspender y Recuperar"}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Grid container spacing={2} sx={{
          border: "1px solid #ccc",
          padding: "10px",
          marginTop: "20px",
          marginBottom: "20px",
          backgroundColor: "whitesmoke"
        }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography>
              Productos Busqueda Rapida
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <TouchInputNumber
              inputState={[cantidadProductosBusquedaRapida, setCantidadProductosBusquedaRapida]}
              label="Cantidad"
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid container spacing={2} sx={{
              border: "1px solid #ccc",
              padding: "10px",
              marginTop: "20px",
              marginBottom: "20px",
            }}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography>
                  Botones extras
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={8} lg={8}>
                <div style={{
                }}>

                  {botonesExtrasBusquedaRapida.map((item, index) => {
                    console.log("item:", item)
                    return (
                      <SmallGrayButton
                        key={index}
                        textButton={(<Typography>
                          {item.categoria.descripcion}
                          -
                          {item.subcategoria.descripcion}
                          -
                          {item.familia.descripcion}
                          -
                          {item.subfamilia.descripcion}
                        </Typography>)}

                        actionButton={() => { }}
                      />
                    )
                  })}


                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={8} lg={8}>

                <ShowFamilies
                  openDialog={showFamily}
                  setOpenDialog={setShowFamily}
                  selectProduct={false}
                  addDirectoToSales={false}
                  onSelect={(product, cat, subcat, fam, subfam) => {

                    console.log("product seleccionada:", product)
                    console.log("cat seleccionada:", cat)
                    console.log("subcat seleccionada:", subcat)
                    console.log("familia seleccionada:", fam)
                    console.log("subfamilia seleccionada:", subfam)
                    setShowFamily(false)

                    setBotonesExtrasBusquedaRapida([...botonesExtrasBusquedaRapida, {
                      categoria: cat,
                      subcategoria: subcat,
                      familia: fam,
                      subfamilia: subfam
                    }])
                  }}
                />

                <SmallDangerButton
                  textButton="Quitar todos los botones"
                  actionButton={() => {
                    setBotonesExtrasBusquedaRapida([])
                  }}
                />

                 <SmallButton
                  textButton="Agregar Boton"
                  actionButton={() => {
                    setShowFamily(true)
                  }}
                />
              </Grid>
            </Grid>

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


    </Grid >
  );
};

export default TabBotones;
