import React, { useState, useContext, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import TableSelecCategory from "../BoxOptionsLite/TableSelect/TableSelecCategory";
import TableSelecSubCategory from "../BoxOptionsLite/TableSelect/TableSelecSubCategory";
import TableSelecFamily from "../BoxOptionsLite/TableSelect/TableSelecFamily";
import TableSelecProductNML from "../BoxOptionsLite/TableSelect/TableSelecProductNML";
import TableSelecSubFamily from "../BoxOptionsLite/TableSelect/TableSelecSubFamily";
import BuscarProductoFamilia from "../BoxOptionsLite/BoxProductoFamilia";
import SmallDangerButton from "../Elements/SmallDangerButton";



const ShowFamilies = ({
  openDialog,
  setOpenDialog,
  selectProduct = true,
  onSelect = () => { },
  addDirectoToSales = true
}) => {

  const {
    userData,
    addToSalesData
  } = useContext(SelectedOptionsContext);



  return (

    <Dialog open={openDialog} onClose={() => {
      setOpenDialog(false)
    }}
      maxWidth="lg"
      PaperProps={{
        style: {
          maxWidth: "90%",
        }
      }}>
      <DialogContent style={{
        minWidth: "500px",
        minHeight: "500px",
      }}>

        <BuscarProductoFamilia
          selectProduct={selectProduct}
          addDirectoToSales={addDirectoToSales}
          onSelect={(product, cat, subcat, fam, subfam) => {
            onSelect(product, cat, subcat, fam, subfam)
          }}
        />

      </DialogContent>
      <DialogActions>

        <SmallDangerButton
          actionButton={() => {
            setOpenDialog(false)
          }}
          textButton={"Cerrar"}
        />


      </DialogActions>
    </Dialog>
  );
};

export default ShowFamilies;
