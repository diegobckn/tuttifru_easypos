import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";
import { SupervisedUserCircle } from "@mui/icons-material";

const TarjetaMenu = ({
  title = "",
  icon = null,
  text = "",
  actionClick = () => { },
  style = {},
}) => {



  return (<div
    style={{
      ...{
        display: "inline-block",
        // border: "2px solid #76679A",
        borderRadius: "5px",
        alignItems: "center",
        padding: "4px",
        marginRight: "2%",
        cursor: "pointer"
      }, ...style
    }}

    onClick={actionClick}
  >
    <p style={{
      "margin": "0",
      "padding": "0",
      "fontSize": "9px",
      "color": "white",
      "fontFamily": "monospace",
      "textTransform": "uppercase",
    }}>
      {title}
    </p>

    <div style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "2px",
      justifyContent: "center",
      minHeight: "24px"
    }}>

      {icon ? (
        icon
      ) : (
        <SupervisedUserCircle sx={{
          color: "#fff",
          width: "0px"
        }} fontSize="medium" />
      )}


        <p style={{
          "margin": "0",
          "padding": "0",
          "fontSize": "12px",
          "color": "white",
          "fontFamily": "monospace",
          "textTransform": "uppercase",
        }}>
          {text}
        </p>
    </div>
  </div>
  )
}

export default TarjetaMenu