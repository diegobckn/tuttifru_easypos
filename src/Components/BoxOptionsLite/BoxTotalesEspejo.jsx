import React, { useState, useContext, useEffect, useRef } from "react";

import {
  Paper,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  TableContainer,
  Grid,
  Container,
  useTheme,
  useMediaQuery,

  IconButton,
  Menu,
  TextField,
  Chip,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ToggleButton,
  ToggleButtonGroup

} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import PagoFactura from "../ScreenDialog/PagoFactura";
import PagoBoleta from "../ScreenDialog/PagoBoleta";
import Envases from "../ScreenDialog/Envases";
import MainButton from "../Elements/MainButton";
import System from "../../Helpers/System";
import LongClick from "../../Helpers/LongClick";
import Model from "../../Models/Model";
import ModelConfig from "../../Models/ModelConfig";
import PruebaImpresionEspecial from "../ScreenDialog/PruebaImpresionEspecial";
import Printer from "../../Models/Printer";
import UltimaVenta from "../ScreenDialog/UltimaVenta";
import LecturaFolioPreventa from "../ScreenDialog/LecturaFolioPreventa";


const BoxTotalesEspejo = () => {
  const {
    userData,
    salesData,
    sales,
    clearSessionData,
    grandTotal,
    getUserData,
    showMessage,
    showAlert,
    showLoading,
    hideLoading,

    modoAvion,
    setModoAvion,
    showPrintButton,

    ultimoVuelto,
    setUltimoVuelto,
    searchInputRef
  } = useContext(SelectedOptionsContext);
  const [vendedor, setVendedor] = useState(null);
  const [recargos, setRecargos] = useState(0);
  const [descuentos, setDescuentos] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [showScreenPagoFactura, setShowScreenPagoFactura] = useState(false)
  const [showScreenPagoBoleta, setShowScreenPagoBoleta] = useState(false)
  const [showScreenEnvases, setShowScreenEnvases] = useState(false)

  const [openSpecialPrint, setOpenSpecialPrint] = useState(false)
  const [showScreenLastSale, setShowScreenLastSale] = useState(false)

  const [showPreventa, setShowPreventa] = useState(false)

  const [verBotonPreventa, setVerBotonPreventa] = useState(false)
  const [verBotonEnvases, setVerBotonEnvases] = useState(false)
  const [verBotonPagarFactura, setVerBotonPagarFactura] = useState(false)


  const longBoleta = new LongClick(2);
  longBoleta.onClick(() => {
    if (salesData.length < 1) {
      showMessage("No hay ventas")
      return
    }

    if(!System.configBoletaOk()){
      showAlert("Se debe configurar emision de boleta")
      return
    }

    setShowScreenPagoBoleta(true)
  })
  longBoleta.onLongClick(() => {
    if (modoAvion) {
      showMessage("Cambiado a modo normal")
    } else {
      showMessage("Cambiado a modo avion")
    }
    setModoAvion(!modoAvion)

  })

  const navigate = useNavigate();

  useEffect(() => {
    setVerBotonPreventa(ModelConfig.get("verBotonPreventa"))
    setVerBotonEnvases(ModelConfig.get("verBotonEnvases"))
    setVerBotonPagarFactura(ModelConfig.get("verBotonPagarFactura"))
  }, [])


  useEffect(() => {
    // Simulación de obtención de datos del usuario después de un tiempo de espera
    const fetchData = () => {
      if (!userData) {
        getUserData();
        return
      }

      if (userData == null) {
        alert("Usuario no logueado");
        clearSessionData();
        navigate("/login");
        return
      }
      // setVendedor({
      //   codigo: userData.codigoUsuario || "21",
      //   nombre:
      //     userData.nombres + " " + userData.apellidos || "Nombre Apellido",
      //   caja: "1",
      //   rol: userData.rol || "Rol del usuario",
      //   boleta: "323232321",
      //   operacion: "12123141",
      // });
    };

    fetchData();
  }, [userData]);

  const abrirLecturaPreventa = () => {
    setShowPreventa(true)
  }

  return (
    <Paper
      elevation={3}
      style={{
        backgroundColor: "rgb(188 188 188)",
        padding: "0px",
        width: "100%",
        marginTop: "20px"
      }}
    >

      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Grid container spacing={2}>

            <Grid item xs={12} sm={12} md={12} lg={12}
              sx={{
                margin: "6px auto",
                color: "#E1213B",
                width: "80%",
                padding: "10px 0 !important",
                maxWidth: "80% !important",
                borderRadius: "5px",
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  color: "rgb(225, 33, 59)",
                  fontSize: "36px",
                  fontFamily: "Victor Mono",
                  fontWeight: "700",
                  justifyContent: "center",
                }}
              >
                TOTAL: ${System.formatMonedaLocal(grandTotal,false)}
              </Typography>

              {/* {ultimoVuelto !== null && (
                <Typography
                  sx={{
                    display: "flex",
                    color: "#34ff1a",
                    fontSize: "18px",
                    fontFamily: "Victor Mono",
                    fontWeight: "700",
                    textShadow: "1px 1px 2px #302f2f",
                    justifyContent: "center",
                  }}
                >
                  Vuelto: ${ultimoVuelto}
                </Typography>
              )} */}
            </Grid>

          </Grid>
        </Grid>
      </Grid>

      <Grid container style={{
        backgroundColor: "#859398",
        marginTop: 10
      }}>
        <Grid item xs={12}>
          <Grid container>

          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BoxTotalesEspejo;
