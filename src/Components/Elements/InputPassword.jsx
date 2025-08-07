import React, { useState, useContext, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel,
  IconButton
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { Check, Dangerous, Visibility, VisibilityOff } from "@mui/icons-material";
import Validator from "./../../Helpers/Validator";
import IngresarTexto from "../ScreenDialog/IngresarTexto";


const InputPassword = ({
    inputState,
    validationState,
    withLabel = true,
    autoFocus = false,
    fieldName="password",
    label = fieldName[0].toUpperCase() + fieldName.substr(1),
    minLength = null,
    maxLength = 20,
    canAutoComplete = false,
    required = false
  }) => {

    const {
      showMessage
    } = useContext(SelectedOptionsContext);
    
    const [password, setPassword] = inputState
    const [showPassword, setShowPassword] = useState(false)
    const [validation, setValidation] = validationState ?? useState(null)
    const [keyPressed, setKeyPressed] = useState(false)

  const validate = ()=>{
    // console.log("validate de:" + fieldName)
    const len = password.length
    // console.log("len:", len)
    const reqOk = (!required || (required && len > 0))
    var badMinlength = false
    var badMaxlength = false

    if(minLength && len < minLength){
      badMinlength = true
    }

    if(maxLength && len > maxLength){
      badMaxlength = true
    }

    var message = ""
    if(!reqOk){
      message = fieldName + ": es requerido."
    }else if(badMinlength){
      message = fieldName + ": debe tener " + minLength + " caracteres o mas."
    }else if(badMaxlength){
      message = fieldName + ": debe tener " + maxLength + " caracteres o menos."
    }

    const vl = {
      "badMinlength": badMinlength,
      "badMaxlength": badMaxlength,
      "require": !reqOk,
      "empty": len == 0,
      "allOk" : (reqOk && !badMinlength && !badMaxlength),
      "message" : message
    }
    // console.log("vale:", vl)
    setValidation(vl)
  }
  
  const checkKeyDown = (event)=>{
    if(!canAutoComplete && event.key == "Unidentified"){
      event.preventDefault();
      return false
    }else{
      setKeyPressed(true)
    }
    if(!Validator.isKeyPassword(event)){
      event.preventDefault();
      return false
    }
  }

  const checkChange = (event)=>{
    if(!canAutoComplete && !keyPressed){
      return
    }
    const value = event.target.value
    if(value == " "){
      showMessage(fieldName + ":Valor erroneo")

      return false
    }
    if(Validator.isPassword(value)){
      // console.log(value + " es valido")
      setPassword(value);
    }else{
      // console.log("es incorrecta")
      showMessage(fieldName + ":Valor erroneo")

    }
  }
  
  const checkChangeBlur = (event)=>{
    validate()
  }

  useEffect(()=>{
    // console.log("cambio inputState")
    // console.log(inputState)
    validate()
  },[])

  useEffect(()=>{
    validate()
  },[password])


  const[showTecladoClave,setShowTecladoClave] = useState(false)

  return (
    <>

      <IngresarTexto
        title={"Clave"}
        openDialog={showTecladoClave}
        setOpenDialog={setShowTecladoClave}
        varChanger={setPassword}
        varValue={password}
        verOcultar={showPassword}
        setVerOcultar={setShowPassword}
      />

      {withLabel && (
      <InputLabel sx={{ marginBottom: "2%" }}>
        {label}
      </InputLabel>
      )}

      <TextField
        fullWidth
        margin="normal"
        autoFocus={autoFocus}
        required={required}
        label={label}
        password="clave"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={checkChange}
        onClick={(e) => setShowTecladoClave(true)}

        onBlur={checkChangeBlur}
        onKeyDown={checkKeyDown}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={()=>{
                  setShowPassword( !showPassword )

                  setTimeout(() => {
                    setShowTecladoClave(false)
                  }, 10);
                  setTimeout(() => {
                    setShowTecladoClave(false)
                  }, 500);

                }}
                edge="end"
              >
                {showPassword ? <VisibilityOff fontSize="small"  /> : <Visibility fontSize="small"  />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />


    </>
  );
};

export default InputPassword;
