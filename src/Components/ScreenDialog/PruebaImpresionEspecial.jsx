import React, { useState, useContext, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  TextField,
  Box,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  TableHead,
  TableBody,
  Paper,
  Typography,
  TableRow,
  TableCell,
  Table,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import TableSelecCategory from "../BoxOptionsLite/TableSelect/TableSelecCategory";
import TableSelecSubCategory from "../BoxOptionsLite/TableSelect/TableSelecSubCategory";
import TableSelecFamily from "../BoxOptionsLite/TableSelect/TableSelecFamily";
import TableSelecProductNML from "../BoxOptionsLite/TableSelect/TableSelecProductNML";
import TableSelecSubFamily from "../BoxOptionsLite/TableSelect/TableSelecSubFamily";
import BuscarProductoFamilia from "../BoxOptionsLite/BoxProductoFamilia";
import SmallButton from "../Elements/SmallButton";
import ScreenDialogAssign from "./BuscarProducto";
import SoldProductItem from "../Elements/SoldProductItem";
import System from "../../Helpers/System";
import SoldProductItemDummy from "../Elements/SoldProductItemDummy";
import ProductSold from "../../Models/ProductSold";
import SalesDummy from "../../Models/SalesDummy";
import User from "../../Models/User";
import Model from "../../Models/Model";
import Printer from "../../Models/Printer";

const PruebaImpresionEspecial = ({
  openDialog,
  setOpenDialog,
  onAssign
}) => {

  const {
    userData,
    addToSalesData,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [metodoPago, setMetodoPago] = useState(0)
  const [metodosPago, setMetodosPagos] = useState([])
  const [products, setProducts] = useState([])
  
  const [showDialogAssign, setShowDialogAssign] = useState(false)
  const [grandTotal, setGrandTotal] = useState(0)

  const sales = new SalesDummy("desde dummy")

  useEffect(()=>{

    if(!openDialog) return
    setMetodosPagos([
      {
        id:0,
        name:"Seleccionar"
      },
      {
        id:1,
        name:"Efectivo"
      },
      {
        id:2,
        name:"Debito"
      },
      {
        id:3,
        name:"Credito"
      },
      {
        id:4,
        name:"Transferencia"
      }
    ])

    setProducts(sales.loadFromSesion())
  },[openDialog])


  useEffect(()=>{
    var total = 0
    products.forEach((prod)=>{
      total += (prod.quantity * prod.price)
    })

    setGrandTotal(total)
  },[products])

  const buscarMetodoPagoTexto = ()=>{
    var encontrado = ""
    metodosPago.forEach((met)=>{
      if(met.id == metodoPago)
        encontrado = met.name
    })

    return encontrado
  }

  const doPrint = ()=>{
    // console.log("do print")
    

    if(!metodoPago){
      showMessage("Ingresar metodo de pago")
      return
    }
    // console.log("productos:")
    // console.log(products)


    const paraEnviar = {
        "fechaIngreso": System.getInstance().getDateForServer(),
        "idUsuario": User.getInstance().getFromSesion().codigoUsuario,
        "codigoClienteSucursal": 0,
        "codigoCliente": 0,
        "codigoUsuarioVenta": 0,
        "total": grandTotal,
        "products": [
        ],
        "metodoPago": buscarMetodoPagoTexto().toUpperCase(),
        "transferencias": {
          "idCuentaCorrientePago": 0,
          "nombre": "nombre cliente",
          "rut": "rut cliente",
          "banco": "banco",
          "tipoCuenta": "tipo cuenta",
          "nroCuenta": "nro cuenta",
          "fecha": System.getInstance().getDateForServer(),
          "nroOperacion": "nro operacion"
        }
    }

    products.forEach((prod)=>{
      paraEnviar.products.push({
        "codProducto": 0,
        "cantidad": prod.quantity,
        "precioUnidad": prod.price,
        "descripcion": prod.description,
        "codBarra": prod.idProducto + ""
      })
    })

    // console.log("paraEnviar:")
    // console.log(paraEnviar)
    
    Model.pruebaImpresionEspecial(paraEnviar,(res)=>{
      // console.log("res:")
      // console.log(res)
      Printer.printAll(res)
    },(err)=>{
      console.log("error")
      console.log(err)
    })

  }
  return (
    <Dialog open={openDialog} onClose={()=>{
      setOpenDialog(false)
    }}
    maxWidth="lg"

    
    >
      <DialogTitle>
        Impresion de prueba
      </DialogTitle>
      <DialogContent>
        <Box sx={{
          minWidth:"400px"
        }}>
        <ScreenDialogAssign 
          openDialog={showDialogAssign} 
          setOpenDialog={setShowDialogAssign} 
          
          onSelect={(a)=>{ 
            if(sales.products.length<1){
              sales.loadFromSesion()
            }
            a.description = a.nombre
            setProducts(sales.addProduct(a))
          }}
          title="Agregar producto"
        />


      <Grid container item xs={12} spacing={2}>
        
        <Grid item xs={12} md={12} lg={12} >
            <InputLabel>Metodo de pago</InputLabel>

            <Select
                fullWidth
                value={metodoPago}
                onChange={(e) => {
                  setMetodoPago(e.target.value)
                }}
              >
                {metodosPago.map((metpago) => (
                  <MenuItem 
                  key={metpago.id} 
                  value={metpago.id}>
                    {metpago.name}
                  </MenuItem>
                ))}
              </Select>




            {/* <TextField
              margin="dense"
              fullWidth
              label="Folio"
              value={metodoPago}
              onChange={(e) => {
                changeFolio(e.target.value)
                }}
                /> */}


        </Grid>
        <Grid item xs={12} md={12} lg={12} >
        <SmallButton textButton={"Agregar producto"} actionButton={()=>{
          setShowDialogAssign(true)
        }} />

        </Grid>
            
        <Grid item xs={12} md={12} lg={12} >
        <TableContainer component={Paper} style={{ overflowX: "auto" }}>
            <Table>
              <TableHead sx={{ background: "#859398", height: "30%" }}>
                <TableRow>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Eliminar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ maxHeight: "400px", overflowY: "auto" }}>
                {products.map((product, index) => (
                  <SoldProductItemDummy
                    product={product}
                    itemIndex={index}
                    key={index}
                    sales={sales}
                    setGrandTotal={setGrandTotal}
                    products={products}
                    setProducts={setProducts}
                  />
                ))}
              </TableBody>
            </Table>
            <Paper
              sx={{
                width: "98%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "21px",
                margin: "5px",
              }}
              elevation={18}
            >
              <Typography sx={{fontSize:"25px",}}>Total: ${System.getInstance().en2Decimales(grandTotal)}</Typography>
            </Paper>
          </TableContainer>

        </Grid>


      </Grid>

      </Box>

      </DialogContent>
      <DialogActions>
        <SmallButton textButton="Imprimir" actionButton={doPrint}/>
        <Button onClick={()=>{
          setOpenDialog(false)
        }}>Atras</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PruebaImpresionEspecial;
