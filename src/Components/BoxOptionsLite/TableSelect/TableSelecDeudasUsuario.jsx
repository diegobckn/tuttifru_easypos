/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
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
  Checkbox,
} from "@mui/material";

import TabPanel from "./../TabPanel";
import SystemHelper from "./../../../Helpers/System";
import SmallButton from "./../../Elements/SmallButton";
import Proveedor from "./../../../Models/Proveedor";
import User from "../../../Models/User";


const TableSelecDeudasUsuarios = ({
  showBox,
  onSelect
}) => {
    
  const [usuarios, setUsuarios] = useState([])
  const [deudasIds, setDeudasIds] = useState([])

  const [isCheck, setIsCheck] = useState([]);
  const [cambioSeleccion, setCambioSeleccion] = useState(false);
  const [totalDeudas, setTotalDeudas] = useState(0);
  const [montoSeleccion, setMontoSeleccion] = useState(0);

  useEffect(()=>{
    User.getInstance().getUsuariosDeudas((respuestaServidor)=>{
      const deudasIdsx = []
      var totalx = 0
      setUsuarios(respuestaServidor)
      respuestaServidor.forEach((deuda)=>{
        totalx += deuda.total
        deudasIdsx[deuda.id] = deuda
      })

      setIsCheck([])
      setTotalDeudas(totalx)
      setMontoSeleccion(0)
      setDeudasIds(deudasIdsx)

    },()=>{
      setUsuarios([])
    })
  },[])

  useEffect(()=>{
    calcularTotalSeleccion()

    //hacemos el onselect con lo que cambio de la seleccion
    const selected = [];
    isCheck.forEach((a)=>{
      selected.push(deudasIds[ parseInt(a)])
    })
    onSelect(selected)
    
  },[cambioSeleccion])

  const handleClickItem = (e)=>{
    const { id, checked } = e.target;

    if(isCheck.length>0){
      const usuarioSeleccionado = deudasIds[id].codigoUsuario
      const usuarioAnterior = deudasIds[isCheck[0]].codigoUsuario
      if(usuarioSeleccionado != usuarioAnterior){
        alert("Deben ser todos del mismo usuario");
        return;
      }
    }

    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
    setCambioSeleccion(!cambioSeleccion)
  }

  const calcularTotalSeleccion = ()=>{
    var total = 0;
    isCheck.forEach((d)=>{
      total+= deudasIds[d].total
    })
    setMontoSeleccion(total)
  }

  return (
      <Paper
        elevation={3}
        style={{
          backgroundColor: "#859398",
          padding: "10px",
          width:"100%",
          minHeight:"200px"
        }}
      >
        <table>
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>Nombre</th>
              <th>Desc. comprobante</th>
              <th>Nro. comprobante</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
          {
            usuarios.map((usuario, index)=>{
              return(
                <tr key={index}>
                  <td><Checkbox 
                    id={usuario.id + ""}
                    checked={isCheck.includes(usuario.id+"")}
                    onChange={handleClickItem} 
                    /></td>
                  <td>{usuario.nombreApellidoOperador}</td>
                  <td>{usuario.descripcionComprobante}</td>
                  <td>{usuario.nroComprobante}</td>
                  <td>${usuario.total}</td>
                </tr>
              )
            })
          }
          <tr>
            <td>Monto seleccion:</td>
            <td>${montoSeleccion}</td>
            <td>Total deudas:</td>
            <td style={{ padding:"5px 20px", textAlign:"right" }}>${totalDeudas}</td>
          </tr>
          </tbody>
        </table>
      </Paper>
  );
};

export default TableSelecDeudasUsuarios;
