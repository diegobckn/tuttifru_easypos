import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Box,
  IconButton,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Margin, Settings } from "@mui/icons-material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import dayjs from "dayjs";

import System from "../../Helpers/System";
import SmallGrayButton from "../Elements/SmallGrayButton"
import SmallDangerButton from "../Elements/SmallDangerButton"
import ScreenBuscarCliente from "../ScreenDialog/BuscarCliente"
import ScreenCloseSession from "../ScreenDialog/CloseSession"
import User from "../../Models/User";
import Client from "../../Models/Client";
import ModelConfig from "../../Models/ModelConfig";
import SmallButton from "../Elements/SmallButton";
import Suspender from "../../Models/Suspender";

import ScreenDialogConfig from "../ScreenDialog/AdminConfig";


const BoxTopVolantes = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const {
    cliente,
    setCliente,
    askLastSale,
    setAskLastSale,
    showDialogSelectClient,
    setShowDialogSelectClient,

    showConfirm,
    showLoading,
    hideLoading,
    showMessage,
    salesData,
    userData,
    addToSalesData,
    clearSessionData,
    getUserData,
    numeroAtencion,
    setNumeroAtencion
  } = useContext(SelectedOptionsContext);
  const [vendedor, setVendedor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const navigate = useNavigate();
  const [showCloseSessionDialog, setShowCloseSessionDialog] = useState(false);

  const [date, setDate] = useState(null);
  const [sucursal, setSucursal] = useState("");
  const [caja, setCaja] = useState("");
  const [time, setTime] = useState(null);


  const [showScreenConfig, setShowScreenConfig] = useState(false);



  useEffect(() => {
    setDate(dayjs().format('DD/MM/YYYY'))

    setInterval(() => {
      setTime(dayjs().format('HH:mm:ss'))

      setSucursal(ModelConfig.get("sucursalNombre"))
      setCaja(ModelConfig.get("puntoVentaNombre"))
    }, 1000)
  }, [])



  return (
    <Paper
      elevation={3}
      style={{
        backgroundColor: "#283048",
        padding: "10px",
        width: "101.2%",
        marginTop: "2px"
      }}
    >
      <Grid container spacing={0}>
        <ScreenDialogConfig openDialog={showScreenConfig} setOpenDialog={(v) => {
          setShowScreenConfig(v)
        }} />
        <Grid item xs={12} sm={6} md={4} lg={4}
          sx={{
            marginTop: "6px",
            padding: 0
          }}
        >
          <Box variant="h5" color="white"
            style={{
              margin: "0"
            }}
          >
            <Typography>
              {System.getInstance().getAppName()}
              {" | "}
              {userData.nombres} {userData.apellidos}

              <IconButton
                onClick={() => { setShowScreenConfig(true) }}
                edge="end"
              >
                <Settings sx={{
                  color: "#919191"
                }} />
              </IconButton>


            </Typography>

            <Typography>
            </Typography>


          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={5} lg={5} sx={{
          margin: "0px 0 0 0",
          padding: "0",
          textAlign: "center"
        }}>

          <Box sx={{
            backgroundColor: "#c2c2c2",
            padding: "10px"
          }}>

            <Typography>

              {numeroAtencion > 0 && (
                " - Numero de atencion: " + numeroAtencion
              )}
            </Typography>
            <Typography sx={{
              color: "white",
              fontSize: "12px"
            }}>Sucursal {sucursal} PV {caja}</Typography>
          </Box>

        </Grid>

        <Grid item xs={12} sm={12} md={3} lg={3}
          sx={{ marginTop: "6px" }}>
          <Box variant="h5" color="white" style={{
            textAlign: "right",
            width: "100%"
          }}>
            <Typography>
              {date}
              {" | "}

              {time}

            </Typography>

          </Box>
        </Grid>


      </Grid>
    </Paper>
  );
};

export default BoxTopVolantes;
