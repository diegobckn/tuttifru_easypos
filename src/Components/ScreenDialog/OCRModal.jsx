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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  Grid,
  Typography,
  TextField,
  Paper,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { ProviderModalesContext } from "../Context/ProviderModales";

import BoxAbrirCaja from "../BoxOptionsLite/BoxAbrirCaja";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import AperturaCaja from "../../Models/AperturaCaja";
import dayjs from "dayjs";
import System from "../../Helpers/System";
import Printer from "../../Models/Printer";
import UserEvent from "../../Models/UserEvent";
import TecladoCierre from "../Teclados/TecladoCierre";
import Validator from "../../Helpers/Validator";
import BoxOptionList from "../BoxOptionsLite/BoxOptionList";
import IngresarNumeroORut from "./IngresarNumeroORut";
import SmallDangerButton from "../Elements/SmallDangerButton";
import TiposDescuentos from "../../definitions/TiposDescuentos";
import ModelConfig from "../../Models/ModelConfig";
import BalanzaDigi from "../../Models/BalanzaDigi";
import LogObject from "../../Models/LogObject";
import SeleccionarProductos from "../BoxOptionsLite/TableSelect/SeleccionarProductos";
import Tesseract from 'tesseract.js';
import OCR from "./OCR";

export default ({
  openDialog,
  setOpenDialog,
}) => {
  const {
    userData,
    updateUserData,
    showMessage,
    showAlert,
  } = useContext(SelectedOptionsContext);

  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const recognizeText = () => {
    setLoading(true);
    Tesseract.recognize(
      image,
      'spa', // Configuración de idioma: Español
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      setText(text);
      setLoading(false);
    });
  };

  useEffect(() => {



  }, [])


  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        // setOpenDialog(false)
      }} maxWidth="lg"
      fullWidth>
      <DialogTitle>
        OCR
      </DialogTitle>
      <DialogContent>


        <Grid container spacing={2} sx={{
          padding: "20px",
          minWidth: "50vw",
          position: "relative"
        }}>


          <Grid item xs={12} sm={12} md={12} lg={12}>
            <OCR />
          </Grid>


        </Grid>


      </DialogContent>
      <DialogActions>

        <Button
          onClick={() => {
            setOpenDialog(false)
            setProductosBalanza([])
          }}
        >Volver</Button>
      </DialogActions>
    </Dialog >
  );
};
