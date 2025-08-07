/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
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
} from "@mui/material";

const Step3Component = ({ data, onNext }) => {
  const [newUnidad, setNewUnidad] = useState("");
  const [stockInicial, setStockInical] = useState(data.stockInicial||0);
  const [precioCosto, setPrecioCosto] = useState(data.precioCosto||0);
  const [selectedUnidadId, setSelectedUnidadId] = useState(data.unidad||"");

  const [openDialog1, setOpenDialog1] = useState(false);

 

  const handleNext = () => {
    const stepData = {
      unidad:selectedUnidadId,
      precioCosto:precioCosto,
      stockInicial:stockInicial
    };
    console.log("Step 3 Data:", stepData); // Log the data for this step
    onNext(stepData);
  };


  const handleOpenDialog1 = () => {
    setOpenDialog1(true);
  };
  const handleCloseDialog1 = () => {
    setOpenDialog1(false);
  };

  const handleUnidadSelect = (unidadId) => {
    setSelectedUnidadId(unidadId);
  };
  const handleCreateUnidad = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog1(false);
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

  const unidades = [
    { id: 1, unidad: "KG" },
    { id: 2, unidad: "UNI" },
    { id: 3, unidad: "MM" },
    { id: 4, unidad: "CM" },
    { id: 5, unidad: "LT" },
    { id: 6, unidad: "OZ" },
    { id: 7, unidad: "CAJON" },
    { id: 8, unidad: "DISPLAY" },
    { id: 9, unidad: "PALLET" },
    { id: 10, unidad: "MALLA" },
  ];

  return (
    <Paper
      elevation={3}
      style={{
        padding: "16px",
        width: "830px",
      }}
    >
      <Box>
        <Box >
          <InputLabel>Unidad de Compra</InputLabel>
          <Select
            sx={{ width: "700px" }}
            value={selectedUnidadId}
            onChange={(e) => handleUnidadSelect(e.target.value)}
            label="Selecciona Unidad"
          >
            {unidades.map((unidad) => (
              <MenuItem key={unidad.id} value={unidad.id}>
                {unidad.unidad}
              </MenuItem>
            ))}
          </Select>
          <Button
            size="large"
            variant="outlined"
            style={{ marginLeft: "18px", padding: "14px" }}
            onClick={handleOpenDialog1}
          >
            +
          </Button>
        </Box>

        <Box>
          <InputLabel>Ingresa Precio Costo</InputLabel>
          <TextField
            sx={{ marginTop: "6px", width: "700px" }}
            label="Precio Costo"
            fullWidth
            value={precioCosto}
            onChange={(e) => setPrecioCosto(+e.target.value)}
          />
        </Box>
        <Box>
          <InputLabel>Ingresa Stock Inicial</InputLabel>
          <TextField
            sx={{ marginTop: "6px", width: "700px" }}
            label="Stock Inicial"
            fullWidth
            value={stockInicial}
            onChange={(e) => setStockInical(+e.target.value)}
          />
        </Box>
        <Button 
        sx={{ marginLeft: "40px",marginTop: "5px",  marginBottom: "12px" }}
        variant="contained"
        color="secondary"
        onClick={handleNext}>Guardar y continuar</Button>
      </Box>

      <Dialog open={openDialog1} onClose={handleCloseDialog1}>
        <DialogTitle>Crear Unidad de Compra</DialogTitle>
        <DialogContent sx={{ marginTop: "9px" }}>
          <TextField
            label="Ingresa Unidad de Compra"
            fullWidth
            value={newUnidad}
            onChange={(e) => setNewUnidad(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog1} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateUnidad} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Step3Component;

   