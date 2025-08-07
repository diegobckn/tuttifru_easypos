import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";
import { WifiOff } from "@mui/icons-material";

const IconButtonBadge = ({
  icon = <WifiOff fontSize="medium" />,
  badgeValue = "",
  actionButton = () => { },
  isDisabled = false,
  style = {},
  iconStyle = {},
}) => {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(isDisabled)
  }, [isDisabled])

  return (
    <Button
      style={{
        ...{
          color: "#FB9090",
          top: "14px",
          position: "relative",
          minWidth: "0",
          padding: "2px 6px ",
          marginLeft: (((badgeValue + "").length * 4) + "px"),
          marginRight: (((badgeValue + "").length * 4) + "px"),
          paddingLeft: (((badgeValue + "").length * 9) + "px !important"),
          width: "24px",
        }, ...style
      }}
      title={(((badgeValue + "").length * 9) + "px")}
      onClick={actionButton}>
      {icon}
      {badgeValue != "" && (
        <span style={{
          backgroundColor: "#ff2626",
          borderRadius: "40%",
          padding: "2px 6px",
          fontSize: "10px",
          position: "absolute",
          right: "0",
          color: "white",
          top: "0px",
        }}>{badgeValue}</span>
      )}
    </Button>
  );
};

export default IconButtonBadge;
