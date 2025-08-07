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
import MainButton from "../../Elements/SmallButton";

const TableSelecSubFamily = ({
  show,
  onSelect,
  onNotSubfamiliesFound,
  title = "Elegir sub familia",
  categoryId,
  subcategoryId,
  familyId
}) => {
  
  const [subfamilies, setSubFamilies] = useState([])

  useEffect(()=>{
    if(!familyId || !show) return
    setSubFamilies([])

    Product.getInstance().getSubFamilia({
      categoryId,
      subcategoryId,
      familyId
    },
      (respuestaServidor)=>{
        if(respuestaServidor.length>0){
          setSubFamilies(respuestaServidor)
        }else{
          onNotSubfamiliesFound()
        }
    },()=>{
      setSubFamilies([])
      onNotSubfamiliesFound()
    })
  },[show,familyId])
  
  return (
    <>
    {show &&(
      <Typography>{title}</Typography>)
    }
    
    {show && subfamilies.length>0 && subfamilies.map((subfamily, index)=>{
      return(
        <SmallButton key={index} textButton={subfamily.descripcion} actionButton={()=>{
          onSelect(subfamily);
        }}
        style={{
          minHeight:"80px"
        }}/>
      )})
    }
    </>
  );
};

export default TableSelecSubFamily;
