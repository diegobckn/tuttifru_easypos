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

const TableSelecSubCategory = ({
  show,
  onSelect,
  onNotSubcategoriesFound,
  title = "Elegir sub categoria",
  categoryId
}) => {
  
  const [subcategories, setSubcategories] = useState([])

  useEffect(()=>{
    if(!categoryId || !show) return
    setSubcategories([])
    Product.getInstance().getSubCategories(categoryId,
      (respuestaServidor)=>{
        if(respuestaServidor.length>0){
          setSubcategories(respuestaServidor)
        }else{
          onNotSubcategoriesFound()
        }
    },()=>{
      setSubcategories([])
      onNotSubcategoriesFound()
    })
  },[show,categoryId])
  
  return (
    <>
    {show &&(
      <Typography>{title}</Typography>
    )}
    
    {show && subcategories.length>0 && subcategories.map((subcategory, index)=>{
      return(
        <SmallButton key={index} textButton={subcategory.descripcion} actionButton={()=>{
          onSelect(subcategory);
        }}
        style={{
          minHeight:"80px"
        }}/>
      )})
    }
    </>
  );
};

export default TableSelecSubCategory;
