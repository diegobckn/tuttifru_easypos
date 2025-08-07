import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import TecladoAlfaNumerico from "../Teclados/TecladoAlfaNumerico";
import ScreenDialogAssign from "./BuscarProducto";
import TecladoPeso from "../Teclados/TecladoPeso";
import InputPeso from "../Elements/InputPeso";
import System from "../../Helpers/System";
import Validator from "../../Helpers/Validator";
import IngresarTexto from "./IngresarTexto";
import TecladoNumeros from "../Teclados/TecladoNumeros";

var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

const ProductoAbierto = ({
  openDialog,
  setOpenDialog
}) => {

  const {
    userData,
    
    cliente,
    setCliente,
    askLastSale,
    setAskLastSale,
    showDialogSelectClient,
    setShowDialogSelectClient,

    setShowLoadingDialogWithTitle,
    hideLoadingDialog,
    showMessage,
    addToSalesData
  } = useContext(SelectedOptionsContext);


  const [monto, setMonto] = useState(0);
  const [labelCantidadPeso, setLabelCantidadPeso] = useState("Ingrese cantidad");
  const [cantidadPeso, setCantidadPeso] = useState(0);
  const [showTecladoPrecio, setShowTecladoPrecio] = useState(true);
  const [showTecladoCantidad, setShowTecladoCantidad] = useState(false);
  
  const [productoAsignado, setProductoAsignado] = useState(null);

  const [showDialogAssign, setShowDialogAssign] = useState(false);
  
  const [isPesable, setIsPesable] = useState(false);

  const [descripcion, setDescripcion] = useState("");
  const [dialogDescripcion, setDialogDescripcion] = useState(false);

  
  useEffect(()=>{
    setMonto(0)
    setDescripcion("")
    setCantidadPeso(0)
    setProductoAsignado(null)
  },[openDialog])

  useEffect(()=>{
    if(productoAsignado != null){
      setDescripcion( productoAsignado.nombre + " oferta" )
      if(parseFloat(monto)<=0) setMonto(productoAsignado.precioVenta)
      
      //es pesable
      if(productoAsignado.tipoVenta == 2){
        setIsPesable(true)
        setLabelCantidadPeso("Ingrese el peso")
        if(!Validator.isPeso(cantidadPeso)){
          setCantidadPeso(0)
        }
      }else{
        setLabelCantidadPeso("Ingrese la cantidad")
        setIsPesable(false)
        if(!Validator.isCantidad(cantidadPeso)){
          setCantidadPeso(0)
        }
      }
    }
  },[productoAsignado])


  const onAceptClick = ()=>{
    if(!productoAsignado){
      showMessage("Falta asignar producto")
      return
    }
    if(parseFloat(monto)<=0 ){
      showMessage("Falta ingresar monto")
      return
    }
    
    if(parseFloat(cantidadPeso)<=0){
      showMessage("Falta ingresar cantidad o peso")
      return
    }
    
    if(descripcion.trim() == ""){
      showMessage("Falta ingresar descripcion")
      return
    }

    var producto = productoAsignado

    producto.nombre = descripcion,
    producto.precioVenta = monto / System.getInstance().typeIntFloat(cantidadPeso),
    producto.cantidad = cantidadPeso
    addToSalesData(producto)
    setOpenDialog(false)
  }

  const validateChangeDesc = (newvalue)=>{
    if(Validator.isSearch(newvalue))
    setDescripcion(newvalue)
  }


  return (
      <Dialog open={openDialog} onClose={()=>{
        setOpenDialog(false)
      }}
      maxWidth="lg"
      >
        <DialogTitle>
          Producto Abierto
        </DialogTitle>
        <DialogContent>

        <ScreenDialogAssign 
          openDialog={showDialogAssign} 
          setOpenDialog={setShowDialogAssign} 
          onSelect={(a)=>{ setProductoAsignado(a) }}
          title="Seleccionar producto"
        />

      <IngresarTexto
        title="Ingrese una descripcion"
        openDialog={dialogDescripcion}
        setOpenDialog={setDialogDescripcion}
        varChanger={validateChangeDesc}
        varValue={descripcion}
      />

        <Grid container item xs={12} spacing={2}>
          
          <Grid item xs={12} md={5} lg={5} >
              <Grid container spacing={2}>

              <div style={{
                  marginTop:"16px",
                  width:"100%",
                }}>
                {productoAsignado != null ?(
                  <>
                  <Typography style={{
                    padding:10
                  }}>{productoAsignado.nombre}</Typography>
                  <SmallButton
                    textButton="Asignar otro producto"
                    actionButton={()=>{
                      setProductoAsignado(null)
                      setShowDialogAssign(true)
                    }}
                  />
                  </>
                ):(
                  <SmallButton
                    textButton="Asignar producto"
                    actionButton={()=>{
                      setShowDialogAssign(true)
                    }}
                  />
                )}
                </div>


              

              <TextField
                margin="normal"
                fullWidth
                label="Ingrese el precio"
                type="number"
                value={monto}
                onClick={()=>{
                  setShowTecladoPrecio(true)
                  setShowTecladoCantidad(false)
                }}
                onChange={(e) => {
                  if(Validator.isMonto(e.target.value))
                  setMonto(e.target.value)
                }}
              />

              <InputPeso
                inputValue={cantidadPeso}
                textInput={labelCantidadPeso}
                showGrInfo={ isPesable}
                funChanger={(e)=>{
                  if(
                    (isPesable && Validator.isPeso(e))
                    || (!isPesable && Validator.isCantidad(e))
                  )
                  setCantidadPeso(e)
                }}
                onClick={()=>{
                  setShowTecladoPrecio(false)
                  setShowTecladoCantidad(true)
                }}
              />

              <textarea
                margin="normal"
                placeholder="Ingrese una descripci&oacute;n"
                type="text"
                value={descripcion}
                onChange={(e) => validateChangeDesc(e.target.value)}
                onClick={()=>{
                  setDialogDescripcion(true)
                }}
                style={{
                  marginTop:"16px",
                  height:"100px",
                  width:"100%",
                  padding:10,
                  borderRadius:5
                }}
              ></textarea>

            
              </Grid>
            
          </Grid>

          <Grid item xs={12} md={7} lg={7} >
            <TecladoPrecio
              showFlag={showTecladoPrecio}
              varValue={monto}
              varChanger={setMonto}
              onEnter={()=>{

              }}
            />

            {
              isPesable ?(
                <TecladoPeso
                  showFlag={showTecladoCantidad}
                  varValue={cantidadPeso}
                  varChanger={setCantidadPeso}
                  onEnter={()=>{
                  }}
                />

              ) :(
                <TecladoNumeros
                  showFlag={showTecladoCantidad}
                  varValue={cantidadPeso}
                  varChanger={setCantidadPeso}
                  onEnter={()=>{
                  }}
                />
              )
            }
          </Grid>

          {/* <Grid item xs={12} md={7} lg={7} >
            <TecladoAlfaNumerico 
              showFlag={showletras}
              varValue={descripcion}
              varChanger={setDescripcion}
              onEnter={()=>{
              }}
            />
          </Grid> */}
              
        </Grid>
        </DialogContent>
        <DialogActions>
          <SmallButton textButton="Guardar" actionButton={onAceptClick}/>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Atras</Button>
        </DialogActions>
      </Dialog>
  );
};

export default ProductoAbierto;
