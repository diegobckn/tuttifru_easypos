import React, { useState, useContext, useEffect } from "react";

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
  CircularProgress,
  DialogTitle
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";
import Suspender from "../../Models/Suspender";
import Validator from "../../Helpers/Validator";
import IngresarTexto from "./IngresarTexto";

var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

const SuspenderVenta = ({ openDialog, setOpenDialog }) => {
  const {
    userData,
    salesData,
    sales,
    clearSalesData,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [suspendName, setSuspendName] = useState("");
  const [loading, setLoading] = useState(false)


  const onAceptClick = () => {
    if (suspendName == "") {
      showMessage("ingresar una descripcion");
      return
    }

    const ventaSuspenderDetalle = [];
    salesData.forEach(sale => {
      ventaSuspenderDetalle.push({
        cantidad: parseFloat(sale.quantity),
        descripcion: sale.description,
        codProducto: sale.idProducto + ""
      });
    })

    const sus = new Suspender()
    sus.preSuspender({
      usuario: userData.codigoUsuario,
      descripcion: suspendName,
      listado: ventaSuspenderDetalle,
    })

    setLoading(true)
    sus.suspender((res) => {
      showMessage(res.descripcion);
      setOpenDialog(false)
      clearSalesData()
      setLoading(false)
      setSuspendName("")
    }, () => {
      showMessage("No se pudo realizar");
      setLoading(false)
    })
  }

  const validateChangeDesc = (newvalue) => {
    if (Validator.isSearch(newvalue))
      setSuspendName(newvalue)
  }

  const [dialogDescripcion, setDialogDescripcion] = useState(false);


  return (
    <Dialog open={openDialog} maxWidth="lg" onClose={() => {
      setOpenDialog(false)
    }}
    >
      <DialogTitle>
        Suspender Venta
      </DialogTitle>
      <DialogContent>

        <IngresarTexto
          title="Ingrese una descripcion"
          openDialog={dialogDescripcion}
          setOpenDialog={setDialogDescripcion}
          varChanger={validateChangeDesc}
          varValue={suspendName}
        />

        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12} lg={12}>
            <Grid container spacing={2}>

              <TextField
                margin="normal"
                fullWidth
                label="Ingrese una descripción"
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={suspendName}
                onChange={(e) => validateChangeDesc(e.target.value)}
                style={{
                  marginTop: "20px"
                }}
                onClick={() => {
                  setDialogDescripcion(true)
                }}
              />

              <table style={{
                margin: "20px 0",
                border: "1px solid"
              }}>
                <tbody>

                  {
                    salesData.map((sale, index) => {
                      return (
                        <tr key={sale.idProducto + "" + index}>
                          <td style={{ fontSize: "20px" }}>{sale.quantity} x ${sale.price} </td>
                          <td style={{ fontSize: "20px", padding: "0 20px" }}>{sale.description}</td>
                          <td style={{ fontSize: "20px" }}>${sale.getSubTotal()}</td>
                        </tr>
                      )
                    })
                  }
                  <tr>
                    <td>&nbsp;</td>
                    <td style={{ fontSize: "20px", padding: "0 20px", textAlign: "right" }}>Total</td>
                    <td style={{ fontSize: "20px" }}>${sales.getTotal()}</td>
                  </tr>
                </tbody>
              </table>

            </Grid>
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={onAceptClick}
          disabled={loading}
          sx={{
            margin: "1px",
            height: "3.4rem",
            backgroundColor: "#283048",
            color: "white",
            "&:hover": {
              backgroundColor: "#1c1b17",
            },
            marginLeft: "8px", // Margen izquierdo para separar el TextField del Button
          }}
        >
          {
            loading && (<CircularProgress size={20} />)
          }
          Suspender
        </Button>



        <Button onClick={() => {
          setOpenDialog(false)
        }}>Atras</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuspenderVenta;
