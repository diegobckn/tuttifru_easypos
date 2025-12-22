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
import System from "../../../Helpers/System";

export default ({
  show,
  onSelect,
  title = "Elegir producto",
  productList,
}) => {

  return (
    <>
      {show && (
        <Typography>{title}</Typography>)
      }


      {show && productList.length > 0 && productList.map((product, index) => {
        return (
          <SmallButton
            key={index}
            textButton={product.nombre}
            actionButton={() => {
              onSelect(System.clone(product));
            }}
            style={{
              minHeight: "80px"
            }}

            animateBackgroundColor={true}
          />)
      })
      }
    </>
  );
};

