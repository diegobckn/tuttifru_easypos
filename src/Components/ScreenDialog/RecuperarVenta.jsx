import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  DialogTitle
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import TableSelecRecuperarVenta from "../BoxOptionsLite/TableSelect/TableSelecRecuperarVenta";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Suspender from "../../Models/Suspender";
import Product from "../../Models/Product";
import MainButton from "../Elements/MainButton";
import System from "../../Helpers/System";


const RecuperarVenta = ({ openDialog, setOpenDialog }) => {
  const {
    userData,
    salesData,
    addToSalesData,
    cliente,
    showConfirm,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [selectedSale, setSelectedSale] = useState(null)


  useEffect(() => {
    if (!openDialog) return
    setSelectedSale(null)
  }, [openDialog])

  const onSelect = (selectedSalex) => {
    setSelectedSale(selectedSalex)
  }


  const cicloRecuperar = (listado, info) => {
    if (listado.length > 0) {
      const product = listado.splice(0, 1)[0]
      product.idProducto = parseInt(product.codProducto)
      Product.getInstance().findByCodigoBarras({
        codigoProducto: product.codProducto,
        codigoCliente: (cliente ? cliente.codigoCliente : 0)
      }, (prodsEncontrados) => {
        prodsEncontrados[0].quantity = product.cantidad
        prodsEncontrados[0].cantidad = product.cantidad
        addToSalesData(prodsEncontrados[0])

        setTimeout(() => {
          cicloRecuperar(listado, info)
        }, 200);
      }, (err) => {
        showMessage("No se pudo encontrar el producto." + err)
      }, true)


    } else {
      Suspender.getInstance().recuperar(selectedSale.id, () => {
        showMessage("Recuperado correctamete")
        setOpenDialog(false)
      }, () => {
        showMessage("No se pudo actualizar la informacion en el servidor")
      })
    }
  }


  const onConfirm = () => {
    if (!selectedSale) {
      showMessage("Elegir una opcion de la lista")
      return
    }

    cicloRecuperar(selectedSale.ventaSuspenderDetalle, selectedSale)
  }

  return (
    <Dialog maxWidth="lg" open={openDialog} onClose={() => {
      setOpenDialog(false)
    }}
    >
      <DialogTitle>Recuperar Venta</DialogTitle>
      <DialogContent>
        <Grid container item xs={12} spacing={2}>

          <Grid item xs={12} lg={12}>
            <Grid container spacing={2}>

              <TableSelecRecuperarVenta
                onSelect={onSelect}
                selectedItem={selectedSale}
                setSelectedItem={setSelectedSale}
              />
            </Grid>
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>

        <SmallButton isDisabled={!selectedSale}
          actionButton={onConfirm}
          textButton="Confirmar"
        />

        <Button onClick={() => {
          setOpenDialog(false)
        }}>Atras</Button>


      </DialogActions>
    </Dialog>
  );
};

export default RecuperarVenta;
