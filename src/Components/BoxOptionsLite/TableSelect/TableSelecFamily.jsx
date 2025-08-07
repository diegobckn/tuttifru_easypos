/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
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
import Product from "../../../Models/Product";
import MainButton from "../../Elements/MainButton";

const TableSelecFamily = ({
  show,
  onSelect,
  onNotFamiliesFound,
  title = "Elegir familia",
  categoryId,
  subcategoryId,
}) => {
  
  const [families, setFamilies] = useState([])

  useEffect(()=>{
    if(!subcategoryId || !show) return
    setFamilies([])    

    Product.getInstance().getFamiliaBySubCat({
      categoryId,
      subcategoryId
    },
      (respuestaServidor)=>{
        if(respuestaServidor.length>0){
          setFamilies(respuestaServidor)
        }else{
          onNotFamiliesFound()
          setFamilies([])    
        }
    },()=>{
      onNotFamiliesFound()
      setFamilies([])
    })
  },[show,subcategoryId])
  
  return (
    <>
    {show &&(
      <Typography>{title}</Typography>)
    }
    
    {show && families.length>0 && families.map((family, index)=>{
      return(
        <SmallButton key={index} textButton={family.descripcion} actionButton={()=>{
          onSelect(family);
        }}
        style={{
          minHeight:"80px"
        }}/>
      )})
    }
    </>



  );
};

export default TableSelecFamily;
