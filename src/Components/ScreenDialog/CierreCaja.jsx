import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  CircularProgress
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxCierreCajaPaso1 from "../BoxOptionsLite/BoxCierreCajaPaso1";
import BoxCierreCajaPaso2 from "../BoxOptionsLite/BoxCierreCajaPaso2";
import InfoCierre from "../../Models/InfoCierre";
import System from "../../Helpers/System";
import CerrarCaja from "../../Models/CerrarCaja";
import SendingButton from "../Elements/SendingButton";

import { useNavigate } from "react-router-dom";
import Printer from "../../Models/Printer";
import UserEvent from "../../Models/UserEvent";

const CierreCaja = ({openDialog,setOpenDialog}) => {

  const {
    userData,
    salesData,
    grandTotal,
    clearSessionData,
    showMessage
  } = useContext(SelectedOptionsContext);


  const [openDialogPaso1, setOpenDialogPaso1] = useState(false)
  const [showButton1, setShowButton1] = useState(false)
  
  const [openDialogPaso2, setOpenDialogPaso2] = useState(false)
  const [showButton2, setShowButton2] = useState(false)

  const [infoCierre, setInfoCierre] = useState(null);
  const [arrayBilletes, setArrayBilletes] = useState([]);
  const [totalEfectivo, setTotalEfectivo] = useState(0);

  const [enviando, setEnviando] = useState(false)

  const navigate = useNavigate();

  const iniciarControles = ()=>{
      setOpenDialogPaso1(true)
      setOpenDialogPaso2(false)
      setShowButton1(true)
      setShowButton2(false)
      setInfoCierre(null)
      setArrayBilletes([])
      setTotalEfectivo(0)
  }

  const cargarInfoCierre = ()=>{
    console.log("buscando info de cierre de caja");
    const infoCierreServidor = new InfoCierre()
    infoCierreServidor.obtenerDeServidor(userData.codigoUsuario,(info)=>{
      setInfoCierre(info)
      console.log("info de cierre cargada correctamente");
      console.log(info);
    },()=>{
      showMessage(
        "Hubo un problema de conexión." +
        " Solicitar al administrador para hacer el cierre administrativo.");
      setOpenDialog(false)
    })
  }

  //observers
  useEffect(()=>{
    if(!openDialog) {
      setArrayBilletes([])
      return
    }
    iniciarControles()
    cargarInfoCierre()
  },[openDialog])


  const handleOnNext = ()=>{
    
    if(arrayBilletes.length<1){
      showMessage("Agregar los billetes para continuar.");
      return
    }
    
    UserEvent.send({
      name: "presiono boton next en cierre de caja",
      info: ""
    })

    setOpenDialogPaso1(false)
    setShowButton1(false)

    setOpenDialogPaso2(true)
    setShowButton2(true)
  }

  const handleOnPrev = ()=>{

    UserEvent.send({
      name: "presiono boton 'previo' en cierre de caja",
      info: ""
    })


    setOpenDialogPaso1(true)
    setShowButton1(true)

    setOpenDialogPaso2(false)
    setShowButton2(false)
  }

  const handleOnNext2 = ()=>{

    UserEvent.send({
      name: "presiono boton finalizar cierre de caja",
      info: ""
    })


    var diferencia = totalEfectivo - infoCierre.arqueoCajaById.totalSistema

    console.log("infoCierre.arqueoCajaById.totalSistema",infoCierre.arqueoCajaById.totalSistema)
    console.log("totalEfectivo",totalEfectivo)
    console.log("diferencia",diferencia)

    const data = {
      "idTurno": userData.idTurno,
      "totalSistema": infoCierre.arqueoCajaById.totalSistema,
      "totalIngresado": totalEfectivo,
      "diferencia": diferencia,
      "codigoUsuario": userData.codigoUsuario,
      "fechaIngreso": System.getInstance().getDateForServer(),
      "cajaArqueoDetalles": arrayBilletes
    }

    const cerrarCaja = new CerrarCaja()
    cerrarCaja.enviar(data,(res)=>{
      showMessage("Caja cerrada correctamente.");

      UserEvent.send({
        name: "cierre de caja correctamente",
        info: ""
      })

      

      Printer.printAll(res)
      clearSessionData();
      navigate("/login");
      setOpenDialog(false)
    }, (error)=>{
      showMessage(error);
    });


  }

  return (
    <Dialog open={openDialog} 
      // onClose={()=>{setOpenDialog(false)}} 
      maxWidth="md" fullWidth ={true}>
      <DialogTitle>Cerrar Caja</DialogTitle>
      <DialogContent onClose={()=>{setOpenDialog(false)}}>
        {openDialogPaso1 && (
            <BoxCierreCajaPaso1 
            arrayBilletes={arrayBilletes} 
            totalEfectivo={totalEfectivo}
            hasFocus={openDialogPaso1}
            setTotalEfectivo={setTotalEfectivo}
            setArrayBilletes={setArrayBilletes}
            />
          )
        }

        {openDialogPaso2 && (
            <BoxCierreCajaPaso2 
            arrayBilletes={arrayBilletes}
            infoCierre={infoCierre}
            totalEfectivo={totalEfectivo}
            hasFocus={openDialogPaso2}

            />
          )
        }
      </DialogContent>
      <DialogActions>

      {showButton1 && (
        <>
          <SmallButton
          style={{
            height:"60px",
            backgroundColor:"#dc0808"
          }}
          actionButton={() => {
            UserEvent.send({
              name: "presiono boton salir de cierre de caja",
              info: ""
            })
            setOpenDialog(false)
          }
          }
          textButton={"Salir"}
          />


        <SmallButton
          style={{
            height:"60px"
          }}
          actionButton={handleOnNext}
          textButton={"Continuar"}
        />
        </>
        )
      }

        {showButton2 && (
          <>
          <SmallButton
            style={{
              height:"60px"
            }}
            disabled={enviando}
            actionButton={handleOnPrev}
            textButton={"Previo"}
          />
          <SendingButton
            style={{
              height:"60px"
            }}
            sending={enviando}
            actionButton={handleOnNext2}
            textButton={"Finalizar"}
            sendingText={"Enviando..."}
          />
          </>
          )
        }

        

      </DialogActions>
    </Dialog>
  );
};

export default CierreCaja;
