import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button,
  TextField
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";
import Balanza from "../../Models/Balanza";


const DetectarPeso = ({
  onChange = () => { }
}) => {

  useEffect(() => {
    // const socket = new WebSocket("ws://localhost:8765");
    Balanza.deteccionPeso((peso)=>{
      onChange(peso)
    })

    if (Balanza.ultimoPesoDetectado !== null) {
      onChange(Balanza.ultimoPesoDetectado)
    }
  }, []);

  return (<></>);
};

export default DetectarPeso;
