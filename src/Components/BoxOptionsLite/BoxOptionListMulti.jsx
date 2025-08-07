import React, { useContext, useState, useEffect } from "react";
import {
  Button
} from "@mui/material";

const BoxOptionListMulti = ({
  optionSelected,
  setOptionSelected,
  options = []
}) => {


  const assignSelected = (option) => {
    if (isSelected(option)) {
      var index = optionSelected.indexOf(option);
      if (index !== -1) {
        optionSelected.splice(index, 1);
      }
    }else{
      optionSelected.push(option)
    }
    setOptionSelected([...optionSelected])
  }

  const isSelected = (option) => {
    return optionSelected.includes(option)
  }

  return (
    <table>
      <tbody>
        <tr>
          {options.map((option, ix) => {
            return (
              <td key={ix} ><Button
                id={`${ix}-btn`}
                sx={{ height: "60px" }}
                fullWidth
                variant={ isSelected(parseInt(option.id)) ? "contained" : "outlined"}
                onClick={() => assignSelected(parseInt(option.id))}
              >
                {option.value}
              </Button></td>
            )
          })}


        </tr>
      </tbody>
    </table>
  );
};

export default BoxOptionListMulti;
