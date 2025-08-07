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
import TabFiado from "./BoxIngresoTabFiado";
import TabUsuario from "./BoxIngresoTabUsuario";
import TabIngresoOtro from "./BoxIngresoTabOtro";


const BoxIngreso = ({
  info,
  setInfo,
  tabNumber,
  setTabNumber
}) => {

  const handleChange = (event, newValue) => {
    setTabNumber(newValue);
  };

  return (
    <Paper>
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          {/* Tabs component */}
          <Tabs value={tabNumber} onChange={handleChange} centered>
            {/* Individual tabs */}
            <Tab label="Fiados"/>
            <Tab label="Usuarios"/>
            <Tab label="Otros Ingresos"/>
          </Tabs>
        </Grid>

        {/* Content for each tab */}
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TabFiado 
            tabNumber={tabNumber}
            info={info} 
            setInfo={setInfo}
          />
          <TabUsuario 
            tabNumber={tabNumber}
            info={info} 
            setInfo={setInfo} 
          />
          <TabIngresoOtro 
            info={info} 
            setInfo={setInfo} 
            tabNumber={tabNumber}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BoxIngreso;
