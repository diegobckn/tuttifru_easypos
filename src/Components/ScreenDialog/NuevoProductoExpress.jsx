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
  Grid,
  Typography,
  TextField,
  MenuItem
} from "@mui/material";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import Product from "../../Models/Product";
import Validator from "../../Helpers/Validator";
import IngresarTexto from "./IngresarTexto";
import TiposProductos from "../../definitions/TiposProductos";


const NuevoProductoExpress = ({
  openDialog,
  setOpenDialog,
  onComplete,
  codigoIngresado
}) => {


  const [nombre, setNombre] = useState("")
  const [precioVenta, setPrecioVenta] = useState(0)
  const [tipos, setTipos] = useState([])
  const [tipoSel, setTipoSel] = useState(0)
  const [dialogNombre, setDialogNombre] = useState(false);


  useEffect(() => {
    if (!openDialog) return

    Product.getInstance().getTipos((tipos) => {
      setTipos(tipos)
      setTipoSel(1)
    }, () => {
      setTipos(TiposProductos)
      setTipoSel(1)
    })

  }, [openDialog])

  const handlerSaveAction = () => {
    if (nombre.trim() == "") {
      alert("Debe ingresar un nombre");
      return;
    }

    if (precioVenta == 0) {
      alert("Debe ingresar un precio");
      return;
    }

    if (tipoSel == 0) {
      alert("Debe ingresar un tipo de producto");
      return;
    }

    onComplete({
      codSacanner: codigoIngresado,
      nombre: nombre,
      precioVenta: precioVenta + "",
      tipoVenta: tipoSel
    })
    setOpenDialog(false)
  }

  const validateChangeNombre = (newvalue) => {
    if (Validator.isNumericOAlphaConEspacio(newvalue) || newvalue == "")
      setNombre(newvalue)
  }

  return (
    <Dialog open={openDialog} onClose={() => { }} maxWidth="lg">
      <DialogTitle>
        Nuevo producto
      </DialogTitle>
      <DialogContent>
        <IngresarTexto
          title="Ingrese un nombre"
          openDialog={dialogNombre}
          setOpenDialog={setDialogNombre}
          varChanger={validateChangeNombre}
          varValue={nombre}
        />
        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="body4" color="black">
              Crear un producto con el codigo '{codigoIngresado}'
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5}>
            <TextField
              margin="normal"
              fullWidth
              label="Nombre"
              type="text" // Cambia dinámicamente el tipo del campo de contraseña
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onClick={() => {
                setDialogNombre(true)
              }}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Precio venta"
              type="number" // Cambia dinámicamente el tipo del campo de contraseña
              value={precioVenta}
              onChange={(e) => {
                if (Validator.isMonto(e.target.value))
                  setPrecioVenta(e.target.value)
              }}
            />


            <TextField
              fullWidth
              id="region"
              select
              onClick={() => {
              }}
              label="Tipo"
              value={tipoSel}
              onChange={(e) => setTipoSel(e.target.value)}
              sx={{
                width: "100%",
                marginTop: "20px",
                height: "50px",
              }}
            >
              {tipos.map((option) => (
                <MenuItem key={option.idTipo} value={option.idTipo}>
                  {option.descripcion}
                </MenuItem>
              ))}
            </TextField>

          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={7}>
            <TecladoPrecio
              maxValue={100000}
              showFlag={true}
              varValue={precioVenta}
              varChanger={setPrecioVenta}
              onEnter={handlerSaveAction}
            />
          </Grid>
        </Grid>

      </DialogContent>
      <DialogActions>
        <SmallButton textButton="Confirmar" actionButton={handlerSaveAction} />
        <Button onClick={() => {
          setOpenDialog(false)
        }}>No agregar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NuevoProductoExpress;
