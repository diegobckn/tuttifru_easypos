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
  TextField
} from "@mui/material";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import TecladoPeso from "../Teclados/TecladoPeso";
import InputPeso from "../Elements/InputPeso";
import Validator from "../../Helpers/Validator";
import MainButton from "../Elements/MainButton";
import DetectarPeso from "./DetectarPeso";
import ModelConfig from "../../Models/ModelConfig";
import dayjs from "dayjs";
import ProductSold from "../../Models/ProductSold";
import BoxOptionList from "../BoxOptionsLite/BoxOptionList";


export default ({
  openDialog,
  setOpenDialog,
  title = "Seleccionar",
  optionObject,
  onSelect = () => { }
}) => {


  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (selected != null) {
      onSelect(selected)
      setOpenDialog(false)
    }
  }, selected)
  useEffect(() => {
    setSelected(null)
  }, selected)

  return (
    <Dialog open={openDialog} onClose={() => { }} maxWidth="lg">
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>


          <Grid item xs={12} sm={12} md={7} lg={7}>
            <BoxOptionList
              optionSelected={selected}
              setOptionSelected={setSelected}
              options={System.arrayIdValueFromObject(optionObject, true)}
            />
          </Grid>
        </Grid>

      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
};

