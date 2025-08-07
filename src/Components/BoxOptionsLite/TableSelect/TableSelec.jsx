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

import SystemHelper from "../../../Helpers/System";
import SmallButton from "../../Elements/SmallButton";

const TableSelec = ({
  onSelect,
  tituloColumnaNombre = "Nombre",
  funcNombreColumna,
  listaInfo
}) => {
  
  return (
      <Table>
          <TableHead>

            { listaInfo.length>0 && (
              <TableRow>
                <TableCell>{tituloColumnaNombre}</TableCell>
                <TableCell> </TableCell>
              </TableRow>
          )}
        </TableHead>

        <TableBody>

          {
            listaInfo.map((itemInfo, index)=>{
              return(
              <TableRow key={index}>
                <TableCell>{funcNombreColumna(itemInfo, index)}</TableCell>
                <TableCell>
                
                <SmallButton textButton="Seleccionar" actionButton={()=>{
                    onSelect(itemInfo);
                  }}/>

                </TableCell>
              </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
  );
};

export default TableSelec;
