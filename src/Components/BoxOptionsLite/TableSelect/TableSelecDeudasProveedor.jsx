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


const TableSelecDeudasProveedor = ({
  showBox,
  onSelect,
  proveedor
}) => {
    
  const [deudasProveedor, setDeudasProveedor] = useState([])
  const [allDeudas, setAllDeudas] = useState([])

  const [deudas, setDeudas] = useState([])
  const [deudasId, setDeudasId] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [isCheck, setIsCheck] = useState([]);
  const [cambioSeleccion, setCambioSeleccion] = useState(false);
  const [totalDeudas, setTotalDeudas] = useState(0);
  const [montoSeleccion, setMontoSeleccion] = useState(0);

  useEffect(()=>{
    if(!proveedor) return

    if(allDeudas.length<1){
      Proveedor.getInstance().getAllDeudas((respuestaServidor)=>{
        setAllDeudas(respuestaServidor)
      },()=>{
        setAllDeudas([])
      })
    }


  },[])

  useEffect(()=>{
    if(!proveedor) return
    
    if(allDeudas.length>1){
      var pro = new Proveedor()
      pro.codigoProveedor = proveedor.codigoProveedor
      const deudaIdsx = []
      var totalx = 0
      setDeudasProveedor(pro.filterByCodigo(allDeudas,(item)=>{
        deudaIdsx[item.id] = item;
        totalx += item.total
      }))
      setIsCheck([])
      setSelectAll(false)
      setDeudasId(deudaIdsx)
      setTotalDeudas(totalx)
      setMontoSeleccion(0)
    }
  },[allDeudas])

  useEffect(()=>{
    calcularTotalSeleccion()

    if(isCheck.length == deudasProveedor.length){
      setSelectAll(true)
    }

    //hacemos el onselect con lo que cambio de la seleccion
    const selected = [];
    isCheck.forEach((a)=>{
      selected.push(deudasId[ parseInt(a)])
    })

    if(onSelect){
      onSelect(selected)
    }

  },[cambioSeleccion])


  const calcularTotalSeleccion = ()=>{
    var total = 0;
    isCheck.forEach((d)=>{
      total+= deudasId[d].total
    })
    setMontoSeleccion(total)
  }

  const handleClickSelAll = ()=>{
    setSelectAll(!selectAll)
    setIsCheck(deudasProveedor.map(li => li.id + ""));
    if(selectAll){
      setIsCheck([]);
    }
    setCambioSeleccion(!cambioSeleccion)
  }

  const handleClickItem = (e)=>{
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setSelectAll(false)
      setIsCheck(isCheck.filter(item => item !== id));
    }
    setCambioSeleccion(!cambioSeleccion)
  }

  return (
    <>
      {showBox && (
      <Paper
        elevation={3}
        style={{
          backgroundColor: "#859398",
          padding: "10px",
          width:"100%",
          minHeight:"200px"
        }}
      >
        <table >
          <thead>
            <tr>

              <th width="120px">
              <Checkbox checked={selectAll} onChange={handleClickSelAll} />
                #&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </th>
              <th>Fecha</th>
              <th>Descripcion</th>
              <th>Monto</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
          {
            deudasProveedor.length>0 &&
            deudasProveedor.map((deuda, index)=>{
              return(
                <tr key={index} style={{
                  backgroundColor: (index % 2)? "#d4d4d4":"#c2c2c2",
                  cursor:"default"
                }}>
                  <td style={{ padding:"5px 20px" }} >
                    <Checkbox 
                    id={deuda.id + ""}
                    checked={selectAll || isCheck.includes(deuda.id+"")}
                    onChange={handleClickItem} 
                    />
                    {deuda.id}
                  </td>
                  <td style={{ padding:"5px 20px" }} >{deuda.fechaIngreso}</td>
                  <td style={{ padding:"5px 20px" }} >{deuda.tipoDocumento + " " + deuda.folio }</td>
                  <td style={{ padding:"5px 20px", textAlign:"right" }} >${deuda.total}</td>
                  
                </tr>
              )
            })
          }

          {
          deudasProveedor.length>0 &&(
            <tr>
              <td>Monto seleccion:</td>
              <td>${montoSeleccion}</td>
              <td>Total deudas:</td>
              <td style={{ padding:"5px 20px", textAlign:"right" }}>${totalDeudas}</td>
            </tr>
          )}
          
          {deudasProveedor.length<1 && (
              <tr>
                <td colSpan={4} style={{
                  textAlign:"center"
                }}>No hay deudas para el proveedor</td>
              </tr>
          )}


          </tbody>
        </table>
      </Paper>
    )}
    </>
  );
};

export default TableSelecDeudasProveedor;
