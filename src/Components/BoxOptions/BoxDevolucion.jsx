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
  Typography,
  Button,
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
          <>{children}</>
        </Box>
      )}
    </div>
  );
};

const BoxDevolucion = () => {
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
      <div>
        {/* Tabs component */}
        <Tabs value={value} onChange={handleChange} centered>
          {/* Individual tabs */}
          <Tab label="Boleta" />
          <Tab label="Ticket" />
          <Tab label="Otras Devoluciones" />
        </Tabs>

        {/* Content for each tab */}
        <TabPanel value={value} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={10} md={8}>
              <TextField
                label="Ingresa numero Boleta "
                variant="outlined"
                fullWidth
                value={boletaCode}
              />
            </Grid>
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
        <TabPanel value={value} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={10} md={8}>
              <TextField
                label="Ingresa numero Ticket "
                variant="outlined"
                fullWidth
                value={ticketCode}
              />
            </Grid>
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
        <TabPanel value={value} index={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={10} md={8}>
              <TextField
                label="Ingresa numero Ticket ModoAVION "
                variant="outlined"
                fullWidth
                value={modoAvionCode}
              />
            </Grid>
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
      </div>
    </Paper>
  );
};

export default BoxDevolucion;
