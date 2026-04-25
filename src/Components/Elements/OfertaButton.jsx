import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";
import Product from "../../Models/Product";
import ProductSold from "../../Models/ProductSold";
import System from "../../Helpers/System";


export default ({
  ofertaInfo,
  actionButton = () => { },
  style = {},
  isDisabled = false,
  withDelay = true,

  onTouchStart = () => { },
  onMouseDown = () => { },
  onTouchEnd = () => { },
  onMouseUp = () => { },
  onMouseLeave = () => { },
  onTouchMove = () => { },

  animateBackgroundColor = false

}) => {
  const [clickeable, setClickeable] = useState(true);

  const colorPasivo = "#f7f7f7ff"
  const [colorFondo, setColorFondo] = useState(colorPasivo)
  const [image, setImage] = useState("")


  const changeBackgroundColor = () => {
    setColorFondo("#0dee8e")
    setTimeout(() => {
      setColorFondo(colorPasivo)
      // setColorFondo("#283048")
    }, 1000);
  }

  const getNombre = () => {
    if (ofertaInfo.oferta.descripcion) {
      return ofertaInfo.oferta.descripcion + " | " + ofertaInfo.oferta.codigoOferta
    } else {
      return "oferta #" + ofertaInfo.oferta.codigoOferta
    }
  }

  useEffect(() => {
    // console.log("ofertaInfo", ofertaInfo)

    if (ofertaInfo.oferta.oferta_Regla) {
      ofertaInfo.precioVenta = ofertaInfo.oferta.oferta_Regla.valor
    } else {
      ofertaInfo.precioVenta = 0
    }

    ofertaInfo.precioMostrar = ProductSold.createByValues(ofertaInfo).getPrecioCantidad(1)
  }, [ofertaInfo])

  return (
    <div
      disabled={isDisabled}
      style={{
        ...{
          width: "250px",
          backgroundColor: colorFondo,
          color: "#000000ff",
          display: "block",
          float: "left",
          alignContent: "center",
          textAlign: "center",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#1c1b17 ",
            color: "white",
          },
          padding: "5px",
          margin: "0 5px 10px 5px",
          border: "1px solid #000",
          borderRadius: "5px",
          justifyItems: "center"
        }, ...style
      }}

      onClick={() => {
        if (!clickeable) {
          return
        }
        actionButton()
        if (withDelay) {
          setClickeable(false);
          setTimeout(function () {
            setClickeable(true);
          }, ModelConfig.getInstance().getFirst().buttonDelayClick);
        }

        if (animateBackgroundColor) {
          changeBackgroundColor()
        }
      }}

      onTouchStart={() => { onTouchStart() }}
      onMouseDown={() => { onMouseDown() }}
      onTouchEnd={() => { onTouchEnd() }}
      onMouseUp={() => { onMouseUp() }}
      onMouseLeave={() => { onMouseLeave() }}
      onTouchMove={() => { onTouchMove() }}
    >
      <div style={{
        width: "100%",
        height: "175px",
        backgroundImage: "url(https://softus.com.ar/easypos_public/images/icono-canasta-productos.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgrounRepeat: "no-repeat"
      }}
      >
      </div>
      <Typography variant="h7" sx={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 3,
        height: "68px",
        alignContent: "center",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>{getNombre()} </Typography>

      <div style={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 3,
        // height: "23px",
        alignContent: "center",
        overflow: "hidden",
        textOverflow: "ellipsis",

      }}>
        {ofertaInfo.oferta.products.map((prod, ix) => (
          <Typography key={ix} variant="h7" sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            height: "23px",
            alignContent: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {prod.descripcion || prod.nombre}
          </Typography>
        ))}
      </div>
      <Typography sx={{
        padding: "1px 14px",
        borderRadius: "30px 0px 30px 0px",
        border: "2px solid #000000",
        textTransform: "uppercase",
        fontSize: "12px",
        background: "#00ff26",
      }}>
        Tipo: {ofertaInfo.oferta.codigoTipo}
      </Typography>


      <Typography variant="h7" sx={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 3,
        height: "23px",
        alignContent: "center",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {ofertaInfo.codigoProducto != 0 && ofertaInfo.precioMostrar > 0 ? (
          "$" + System.formatMonedaLocal(ofertaInfo.precioMostrar, false)
        ) : null}
      </Typography>

    </div >
  );
};

