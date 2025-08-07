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

const TableSelecUsuario = ({
  onSelectCallback,
  tituloColumnaNombre = "Nombre",
  usuarios
}) => {

  
  
  return (
      <Table>
          <TableHead>

            { usuarios.length>0 && (
              <TableRow>
                <TableCell>{tituloColumnaNombre}</TableCell>
                <TableCell> </TableCell>
              </TableRow>
          )}
        </TableHead>

        <TableBody>

          {
            usuarios.map((usuario, index)=>{
              return(
              <TableRow key={index}>
                <TableCell>{usuario.nombres + " " + usuario.apellidos + " - " + usuario.codigoUsuario}</TableCell>
                <TableCell>
                
                <SmallButton textButton="Seleccionar" actionButton={()=>{
                    onSelectCallback(usuario);
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

export default TableSelecUsuario;
