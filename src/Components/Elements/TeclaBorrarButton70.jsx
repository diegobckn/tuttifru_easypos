import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";
import { Backspace } from "@mui/icons-material";
import TeclaButton70 from "./TeclaButton70";


const TeclaBorrarButton70 = ({
  actionButton,
  style = {}
}) => {
  const [disabled, setDisabled] = useState(false);

  return (
    <TeclaButton70 actionButton={() => {
      actionButton("borrar")
    }}
      textButton={<Backspace sx={{
        color: "#FFFFFF"
      }} />}

      style={{
        backgroundColor: "#FA4646",
      }}
    />
  );
};

export default TeclaBorrarButton70;
