/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} component="div">
          {children}
        </Box>
      )}
    </div>
  );
};

const BoxIngreso = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // State for tracking PLU input in each tab
  const [boletaCode, setBoletaCode] = useState("");
  const [ticketCode, setTicketCode] = useState("");
  const [modoAvionCode, setModoAvionCode] = useState("");

  const handleNumberClick = (number) => {
    switch (value) {
      case 0:
        setBoletaCode(boletaCode + number);
        break;
      case 1:
        setTicketCode(ticketCode + number);
        break;
      case 2:
        setModoAvionCode(modoAvionCode + number);
        break;
      default:
        break;
    }
  };

  // Function to handle delete one for each tab
  const handleDeleteOne = () => {
    switch (value) {
      case 0:
        setBoletaCode(boletaCode.slice(0, -1));
        break;
      case 1:
        setTicketCode(ticketCode.slice(0, -1));
        break;
      case 2:
        setModoAvionCode(modoAvionCode.slice(0, -1));
        break;
      default:
        break;
    }
  };

  // Function to handle delete all for each tab
  const handleDeleteAll = () => {
    switch (value) {
      case 0:
        setBoletaCode("");
        break;
      case 1:
        setTicketCode("");
        break;
      case 2:
        setModoAvionCode("");
        break;
      default:
        break;
    }
  };

  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];

  return (
    <Paper>
      <Grid container>
        <Grid item xs={12}>
          {/* Tabs component */}
          <Tabs value={value} onChange={handleChange} centered>
            {/* Individual tabs */}
            <Tab label="Fiados" />
            <Tab label="Usuarios" />
            <Tab label="Otras Ingresos" />
          </Tabs>
        </Grid>

        {/* Content for each tab */}
        <Grid item xs={12}>
          <TabPanel value={value} index={0}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>Nombre </TableCell>
                      <TableCell colSpan={2}>Deuda</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>fiado 2</TableCell>
                      <TableCell colSpan={2}>xxxx</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>Nombre </TableCell>
                      <TableCell colSpan={2}>Monto Pago</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>fiado 2</TableCell>
                      <TableCell colSpan={2}>xxxx</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Your buttons go here */}
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Button variant="contained" color="primary">
                          Imprimir
                        </Button>
                        <Button variant="contained" color="primary">
                          Aceptar
                        </Button>
                        <Button variant="contained" color="primary">
                          Atras
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1}>
          <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Table>
                  <Grid> <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>Nombre </TableCell>
                      <TableCell colSpan={2}>Deuda</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>fiado 2</TableCell>
                      <TableCell colSpan={2}>xxxx</TableCell>
                    </TableRow>
                  </TableHead></Grid>

                  <Grid><TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>Nombre </TableCell>
                      <TableCell colSpan={2}>Monto Pago</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>usuario 2</TableCell>
                      
                      <TableCell colSpan={2}>xxxx</TableCell>
                    </TableRow>
                  </TableHead></Grid>
                 
                  
                  <TableBody>
                    {/* Your buttons go here */}
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Button variant="contained" color="primary">
                          Imprimir
                        </Button>
                        <Button variant="contained" color="primary">
                          Aceptar
                        </Button>
                        <Button variant="contained" color="primary">
                          Atras
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Grid container spacing={2}>
             
              <Grid item xs={12} sm={2} md={4}>
                <Button variant="outlined" size="large" fullWidth>
                  Buscar
                </Button>
              </Grid>

              {/* Include NumericKeypad for Boleta */}
              {numbers.map((number) => (
                <Grid item xs={4} sm={3} lg={2} key={number}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleNumberClick(number)}
                  >
                    {number}
                  </Button>
                </Grid>
              ))}
              <Grid item xs={4} sm={3} lg={2}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={handleDeleteOne}
                >
                  Borrar
                </Button>
              </Grid>
              <Grid item xs={4} sm={3} lg={2}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={handleDeleteAll}
                >
                  Limpiar
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Similar adjustments for other tabs */}
          {/* ... */}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BoxIngreso;
