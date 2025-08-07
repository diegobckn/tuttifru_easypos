import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  Typography
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import Boxfactura from "../BoxOptionsLite/BoxFactura";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import InfoClienteFactura from "../Forms/InfoClienteFactura";
import Client from "../../Models/Client";
import FormUpdateClient from "../Forms/FormUpdateClient";



const PagoFactura = ({
  openDialog,
  setOpenDialog
}) => {
  const {
    cliente,
    setCliente,
    showMessage,
    clienteValidoFactura,
    setShowDialogSelectClient,
    setAskLastSale
  } = useContext(SelectedOptionsContext);

  const [title, setTitle] = useState("Pagar factura")

  useEffect(() => {
    if (!openDialog) return

    setAskLastSale(false)
    checkCliente()
  }, [openDialog]);

  useEffect(() => {
    if (!openDialog) return
    if (cliente)
      checkCliente()
  }, [cliente]);

  const checkCliente = () => {
    console.log("checkCliente")
    console.log("checkCliente..cliente", cliente)
    if (!cliente) {
      showMessage("Seleccionar un cliente antes de hacer el pago");
      setShowDialogSelectClient(true)
      // setOpenDialog(false)
      return
    }

    // if (cliente && !Client.completoParaFactura(cliente)) {
    if (!clienteValidoFactura) {
      setShowDialogSelectClient(false)
      setTitle("Informacion incompleta del cliente")
      // setShowDialogSelectClient(true)
      return
    }

    setTitle("Pagar factura")


    console.log("cliente ok")
    console.log(cliente)

  }

  useEffect(() => {
    console.log("cambio clienteValidoFactura", clienteValidoFactura)
  }, [clienteValidoFactura])

  return (
    <Dialog open={openDialog} onClose={() => { setOpenDialog(false) }} maxWidth={"lg"}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent onClose={() => { setOpenDialog(false) }}>

        {cliente && clienteValidoFactura === true && (
          <Boxfactura onClose={() => { setOpenDialog(false) }} />
        )}

        {cliente && clienteValidoFactura === false && (
          <FormUpdateClient
            cliente={cliente}
            onFinish={(cl) => {
              console.log("on finish", cl)
              const info = {
                ...cl,
                apellidoResponsable: cl.apellido,
                nombreResponsable: cl.nombre,
                validacionFactura: {
                  esValidoFactura: true
                }
              }
              console.log(info)
              setCliente(info)
              Client.getInstance().saveInSesion(info)
            }}
          />
        )}

        {clienteValidoFactura === null && (
          <Typography>Chequando informacion del cliente...</Typography>
        )}


      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setOpenDialog(false) }}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PagoFactura;
