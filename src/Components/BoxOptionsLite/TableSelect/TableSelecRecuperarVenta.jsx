/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from "react";
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
  Typography,
} from "@mui/material";

import SystemHelper from "../../../Helpers/System";
import SmallButton from "../../Elements/SmallButton";
import Suspender from "../../../Models/Suspender";
import { SelectedOptionsContext } from "./../../Context/SelectedOptionsProvider";


const TableSelecRecuperarVenta = ({
  onSelect,
  selectedItem,
  setSelectedItem
}) => {

  const {
    userData,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [ventas, setVentas] = useState([])
  const [ventaSeleccionada, setVentaSeleccionada] = useState([])
  
  useEffect(()=>{
    showLoading("cargando ventas suspendidas...")
    Suspender.getInstance().listarVentas(userData.codigoUsuario,(ventas)=>{
      setVentas(ventas)
      console.log("ventas", ventas)
      hideLoading()
    }, (error)=>{
      console.log("listarVentas:" + error)
      setVentas([])
      hideLoading()
    })
  },[])

  return (
      <Table style={{
        minWidth:"200px",
        minHeight:"150px"
      }}>
          <TableHead>

            {!selectedItem &&  ventas.length>0 && (
              <TableRow>
                <TableCell>Descripcion</TableCell>
                <TableCell> </TableCell>
              </TableRow>
          )}
        </TableHead>

        <TableBody>
          {ventas.length>0 && !selectedItem && ventas.map((venta, index)=>{
            return(
              <TableRow key={index}>
              <TableCell>{venta.descripcion}</TableCell>
              <TableCell>
              
              <SmallButton textButton="Seleccionar" actionButton={()=>{
                onSelect(venta);
                console.log("sel", venta)
              }}/>
              
              </TableCell>
              </TableRow>
            )
            })
          }

          {ventas.length < 1 && (
            <TableRow>
            <TableCell>
              <Typography >No hay ventas para recuperar</Typography>
            </TableCell>
          </TableRow>
          )}
              
          {
            selectedItem && (
              <>
                <TableRow>
                    <TableCell>
                      <Typography >{selectedItem.descripcion}</Typography>
                  </TableCell>
                  <TableCell>
                    <Button onClick={()=>{
                      setSelectedItem(null)
                    }} variant="contained">Cambiar</Button>
                  </TableCell>
                </TableRow>

                { selectedItem.ventaSuspenderDetalle.length > 0 && (
                  <TableRow>
                  <TableCell>
                    Producto
                  </TableCell>

                  <TableCell>
                    Cantidad
                  </TableCell>
                  </TableRow>
                )}
                { selectedItem.ventaSuspenderDetalle.map((venta,index)=>{
                    return(
                      <TableRow key={index}>
                      <TableCell>
                        { venta.descripcion }
                      </TableCell>

                      <TableCell>
                      { venta.cantidad }
                      </TableCell>
                      </TableRow>
                    )
                  })
                }
              </>
            )
          }
          
          
        </TableBody>
      </Table>
  );
};

export default TableSelecRecuperarVenta;
