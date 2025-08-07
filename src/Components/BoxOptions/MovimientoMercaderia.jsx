import React, { useState } from "react";
import { Paper, Grid, Button, TextField, Table, TableBody, TableCell, TableContainer, Radio, RadioGroup, FormControlLabel, TableHead, TableRow, Typography, Dialog, DialogContent } from "@mui/material";
import BotonesCategorias from "../BoxOptions/BotonesCategorias";
import TecladoPLU from "../Teclados/TecladoPLU";

const MovimientoMercaderia = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [plu, setPlu] = useState("");
  const [open, setOpen] = useState(false);
  const [openCategoria, setOpenCategoria] = useState(false);
  const [selectedOption, setSelectedOption] = useState("entrada");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenCategoria = () => setOpenCategoria(true);
  const handleCloseCategoria = () => setOpenCategoria(false);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Paper style={{ padding: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            placeholder="Ingresa Código o Descripción"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={12} sm={6}  md={4}>
          <Button size="large" variant="contained" onClick={handleOpen}>
            Código
          </Button>
        </Grid>
        <Grid item xs={12} md={4} >
          <Typography variant="h7">Búsqueda por familias :</Typography>
          <Button
            variant="contained"
            onClick={handleOpenCategoria}
            fullWidth
          >
            <Typography variant="h7">Familias</Typography>
          </Button>
        </Grid>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Entrada-Salida</TableCell>
              <TableCell>Stock Actual</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Example rows */}
            <TableRow>
              <TableCell>Data 1</TableCell>
              <TableCell>Data 2</TableCell>
              <TableCell>
                <RadioGroup row value={selectedOption} onChange={handleOptionChange}>
                  <FormControlLabel value="entrada" control={<Radio />} label="Entrada" />
                  <FormControlLabel value="salida" control={<Radio />} label="Salida" />
                </RadioGroup>
                Cantidad Producto
              </TableCell>
              <TableCell>Data 4</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Data 5</TableCell>
              <TableCell>Data 6</TableCell>
              <TableCell>Data 7</TableCell>
              <TableCell>Data 8</TableCell>
            </TableRow>
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <TecladoPLU
            plu={plu}
            setPlu={setPlu}
            onClose={handleClose}
            onPluSubmit={(productInfo) => {
              setPlu(productInfo.idProducto);
              handleClose();
              if (productInfo) {
                //addToSalesData(productInfo, 1); // Agregar lógica según sea necesario
              }
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openCategoria} onClose={handleCloseCategoria}>
        <DialogContent>
          <Typography variant="h6">Selecciona una categoría</Typography>
          <BotonesCategorias />
          <Button variant="outlined" onClick={handleCloseCategoria}>Cerrar</Button>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default MovimientoMercaderia;
