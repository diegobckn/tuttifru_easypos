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
import ConfigPlantillasDatosPruebaItem from "./ConfigPlantillasDatosPruebaItem";


const ConfigPlantillasDatosPrueba = ({
  openDialog,
  setOpenDialog,
  datosPrueba,
  onChange
}) => {
  const {
    userData,
    updateUserData,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [datos, setDatos] = useState([])
  const [someChange, setSomeChange] = useState(false)
  const [datos2, setDatos2] = useState([])

  useEffect(() => {
    setDatos(datosPrueba)
  }, [datosPrueba])

  return (
    <Dialog open={openDialog} onClose={() => { setOpenDialog(false) }} fullWidth maxWidth="lg">
      <DialogTitle>
        Datos de prueba
      </DialogTitle>
      <DialogContent>

        {datos.map((datoPrueba, ix) => (
          <ConfigPlantillasDatosPruebaItem
            key={ix}
            datoPrueba={datoPrueba}
            onChange={(nv) => {
              const me = {}
              me.name = datoPrueba.name
              me.value = nv

              const xfr = System.clone(datos)
              var ixClave = -1
              datos.forEach((dato, ixDato) => {
                if (dato.name === datoPrueba.name) {
                  ixClave = ixDato
                }
              })
              if (ixClave > -1) {
                xfr[ixClave].value = nv
              }
              console.log("xfr", xfr)
              setDatos2(xfr)
              setSomeChange(true)
            }} />
        ))}


      </DialogContent>
      <DialogActions>

        {someChange && (
          <SmallButton textButton="Guardar cambios" actionButton={() => {
            onChange(datos2)
            setOpenDialog(false)
          }} />
        )}
        <SmallButton textButton="Volver" actionButton={() => { setOpenDialog(false) }} />
      </DialogActions>
    </Dialog>
  );
};

export default ConfigPlantillasDatosPrueba;
