/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
} from "@mui/material";
import TecladoCierre from "../Teclados/TecladoCierre";
import Validator from "../../Helpers/Validator";
import User from "../../Models/User";
import ScreenDialogConfig from "../ScreenDialog/AdminConfig";
import { Margin, Settings } from "@mui/icons-material";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import InputNumber from "../Elements/Compuestos/InputNumber";
import TecladoNumerico from "../Teclados/TecladoNumerico";
import TecladoNumeros from "../Teclados/TecladoNumeros";
import MainButton from "../Elements/MainButton";
import System from "../../Helpers/System";


const BoxNumeroAtencion = ({
  onChange = () => { }
}) => {

  const {
    userData,
    updateUserData,
    showAlert,
    showConfirm,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [numero, setNumero] = useState(0)

  const confirmar = () => {
    console.log("confirmar")
    if(numero < 1){
      showAlert("Ingresar un valor")
      return
    }
    onChange(numero)
  }

  return (
    <Grid container spacing={2}>

      <Grid item xs={12} sm={12} md={12} lg={12}>

        <Typography variant="h5" color="black">
          Ingresar n&uacute;mero de atenci&oacute;n
        </Typography>

        <div style={{ width: "100%", display: "inline-block", height: "40px" }}></div>
      </Grid>

      <Grid item xs={12} sm={12} md={4} lg={4}>
        <InputNumber
          inputState={[numero, setNumero]}
          label={"Numero de atencion"}
          onRef={(ref)=>{
            System.intentarFoco(ref)
          }}
        />
        <MainButton
          textButton={"Confirmar"}
          actionButton={confirmar}
          xs={12} sm={12} md={12} lg={12}
          style={{ margin: 0, width: "100%" }}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={8} lg={8}>
        <TecladoCierre onEnter={confirmar}
          showFlag={true}
          varValue={numero}
          varChanger={setNumero}
        />
      </Grid>


    </Grid >
  );
};

export default BoxNumeroAtencion;
