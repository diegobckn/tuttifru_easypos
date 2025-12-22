import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ProductosCriticos from "./ProductosCriticos";
import ProductosCriticosBuscarUno from "./ProductosCriticosBuscarUno";
import Tabs, { Tab } from "../Elements/Tabs";


const BoxStockCriticos = () => {
  const {
    userData,
  } = useContext(SelectedOptionsContext);

  return (
    <Tabs
      tabsItems={[
        {
          title: "Todos los Productos",
          content: (
            <ProductosCriticos onFinish={() => { }} />
          )
        },
        {
          title: "Buscar un producto",
          content: (
            <ProductosCriticosBuscarUno onFinish={() => { }} />
          )
        },
      ]}
    />
  );
};

export default BoxStockCriticos;
