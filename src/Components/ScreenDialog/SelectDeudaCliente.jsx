import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  TableContainer,
  Grid,
  Container,
  useTheme,
  useMediaQuery,

  IconButton,
  Menu,
  TextField,
  Chip,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox

} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Client from "../../Models/Client";
import SmallButton from "./../Elements/SmallButton"

const SelectDeudaCliente = ({
  openDialog,
  setOpenDialog,
  client,
  onSelect
}) => {

  const {
  showMessage
} = useContext(SelectedOptionsContext);

  const [deudas, setDeudas] = useState([])
  const [deudasId, setDeudasId] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [isCheck, setIsCheck] = useState([]);
  
  const [cambioSeleccion, setCambioSeleccion] = useState(false);
  const [totalDeudas, setTotalDeudas] = useState(0);
  const [montoSeleccion, setMontoSeleccion] = useState(0);
  
  const [ultimoCliente, setUltimoCliente] = useState(null);

  useEffect(()=>{
    if(!openDialog) return
    if(client == null)return

    if(ultimoCliente == null || client.codigoCliente != ultimoCliente.codigoCliente){
      setUltimoCliente(client)
      setLoading(true)

      var cl = new Client()
      cl.id = client.codigoCliente
      cl.getDeudasByMyId((deudasServidor)=>{
        setDeudas(deudasServidor);
        setLoading(false)
        setIsCheck([])
        setSelectAll(false)
        const deudaIdsx = []

        var total = 0;
        deudasServidor.forEach((deuda)=>{
          deudaIdsx[deuda.id] = deuda
          total += deuda.total;
        })
        setDeudasId(deudaIdsx)
        setTotalDeudas(total)
        setMontoSeleccion(0)
      },(error)=>{
        console.log("error", error)
        showMessage("No se pudo cargar el listado de deudas. Problemas con la respuesta del servidor.");
        setLoading(false)
      })
    }
    
  },[openDialog])

  useEffect(()=>{
    calcularTotalSeleccion()

    if(isCheck.length == deudas.length){
      setSelectAll(true)
    }
  },[cambioSeleccion])
  
  const handleClickSelAll = ()=>{
    setSelectAll(!selectAll)
    setIsCheck(deudas.map(li => li.id + ""));
    if(selectAll){
      setIsCheck([]);
    }
    setCambioSeleccion(!cambioSeleccion)
  }


  const calcularTotalSeleccion = ()=>{
    var total = 0;
    isCheck.forEach((d)=>{
      total+= deudasId[d].total
    })
    setMontoSeleccion(total)
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
      <Dialog open={openDialog} onClose={()=>{
        //setOpenDialog(false)
      }}
      fullWidth={true}>
        <DialogTitle>
          Seleccionar deuda de cliente
        </DialogTitle>
        <DialogContent>
            {
            (deudas.length> 0 ) ? (
              <>
              <Table>
              <TableHead>
                <TableRow>
                  <TableCell >
                    <Checkbox checked={selectAll} onChange={handleClickSelAll} />
                  </TableCell>
                  <TableCell >#</TableCell>
                  <TableCell >Razon Social </TableCell>
                  <TableCell >Ticket </TableCell>
                  <TableCell >Monto </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {
                deudas.map((deuda, index)=>{
                  return(
                  <TableRow key={index}>    
                  <TableCell >
                    <Checkbox 
                    id={deuda.id + ""}
                    checked={selectAll || isCheck.includes(deuda.id+"")}
                    onChange={handleClickItem} 
                    />
                  </TableCell>
                  <TableCell >{deuda.id} </TableCell>
                  <TableCell >{deuda.razonSocial} </TableCell>
                  <TableCell >{deuda.descripcionComprobante + " " + deuda.nroComprobante} </TableCell>
                  <TableCell >${deuda.total} </TableCell>
                  
                  </TableRow>
                  )}
                )
              }

              <TableRow>  
                <TableCell >Monto seleccion: </TableCell>
                <TableCell >${montoSeleccion}</TableCell>
                <TableCell >&nbsp;</TableCell>
                <TableCell >Total deudas: </TableCell>
                <TableCell >${totalDeudas}</TableCell>
              </TableRow>
            </TableBody>
            </Table>
            </>
          ):<Typography>
            {
              (loading ) ? "Cargando...":

                "El cliente no tiene deudas"
            }
          </Typography>
        }

        </DialogContent>
        <DialogActions>

          <Button onClick={()=>{
            const selected = [];
            isCheck.forEach((a)=>{
              selected.push(deudasId[ parseInt(a)])
            })
            onSelect(selected)
            setOpenDialog(false)
          }}>continuar</Button>

          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Atras</Button>
        </DialogActions>
      </Dialog>
  );
};

export default SelectDeudaCliente;
