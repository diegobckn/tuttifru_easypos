import React, { useState, useContext, useEffect } from "react";
import TeclaButton70 from "./../Elements/TeclaButton70"
import TeclaEnterButton70 from "./../Elements/TeclaEnterButton70"
import TeclaBorrarButton70 from "./../Elements/TeclaBorrarButton70"

const TecladoAlfaNumerico = ({
  showFlag, varValue,
  varChanger,
  onEnter,
  isEmail = false,
  isUrl = false,
  mayus = null,
  setMayus = () => { },
  style = {},
}) => {

  const [altoExtraUrlEmail, setAltoExtraUrlEmail] = useState(0)

  const handleKeyButton = (key) => {
    console.log("apreta una tecla")
    if (key == "enter") {
      onEnter()
      return
    }

    if (key == "limpiar") {
      varChanger("")
      return
    }

    if (key == "borrar") {
      varChanger(varValue.slice(0, -1))
      return
    }

    varChanger(varValue + key)
  }

  useEffect(() => {
    
    setAltoExtraUrlEmail(((isUrl ? 80 : 0) + (isEmail ? 80 : 0)))
  }, [isUrl, isEmail])
  
  useEffect(() => {
    // console.log("isUrl", isUrl)
    // console.log("isEmail", isEmail)
  }, [])

  return (
    showFlag ? (
      <div style={{
        ...{
          // height: (330 + (altoExtraUrlEmail) + "px"),
          border:"5px solid #000",
          borderRadius:"10px",
          position: "fixed",
          zIndex: "10",
          background: "#efefef",
          alignContent: "center",
          alignItems: "start",
          flex: "1",
          left: "calc(50% - 435px)",
          bottom: "10px",
          flexDirection: "column"
        }, ...style
      }}
      >
        <div style={{
          display: "flex",
          flexDirection: "row"
        }}>

          <TeclaButton70 mayus={mayus} textButton="1" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="2" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="3" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="4" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="5" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="6" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="7" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="8" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="9" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="0" actionButton={handleKeyButton} />
          <TeclaBorrarButton70 actionButton={handleKeyButton} />
        </div>

        <div style={{
          display: "flex",
          marginBottom: "-80px",
          flexDirection: "row"
        }}>

          <TeclaButton70 mayus={mayus} textButton="q" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="w" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="e" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="r" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="t" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="y" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="u" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="i" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="o" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="p" actionButton={handleKeyButton} />
          <TeclaEnterButton70 style={{
            height: "150px"
          }} actionButton={handleKeyButton} />
        </div>



        <div style={{
          display: "flex",
          // position:"relative",
          // top:"-80px",
          flexDirection: "row"
        }}>


          <TeclaButton70 mayus={mayus} textButton="a" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="s" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="d" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="f" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="g" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="h" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="j" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="k" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="l" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="ñ" actionButton={handleKeyButton} />
        </div>


        <div style={{
          display: "flex",
          flexDirection: "row"
        }}>

          <TeclaButton70 mayus={mayus} textButton="z" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="x" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="c" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="v" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="b" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="n" actionButton={handleKeyButton} />
          <TeclaButton70 mayus={mayus} textButton="m" actionButton={handleKeyButton} />

          <TeclaButton70 style={{
            width: "150px"
          }} mayus={mayus} textButton={(mayus ? "MINUS" : "MAYUS")}
            actionButton={() => {
              setMayus(!mayus)
            }} />

          <TeclaButton70 style={{
            width: "150px"
          }} textButton="Espacio" actionButton={() => {
            handleKeyButton(" ")
          }} />

        </div>

        {isUrl && (

          <div style={{
            display: "flex",
            flexDirection: "row"
          }}>

            <TeclaButton70 mayus={mayus} textButton="." actionButton={handleKeyButton} />
            <TeclaButton70 mayus={mayus} textButton=":" actionButton={handleKeyButton} />
            <TeclaButton70 mayus={mayus} textButton="/" actionButton={handleKeyButton} />
            <TeclaButton70 mayus={mayus} textButton="-" actionButton={handleKeyButton} />
            <TeclaButton70 mayus={mayus} textButton="?" actionButton={handleKeyButton} />
            <TeclaButton70 mayus={mayus} textButton="&" actionButton={handleKeyButton} />
            <TeclaButton70 mayus={mayus} textButton="=" actionButton={handleKeyButton} />
            <TeclaButton70 mayus={mayus} textButton="_" actionButton={handleKeyButton} />
            <TeclaButton70 mayus={mayus} textButton="#" actionButton={handleKeyButton} />
            <TeclaButton70 mayus={mayus} textButton="+" actionButton={handleKeyButton} />


          </div>
        )}



        {
          isEmail && (
            <div style={{
              display: "flex",
              flexDirection: "row"
            }}>

              <TeclaButton70 style={{
                width: "150px"
              }}
                textButton={".com"}
                actionButton={() => {
                  handleKeyButton(".com")
                }} />


              <TeclaButton70 mayus={mayus} style={{
                width: "10%"
              }} textButton="@" actionButton={() => {
                handleKeyButton("@")
              }} />

              <TeclaButton70 style={{
                width: "450px",
                backgroundColor: "#f05a5a",
                color: "white"
              }} textButton="Limpiar" actionButton={() => {
                handleKeyButton("limpiar")
              }} />
              <TeclaButton70 mayus={mayus} textButton="." actionButton={handleKeyButton} />
              <TeclaButton70 mayus={mayus} textButton={mayus ? "_" : "-"} actionButton={handleKeyButton} />
            </div>
          )
        }
      </div>
    ) : (
      <></>
    )
  )
};

export default TecladoAlfaNumerico;
