import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";


const FlatButton = ({
  actionButton = () => { },
  backgroundColor = "rgb(224 224 224)",
  textColor = "#000",
  children,
  style = {},
}) => {
  return (

    <Button
      sx={{
        ...{
          width: "100%",
          height: "40px",
          backgroundColor: { backgroundColor },
          border: "1px solid #313131",
          borderRadius: "0",
          color: textColor,
          "&:hover": {
            backgroundColor: "#1c1b17 ",
            color: "white",
          },
        }, ...style
      }}


      onClick={actionButton}
    >
      <Typography variant="h7">{children}</Typography>
    </Button>
  );
};

export default FlatButton;
