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
import BalanzaDigiControl from "../../ScreenDialog/BalanzaDigiControl";
import OCR from "../../ScreenDialog/OCR";
import OCRModal from "../../ScreenDialog/OCRModal";
import TouchInputName from "../../TouchElements/TouchInputName";
import BoxOptionList from "../BoxOptionList";
import System from "../../../Helpers/System";
import BalanzaDigi from "../../../Models/BalanzaDigi";
import SmallSecondaryButton from "../../Elements/SmallSecondaryButton";
import SmallPrimaryButton from "../../Elements/SmallPrimaryButton";
import SmallGrayButton from "../../Elements/SmallGrayButton";
import SmallWarningButton from "../../Elements/SmallWarningButton";
import SmallSuccessButton from "../../Elements/SmallSuccessButton";
import SmallDangerButton from "../../Elements/SmallDangerButton";
import { ModosLecturaDigi } from "../../../definitions/BaseConfig";

const TabBalanzaDigi = ({
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
    showAlert,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [ipBalanzaDigi, setIpBalanzaDigi] = useState("")
  const [puertaBalanzaDigi, setPuertaBalanzaDigi] = useState("")
  const [usuarioBalanzaDigi, setUsuarioBalanzaDigi] = useState("")
  const [claveBalanzaDigi, setClaveBalanzaDigi] = useState("")
  const [codigoValeBalanzaDigi, setCodigoValeBalanzaDigi] = useState("")
  const [refreshValeBalanzaDigi, setRefreshValeBalanzaDigi] = useState("")

  const [urlServicioBalanzaDigi, setUrlServicioBalanzaDigi] = useState("");
  const [revisarValeRepeditoBalanzaDigi, setRevisarValeRepeditoBalanzaDigi] = useState(false);

  const MODELOSDIGI = {
    SM300: "sm-300",
    SM110_TWS: "sm-110-tws",
    SM120: "sm-120",
  }

  const [verDigi, setVerDigi] = useState(false);
  const [modeloBalanzaDigi, setModeloBalanzaDigi] = useState(MODELOSDIGI.SM300);

  const [modoLecturaBalanzaDigi, setModoLecturaBalanzaDigi] = useState(null);

  const [trabajarConBalanzaDigi, setTrabajarConBalanzaDigi] = useState(false);
  const [balanzasDigi, setBalanzasDigi] = useState([]);
  const [balanzaDigiSelected, setBalanzaDigiSelected] = useState(-1);

  const balanza = new BalanzaDigi()

  const eliminarUltimaBalanza = () => {
    var balanzasSesion = System.clone(balanzasDigi)
    if (balanzaDigiSelected != balanzasDigi.length - 1) return


    if (balanzasDigi[balanzaDigiSelected].ipBalanzaDigi != "") {
      showConfirm("Eliminar balanza " + (balanzaDigiSelected + 1) + "?", () => {
        balanzasSesion.splice(balanzaDigiSelected, 1)
        ModelConfig.change("balanzasDigi", balanzasSesion)
        setBalanzaDigiSelected(balanzaDigiSelected - 1)
        setBalanzasDigi(balanzasSesion)

      })
      return
    }

    balanzasSesion.splice(balanzaDigiSelected, 1)
    ModelConfig.change("balanzasDigi", balanzasSesion)
    setBalanzaDigiSelected(balanzaDigiSelected - 1)
    setBalanzasDigi(balanzasSesion)

  }

  const crearNuevaBalanza = () => {
    var balanzasSesion = System.clone(balanzasDigi)

    balanzasSesion.push({
      ipBalanzaDigi: "",
      modeloBalanzaDigi: "",
      usuarioBalanzaDigi: "",
      claveBalanzaDigi: "",
      puertaBalanzaDigi: "",
      codigoValeBalanzaDigi: "",
    })

    ModelConfig.change("balanzasDigi", balanzasSesion)
    setBalanzasDigi(balanzasSesion)
    setBalanzaDigiSelected(balanzasSesion.length - 1)
  }


  const cargarInfoBalanzaSeleccionada = () => {
    var balanzasSesion = System.clone(balanzasDigi)

    console.log("cargarInfoBalanzaSeleccionada")
    console.log("balanzasSesion", balanzasSesion)

    if (balanzasSesion.length < 1) return
    if (balanzaDigiSelected >= balanzasSesion.length) return

    setIpBalanzaDigi(balanzasSesion[balanzaDigiSelected]["ipBalanzaDigi"])
    setModeloBalanzaDigi(balanzasSesion[balanzaDigiSelected]["modeloBalanzaDigi"])
    setUsuarioBalanzaDigi(balanzasSesion[balanzaDigiSelected]["usuarioBalanzaDigi"])
    setClaveBalanzaDigi(balanzasSesion[balanzaDigiSelected]["claveBalanzaDigi"])
    setPuertaBalanzaDigi(balanzasSesion[balanzaDigiSelected]["puertaBalanzaDigi"])
    setCodigoValeBalanzaDigi(balanzasSesion[balanzaDigiSelected]["codigoValeBalanzaDigi"])
  }

  const loadConfigSesion = () => {

    var balanzasSesion = ModelConfig.get("balanzasDigi")

    if (balanzasSesion.length < 1) {
      ModelConfig.change("balanzasDigi", [
        {
          ipBalanzaDigi: ModelConfig.get("ipBalanzaDigi"),
          modeloBalanzaDigi: ModelConfig.get("modeloBalanzaDigi"),
          usuarioBalanzaDigi: ModelConfig.get("usuarioBalanzaDigi"),
          claveBalanzaDigi: ModelConfig.get("claveBalanzaDigi"),
          puertaBalanzaDigi: ModelConfig.get("puertaBalanzaDigi"),
          codigoValeBalanzaDigi: ModelConfig.get("codigoValeBalanzaDigi"),
        }
      ])
      balanzasSesion = ModelConfig.get("balanzasDigi")
    }
    setBalanzaDigiSelected(0)
    setBalanzasDigi(balanzasSesion)

    setModoLecturaBalanzaDigi(ModelConfig.get("modoLecturaBalanzaDigi"))
    setTrabajarConBalanzaDigi(ModelConfig.get("trabajarConBalanzaDigi"))
    setUrlServicioBalanzaDigi(ModelConfig.get("urlServicioBalanzaDigi"))
    setRefreshValeBalanzaDigi(ModelConfig.get("refreshValeBalanzaDigi"))
    setRevisarValeRepeditoBalanzaDigi(ModelConfig.get("revisarValeRepeditoBalanzaDigi"))
  }

  const handlerSaveAction = () => {

    ModelConfig.change("urlServicioBalanzaDigi", urlServicioBalanzaDigi)
    ModelConfig.change("trabajarConBalanzaDigi", trabajarConBalanzaDigi)
    ModelConfig.change("refreshValeBalanzaDigi", refreshValeBalanzaDigi)
    ModelConfig.change("revisarValeRepeditoBalanzaDigi", revisarValeRepeditoBalanzaDigi)
    ModelConfig.change("modoLecturaBalanzaDigi", modoLecturaBalanzaDigi)

    // ModelConfig.change("codigoValeBalanzaDigi", codigoValeBalanzaDigi)

    var balanzasSesion = ModelConfig.get("balanzasDigi")

    if (balanzaDigiSelected > -1 && balanzaDigiSelected < balanzasDigi.length) {
      const infoItem = {
        ipBalanzaDigi,
        modeloBalanzaDigi,
        usuarioBalanzaDigi,
        claveBalanzaDigi,
        puertaBalanzaDigi,
        codigoValeBalanzaDigi,
      }
      balanzasSesion[balanzaDigiSelected] = infoItem
      ModelConfig.change("balanzasDigi", balanzasSesion)
      console.log("guardando info de balanzas", balanzasSesion)
      setBalanzasDigi(balanzasSesion)

    }


    showMessage("Guardado correctamente")
    // onFinish()
  }

  useEffect(() => {
    loadConfigSesion()
  }, [])

  useEffect(() => {
    if (balanzaDigiSelected > -1) {
      cargarInfoBalanzaSeleccionada()
    }
  }, [balanzaDigiSelected])


  return (
    <Grid container spacing={2}>


      {/* BALANZA */}
      <Grid item xs={12} lg={12} sx={{
        border: "1px solid #C5C3C3",
        backgroundColor: "#f6f6f6",
        borderRadius: "4px",
        marginTop: "20px",
        padding: "20px"
      }}>

        <Typography sx={{
          fontWeight: "bold",
          marginBottom: "20px"
        }}>
          Balanza DIGI
        </Typography>

        <Grid container spacing={2}>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <InputCheckbox
              inputState={[trabajarConBalanzaDigi, setTrabajarConBalanzaDigi]}
              label={"Trabajar con Digi"}
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
              Modo lectura ticket
            </label>
            <BoxOptionList
              optionSelected={modoLecturaBalanzaDigi}
              setOptionSelected={setModoLecturaBalanzaDigi}
              options={System.arrayIdValueFromObject(ModosLecturaDigi, true)}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <InputCheckbox
              inputState={[revisarValeRepeditoBalanzaDigi, setRevisarValeRepeditoBalanzaDigi]}
              label={"Revisar vales repetidos"}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={8} lg={8}>
            <TouchInputPage
              inputState={[urlServicioBalanzaDigi, setUrlServicioBalanzaDigi]}
              label="Url Servicio"
              onEnter={() => {
                handlerSaveAction()
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TouchInputNumber
              inputState={[refreshValeBalanzaDigi, setRefreshValeBalanzaDigi]}
              label="Tiempo refresco Vales(seg)"
            />
          </Grid>



          <Grid item xs={11} sm={11} md={11} lg={11}>
            <Grid container spacing={2} sx={{
              borderWidth: 2,
              borderRadius: 1,
              borderStyle: "solid",
              borderColor: "#5f5f5f",
              backgroundColor: "#e1ffe7",
              margin: "10px 0 20px 0",
              padding: "10px 10px 20px 0"
            }}>

              <Grid item xs={12} sm={12} md={12} lg={12}>
                {balanzasDigi.map((info, index) => (
                  <SmallButton
                    key={index}
                    style={{
                      backgroundColor: (balanzaDigiSelected == index ? "deepskyblue" : "white"),
                      color: (balanzaDigiSelected == index ? "white" : "darkslategray"),
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderStyle: "solid"
                    }}
                    textButton={"Balanza" + (index + 1)}
                    actionButton={() => {
                      setBalanzaDigiSelected(index)
                    }}
                  />
                ))}
              </Grid>

              <Grid item xs={12} sm={12} md={3} lg={3}>
                <TouchInputNumber
                  inputState={[codigoValeBalanzaDigi, setCodigoValeBalanzaDigi]}
                  label="Codigo Vale"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TouchInputName
                  inputState={[ipBalanzaDigi, setIpBalanzaDigi]}
                  label="Ip de la balanza"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <TouchInputNumber
                  inputState={[puertaBalanzaDigi, setPuertaBalanzaDigi]}
                  label="Puerta"
                />
              </Grid>

              {modeloBalanzaDigi == MODELOSDIGI.SM120 && (
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TouchInputName
                    inputState={[usuarioBalanzaDigi, setUsuarioBalanzaDigi]}
                    label="usuario de conexion ftp"
                  />
                </Grid>
              )}
              {modeloBalanzaDigi == MODELOSDIGI.SM120 && (

                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TouchInputName
                    inputState={[claveBalanzaDigi, setClaveBalanzaDigi]}
                    label="contraseña de conexion ftp"
                  />
                </Grid>
              )}


              <Grid item xs={12} sm={12} md={12} lg={12}>
                <label
                  style={{
                    userSelect: "none",
                    fontSize: "19px",
                    display: "inline-block",
                    margin: "10px 0"
                  }}>
                  Modelo
                </label>
                <BoxOptionList
                  optionSelected={modeloBalanzaDigi}
                  setOptionSelected={setModeloBalanzaDigi}
                  options={System.arrayIdValueFromObject(MODELOSDIGI, true)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>


                <SmallSecondaryButton
                  style={{
                    width: "inherit",
                    float: "right"
                  }}
                  textButton={"Agregar Balanza +"}
                  actionButton={() => {
                    crearNuevaBalanza()
                  }}
                />

                {balanzaDigiSelected > 0 && (balanzaDigiSelected == balanzasDigi.length - 1) && (
                  <SmallDangerButton
                    style={{
                      width: "inherit",
                      float: "right",
                    }}
                    textButton={"Eliminar balanza " + (balanzaDigiSelected + 1)}
                    actionButton={eliminarUltimaBalanza}
                  />
                )}

              </Grid>
            </Grid>

          </Grid>





          <Grid item xs={12} sm={12} md={12} lg={12}>

            <SmallButton
              textButton="CONTROL Productos, Vendedores Y Teclas"
              actionButton={() => {
                setVerDigi(true)
              }} style={{
                backgroundColor: "green",
                width: "inherit"
              }} />

          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <label
              style={{
                userSelect: "none",
                fontSize: "19px",
                display: "inline-block",
                margin: "30px 0 0 0"
              }}>
              Cambiar Specs
            </label>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>

            <SmallButton
              textButton="Modo Vales"
              actionButton={() => {

                showConfirm("Cambiar los spec a modo vales?", () => {
                  showLoading("cambiando spec a vales...")
                  balanza.cambiarSpecVales((res) => {
                    if (res.status) {
                      showAlert("realizado correctamente")
                    } else {
                      showAlert("No se pudo crear")
                    }
                    hideLoading()
                  }, (er) => {
                    hideLoading()
                    showAlert(er)
                  })
                }, () => {
                  showMessage("cancelado")
                })
              }}
              style={{
                width: "inherit",
                height: "50px"
              }} />

            <SmallButton
              textButton="Modo Productos"
              actionButton={() => {
                showConfirm("Cambiar los spec a modo productos?", () => {
                  showLoading("cambiando spec a productos...")
                  balanza.cambiarSpecProductos((res) => {
                    if (res.status) {
                      showAlert("realizado correctamente")
                    } else {
                      showAlert("No se pudo crear")
                    }
                    hideLoading()
                  }, (er) => {
                    hideLoading()
                    showAlert(er)
                  })
                }, () => {
                  showMessage("cancelado")
                })
              }}

              style={{
                width: "inherit",
                height: "50px"
              }} />

          </Grid>
        </Grid>




      </Grid>

      {/* FIN BALANZA */}


      <BalanzaDigiControl openDialog={verDigi} setOpenDialog={setVerDigi} />


      <Grid item xs={12} sm={12} md={12} lg={12}>

        <SmallButton textButton="Reiniciar sistema" actionButton={() => {
          window.location.href = window.location.href
        }} style={{
          backgroundColor: "blueviolet",
          width: "inherit"
        }} />

        <SmallButton textButton="Guardar" actionButton={() => {
          handlerSaveAction()
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

export default TabBalanzaDigi;
