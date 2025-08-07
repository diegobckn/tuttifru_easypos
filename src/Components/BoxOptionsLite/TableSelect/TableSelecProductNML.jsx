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
import System from "../../../Helpers/System";

const TableSelecProductNML = ({
  show,
  onSelect,
  categoryId,
  subcategoryId,
  familyId,
  subfamilyId,
  title = "Elegir producto",

  excludeIfText = "",
  includeOnlyText = "",
  replaceText = "",//separado por coma.. primero lo que quita, luego lo que agrega
}) => {

  const [productsNML, setProductsNML] = useState([])

  useEffect(() => {
    if (!show) return
    setProductsNML([])

    Product.getInstance().getProductsNML({
      catId: categoryId,
      subcatId: subcategoryId,
      famId: familyId,
      subFamId: subfamilyId,
    },
      (respuestaServidor) => {
        setProductsNML(respuestaServidor)
      }, () => {
        setProductsNML([])
      })

  }, [show, subcategoryId])

  const isExcluded = (text) => {
    var excludeIfTextArr = []
    if (typeof (excludeIfText) == "string") {
      excludeIfTextArr.push(excludeIfText)
    } else {
      excludeIfTextArr = excludeIfText
    }

    // console.log("isExcluded ", text, ".. en", excludeIfTextArr, "?")

    var exclude = false
    excludeIfTextArr.forEach((excludeItem) => {
      if (excludeItem != '' && text.indexOf(excludeItem) > -1) {
        exclude = true
      }
    })

    // console.log(exclude ? "si" : "no")
    return exclude
  }

  const isIncluded = (text) => {
    var includeTextArr = []
    if (typeof (includeOnlyText) == "string") {
      includeTextArr.push(includeOnlyText)
    } else {
      includeTextArr = includeOnlyText
    }

    // console.log("isIncluded ", text, ".. en", includeTextArr, "?")

    var include = false
    includeTextArr.forEach((includeItem) => {
      if (includeItem != '' && text.indexOf(includeItem) > -1) {
        include = true
      }
    })

    // console.log(include ? "si" : "no")
    return include
  }

  const aplicarReemplazos = (texto) => {
    var reemplazosArr = []
    if (typeof (replaceText) == "string") {
      reemplazosArr.push(replaceText)
    } else {
      reemplazosArr = replaceText
    }

    var textoReemplazado = texto

    if (reemplazosArr.length > 0) {
      reemplazosArr.forEach((reem) => {
        if (reem.indexOf(",") > -1) {
          const replaces = reem.split(",")
          const replaceOut = replaces[0]
          const replacePut = replaces[1]
          textoReemplazado = textoReemplazado.replace(replaceOut, replacePut)
        }
      })
    }

    return textoReemplazado
  }


  return (
    <>
      {show && (
        <Typography>{title}</Typography>)
      }


      {show && productsNML.length > 0 && productsNML.map((product, index) => {
        var puedeMostrar = !isExcluded(product.nombre)
        if (includeOnlyText !== "" && includeOnlyText.length > 0) {
          puedeMostrar = isIncluded(product.nombre)
        }

        var textButton = aplicarReemplazos(product.nombre)

        // console.log("no puede mostrar", product)
        return (
          puedeMostrar ? (
            <SmallButton key={index} textButton={textButton} actionButton={() => {
              onSelect(System.clone(product));
            }}
              style={{
                minHeight: "80px"
              }}

              animateBackgroundColor={true}
            />
          ) : null)
      })
      }
    </>
  );
};

export default TableSelecProductNML;
