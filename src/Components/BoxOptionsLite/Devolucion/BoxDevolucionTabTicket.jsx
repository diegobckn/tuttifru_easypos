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

import TabPanel from "../TabPanel";
import SystemHelper from "../../../Helpers/System";
import TecladoNumeros from "../../Teclados/TecladoNumeros";
import Validator from "../../../Helpers/Validator";

const TabDevolucionFactura = ({
  tabIndex
}) => {
  const [nroTicket, setNroTicket] = useState("")

  const checkNroTicket = (nueTicket)=>{
    if(Validator.isNumeric(nueTicket, 30)){
      setNroTicket(nueTicket)
    }
  }

  return (
    <TabPanel value={tabIndex} index={1}>
      <Grid container spacing={2} 
      >
          
          <Grid item xs={12} sm={12} md={5} lg={5}>
            <TextField
              margin="normal"
              fullWidth
              label="Numero Ticket"
              type="text" // Cambia dinámicamente el tipo del campo de contraseña
              value={nroTicket}
              onChange={(e) => checkNroTicket(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={7}>
            <TecladoNumeros
              showFlag={true}
              varValue={nroTicket}
              varChanger={checkNroTicket}
              maxValue={10000000000000000000}
              onEnter={()=>{
              }}
            />
          </Grid>
        </Grid>
      </TabPanel>
  );
};

export default TabDevolucionFactura;
