import React, { useContext, useState, useEffect } from "react";
import {
  Button
} from "@mui/material";

// OptionType {
//   id:String,
//   value:String
// }

const BoxOptionList = ({
  optionSelected,
  setOptionSelected,
  options = []
}) => {
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
                variant={optionSelected == option.id ? "contained" : "outlined"}
                onClick={() => setOptionSelected(option.id)}
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

export default BoxOptionList;
