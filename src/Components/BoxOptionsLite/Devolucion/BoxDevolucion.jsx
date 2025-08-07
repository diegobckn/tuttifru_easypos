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
import TabBoleta from "./BoxDevolucionTabBoleta";
import TabTicket from "./BoxDevolucionTabTicket";
import TabOtras from "./BoxDevolucionTabOtras";


const BoxDevolucion = () => {
  const [tabIndex, setActiveTab] = useState(0);
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Paper>
      <Grid container>
        <Grid item xs={12}>
          {/* Tabs component */}
          <Tabs value={tabIndex} onChange={handleChange} centered>
            {/* Individual tabs */}
            <Tab label="Con boleta"/>
            <Tab label="Con ticket"/>
            <Tab label="Otras devoluciones"/>
          </Tabs>
        </Grid>

        {/* Content for each tab */}
        <Grid>
          <TabBoleta tabIndex={tabIndex}/>
          <TabTicket tabIndex={tabIndex} />
          <TabOtras tabIndex={tabIndex} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BoxDevolucion;
