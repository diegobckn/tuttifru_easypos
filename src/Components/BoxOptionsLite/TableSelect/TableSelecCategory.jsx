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

const TableSelecCategory = ({
  show,
  onSelect,
  title = "Elegir categoria",
}) => {
  
  const [categories, setCategories] = useState([])

  useEffect(()=>{
    setCategories([])
    Product.getInstance().getCategories((respuestaServidor)=>{
      setCategories(respuestaServidor)
    },()=>{
      setCategories([])
    })
  },[show])
  
  return (
    <>
    {show &&(
      <Typography>{title}</Typography>)
    }
    
    {show && categories.length>0 && categories.map((category, index)=>{
      return(
        <SmallButton key={index} textButton={category.descripcion} actionButton={()=>{
          onSelect(category);
        }}
        style={{
          minHeight:"80px"
        }}/>
      )})
    }
    </>
  );
};

export default TableSelecCategory;
