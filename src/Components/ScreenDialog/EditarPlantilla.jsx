/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect, useRef } from "react";
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
  Grid,
  Paper,
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
import Comercio from "../../Models/Comercio";


const EditarPlantilla = ({
  openDialog,
  setOpenDialog,
  plantillaItem,
  onChange
}) => {
  const {
    userData,
    updateUserData,
    showMessage,
    showAlert
  } = useContext(SelectedOptionsContext);

  const [plantillaHtml, setPlantillaHtml] = useState("")
  const [cambio, setCambio] = useState(false)

  const refPreview = useRef(null)


  const guardarCambios = () => {

    const actual = Comercio.sesionServerAllConfig.cargar(1)
    // console.log("actual", actual)
    var news = []
    const aPoner = { ...plantillaItem, valor: plantillaHtml }
    actual.forEach((configEnSesion) => {
      // console.log("configEnSesion", configEnSesion)
      if (
        configEnSesion.entrada === plantillaItem.entrada
        && configEnSesion.grupo === plantillaItem.grupo
      ) {
        news.push(aPoner)
      } else {
        news.push(configEnSesion)
      }
    })
    // console.log("antes de guardar..")
    console.log("viejo", System.clone(actual))
    console.log("nuevo", System.clone(news))
    Comercio.sesionServerAllConfig.guardar(news)
    onChange(aPoner, news)
  }

  useEffect(() => {
    setPlantillaHtml(plantillaItem.valor)
    console.log("plantillaItem", plantillaItem)
  }, [])

  const refreshPreview = () => {
    if (refPreview && refPreview.current) {
      // console.log("refPreview de " + plantilla.entrada, refPreview)
      // console.log("plantilla", plantilla)
      if (plantillaHtml) {
        refPreview.current.innerHTML = plantillaHtml
      } else {
        console.log("no tiene plantilla")
      }
    } else {
      console.log("no tiene ref", refPreview)
    }
  }

  useEffect(() => {
    refreshPreview()
  }, [openDialog, refPreview, plantillaHtml])

  return (
    <Dialog open={openDialog} fullWidth onClose={() => { }} maxWidth="lg">
      <DialogTitle>
        Editar Plantilla
      </DialogTitle>
      <DialogContent>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography variant="h5">Preview</Typography>
            <Paper ref={refPreview}></Paper>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography variant="h5">{plantillaItem.entrada}</Typography>
            <textarea style={{
              width: "100%",
              height: "100%",
              minHeight: "500px"
            }} value={plantillaHtml} onChange={(v) => {
              const newVal = v.target.value
              if (plantillaItem.valor != newVal) {
                setCambio(true)
                setPlantillaHtml(newVal)
              }
            }} />
          </Grid>



        </Grid>

      </DialogContent>
      <DialogActions>
        {cambio && (
          <SmallButton textButton="Guardar cambios" actionButton={guardarCambios} />
        )}
        <SmallButton textButton="Refresh Preview" actionButton={() => {
          refreshPreview()
        }} />
        <SmallButton textButton="Volver" actionButton={() => {
          setOpenDialog(false)
        }} />
      </DialogActions>
    </Dialog>
  );
};

export default EditarPlantilla;
