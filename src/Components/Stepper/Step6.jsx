/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Input,
} from "@mui/material";

const Step6Component = () => {
  const [newStock, setNewStock] = useState("");
  const [newImpuesto, setNewImpuesto] = useState("");
  const [nota, setNota] = "";

  const [stockCritico, setStockCritico] = useState("");
  const [selectedImpuestoId, setSelectedImpuestoId] = useState("");
  const [imagen, setImagen] = useState("");

  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);

  const handleOpenDialog1 = () => {
    setOpenDialog1(true);
  };
  const handleCloseDialog1 = () => {
    setOpenDialog1(false);
  };

  const handleOpenDialog2 = () => {
    setOpenDialog2(true);
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };

  const handleImpuestoSelect = (formatoId) => {
    setSelectedImpuestoId(formatoId);
  };
  const handleCreateStock = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog1(false);
  };
  const handleCreateImpuesto = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog2(false);
  };

  const handleUpload = () => {
    // Implement your upload logic here
    if (imagen) {
      // You can use a library like Axios to send the file to your server or
      // implement the logic to handle the file on the client-side.
      console.log("Uploading file:", imagen);
    }
  };

  // useEffect(() => {
  //   async function fetchBodegas() {
  //     try {
  //       const response = await axios.get(
  //         "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetAllBodegas"
  //       );
  //       setBodegas(response.data.categorias);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   fetchBodegas();
  // }, []);

  const impuestos = [
    { id: 1, tipo: "IVA 19%" },
    { id: 2, tipo: "EXENTO" },
    { id: 3, tipo: "OTRO IMPUESTO" },
  ];

  return (
    <Paper elevation={3}>
      <Box>
        <Box>
          <Grid item xs={12} sm={12} md={12}>
            <Typography
              variant="h6"
              sx={{
                display:"flex",
                justifyContent:"center",
                marginBottom: "8px",
              }}
            >
             
              
            </Typography>
            {/* <InputLabel>Código del Producto :</InputLabel> */}
            <Grid item md={12}>
              {/* <TextField
                sx={{ marginTop: "7px" }}
                fullWidth
                value={stockCritico}
                onChange={(e) => setStockCritico(e.target.value)}
              /> */}
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Dialog open={openDialog1} onClose={handleCloseDialog1}>
        <DialogTitle>Crear Impuesto</DialogTitle>
        <DialogContent sx={{ marginTop: "9px" }}>
          <TextField
            label="Ingresa Stock"
            fullWidth
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog1} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateStock} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogTitle>Crear Impuesto Adicional </DialogTitle>
        <DialogContent sx={{ marginTop: "9px" }}>
          <TextField
            label="Impuesto Adicional "
            fullWidth
            value={newImpuesto}
            onChange={(e) => setNewImpuesto(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog2} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateImpuesto} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Step6Component;
