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
import System from "./../../../Helpers/System";


const TableSelectProveedor = ({
  showBox,
  onSelect
}) => {

  const [proveedores, setProveedores] = useState([])
  const [facturaIds, setFacturaIds] = useState([])

  const [isCheck, setIsCheck] = useState([]);
  const [cambioSeleccion, setCambioSeleccion] = useState(false);
  const [totalDeudas, setTotalDeudas] = useState(0);
  const [montoSeleccion, setMontoSeleccion] = useState(0);

  useEffect(() => {
    Proveedor.getInstance().getAllFromServer((respuestaServidor) => {
      const facturaIdsx = []
      var totalx = 0
      setProveedores(respuestaServidor)
      respuestaServidor.forEach((deuda) => {
        totalx += deuda.total
        facturaIdsx[deuda.id] = deuda
      })

      setIsCheck([])
      setTotalDeudas(totalx)
      setMontoSeleccion(0)
      setFacturaIds(facturaIdsx)

    }, () => {
      setProveedores([])
    })
  }, [])

  useEffect(() => {
    calcularTotalSeleccion()

    //hacemos el onselect con lo que cambio de la seleccion
    const selected = [];
    isCheck.forEach((a) => {
      selected.push(facturaIds[parseInt(a)])
    })
    if (onSelect) {
      onSelect(selected)
    }

  }, [cambioSeleccion])

  const handleClickItem = (e) => {
    const { id, checked } = e.target;

    if (isCheck.length > 0) {
      const proveedorSeleccionado = facturaIds[id].codigoProveedor
      const proveedorAnterior = facturaIds[isCheck[0]].codigoProveedor
      if (proveedorSeleccionado != proveedorAnterior) {
        alert("Deben ser todos del mismo proveedor");
        return;
      }
    }

    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
    setCambioSeleccion(!cambioSeleccion)
  }

  const calcularTotalSeleccion = () => {
    var total = 0;
    isCheck.forEach((d) => {
      total += facturaIds[d].total
    })
    setMontoSeleccion(total)
  }

  return (
    <>
      {showBox && (
        <table style={{
          width:"90%",
          borderColor: "#a0a0a0",
          backgroundColor: "#859398",
        }} border={2} cellSpacing={0} cellPadding={10} align="center">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th style={{
                width: "40%",
              }} >Razon Social</th>
              <th>Tipo documento</th>
              <th>Folio</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {
              proveedores.map((proveedor, index) => {
                return (
                  <tr key={index}>
                    <td style={{
                      textAlign:"center"
                    }}><Checkbox
                      id={proveedor.id + ""}
                      checked={isCheck.includes(proveedor.id + "")}
                      onChange={handleClickItem}
                    /></td>
                    <td>{proveedor.razonSocial}</td>
                    <td>{proveedor.tipoDocumento}</td>
                    <td>{proveedor.folio}</td>
                    <td>${System.formatMonedaLocal(proveedor.total)}</td>
                  </tr>
                )
              })
            }
            <tr>
              <td colSpan={4}>
                Monto seleccion:
                ${System.formatMonedaLocal(montoSeleccion)}
                </td>
              <td colSpan={3}>
                Total deudas: <br />
                ${System.formatMonedaLocal(totalDeudas)}
                </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default TableSelectProveedor;
