import React, { useState, useEffect, useContext } from "react";

import {
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import BoxBuscadorCliente from "./../BoxOptionsLite/BoxBuscadorCliente"
import Client from "../../Models/Client";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

const ScreenDialogBuscarCliente = ({
  openDialog,
  setOpenDialog,
  setCliente,
  askLastSale = false,
  addToSalesData = ()=>{}
}) => {

  const {
    sales,
    salesData,
    cliente,
    
    setSalesData,
    grandTotal,
    setGrandTotal,
    removeFromSalesData,
    quantity,
    setQuantity,
    clearSalesData,

    showMessage,
    showConfirm,

    textSearchProducts,
    setTextSearchProducts,
    buscarCodigoProducto,
    setBuscarCodigoProducto,
    showTecladoBuscar,
    setShowTecladoBuscar,

    addNewProductFromCode
  } = useContext(SelectedOptionsContext);



  const onSelectClient = (selectedClient)=>{
    setCliente(selectedClient)
    Client.getInstance().sesion.guardar(selectedClient);
    
    if(!askLastSale)return

    showConfirm("Cargar ultima venta?",()=>{
      const cl = new Client();
      cl.fill(selectedClient)
      cl.getLastSale((products)=>{
          if (products.length > 0) {
            products.forEach((product) => {
              addToSalesData({
                nombre: product.descripcion,
                precioVenta: product.precioUnidad,
                idProducto: product.codProducto,
                cantidad: product.cantidad,
              });
            });
            setOpenDialog(false)
          } else {
            console.log("No se encontraron productos en la última venta.");
            showMessage("No se encontraron productos en la última venta.");
          }
      },()=>{
        showMessage("No se encontraron resultados");
      })
    },()=>{
      setOpenDialog(false)
    })
  }

  return (
      <Dialog 
      open={openDialog} 
      onClose={()=>{
        setOpenDialog(false)
      }}
      maxWidth="lg"
      >
        <DialogContent>
          <BoxBuscadorCliente onSelect={onSelectClient}/>
        </DialogContent>
        {/* <DialogActions>
          <SmallButton textButton="Guardar" actionButton={handlerSaveAction}/>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Atras</Button>
        </DialogActions> */}
      </Dialog>
  );
};

export default ScreenDialogBuscarCliente;
