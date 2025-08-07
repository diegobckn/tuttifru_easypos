import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import BoxBuscarEnvases from "../BoxOptionsLite/BoxBuscarEnvases";
import BoxDevolverEnvases from "../BoxOptionsLite/BoxDevolverEnvases";
import Envase from "../../Models/Envase";
import System from "../../Helpers/System";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Printer from "../../Models/Printer";

const Envases = ({
  openDialog,
  setOpenDialog
}) => {

  const {
    userData,
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);



  const[step, setStep] = useState(1)
  const[folio, setFolio] = useState(0)
  const[qr, setQr] = useState("")
  const[dataBusqueda, setdataBusqueda] = useState("")
  const[dataDevolver, setDataDevolver] = useState(null)
  


  useEffect(()=>{
    if(!openDialog) return

    setStep(1)

  },[openDialog])


  const handleBuscar = ()=>{

    const data = {
      nfolio: folio,
      qr: qr
    }

    showLoading("Buscando...")
    Envase.buscar({
      folio,qr
    },(res)=>{
      console.log("res")
      console.log(res)
      hideLoading()
      if(res.gestionEnvases.length< 1){
        showMessage("Ya estan devueltos los envases de este ticket")
      }else{
        setdataBusqueda(res)
        setStep(step+1)
      }
    }, (err)=>{
      showMessage(err)
      hideLoading()
    })

  }

  const handleDevolver = ()=>{

    const data = {
      "fechaIngreso": System.getInstance().getDateForServer(),
      "codigoUsuario": userData.codigoUsuario,
      "qr": "string",
      "cantidad": 0,
      "precioUnitario": 0,
      "nFolio": 0
    }
    data.cantidad = dataDevolver.cantidad
    data.qr = dataBusqueda.gestionEnvases[0].qr
    data.nFolio = dataBusqueda.gestionEnvases[0].nFolio
    data.precioUnitario = dataBusqueda.gestionEnvases[0].precioUnitario

    // console.log("para enviar")
    // console.log(data)

    showLoading("Devolviendo")
    Envase.devolver(data,(res)=>{
      // console.log("res")
      // console.log(res)
      Printer.printAll(res)
      showMessage("Realizado correctamente")
      hideLoading()
      setOpenDialog(false)
    }, (err)=>{
      console.log(err)
      showMessage("No se pudo realizar")
      hideLoading()
    })

  }

  return (
    <Dialog open={openDialog} onClose={()=>{setOpenDialog(false)}} maxWidth="lg">
      <DialogTitle>Devolucion de Envases</DialogTitle>
      <DialogContent onClose={()=>{setOpenDialog(false)}}>
      { (step == 1) && (
        <BoxBuscarEnvases 
        openDialog={openDialog} 
        onClose={()=>{setOpenDialog(false)}}
        folio={folio}
        setFolio={setFolio}
        qr={qr}
        setQr={setQr}

        onEnter={()=>{
          handleBuscar()
        }}
        />
      )}

      { (step == 2) && (
        <BoxDevolverEnvases 
        openDialog={openDialog} 
        onClose={()=>{setOpenDialog(false)}}
        dataBusqueda={dataBusqueda}
        step={step}
        onChange={setDataDevolver}
        />
      )}

      </DialogContent>
      <DialogActions>
        { (step > 1) && (
          <SmallButton textButton="Anterior" actionButton={()=>{
            setStep(step - 1)
          }}/>
        ) }
          <SmallButton textButton="Continuar" actionButton={()=>{
            if(step == 1){
              handleBuscar()
            }else if(step == 2){
              handleDevolver()
            }
            // setStep(step + 1)
          }}/>

        </DialogActions>
      </Dialog>
  );
};

export default Envases;
