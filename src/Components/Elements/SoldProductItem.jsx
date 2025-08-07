import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button,
  TableRow,
  TableCell,
  TextField,
  IconButton
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";
import IngresarNumeroORut from "../ScreenDialog/IngresarNumeroORut";
import SmallButton from "./SmallButton";
import System from "../../Helpers/System";
import RemoveIcon from "@mui/icons-material/Remove";
import Validator from "../../Helpers/Validator";
import ProductSold from "../../Models/ProductSold";
import AsignarPeso from "../ScreenDialog/AsignarPeso";
import BotonAgregarQuitar from "./BotonAgregarQuitar";

const SoldProductItem = ({
  itemIndex,
  product,
  products,
  onClick
}) => {

  const {
    sales,
    salesData,
    cliente,
    setCliente,

    setSalesData,
    grandTotal,
    setGrandTotal,
    removeFromSalesData,

    showMessage,
    showConfirm,


    hideLoading,
    showLoading,
    searchInputRef,

    pedirSupervision
  } = useContext(SelectedOptionsContext);



  const changeQuantity = (newQuantity) => {
    if (ProductSold.esEnvase(product)) {
      return
    }

    if (newQuantity <= 0) return
    if (!product.pesable && !Validator.isCantidad(newQuantity)) return false
    if (product.pesable && !Validator.isPeso(newQuantity)) return false
    setSalesData([...sales.changeQuantityByIndex(itemIndex,
      isNaN(newQuantity) ? 0 : newQuantity)])
    setGrandTotal(sales.getTotal())
  }

  const handleChangeQuantityProductSold = (event) => {
    var newQuantity = parseFloat(event.target.value);
    if (!product.pesable) {
      newQuantity = parseInt(event.target.value);
    }
    changeQuantity(newQuantity)

    // setTimeout(() => {
    //   searchInputRef.current.focus()
    // }, 500);
  }


  const decQuantity = () => {
    const newQuantity = parseInt(product.quantity - 1);
    if (newQuantity < 1) return
    changeQuantity(newQuantity)
    setTimeout(() => {
      searchInputRef.current.focus()
    }, 500);
  }

  const addQuantity = () => {
    const newQuantity = parseInt(product.quantity + 1);
    changeQuantity(newQuantity)

    setTimeout(() => {
      searchInputRef.current.focus()
    }, 500);
  }

  const confirmarEliminar = () => {
    removeFromSalesData(itemIndex)
    showMessage("Eliminado " + salesData[itemIndex].description)
    setTimeout(() => {
      searchInputRef.current.focus()
    }, 500);
  }

  const handleRemoveFromSalesData = () => {
    console.log("product", product)
    const debePedirPermiso = (ModelConfig.get("pedirPermisoBorrarLinea"))
    showConfirm("Eliminar " + product.description + "?", () => {

      if (debePedirPermiso) {
        pedirSupervision("Quitar Producto", () => {
          confirmarEliminar()
          console.log("vuelve de confirmar autorizacion")
        }, {
          "codProducto": 0, //parseInt(product.idProducto),
          "cantidad": product.quantity,
          "precioUnidad": product.price,
          "descripcion": product.description,
          "codBarra": product.idProducto + ""
        })
      } else {
        confirmarEliminar()
      }

    }, () => {
      setTimeout(() => {
        searchInputRef.current.focus()
      }, 500);
    })
  }

  const [showTecladoQuantity, setShowTecladoQuantity] = useState(false)
  const [newQuantityValue, setNewQuantityValue] = useState(0)

  const prepareTecladoChangeQuantity = () => {
    setNewQuantityValue(product.quantity)
    setShowTecladoQuantity(true)
  }

  const endTecladoChangeQuantity = () => {
    setShowTecladoQuantity(false)
    handleChangeQuantityProductSold({
      "target": {
        "value": newQuantityValue
      }
    })

    setTimeout(() => {
      searchInputRef.current.focus()
    }, 500);

  }

  useEffect(() => {
    handleChangeQuantityProductSold({
      "target": {
        "value": newQuantityValue
      }
    })
  }, [newQuantityValue])


  const checkChangeQuantity = (quantity) => {
    if (Validator.isCantidad(quantity))
      setNewQuantityValue(quantity)
  }

  return (product && !product.ocultarEnListado ? (
    <>
      <TableRow key={itemIndex} sx={{
        // height: "33px"
      }}>
        <TableCell sx={{
          // display: "flex",
          alignItems: "center",
          // backgroundColor: "red",
          alignContent: "center",
          flexDirection: "column",
          // borderBottom:0,
          width: "230px"
        }}>


          {!product.pesable && (

            <IngresarNumeroORut
              openDialog={showTecladoQuantity}
              setOpenDialog={(v) => {
                if (!v) {
                  setTimeout(() => {
                    searchInputRef.current.focus()
                  }, 500);
                }
                setShowTecladoQuantity(v)
              }}
              title={"Cambiar cantidad"}
              varChanger={checkChangeQuantity}
              varValue={newQuantityValue}
              onEnter={() => {
                endTecladoChangeQuantity()
              }}
            />
          )}

          {product.pesable && (

            <AsignarPeso
              openDialog={showTecladoQuantity}
              setOpenDialog={setShowTecladoQuantity}
              title={"Cambiar peso"}
              product={product}
              onAsignWeight={setNewQuantityValue}
              currentWight={newQuantityValue}
              onEnter={() => {
                endTecladoChangeQuantity()
              }}
            />
          )}



          {
            product.pesable ? (
              <Typography sx={{
                width: "33%",
                height: "56px",
                border: "1px solid",
                borderColor: "#ccc",
                borderRadius: "5px",
                fontSize: "15px",
                textAlign: "center",
                marginLeft: "33%",
                padding: "16.5px 0"
              }}
                onClick={() => {
                  if (!product.isEnvase) prepareTecladoChangeQuantity()
                }}

              >{product.quantity === 0 ? "" : product.quantity}</Typography>
            ) : (
              <div>

                {!product.isEnvase && (
                  <>
                    <SmallButton style={{
                      position: "relative",
                      height: "52px",
                      top: "2px",
                      width: "33%",
                      textAlign: "center",
                      backgroundColor: "#6c6ce7",
                      fontSize: "25px",
                      margin: "0",
                      color: "white"
                    }}
                      withDelay={false}
                      actionButton={() => {
                        decQuantity()
                      }}
                      textButton={"-"} />




                    <TextField
                      value={product.quantity === 0 ? "" : product.quantity}
                      onChange={(event) => {
                        handleChangeQuantityProductSold(event)
                      }}

                      onClick={() => {
                        if (!product.isEnvase) prepareTecladoChangeQuantity()
                      }}
                      style={{
                        // marginLeft: (product.isEnvase ? "65px" : "0"),
                        width: "33%",
                        fontSize: 2,
                        position: "relative",
                        // top:"2px",
                        alignContent: "center",
                        alignItems: "center",
                        textAign: "center"
                      }}
                    />

                    <SmallButton style={{
                      position: "relative",
                      height: "52px",
                      top: "2px",
                      textAlign: "center",
                      width: "33%",
                      backgroundColor: "#6c6ce7",
                      fontSize: "25px",
                      margin: "0",
                      color: "white"
                    }}
                      withDelay={false}
                      actionButton={() => {
                        addQuantity()
                      }}
                      textButton={"+"} />

                  </>
                )}

                {product.isEnvase && (
                  <Typography
                    style={{
                      // marginLeft: (product.isEnvase ? "65px" : "0"),
                      // marginLeft: "65px",
                      width: "33%",
                      fontSize: "16px",
                      alignContent: "center",
                      alignItems: "center",
                      height: "60px",
                      border: "1px solid #cfcfcf",
                      borderRadius: "4px",
                      marginLeft: "33%",
                      padding: "0 15px",
                    }}
                  >{product.quantity === 0 ? "0" : product.quantity}</Typography>
                )}


              </div>
            )
          }

        </TableCell>
        <TableCell sx={{
          // display: "flex",
          alignItems: "center",
          // backgroundColor: "green",
          alignContent: "center",
          // flexDirection: "column",
          padding: '0',
          margin: '0'
          // width:"220px"
        }}>
          <BotonAgregarQuitar product={product} indexInSales={itemIndex} />
        </TableCell>
        <TableCell sx={{
          fontSize: "20px",
          // backgroundColor: "blue"
        }}>



          {product.description}

          {product.tieneExtraAgregar() && (
            <Typography>
              Agregar: {product.getAgregadosEnTexto()}
            </Typography>
          )}

          {product.tieneExtraQuitar() && (
            <Typography>
              Quitar: {product.getQuitadosEnTexto()}
            </Typography>
          )}

          {ModelConfig.get("permitirAgregarYQuitarExtras") && !product.isEnvase && product.extras && (
            <Typography>
              Entrega: {product.extras.entrega}
            </Typography>
          )}

        </TableCell>
        <TableCell sx={{ fontSize: "20px" }}>${System.formatMonedaLocal(product.price, false)}</TableCell>
        <TableCell sx={{ fontSize: "20px" }}>
          ${System.formatMonedaLocal(product.total, false)}
        </TableCell>
        <TableCell>

          {!product.isEnvase ? (

            <IconButton
              onClick={() => handleRemoveFromSalesData()}
              color="secondary"
            >
              <RemoveIcon />
            </IconButton>
          ) : (" ")}
        </TableCell>
      </TableRow>
    </>

  ) : (
    <></>
  )
  )
};

export default SoldProductItem;
