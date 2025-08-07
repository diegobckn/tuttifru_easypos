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
import Validator from "../../../Helpers/Validator";
import TecladoNumeros from "../../Teclados/TecladoNumeros";

const TabDevolucionFactura = ({
  tabIndex
}) => {
  const [nroTicket2, setNroTicket2] = useState("")

  const checkNroTicket2 = (nueTicket)=>{
    if(Validator.isNumeric(nueTicket, 30)){
      setNroTicket2(nueTicket)
    }
  }


  return (
    <TabPanel value={tabIndex} index={2}>
      <Grid container spacing={2} 
      >
          <Grid item xs={12} sm={12} md={5} lg={5}>
            <TextField
              margin="normal"
              fullWidth
              label="Numero Ticket 2"
              type="text" // Cambia dinámicamente el tipo del campo de contraseña
              value={nroTicket2}
              onChange={(e) => checkNroTicket2(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={7}>
            <TecladoNumeros
              showFlag={true}
              varValue={nroTicket2}
              varChanger={checkNroTicket2}
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
