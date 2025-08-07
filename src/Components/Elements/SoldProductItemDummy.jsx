import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button,
  TableRow,
  TableCell,
  TextField,
  IconButton
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";
import IngresarNumeroORut from "../ScreenDialog/IngresarNumeroORut";
import SmallButton from "./SmallButton";
import System from "../../Helpers/System";
import RemoveIcon from "@mui/icons-material/Remove";
import Validator from "../../Helpers/Validator";
import ProductSold from "../../Models/ProductSold";
import AsignarPeso from "../ScreenDialog/AsignarPeso";
import Sale from "../../Models/Sale";
import Sales from "../../Models/Sales";
import StorageSesion from "../../Helpers/StorageSesion";
import SalesDummy from "../../Models/SalesDummy";



const SoldProductItemDummy = ({
    itemIndex,
    product,
    products,
    setProducts,
    sales,
    setGrandTotal
  }) => {

    const {
      showMessage,
      showConfirm,
    } = useContext(SelectedOptionsContext);

    

    const [showTecladoQuantity, setShowTecladoQuantity] = useState(false)
    const [newQuantityValue, setNewQuantityValue] = useState(0)


    useEffect(()=>{
      handleChangeQuantityProductSold({
        "target": {
          "value": newQuantityValue
        }
      })
    }, [newQuantityValue])


  const changeQuantity = (newQuantity)=>{
    // console.log("changeQuantity")

    // if(ProductSold.esEnvase(product)){
    //   return
    // }

    const esEnvase = ProductSold.esEnvase(product)

    if(esEnvase){
      const owner = ProductSold.getOwnerByEnvase(product,products)
      const cantOwner = owner.quantity
      // console.log("owner")
      // console.log(owner)
      // console.log("cantOwner")
      // console.log(cantOwner)
      if(newQuantity > cantOwner) return
    }

    if(sales.products.length<1) sales.loadFromSesion()

    if(ProductSold.esEnvase(product) && newQuantity<0)return
    if(!ProductSold.esEnvase(product) && newQuantity<=0)return
    if(!product.pesable && !Validator.isCantidad(newQuantity))return false
    if(product.pesable && !Validator.isPeso(newQuantity))return false
    setProducts([...sales.changeQuantityByIndex(itemIndex,
      isNaN(newQuantity) ? 0 : newQuantity)])
      setGrandTotal(sales.getTotal())
  }

  const handleChangeQuantityProductSold = (event) =>{
    var newQuantity = parseFloat(event.target.value);
  
    if(!product.pesable){
      newQuantity = parseInt(event.target.value);
    }
    changeQuantity(newQuantity)
  }


  const decQuantity = () =>{
    const newQuantity = parseInt(product.quantity-1);
    const esEnvase = ProductSold.esEnvase(product)

    if(esEnvase && newQuantity < 0) return
    if(!esEnvase && newQuantity<1)return
    changeQuantity(newQuantity)
  }

  const addQuantity = () =>{
    const newQuantity = parseInt(product.quantity+1);
    changeQuantity(newQuantity)
  }

  const removeFromSalesData = (index) => {
    setProducts(sales.removeFromIndex(index));
  };

  const handleRemoveFromSalesData = ()=>{
    showConfirm("Eliminar " + product.description + "?", ()=>{
      
      removeFromSalesData(itemIndex)

      showMessage("Eliminado " + products[itemIndex].description)
    },()=>{
    })
  }

    
  
    const prepareTecladoChangeQuantity = ()=>{
      setNewQuantityValue(product.quantity)
      setShowTecladoQuantity(true)
    }
  
    const endTecladoChangeQuantity = ()=>{
      setShowTecladoQuantity(false)
      handleChangeQuantityProductSold({
        "target": {
          "value": newQuantityValue
        }
      })
      
    }
  
    

    
    const checkChangeQuantity = (quantity)=>{
      if(Validator.isCantidad(quantity))
        setNewQuantityValue(quantity)
    }

  return (product ? (
    <TableRow key={itemIndex} sx={{ height: "33px" }}>
    <TableCell sx={{ display: "flex", alignItems: "center" }}>

    { !product.pesable && (

      <IngresarNumeroORut
      openDialog={showTecladoQuantity}
      setOpenDialog={setShowTecladoQuantity}
      title={"Cambiar cantidad"}
      varChanger={checkChangeQuantity}
      varValue={newQuantityValue}
      onEnter={()=>{
        endTecladoChangeQuantity()
      }}
      />
    )}

    { product.pesable && (

      <AsignarPeso
      openDialog={showTecladoQuantity}
      setOpenDialog={setShowTecladoQuantity}
      title={"Cambiar peso"}
      onAsignWeight={setNewQuantityValue}
      currentWight={newQuantityValue}
      onEnter={()=>{
        endTecladoChangeQuantity()
      }}
      />
    )}



      {
        product.pesable ?(
          <Typography sx={{
            width:"60px",
            height:"56px",
            border:"1px solid",
            borderColor:"#ccc",
            borderRadius:"5px",
            fontSize:"15px",
            marginLeft:"65px",
            padding:"16.5px 14px"
          }}
          onClick={()=>{
            if(!product.isEnvase) prepareTecladoChangeQuantity()
          }}

          >{product.quantity === 0 ? "" : product.quantity}</Typography>
        ) :(
          <div>
            
            {/* {!product.isEnvase && ( */}
            { 1 && (
              <>
              <SmallButton style={{
                position:"relative",
                height:"52px",
                top:"2px",
                width:"45px",
                backgroundColor:"#6c6ce7",
                fontSize:"25px",
                margin:"0",
                color:"white"
              }}
              withDelay={false}
              actionButton={()=>{
                decQuantity()
              }}
              textButton={"-"} />
            
            


              <TextField
              value={product.quantity}
              onChange={(event) => {
                handleChangeQuantityProductSold(event)
              }}

              onClick={()=>{
                // if(!product.isEnvase) prepareTecladoChangeQuantity()
                prepareTecladoChangeQuantity()
              }}
              style={{
                // marginLeft: (product.isEnvase ? "65px":"0"),
                marginLeft: "0",
                width: 60,
                fontSize: 2,
                alignContent:"center",
                alignItems:"center",
                textAign:"center"
              }}
              />
              
                <SmallButton style={{
                  position:"relative",
                  height:"52px",
                  top:"2px",
                  
                  width:"45px",
                  backgroundColor:"#6c6ce7",
                  fontSize:"25px",
                  margin:"0",
                  color:"white"
                }}
                withDelay={false}
                actionButton={()=>{
                  addQuantity()
                }}
                textButton={"+"} />

                </>
              )}

              {/* {product.isEnvase && (
              <Typography
              style={{
                marginLeft: (product.isEnvase ? "65px":"0"),
                marginLeft: "65px",
                width: "60px",
                fontSize: "16px",
                alignContent: "center",
                alignItems: "center",
                height: "60px",
                border: "1px solid #cfcfcf",
                borderRadius: "4px",
                padding: "0 15px",
              }}
              >{ product.quantity === 0 ? "" : product.quantity }</Typography>
            )} */}


            </div>
        )
      }
    </TableCell>
    <TableCell sx={{fontSize:"20px"}}>{product.description}</TableCell>
    <TableCell sx={{fontSize:"20px"}}>${System.getInstance().en2Decimales(product.price)}</TableCell>
    <TableCell sx={{fontSize:"20px"}}>
      ${System.getInstance().en2Decimales(product.total)}
    </TableCell>
    <TableCell>

      {!product.isEnvase ? (

      <IconButton
        onClick={() => handleRemoveFromSalesData()}
        color="secondary"
        >
        <RemoveIcon />
      </IconButton>
      ):(" ")}
    </TableCell>
  </TableRow>
    ):(
      <></>
    )
    )
};

export default SoldProductItemDummy;
