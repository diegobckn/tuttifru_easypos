import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";


const TeclaButton70 = ({
  textButton,
  actionButton,
  textColor = "#4f4e4e",
  style = {},
  mayus = false
}) => {
  const [disabled, setDisabled] = useState(false);
  return (
    <div
      style={{
        ...{
          width: "70px",
          height: "70px",
          textAlign: "center",
          padding: "10px",
          cursor: "pointer",
          fontSize: "32px",
          color: textColor,
          backgroundColor: "#e1e1e5",
          border: "2px solid #6b6767",
          margin: "5px",
          borderRadius: "10px",
          boxShadow: "0 0 1px 1px #c1c1c1",
          fontFamily: "'Victor Mono'",
        }, ...style
      }}
      onClick={() => {
        actionButton(!mayus ? textButton : (textButton+"").toUpperCase() )
      }}
    >
      <p style={{
        margin: 0,
        padding: 0,
        userSelect: "none"
      }}>{!mayus ? textButton : (textButton+"").toUpperCase()}</p>
    </div>
  );
};

export default TeclaButton70;
