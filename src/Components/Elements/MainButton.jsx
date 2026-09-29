import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";


const MainButton = ({
  textButton,
  actionButton,
  xs = 6,
  sm = 6,
  md = 2,
  lg = 2,
  isDisabled = false,
  style = {},
}) => {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(isDisabled)
  }, [isDisabled])

  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg} sx={{
      padding: "0.25%"
    }}>
      <Button
        sx={{
          ...{
            width: "100%",
            // height: "80px",
            height: "8.5vh",
            overflowY: "auto",
            backgroundColor: "#283048",
            padding: "0",
            color: "white",
            "&:hover": {
              backgroundColor: "#1c1b17 ",
              color: "white",
            },
          }, ...style
        }}
        onClick={() => {
          if (disabled) {
            return
          }
          actionButton()
          setDisabled(true);
          setTimeout(function () {
            setDisabled(false);
          }, ModelConfig.getInstance().getFirst().buttonDelayClick);
        }}
        disabled={disabled}
      >
        <Typography variant="h7">{textButton}</Typography>
      </Button>
    </Grid >
  );
};

export default MainButton;
