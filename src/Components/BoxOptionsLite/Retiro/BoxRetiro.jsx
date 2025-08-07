/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import {
  Paper,
  Tabs,
  Tab,
  Grid
} from "@mui/material";
import TabCaja from "./BoxRetiroTabCaja";
import TabFactura from "./BoxRetiroTabFactura";
import TabTrabajador from "./BoxRetiroTabTrabajador";


const BoxRetiro = ({
  tabNumber,
  setTabNumber,
  infoRetiro,
  setInfoRetiro
}) => {
  
  const handleChange = (event, newValue) => {
    setTabNumber(newValue);
  };

  return (
    <Paper>
      <Grid container>
        <Grid item xs={12}>
          {/* Tabs component */}
          <Tabs value={tabNumber} onChange={handleChange} centered>
            {/* Individual tabs */}
            <Tab label="Retiro de Caja"/>
            <Tab label="Pago de Factura"/>
            <Tab label="Anticipo Trabajador"/>
          </Tabs>
        </Grid>

        {/* Content for each tab */}
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TabCaja info={infoRetiro} setInfo={setInfoRetiro} tabNumber={tabNumber}/>
          <TabFactura info={infoRetiro} setInfo={setInfoRetiro} tabNumber={tabNumber} />
          <TabTrabajador info={infoRetiro} setInfo={setInfoRetiro} tabNumber={tabNumber} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BoxRetiro;
