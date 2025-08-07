/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

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
  Typography,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxAbrirCaja from "../BoxOptionsLite/BoxAbrirCaja";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import AperturaCaja from "../../Models/AperturaCaja";
import dayjs from "dayjs";
import System from "../../Helpers/System";
import Printer from "../../Models/Printer";
import UserEvent from "../../Models/UserEvent";
import PrinterPaper from "../../Models/PrinterPaper";
import Comercio from "../../Models/Comercio";
import ConfigPlantillaItem from "./ConfigPlantillaItem";
import InputName from "../Elements/Compuestos/InputName";
import InputGeneric from "../Elements/Compuestos/InputGeneric";


const ConfigPlantillasDatosPruebaItem = ({
  datoPrueba,
  onChange
}) => {
  const {
    userData,
    updateUserData,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [value, setValue] = useState("")

  useEffect(() => {
    // console.log("inicia datos prueba item", datoPrueba)
    setValue(datoPrueba.value)
    // if (datoPrueba) {
    // console.log("datoPrueba", datoPrueba)
    // }
  }, [datoPrueba])

  const newValueCheck = (newValue) => {
    setValue(newValue)
    onChange(newValue)
  }

  return (
    <>
      <Typography>{datoPrueba.name}</Typography>
      <InputGeneric
        inputState={[value, newValueCheck]}
        fieldName={datoPrueba.name}
        withLabel={false}
      />
    </>
  );
};

export default ConfigPlantillasDatosPruebaItem;
