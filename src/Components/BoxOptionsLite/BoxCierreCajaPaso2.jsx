import React, { useContext, useState, useEffect } from "react";
import {
  Grid,
  Typography,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";
import BoxCantidadBillete from "./BoxCantidadBillete";
import TecladoCierre from "../Teclados/TecladoCierre";
import InfoCierre from "../../Models/InfoCierre";
import CerrarCaja from "../../Models/CerrarCaja";
import { BorderLeft, BorderTop } from "@mui/icons-material";

const BoxCierrCaja = ({ 
  arrayBilletes,
  infoCierre,
  totalEfectivo,
  hasFocus
}) => {
  const {
    userData
  } = useContext(SelectedOptionsContext);

  const [diferenciaPositiva, setDiferenciaPositiva] = useState(false)
  const [diferencia, setDiferencia] = useState(0)

    //observers
    useEffect(()=>{
      if(!hasFocus) return
      console.log(arrayBilletes)
      calcularDiferencia()
    },[hasFocus])


  const styleTdLeft = {
    borderRight:"1px #90b2f2 solid",
    borderBottom:"1px #90b2f2 solid",
    padding:"5px",
    fontSize:"20px"
  }
  
  const styleTdRight = {
    borderBottom:"1px #90b2f2 solid",
    padding:"5px",
    fontSize:"20px"
  }

  const styleTdLeftSepared = {...styleTdLeft,...{
      borderTop:"1px #90b2f2 solid",
    }
  }

  const styleTdRightSepared = {...styleTdRight,...{
      borderTop:"1px #90b2f2 solid",
    }
  }

  const calcularDiferencia = ()=>{
    console.log("calcular diferencia")
    var dif = totalEfectivo - infoCierre.arqueoCajaById.totalSistema
    console.log("dif")
    console.log(dif)
    setDiferencia(dif)
    if(dif < 0) {
      dif *= -1;
      setDiferenciaPositiva(false)
    }else{
      setDiferenciaPositiva(true)
    }

    return dif
  }


  return (
      <Grid container spacing={2} style={{
      }}>

        <Grid item xs={12} md={12} lg={12}>
          <table cellSpacing={0} cellPadding={0} style={{
            width: "50%",
            border:"3px solid #90b2f2",
          }} align="center">
            <thead>
              <tr>
                <td align="right" style={styleTdLeft}>Cantidad de Billetes</td>
                <td align="right" style={styleTdRight}>Total</td>
              </tr>
            </thead>
            <tbody>

            {
              arrayBilletes.map((billete, index)=>{
                return(
                  <tr key={index}>
                    <td align="right" style={styleTdLeft}>
                    {billete.cantidad} x ${billete.denoBillete}
                    </td>
                    <td align="right" style={styleTdRight}>
                      ${billete.valor}
                    </td>
                  </tr>
                )
              })
            }


              <tr>
                <td colSpan={2}>
                  <div style={{ height:"50px" }}></div>
                  </td>
              </tr>

              <tr>
                <td align="right" style={styleTdLeftSepared}>
                Total en caja
                </td>
                <td align="right" style={styleTdRightSepared}>
                  ${ totalEfectivo  }
                </td>
              </tr>


              <tr>
                <td align="right" style={styleTdLeft}>
                Total sistema
                </td>
                <td align="right" style={styleTdRight}>
                  ${ infoCierre.arqueoCajaById.totalSistema }
                </td>
              </tr>

              <tr>
                <td align="right" style={styleTdLeft}>
                  { diferencia == 0 ? (
                    <Typography>No hay diferencia</Typography>
                  ) : diferenciaPositiva ? (
                    <Typography style={{ color:"green" }}>Diferencia efectivo(sobrante)</Typography>
                  ) : (
                    <Typography style={{ color:"red" }}>Diferencia efectivo(faltante)</Typography>
                  )}
                </td>
                <td align="right" style={styleTdRight}>
                  

                  { diferencia == 0 ? (
                    <Typography>${ diferencia }</Typography>
                  ) : diferenciaPositiva ? (
                    <Typography style={{ color:"green" }}>${ diferencia }</Typography>
                  ) : (
                    <Typography style={{ color:"red" }}>${ diferencia }</Typography>
                  )}


                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div style={{ height:"50px" }}></div>
                  </td>
              </tr>

              <tr>
                <td align="right" style={styleTdLeftSepared}>
                Usuario
                </td>
                <td align="right" style={styleTdRightSepared}>
                  {userData.nombres + " " +  userData.apellidos}
                </td>
              </tr>

            </tbody>
          </table>

        </Grid>


      </Grid>
  );
};

export default BoxCierrCaja;
