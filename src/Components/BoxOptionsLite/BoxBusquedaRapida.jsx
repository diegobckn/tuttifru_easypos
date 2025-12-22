import React, { useState, useContext, useEffect, useRef } from "react";

import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Button
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import Product from "../../Models/Product";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import TableSelecProduct from "./TableSelect/TableSelecProduct";
import ModelConfig from "../../Models/ModelConfig";
import LongClick from "../../Helpers/LongClick";
import ConfirmOption from "../Dialogs/ConfirmOption";
import SmallDangerButton from "../Elements/SmallDangerButton";
import ProductFastSearch from "../../Models/ProductFastSearch";
import ProductButton from "../Elements/ProductButton";
import BoxOptionList from "./BoxOptionList";
import System from "../../Helpers/System";
import ProductSold from "../../Models/ProductSold";

export const filtrosBusquedaRapida = {
  Pesables: 1,
  Unitarios: 2,
  Todos: 3,
}

export default ({
  show
}) => {

  const {
    userData,
    addToSalesData,
    showConfirm,
    showMessage,
    showLoading,
    hideLoading,
    cliente
  } = useContext(SelectedOptionsContext);

  const [prods, setProds] = useState([])

  const [prodFiltereds, setProdfiltereds] = useState([])
  const [filterSelected, setFilterSelected] = useState(null)

  const [showSearchProduct, setShowSearchProduct] = useState(false)
  const [showConfirmOption, setShowConfirmOption] = useState(false)
  const [findedProduct, setFindedProduct] = useState(null)
  const [settingProduct, setSettingProduct] = useState(null)

  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    if (!show) return

    if (prods.length < 1) {
      console.log("no tiene prod cargados")
      setProdfiltereds([])
      getProducts()
    }
  }, [show]);


  useEffect(() => {
    if (filterSelected === null) return

    aplicarFiltro()

  }, [filterSelected]);

  const aplicarFiltro = () => {
    if (filterSelected == filtrosBusquedaRapida.Todos) {
      setProdfiltereds(prods)
      return
    }

    var filtered = []

    prods.forEach((botonProd) => {
      if (
        filterSelected == filtrosBusquedaRapida.Pesables && ProductSold.esPesable(botonProd)
        || filterSelected == filtrosBusquedaRapida.Unitarios && !ProductSold.esPesable(botonProd)
      ) {
        filtered.push(botonProd)
      }
    })

    setProdfiltereds(filtered)
  }

  const getProducts = () => {
    // console.log("getProducts")
    showLoading("Cargando productos...")
    setProds([])
    setProdfiltereds([])
    ProductFastSearch.getInstance().getProductsFastSearch((productosServidor) => {
      setProds(productosServidor)
      setProdfiltereds(productosServidor)
      setFilterSelected(filtrosBusquedaRapida.Todos)
      // console.log("respuesta del servidor")
      // console.log(productosServidor)
      completarBotonesFaltantes(productosServidor)
      hideLoading()
    }, () => {
      hideLoading()
    })
  }

  const completarBotonesFaltantes = (productosServidor) => {
    // console.log("completarBotonesFaltantes")
    const cantConfig = ModelConfig.get("cantidadProductosBusquedaRapida");
    var botonesByBotonNum = []
    const hay = productosServidor.length
    productosServidor.forEach(prodSer => {
      // console.log("item")

      // console.log("prodSer")
      // console.log(prodSer)
      // console.log("cantConfig")
      // console.log(cantConfig)
      if (prodSer.boton <= cantConfig)
        botonesByBotonNum[prodSer.boton] = prodSer
    });

    for (let i = 1; i <= cantConfig; i++) {
      if (botonesByBotonNum[i] == undefined) {
        botonesByBotonNum[i] = {
          boton: i,
          codigoProducto: 0,
          nombre: "Boton " + i,
        }
      }
    }
    // console.log("setProds(botonesByBotonNum)")
    // console.log(botonesByBotonNum)
    setProds(botonesByBotonNum)
  }

  const onSelect = (product) => {
    console.log("onSelect", product)
    setIsChanging(false)
    if (product.codigoProducto) {//si tiene codigo 0 o null es un boton sin asignar
      product.idProducto = product.codigoProducto
      Product.getInstance().findByCodigoBarras({
        codigoProducto: product.codBarra,
        codigoCliente: (cliente ? cliente.codigoCliente : 0)
      }, (prodsEncontrados) => {

        if (prodsEncontrados.length < 1) {
          showLoading("No se pudo encontrar el producto, intentando eliminar del listado...")
          ProductFastSearch.getInstance().removeProductFastSearch(product, (response) => {
            hideLoading()
            showMessage("Eliminado del listado")
            setProds([])
            getProducts()
          }, () => {
            hideLoading()
            showMessage("No se pudo realizar")
          })



        } else {
          addToSalesData(prodsEncontrados[0])
          // setOpenDialog(false)
        }
      }, (err) => {
        showMessage("No se pudo encontrar el producto." + err)
      })

    } else {
      console.log("deberia preguntar")
      showConfirm("No esta configurado este boton, desea configurarlo ahora?", () => {
        // console.log("configurando el boton " + product.boton)
        setSettingProduct(product)
        setShowSearchProduct(true)
      })
    }
  }

  const handleSelectProduct = (findedProductx) => {
    console.log("handleSelectProduct..findedProductx", findedProductx)
    setShowSearchProduct(false)
    setFindedProduct(findedProductx)

    findedProductx.codigoProducto = findedProductx.idProducto
    findedProductx.codigoUsuario = userData.codigoUsuario
    findedProductx.boton = settingProduct.boton

    // console.log("para enviar:")
    // console.log(findedProductx)
    console.log("isChanging", isChanging ? "si" : "no")
    if (isChanging) {
      findedProductx.id = settingProduct.id,
        ProductFastSearch.getInstance().changeProductFastSearch(findedProductx, (response) => {
          showMessage("Se ha modificado correctamente")
          setProds([])
          getProducts()
        }, () => {
          showMessage("No se pudo modificar")
        })
    } else {
      ProductFastSearch.getInstance().addProductFastSearch(findedProductx, (response) => {
        console.log("Se agrego correctamente")
        showMessage("Se agrego correctamente")
        setProds([])
        getProducts()
      }, () => {
        console.log("No se pudo agregar")
        showMessage("No se pudo agregar")
      })
    }
  }


  const handleClearButton = () => {
    console.log("handleClearButton..")
    showConfirm("Limpiar el boton " + (settingProduct ? settingProduct.boton : "") + " " + settingProduct.nombre + "?",
      () => {
        console.log("eligio si")
        setSettingProduct(null)
        ProductFastSearch.getInstance().removeProductFastSearch(settingProduct, (response) => {
          console.log("Realizado correctamente")
          showMessage("Realizado correctamente")
          setProds([])
          getProducts()
        }, () => {
          console.log("No se pudo realizar")
          showMessage("No se pudo realizar")
        })
      })
  }


  return (

    <Grid container spacing={2} style={{
      padding: "0px",
    }}>

      <Grid item xs={12} sm={12} md={12} lg={12} style={{
        display: (!showSearchProduct ? "block" : "none")
      }}>

        <BoxOptionList
          optionSelected={filterSelected}
          setOptionSelected={setFilterSelected}
          options={System.arrayIdValueFromObject(filtrosBusquedaRapida, true)}
        />

        {prodFiltereds.length > 0 && prodFiltereds.map((product, index) => {
          var styles = {
            marginTop: "20px",
            minHeight: "80px"
          }

          if (!product.codigoProducto) {
            styles.backgroundColor = "#c1c1c1"
          }

          const longBoleta = new LongClick(2);
          longBoleta.onClick(() => {
            onSelect(product)
          })
          longBoleta.onLongClick(() => {
            setIsChanging(true)
            if (product.codigoProducto) {
              setSettingProduct(product)
              setShowConfirmOption(true)
            }
          })


          return (
            <ProductButton key={index} product={product}
              onTouchStart={() => longBoleta.onStart("touch")}
              onMouseDown={() => longBoleta.onStart("mouse")}
              onTouchEnd={() => longBoleta.onEnd("touch")}
              onMouseUp={() => longBoleta.onEnd("mouse")}
              onMouseLeave={() => longBoleta.cancel()}
              onTouchMove={() => longBoleta.cancel()}
              // actionButton={()=>{
              //   onSelect(product);
              // }}
              style={styles}
              animateBackgroundColor={true}
            />
          )
        })
        }
      </Grid>

      {/* <Grid item xs={12} sm={5} md={12} lg={12} style={{
        display: (!showSearchProduct ? "block" : "none")
      }}>

        <Box sx={{
          width: "100%",
          textAlign: "center"
        }}>

          <Button sx={{
            height: "50px"
          }} variant="contained" onClick={() => {
            setShowSearchProduct(false)
          }}>volver</Button>

        </Box>

      </Grid> */}

      <TableSelecProduct
        show={showSearchProduct}
        onSelect={handleSelectProduct}
      />

      <ConfirmOption
        openDialog={showConfirmOption}
        setOpenDialog={setShowConfirmOption}
        textTitle={"Opciones del boton " + (settingProduct ? settingProduct.boton : "")}
        textConfirm={"Elegir una opcion para el boton " +
          (settingProduct
            ?
            settingProduct.boton + " con el producto '" + settingProduct.nombre + "'"
            : " de busqueda rapida")}
        onClick={(option) => {
          console.log(" on click option", option)
          switch (option) {
            case 0:
              setShowSearchProduct(true)
              break
            case 1:
              handleClearButton()
              break
          }

        }}
        buttonOptions={[
          "Modificar",
          "Liberar"
        ]}

      />
    </Grid>

  );
};

