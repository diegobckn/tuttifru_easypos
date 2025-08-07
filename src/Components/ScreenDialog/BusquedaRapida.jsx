import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import Product from "../../Models/Product";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import TableSelecProduct from "../BoxOptionsLite/TableSelect/TableSelecProduct";
import ModelConfig from "../../Models/ModelConfig";
import LongClick from "../../Helpers/LongClick";
import ConfirmOption from "../Dialogs/ConfirmOption";
import SmallDangerButton from "../Elements/SmallDangerButton";
import BoxBusquedaRapida from "../BoxOptionsLite/BoxBusquedaRapida";

const BusquedaRapida = ({ 
  openDialog,
  setOpenDialog
}) => {

  const {
    userData,
    addToSalesData,
    showConfirm,
    showMessage,
    showLoading,
    hideLoading,
    cliente
  } = useContext(SelectedOptionsContext);

  return (
    <Dialog open={openDialog} onClose={() => {
      setOpenDialog(false)
    }}
      // fullScreen
      maxWidth="lg"
      PaperProps={{
        style: {
          maxWidth: "90%",
          // backgroundColor:"red",
          // padding:"100px"
        }
      }}
    >
      <DialogContent>

        <BoxBusquedaRapida />

      </DialogContent>
      <DialogActions sx={{
        alignSelf: "center"
      }}>

        
        <SmallDangerButton
          actionButton={() => {
            setOpenDialog(false)
            // setShowConfirmOption(false)
            // setShowSearchProduct(false)
          }}
          textButton={"Cerrar"}
        />



      </DialogActions>
    </Dialog>
  );
};

export default BusquedaRapida;
