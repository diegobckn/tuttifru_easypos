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
  Input,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Step5Component = ({ data, onNext }) => {
  const impuestos = [
    { id: 1, tipo: "IVA 19%" },
    { id: 2, tipo: "EXENTO" },
    { id: 3, tipo: "OTRO IMPUESTO" },
  ];

  const [newStock, setNewStock] = useState("");
  const [newImpuesto, setNewImpuesto] = useState(data.selectedFormatoId||"");
  const [nota, setNota] = useState(data.nota||"");

  const [stockCritico, setStockCritico] = useState(data.stockCritico||"");
  const [selectedImpuestoId, setSelectedImpuestoId] = useState(data.selectedImpuestoId||impuestos[0].tipo);

  const [selectedFile, setSelectedFile] = useState(data.selectedFile||null);

  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);

  const handleNext = () => {
    const stepData = {
      stockCritico:stockCritico,
      impuesto:selectedImpuestoId,
      selectedFile,
      nota:nota,
    };
    console.log("Step 5 Data:", stepData); // Log the data for this step
    onNext(stepData);
  };

  const handleSubmit = () => {};

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

  // const handleUpload = () => {
  //   // Implement your upload logic here
  //   if () {
  //     // You can use a library like Axios to send the file to your server or
  //     // implement the logic to handle the file on the client-side.
  //     console.log("Uploading file:", imagen);
  //   }
  // };

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

  

  return (
    <Paper
      elevation={3}
      style={{
        padding: "16px",
        width: "740px",
      }}
    >
      <Box>
        <Box>
          <InputLabel>Ingresa Stock Crítico</InputLabel>
          <TextField
            sx={{ marginTop: "7px", width: "500px", marginBottom: "11px" }}
            label="Stock Crítico"
            fullWidth
            value={stockCritico}
            onChange={(e) => setStockCritico(+e.target.value)}
            
          />
          {/* <Button
            size="large"
            variant="outlined"
            style={{
              marginLeft: "16px",
              marginTop: "7px",
              padding: "14px",
              width: "33px",
            }}
            onClick={handleOpenDialog1}
          >
            +
          </Button> */}
        </Box>

        <Box >
          <InputLabel>Impuestos Adicionales</InputLabel>
          <Select
            sx={{ width: "500px" }}
            value={selectedImpuestoId}
            onChange={(e) => handleImpuestoSelect(e.target.value)}
            label="Selecciona Impuesto adicional "
            
          >
            <MenuItem selected  key={impuestos.id} value={impuestos.tipo}>
            {impuestos.tipo}
              </MenuItem>
            {impuestos.map((impuesto) => (
              <MenuItem key={impuesto.id} value={impuesto.tipo}>
                {impuesto.tipo}
              </MenuItem>
            ))}
          </Select>
          <Button
            size="large"
            variant="outlined"
            style={{ marginLeft: "16px", marginTop: "1px", padding: "14px" }}
            onClick={handleOpenDialog2}
          >
            +
          </Button>
        </Box>

        {/* <Box>
          <InputLabel>Ingresa Imagen producto</InputLabel>
          <Input
            sx={{ marginTop: "17px", width: "500px", marginBottom: "31px" }}
            label="Ingresa Imagen"
            type="file"
            fullWidth
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
          
        </Box> */}
        <Box>
        <InputLabel>Ingresa Imagen </InputLabel>
          <label htmlFor="file-input">
            <input
            
              type="file"
              id="file-input"
              style={{ display: "none" }}
              accept="image/*" // You can specify the accepted file types here
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedFile(file);
                // Handle the selected file directly here
                console.log("Selected File:", file);
              }}
            />
            <Button
            sx={{ marginTop: "5px", width: "500px" }}
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Seleccionar Imagen
            </Button>
          </label>
          {selectedFile && <p>Archivo: {selectedFile.name}</p>}
        </Box>

        <Box>
          <InputLabel>Ingresa Nota </InputLabel>
          <TextField
            sx={{ marginTop: "5px", width: "570px" }}
            label="Ingrese nota ... "
            multiline
            rows={4}
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
        </Box>
        {/* <Button onClick={handleNext}>Guardar</Button> */}

        {/* <Button 
        sx={{ marginLeft: "40px",marginTop: "5px",  marginBottom: "12px" }}
        variant="contained"
        color="secondary"
        onClick={handleNext}>Guardar </Button> */}

        


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

export default Step5Component;
