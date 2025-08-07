import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  DialogContent,
  Dialog,
  Table,
  TableBody,
  TableCell,
  Autocomplete,
  TableContainer,
  TableHead,
  DialogActions,
  DialogTitle,
  TableRow,
  Snackbar,
} from "@mui/material";
import MovimientoMercaderia from "./MovimientoMercaderia";

const BoxStock = () => {
  const [openFacturamanual, setOpenFacturamanual] = useState(false);
  const [openMercaderia, setOpenMercaderia] = useState(false);
  const [openFacturaAtomaticaDialog, setOpenFacturaAtomaticaDialog] = useState(false);
  const handleOpenFactura = () => {
    setOpenFacturamanual(true);
  };
  const handleCloseFactura = () => {
    setOpenFacturamanual(false);
  };
  const handleOpenMercaderia = () => {
    setOpenMercaderia(true);
  };
  const handleCloseMercaderia = () => {
    setOpenMercaderia(false);
  };
  const handleOpenFacturaAutomatica = () => {
    setOpenFacturaAtomaticaDialog(true);
  };
  const handleCloseFacturaAutomatica = () => {
    setOpenFacturaAtomaticaDialog(false);
  };

  return (
    <>
      <Paper style={{ display: "flex", justifyContent: "center" }}>
        {/* <Grid item xs={4}>
          <Button
            onClick={handleOpenFactura}
            sx={{ margin: "2px",width:"90%",height:"90%" }}
            variant="contained"
            color="primary"
          >
            Ingreso factura Manual
          </Button>
        </Grid> */}
        <Grid item xs={12}>
          
          <Button
             sx={{ margin: "auto ",width:"90%",height:"90%",display:"flex",justifyContent:"center",justifyItems:"center" }}
            onClick={handleOpenMercaderia}
            variant="contained"
            color="primary"
          >
            Movimiento Mercadería
          </Button>
        </Grid>
        {/* <Grid item xs={4}>
          <Button   sx={{ margin: "2px",width:"90%",height:"90%" }} onClick={handleOpenFacturaAutomatica} variant="contained" color="primary">
            Ingreso Automático de Facturas
          </Button>
        </Grid> */}
      </Paper>

      <Dialog open={openFacturamanual}>
        <DialogTitle>Ingreso Facturas Manual</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFactura}>Cancelar</Button>
          {/* <Button onClick={handleButtonRecuperarVenta}>Seleccionar</Button> */}
        </DialogActions>
      </Dialog>

      <Dialog open={openMercaderia}>
        <DialogTitle>Moviento mercaderia</DialogTitle>
        <DialogContent><MovimientoMercaderia/></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMercaderia}>Cancelar</Button>
          {/* <Button onClick={handleButtonRecuperarVenta}>Seleccionar</Button> */}
        </DialogActions>
      </Dialog>
      <Dialog open={openFacturaAtomaticaDialog} onClose={handleCloseFacturaAutomatica}>
        <DialogTitle>Ingreso Automático de Facturas</DialogTitle>
        <DialogContent>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFacturaAutomatica}>Cancelar</Button>
         
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BoxStock;
