import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Grid,
  Typography,
  Snackbar
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";
import BoxCantidadBillete from "./BoxCantidadBillete";
import TecladoCierre from "../Teclados/TecladoCierre";
import CerrarCaja from "../../Models/CerrarCaja";

const BoxCierrCaja = ({
  arrayBilletes,
  setArrayBilletes,
  totalEfectivo,
  setTotalEfectivo,
  hasFocus
}) => {

  const {
    userData,
    grandTotal
  } = useContext(SelectedOptionsContext);

  const [con10, setCon10] = useState(0);
  const [con50, setCon50] = useState(0);
  const [con100, setCon100] = useState(0);
  const [con500, setCon500] = useState(0);
  const [con1000, setCon1000] = useState(0);
  const [con2000, setCon2000] = useState(0);
  const [con5000, setCon5000] = useState(0);
  const [con10000, setCon10000] = useState(0);
  const [con20000, setCon20000] = useState(0);
  
  const [ver10, setVer10] = useState(false);
  const [ver50, setVer50] = useState(false);
  const [ver100, setVer100] = useState(false);
  const [ver500, setVer500] = useState(false);
  const [ver1000, setVer1000] = useState(false);
  const [ver2000, setVer2000] = useState(false);
  const [ver5000, setVer5000] = useState(false);
  const [ver10000, setVer10000] = useState(false);
  const [ver20000, setVer20000] = useState(true);

  const [focus10, setFocus10] = useState(false);
  const [focus50, setFocus50] = useState(false);
  const [focus100, setFocus100] = useState(false);
  const [focus500, setFocus500] = useState(false);
  const [focus1000, setFocus1000] = useState(false);
  const [focus2000, setFocus2000] = useState(false);
  const [focus5000, setFocus5000] = useState(false);
  const [focus10000, setFocus10000] = useState(false);
  const [focus20000, setFocus20000] = useState(true);
  
  const [cargandoBilletes, setCargandoBilletes] = useState(false);

  const input20 = useRef(null)
  
  
  const handleFocus = (billete)=>{
      setVer10(false)
      setVer50(false)
      setVer100(false)
      setVer500(false)
      setVer1000(false)
      setVer2000(false)
      setVer5000(false)
      setVer10000(false)
      setVer20000(false)
      eval("setVer" + billete + "(true)");
  }

  const handleEnter = (billete)=>{
    console.log("un enter de " + billete)
    setFocus10(false)
    setFocus50(false)
    setFocus100(false)
    setFocus500(false)
    setFocus1000(false)
    setFocus2000(false)
    setFocus5000(false)
    setFocus10000(false)
    setFocus20000(false)
    if(billete == 20000) setFocus10000(true)
    if(billete == 10000) setFocus5000(true)
    if(billete == 5000) setFocus2000(true)
    if(billete == 2000) setFocus1000(true)
    if(billete == 1000) setFocus500(true)
    if(billete == 500) setFocus100(true)
    if(billete == 100) setFocus50(true)
    if(billete == 50) setFocus10(true)
    if(billete == 10) setFocus20000(true)
}

  const cargarBilletes = ()=>{
    setCargandoBilletes(true)
    arrayBilletes.map((billete)=>{
      if(billete.denoBillete == "10") setCon10(billete.cantidad)
      if(billete.denoBillete == "50") setCon50(billete.cantidad)
      if(billete.denoBillete == "100") setCon100(billete.cantidad)
      if(billete.denoBillete == "500") setCon500(billete.cantidad)
      if(billete.denoBillete == "1000") setCon1000(billete.cantidad)
      if(billete.denoBillete == "2000") setCon2000(billete.cantidad)
      if(billete.denoBillete == "5000") setCon5000(billete.cantidad)
      if(billete.denoBillete == "10000") setCon10000(billete.cantidad)
      if(billete.denoBillete == "20000") setCon20000(billete.cantidad)
    })
    setCargandoBilletes(false)
  }

  const contarBilletes = ()=>{
    var totalEfec = 0
      var arrayBilles = []

      const contarBillete = (valor, cantidad)=>{
        if(cantidad<1) return
        const itemBillete = {
          "denoBillete" : valor + "",
          "cantidad": parseInt(cantidad),
          "valor" : valor * cantidad
        }

        arrayBilles.push(itemBillete);
        totalEfec += itemBillete.valor
      }

      contarBillete(10, con10);
      contarBillete(50, con50);
      contarBillete(100, con100);
      contarBillete(500, con500);
      contarBillete(1000, con1000);
      contarBillete(2000, con2000);
      contarBillete(5000, con5000);
      contarBillete(10000, con10000);
      contarBillete(20000, con20000);

      setArrayBilletes(arrayBilles)
      setTotalEfectivo(totalEfec)
  }


  //observers
  useEffect(()=>{
    if(!hasFocus) return
    cargarBilletes()

  },[hasFocus])

  useEffect(()=>{
    if(!hasFocus) return
    if(cargandoBilletes) return;
    contarBilletes()
  },[cargandoBilletes,con10, con50, con100, con500, con1000, 
    con2000, con5000,con10000,con20000])

  return (
      <Grid container spacing={2} style={{
      }}>

        <Grid item xs={12} md={5} lg={5}>
          

          <table>
            <tbody>

              <tr>
                <td>
                <BoxCantidadBillete 
                    cantidad={con20000}
                    onFocus={handleFocus}
                    textoBillete={20000}
                    setCantidad={setCon20000}
                    hasFocus={focus20000}
                    onEnter={handleEnter}
                  />
                </td>
              </tr>

              <tr>
                <td>
                <BoxCantidadBillete 
                    cantidad={con10000}
                    onFocus={handleFocus}
                    textoBillete={10000}
                    setCantidad={setCon10000}
                    hasFocus={focus10000}
                    onEnter={handleEnter}
                  />
                </td>
              </tr>

              <tr>
                <td>
                <BoxCantidadBillete 
                    cantidad={con5000}
                    onFocus={handleFocus}
                    textoBillete={5000}
                    setCantidad={setCon5000}
                    hasFocus={focus5000}
                    onEnter={handleEnter}
                  />
                </td>
              </tr>


              <tr>
                <td>
                <BoxCantidadBillete 
                    cantidad={con2000}
                    onFocus={handleFocus}
                    textoBillete={2000}
                    setCantidad={setCon2000}
                    hasFocus={focus2000}
                    onEnter={handleEnter}
                  />
                </td>
              </tr>

              

              <tr>
                <td>
                <BoxCantidadBillete 
                    cantidad={con1000}
                    onFocus={handleFocus}
                    textoBillete={1000}
                    setCantidad={setCon1000}
                    hasFocus={focus1000}
                    onEnter={handleEnter}
                  />
                </td>
              </tr>

              

              <tr>
                <td>
                <BoxCantidadBillete 
                    cantidad={con500}
                    onFocus={handleFocus}
                    textoBillete={500}
                    setCantidad={setCon500}
                    hasFocus={focus500}
                    onEnter={handleEnter}
                  />
                </td>
              </tr>


              <tr>
                <td>
                <BoxCantidadBillete 
                    cantidad={con100}
                    onFocus={handleFocus}
                    textoBillete={100}
                    setCantidad={setCon100}
                    hasFocus={focus100}
                    onEnter={handleEnter}
                  />
                </td>
              </tr>

              <tr>
                <td>
                <BoxCantidadBillete 
                    cantidad={con50}
                    onFocus={handleFocus}
                    textoBillete={50}
                    setCantidad={setCon50}
                    hasFocus={focus50}
                    onEnter={handleEnter}
                  />
                </td>
              </tr>

              <tr>
                <td>
                <BoxCantidadBillete 
                    cantidad={con10}
                    onFocus={handleFocus}
                    textoBillete={10}
                    setCantidad={setCon10}
                    hasFocus={focus10}
                    onEnter={handleEnter}
                  />
                </td>
              </tr>

              

              

              

            </tbody>
          </table>

          <Typography style={{
            marginTop: "10px",
            color:"rgb(225, 33, 59)",
            fontSize: "25px",
            fontWeight: "bold",
            width:"100%",
            textAlign: "right",
            fontFamily: "Victor Mono"
            }}>
            Total efectivo
            <br/>
            ${totalEfectivo}
          </Typography>

        </Grid>


        <Grid item xs={12} md={7} lg={7} style={{
        }}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >

        <TecladoCierre
          showFlag={ver10} 
          varValue={con10} 
          varChanger={setCon10} 
          onEnter={()=>{
            handleEnter(10)
          }}
          />

          <TecladoCierre
          showFlag={ver50} 
          varValue={con50} 
          varChanger={setCon50} 
          onEnter={()=>{
            handleEnter(50)
          }}
          />

          <TecladoCierre
          showFlag={ver100} 
          varValue={con100} 
          varChanger={setCon100} 
          onEnter={()=>{
            handleEnter(100)
          }}
          />

          <TecladoCierre
          showFlag={ver500} 
          varValue={con500} 
          varChanger={setCon500} 
          onEnter={()=>{
            handleEnter(500)
          }}
          />

          <TecladoCierre
          showFlag={ver1000} 
          varValue={con1000} 
          varChanger={setCon1000} 
          onEnter={()=>{
            handleEnter(1000)
          }}
          />

          <TecladoCierre
          showFlag={ver2000} 
          varValue={con2000} 
          varChanger={setCon2000} 
          onEnter={()=>{
            handleEnter(2000)
          }}
          />

          <TecladoCierre
          showFlag={ver5000} 
          varValue={con5000} 
          varChanger={setCon5000} 
          onEnter={()=>{
            handleEnter(5000)
          }}
          />

          <TecladoCierre
          showFlag={ver10000} 
          varValue={con10000} 
          varChanger={setCon10000} 
          onEnter={()=>{
            handleEnter(10000)
          }}
          />

          <TecladoCierre
          showFlag={ver20000} 
          varValue={con20000} 
          varChanger={setCon20000} 
          onEnter={()=>{
            handleEnter(20000)
          }}
          />

          </Grid>
        </Grid>

      </Grid>
  );
};

export default BoxCierrCaja;
