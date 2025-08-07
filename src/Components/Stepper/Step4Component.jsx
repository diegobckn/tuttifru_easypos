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

const Step4Component = ({ data, onNext }) => {
  const [newUnidad, setNewUnidad] = useState("");
  const [stockInicial, setStockInical] = useState("");
  const [precioVenta, setPrecioVenta] = useState(data.precioVenta||0);
  const [selectedFormatoId, setSelectedFormatoId] = useState(data.formatoVenta||"");

  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);

  

  const handleNext = () => {
    const stepData = {
      formatoVenta:selectedFormatoId,
      precioVenta:precioVenta

    };
    console.log("Step 4 Data:", stepData); // Log the data for this step
    onNext(stepData);
  };

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

  const handleFormatoSelect = (formatoId) => {
    setSelectedFormatoId(formatoId);
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

  const formatos = [
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
          <InputLabel>Formato de venta</InputLabel>
          <Select
            sx={{ width: "700px" }}
            value={selectedFormatoId}
            onChange={(e) => handleFormatoSelect(e.target.value)}
            label="Selecciona Formato Venta"
          >
            {formatos.map((formato) => (
              <MenuItem key={formato.id} value={formato.id}>
                {formato.unidad}
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
          <InputLabel>Ingresa Precio Venta</InputLabel>
          <TextField
            sx={{ marginTop: "6px", width: "700px" }}
            label="Precio Venta"
            fullWidth
            value={precioVenta}
            onChange={(e) => setPrecioVenta(+e.target.value)}
          />
          <Button
            size="large"
            variant="outlined"
            style={{ marginLeft: "18px", padding: "14px", marginTop: "6px" }}
            onClick={handleOpenDialog2}
          >
            +
          </Button>
        </Box>
        <Box>
        <Button 
        sx={{ marginLeft: "40px",marginTop: "5px",  marginBottom: "12px" }}
        variant="contained"
        color="secondary"
        onClick={handleNext}>Guardar y continuar</Button>
        </Box>


       
      </Box>

      <Dialog open={openDialog1} onClose={handleCloseDialog1}>
        <DialogTitle>Crear Unidad de Venta</DialogTitle>
        <DialogContent sx={{ marginTop: "9px" }}>
          <TextField
            label="Ingresa Unidad de Venta"
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
      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogTitle>Plantilla de Venta</DialogTitle>
        <DialogContent sx={{ marginTop: "9px" }}>
          <TextField
            label="Plantilla"
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

export default Step4Component;
