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
  } = useContext(SelectedOptionsContext);

  const [vendedor, setVendedor] = useState(null);
  

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
