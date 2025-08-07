/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import { SelectedOptionsContext } from "./../../Context/SelectedOptionsProvider";

import TabPanel from "../TabPanel";
import SystemHelper from "../../../Helpers/System";
import SmallButton from './../../Elements/SmallButton'
import Client from "../../../Models/Client";
import SelectDeudaCliente from "../../ScreenDialog/SelectDeudaCliente";
import ScreenDialogBuscarCliente from "./../../ScreenDialog/BuscarCliente"
import TecladoCierre from "../../Teclados/TecladoCierre";
import TecladoPagoCaja from "../../Teclados/TecladoPagoCaja";
import BoxSelectPayMethod from "../BoxSelectPayMethod";
import Validator from "../../../Helpers/Validator";


const BoxIngresoTabFiado = ({
  tabNumber,
  info,
  setInfo
}) => {

  const [showDialogSelectClient,setShowDialogSelectClient]= useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [showSelectDeuda, setShowSelectDeuda] = useState(false)
  const [deudas, setDeudas] = useState([])
  const [monto, setMonto] = useState(0)
  const [metodoPago, setMetodoPago] = useState("EFECTIVO")



  useEffect(()=>{
    if(clienteSeleccionado != null){
      setShowSelectDeuda(true)
    }
  },[clienteSeleccionado])

  useEffect(()=>{
    const infox = {}
    if(clienteSeleccionado != null){
      setShowDialogSelectClient(false)
      infox.clienteSeleccionado = clienteSeleccionado
    }
    if(deudas.length>0){
      infox.deudas = deudas
    }
    if(parseFloat(monto)>0)
      infox.monto = monto
    if(metodoPago != null)
      infox.metodoPago = metodoPago

    setInfo(infox)
  },[clienteSeleccionado, monto, metodoPago])

  useEffect(() => {
    if(deudas.length<1) return
    if(metodoPago == "EFECTIVO"){
    }else if(metodoPago == "CUENTACORRIENTE"){
    }else if(metodoPago == "TRANSFERENCIA"){
    }else{
    }
  }, [metodoPago]);



  //fin observers
  const onSelectDeuda = (deudasRecienSeleccionadas)=>{
    setDeudas(deudasRecienSeleccionadas)
    setMonto(calcularTotalDeudas(deudasRecienSeleccionadas))
  }

  const onChangePayMethod = (method)=>{
    setMetodoPago(method);
  }

  const calcularTotalDeudas = (deudasx)=>{
    var total = 0;
    if(!deudasx) deudasx = deudas
    deudasx.forEach((d)=>{
      total += d.total
    })
    return total
  }


  return (
    <TabPanel value={tabNumber} index={0} >
      
      <Grid container spacing={2} 
      >

        <ScreenDialogBuscarCliente 
          openDialog={showDialogSelectClient} 
          setOpenDialog={setShowDialogSelectClient}
          setCliente={setClienteSeleccionado}
        />



      <Grid item xs={12} sm={5} md={5} lg={5}>

        <TextField
          margin="normal"
          fullWidth
          label="Monto del ingreso"
          type="number" // Cambia dinámicamente el tipo del campo de contraseña
          value={monto}
          onChange={(e) => {
            if(Validator.isMonto(e.target.value)){
              setMonto(parseFloat(e.target.value))
            }
          }}
        />

        { !clienteSeleccionado && (
          <SmallButton 
          textButton="Seleccionar cliente"
          actionButton={()=>{
            setShowDialogSelectClient(true)
          }}
          />
        )}

        <SelectDeudaCliente
        client={clienteSeleccionado}
        openDialog={showSelectDeuda}
        setOpenDialog={setShowSelectDeuda}
        onSelect={onSelectDeuda}
        />

        <Table>
        <TableBody>
          {clienteSeleccionado &&(
          <TableRow>
          <TableCell >Cliente</TableCell>
          <TableCell >{clienteSeleccionado.nombreResponsable + " " + clienteSeleccionado.apellidoResponsable}
          </TableCell>
          <TableCell>
            <SmallButton 
              textButton="Cambiar cliente"
              actionButton={()=>{
                setClienteSeleccionado(null)
                setDeudas([])
                setInfo(null)
                setMonto(0)
                setShowDialogSelectClient(true)
              }}
              />
          </TableCell>
          </TableRow>
          )}

          {deudas.length>0 &&(
          <TableRow>
            <TableCell >Deuda</TableCell>
            <TableCell >${
              calcularTotalDeudas()
            }
            </TableCell>
            <TableCell>
              <SmallButton 
                textButton="Cambiar deuda"
                actionButton={()=>{
                  setDeudas([])
                  setShowSelectDeuda(true)
                }}
                />

            </TableCell>
            </TableRow>
          )}

          {deudas.length<1 && clienteSeleccionado!=null &&(
          <TableRow>
            <TableCell>
              <SmallButton 
                textButton="Seleccionar deuda"
                actionButton={()=>{
                  setDeudas([])
                  setShowSelectDeuda(true)
                }}
                />

            </TableCell>
            </TableRow>
          )}

          { clienteSeleccionado && deudas.length>0 &&(
            <TableRow>
            <TableCell colSpan={3}>
              <BoxSelectPayMethod 
                metodoPago={metodoPago} 
                onChange={onChangePayMethod}
                excludes={[
                  "TRANSFERENCIA",
                  "CUENTACORRIENTE"
                ]}
              />
              </TableCell>
              </TableRow>
            )}
        </TableBody>
        </Table>

        </Grid>
        <Grid item xs={12} sm={7} md={7} lg={7}>
          <TecladoPagoCaja
          maxValue={100000}
          showFlag={true}
          varValue={monto}
          varChanger={setMonto}
          onEnter={()=>{}}
          />
        </Grid>
        
        <Grid item xs={12} sm={12} md={12} lg={12}>
        
            {/* <TableRow>
              <TableCell colSpan={4}>
                <Button variant="contained" color="primary">
                  Imprimir
                </Button>
                <Button variant="contained" color="primary">
                  Aceptar
                </Button>
                <Button variant="contained" color="primary">
                  Atras
                </Button>
              </TableCell>
            </TableRow> */}
        </Grid>


      </Grid>
    </TabPanel>
  );
};

export default BoxIngresoTabFiado;
