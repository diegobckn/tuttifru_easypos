import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
  Snackbar,
  IconButton,
  Table,
  Autocomplete,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Popper,
  Grow,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Slider,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import Swal from "sweetalert2";

import RemoveIcon from "@mui/icons-material/Remove";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";
import System from "../../Helpers/System";
import Validator from "../../Helpers/Validator";
import ProductSold from "../../Models/ProductSold";
import Client from "../../Models/Client";
import SmallButton from "../Elements/SmallButton";
import IngresarNumeroORut from "../ScreenDialog/IngresarNumeroORut";
import SearchProductItem from "../Elements/SearchProductItem";
import SoldProductItem from "../Elements/SoldProductItem";
import ModelConfig from "../../Models/ModelConfig";
import Preventa from "../../Models/Preventa";
import ProductCodeStack from "../../Models/ProductCodeStack";
import Balanza from "../../Models/Balanza";
import BalanzaUnidad from "../../Models/BalanzaUnidad";
import dayjs from "dayjs";
import OrdenListado from "../../definitions/OrdenesListado";

const BoxProducts = ({ }) => {
  const {
    sales,
    salesData,
    cliente,
    setCliente,

    setSalesData,
    grandTotal,
    setGrandTotal,
    addToSalesData,
    removeFromSalesData,
    setQuantity,
    clearSalesData,

    showMessage,
    showConfirm,

    textSearchProducts,
    setTextSearchProducts,
    buscarCodigoProducto,
    setBuscarCodigoProducto,
    showTecladoBuscar,
    setShowTecladoBuscar,
    addNewProductFromCode,
    hideLoading,
    showLoading,

    searchInputRef
  } = useContext(SelectedOptionsContext);



  const [products, setProducts] = useState([]);
  const [cargado, setCargado] = useState(null);

  const [paginaBusqueda, setPaginaBusqueda] = useState(0);
  const [cantidadPaginasBusqueda, setCantidadPaginasBusqueda] = useState(0);

  const focusSearchInput = () => {
    System.intentarFoco(searchInputRef)
  }

  useEffect(() => {
    if (textSearchProducts.trim() == "") {
      // console.log("esta vacio")
      setProducts([])
      return
    }
    handleDescripcionSearchButtonClick()
  }, [textSearchProducts]);

  const buscarValoresBalanzaVentaUnidad = (codigoBusqueda) => {
    const CODBALANZA = BalanzaUnidad.getCodigo()
    const LARGOIDPRODBALANZA = parseInt(ModelConfig.get("largoIdProdBalanzaVentaUnidad"))
    const LARGOCANTIDADBALANZA = parseInt(ModelConfig.get("largoPesoBalanzaVentaUnidad"))

    if (codigoBusqueda.length % 13 == 0) {

      showLoading("Cargando los productos de la balanza")
      var tx = codigoBusqueda.replaceAll("\r", "")

      // var partes = tx.split("\n")

      var partes = tx.match(/.{1,13}/g);
      if (partes.length > 0 && partes[0] != "") {

        var codigoCliente = 0
        if (cliente) codigoCliente = cliente.codigoCliente
        partes.forEach((parte) => {
          const codbalanzaItem = parte.substring(0, CODBALANZA.length)
          if (CODBALANZA == codbalanzaItem) {

            // console.log("es codigo de balanza")

            // const idProducto = parte.substring(3, 3+5)

            const x1 = CODBALANZA.length
            const x2 = CODBALANZA.length + LARGOIDPRODBALANZA
            const idProducto = parte.substring(
              CODBALANZA.length, CODBALANZA.length + LARGOIDPRODBALANZA
            )

            // const peso = parte.substring(8, 8 + 4)
            const peso = parte.substring(
              CODBALANZA.length + LARGOIDPRODBALANZA,
              CODBALANZA.length + LARGOIDPRODBALANZA + LARGOCANTIDADBALANZA
            )

            if (parte.trim() == "") return;

            // console.log("codigo: " + parseInt(idProducto))
            // console.log("peso: " + peso)
            const pesoFloat = parseFloat(peso)

            showLoading("buscando producto " + parseInt(idProducto))
            Product.getInstance().findByCodigo({ codigoProducto: idProducto, codigoCliente: codigoCliente }, (products, response) => {
              if (products.length > 0) {
                const productoEncontrado = products[0];
                addToSalesData(productoEncontrado, pesoFloat);
                // setProductByCodigo(productoEncontrado);
              } else {
                showMessage("Producto No encontrado");
                procesarNoEncontrado(parte)
              }

              hideLoading()
            },
              (error) => {
                // console.error("Error al buscar el producto:", error);
                showMessage("No se pudo encontrar el producto: " + idProducto)
                hideLoading()
              })
          } else {
            //codigo no coincide con codigo de balanza configurado
            showMessage("Producto No encontrado");
            procesarNoEncontrado(parte)
          }


        })
      } else {
        showMessage("Producto No encontrado");
        procesarNoEncontrado(codigoBusqueda)
      }

      hideLoading()
      // setTextSearchProducts("")

      return
    } else {
      showMessage("Producto No encontrado");
      procesarNoEncontrado(codigoBusqueda)
    }
  }

  const procesarNoEncontrado = (codigoNoEncontrado) => {
    if (ModelConfig.get("crearProductoNoEncontrado")) {
      showConfirm("Producto No encontrado, desea agregar un nuevo producto con el codigo ' " + codigoNoEncontrado + " ' ?", () => {
        addNewProductFromCode(codigoNoEncontrado)
      }, () => {
      })
    }
  }

  const buscarValoresBalanza = (codigoBusqueda) => {
    // console.log("buscarValoresBalanza")

    const CODBALANZA = Balanza.getCodigo()
    const LARGOIDPRODBALANZA = parseInt(ModelConfig.get("largoIdProdBalanza"))
    const LARGOPESOBALANZA = parseInt(ModelConfig.get("largoPesoBalanza"))
    const PESOENTERO = parseInt(ModelConfig.get("digitosPesoEnterosBalanza"))

    if (codigoBusqueda.length % 13 == 0) {

      showLoading("Cargando los productos de la balanza")
      var tx = codigoBusqueda.replaceAll("\r", "")

      // var partes = tx.split("\n")

      var partes = System.partirCada(tx, 13);
      // console.log("partes", partes)
      // var partes = tx.match(/.{1,13}/g);
      if (partes.length > 0 && partes[0] != "") {

        var codigoCliente = 0
        if (cliente) codigoCliente = cliente.codigoCliente
        partes.forEach((parte) => {
          const codbalanzaItem = parte.substring(0, CODBALANZA.length)
          if (CODBALANZA == codbalanzaItem) {

            // console.log("es codigo de balanza")

            // const idProducto = parte.substring(3, 3+5)

            const idProducto = parte.substring(
              CODBALANZA.length, CODBALANZA.length + LARGOIDPRODBALANZA
            )

            // const peso = parte.substring(8, 8 + 4)
            const peso = parte.substring(
              CODBALANZA.length + LARGOIDPRODBALANZA,
              CODBALANZA.length + LARGOIDPRODBALANZA + LARGOPESOBALANZA
            )

            if (parte.trim() == "") return;

            // console.log("codigo: " + parseInt(idProducto))
            // console.log("peso: " + peso)
            const pesoEntero = peso.substring(0, PESOENTERO)
            const pesoDecimal = peso.substring(PESOENTERO)
            const pesoFloat = parseFloat(pesoEntero + "." + pesoDecimal)

            showLoading("buscando producto " + parseInt(idProducto))
            Product.getInstance().findByCodigo({ codigoProducto: idProducto, codigoCliente: codigoCliente }, (products, response) => {
              if (products.length > 0) {
                const productoEncontrado = products[0];
                addToSalesData(productoEncontrado, pesoFloat);
                // setProductByCodigo(productoEncontrado);
              } else {
                showMessage("Producto No encontrado");
                procesarNoEncontrado(parte)
              }

              hideLoading()
            },
              (error) => {
                // console.error("Error al buscar el producto:", error);
                showMessage("No se pudo encontrar el producto: " + idProducto)
                hideLoading()
              })
          } else {
            // console.log("no es codigo de balanza")

            buscarValoresBalanzaVentaUnidad(codigoBusqueda)
          }


        })
      } else {
        showMessage("Producto No encontrado");
        procesarNoEncontrado(codigoBusqueda)
      }

      hideLoading()
      // setTextSearchProducts("")

      return
    } else {
      showMessage("Producto No encontrado");
      procesarNoEncontrado(codigoBusqueda)
    }
  }


  const procesarBusqueda = (codigoBusqueda) => {
    // console.log("procesando la busqueda", codigoBusqueda)

    var codigoCliente = 0
    if (cliente) codigoCliente = cliente.codigoCliente
    Product.getInstance().findByCodigoBarras({ codigoProducto: codigoBusqueda, codigoCliente: codigoCliente }, (products, response) => {
      // console.log("Respuesta de la IdBYCODIGO:", response.data);
      // console.log("Cantidad registros:", response.data.cantidadRegistros);


      products.forEach((produ) => {
        if (parseFloat(produ.precioVenta) <= 0) {
          // console.log("el producto " + produ.nombre + ", #" + produ.idProducto + " tiene precio 0")
        }
      })

      if (response.data.cantidadRegistros > 0) {
        const productoEncontrado = products[0];
        addToSalesData(productoEncontrado);
        // setProductByCodigo(productoEncontrado);
        // setTextSearchProducts("");
        setShowTecladoBuscar(false)
        focusSearchInput()
      } else {

        buscarValoresBalanza(codigoBusqueda)

        // setProductByCodigo(null);
        // setTextSearchProducts("")
      }
    },
      (error) => {
        // console.error("Error al buscar el producto:", error);
        showMessage("No se encontraron resultados para: " + codigoBusqueda);
      })
  }


  const handlePluSearchButtonClick = async () => {
    // console.log("handlePluSearchButtonClick", dayjs().format("HH:mm:ss"))
    if (!parseFloat(textSearchProducts)) return

    ProductCodeStack.addProductCode(textSearchProducts)
    setTextSearchProducts("")
    return
  };



  const handleDescripcionSearchButtonClick = async (resetearPagina = true) => {
    if (parseInt(textSearchProducts.trim()) || 0) return //si es numero sale
    // console.log("handleDescripcionSearchButtonClick")
    // console.log("textSearchProducts")
    // console.log(textSearchProducts)



    if (parseFloat(textSearchProducts) || textSearchProducts.trim() == "") return
    var codigoCliente = 0
    if (cliente) codigoCliente = cliente.codigoCliente



    // CHECK PREVENTA
    const largoHash = 46
    const txtPreventa = "@preventa"
    var len = textSearchProducts.length

    // console.log("")
    // console.log("len ", len)
    // console.log("largoHash", largoHash)
    // console.log("len == largoHash - 1", len == largoHash - 1)
    // console.log("textSearchProducts.substr(0, txtPreventa.length)", textSearchProducts.substr(0, txtPreventa.length))
    if (len == largoHash - 1 && textSearchProducts.substr(0, txtPreventa.length) == "PREVENTA-") {
      setTextSearchProducts("@" + textSearchProducts)
      return;
    }
    if (textSearchProducts.indexOf("@") > -1) {
      const txtCortado = txtPreventa.substring(0, textSearchProducts.length)
      // console.log("txtCortado:")
      // console.log(txtCortado)
      if (textSearchProducts.length == largoHash && textSearchProducts.toLowerCase().indexOf(txtCortado) > -1) {
        showLoading("Revisando preventa")
        // console.log("es preventa!!")

        Product.getInstance().findPreVenta({
          "preVentaID": textSearchProducts,
          "idCabecera": 0,
          "folio": 0
        }, (products, response) => {

          if (Preventa.yaFueUsada(textSearchProducts, salesData)) {
            showMessage("Ya fue usada la preventa")
          } else {
            // sales.products = []
            Preventa.adaptarLecturaProductos(products).forEach((produ) => {
              const tipo = ProductSold.getInstance().esPesable(produ) ? 2 : 1
              addToSalesData({
                ...produ, ...{
                  idProducto: produ.codProducto,
                  nombre: produ.descripcion,
                  tipoVenta: tipo,
                  precioCosto: produ.costo,
                  precioVenta: produ.precioUnidad,
                  preVenta: textSearchProducts
                }
              })

            })

            if (response.preventa[0].codigoCliente > 0) {
              Client.getInstance().findById(response.preventa[0].codigoCliente, (clienteEncontrado) => {
                // console.log("Respuesta del servidor:", response.data);
                clienteEncontrado.nombreResponsable = clienteEncontrado.nombre
                clienteEncontrado.apellidoResponsable = clienteEncontrado.apellido
                setCliente(clienteEncontrado)
              }, () => {
                showMessage("no se pudo seleccionar el cliente")
              })
            }
            setProducts(products)
          }
          setTextSearchProducts("")
          hideLoading()
        },
          (error) => {
            hideLoading()
            showMessage(error)
            setProducts([])
          })


      }
      // return
    }

    // console.log('textSearchProducts.indexOf("@@offlinepreventa")', textSearchProducts.indexOf("@@offlinepreventa"))
    if (textSearchProducts.length > 23 && textSearchProducts.indexOf("@@offlinepreventa") === 0) {
      // console.log("entro")
      var buscado = textSearchProducts.substr(-3)
      if (buscado != "-p-") return
      var buscado = textSearchProducts + ""
      // console.log("buscado:", buscado)
      if (buscado.indexOf("'") > -1) {
        buscado = buscado.replaceAll("'", "-")
      }
      // console.log("buscado:", buscado)
      if (buscado.indexOf("´") > -1) {
        buscado = buscado.replaceAll("´", "-")
      }
      // console.log("buscado:", buscado)
      setTextSearchProducts("")
      const prodsTxtArr = buscado.split("@@offlinepreventa")
      // console.log("prodsTxtArr:", prodsTxtArr)

      if (prodsTxtArr.length == 2) {
        // console.log("prodsTxtArr tiene :", prodsTxtArr.length)

        const prodsTxt = prodsTxtArr[1]
        // console.log("prodsTxt:", prodsTxt)

        const preprods = prodsTxt.split("-p-")
        // console.log("preprods:", preprods)

        if (preprods.length >= 2) {
          const preprodsConPunYCom = preprods[1]
          // console.log("preprodsConPunYCom:", preprodsConPunYCom)

          const prodsStr = preprodsConPunYCom.split(";;")
          // console.log("prodsStr:", prodsStr)

          if (prodsStr.length > 0) {
            prodsStr.forEach(async (prosStr, ix) => {
              const infArr = prosStr.split(",")
              // console.log("infArr:", infArr)
              if (infArr.length > 0) {
                const codBarra = infArr[0] + ""
                const cantidad = parseFloat(infArr[1])

                // console.log("vamos a buscar con estos datos:")
                // console.log("codBarra:", codBarra)
                // console.log("cantidad:", cantidad)

                setTimeout(() => {
                  Product.getInstance().findByCodigoBarras({
                    codigoProducto: codBarra,
                    codigoCliente: codigoCliente
                  },
                    (products, response) => {
                      if (products.length > 0) {
                        const productoEncontrado = products[0];
                        addToSalesData(productoEncontrado, cantidad);
                        // setProductByCodigo(productoEncontrado);
                      } else {
                        showMessage("Producto No encontrado");
                      }
                    },
                    (error) => {
                      showMessage("No se pudo encontrar el producto: " + codBarra)
                    })
                }, (ix + 1) * 1000);

              }

            })
          }


        }
      }

      return
    }

    if (textSearchProducts.indexOf("@@") > -1 || textSearchProducts.indexOf("PREVENTA") > -1) {
      return
    }
    Product.getInstance().findByDescriptionPaginado({ description: textSearchProducts, codigoCliente: codigoCliente }, (products, response) => {
      if (response.data.cantidadRegistros > 0) {

        // products.forEach((produ)=>{
        // if(parseFloat(produ.precioVenta) <=0){
        // console.log("el producto " + produ.nombre + ", #"+produ.idProducto + " tiene precio 0")
        // }
        // })
        setCantidadPaginasBusqueda(Math.ceil(response.data.cantidadRegistros / 10))
        setProducts(products);
      } else {
        // console.log("Producto no encontrado.");
        setCantidadPaginasBusqueda(0)
        setProducts([]);
        showMessage("Descripción o producto no encontrado");
      }
      setProducts(products)

      if (resetearPagina) {
        setPaginaBusqueda(1)
      }
    },
      () => {
        if (resetearPagina) {
          setPaginaBusqueda(1)
        }
        setCantidadPaginasBusqueda(0)
        setProducts([])
      })


  };

  const verProximaPagina = () => {
    var codigoCliente = 0
    if (cliente) codigoCliente = cliente.codigoCliente


    Product.getInstance().findByDescriptionPaginado({
      description: textSearchProducts,
      codigoCliente: codigoCliente,
      pagina: (paginaBusqueda + 1)
    }, (products, response) => {
      if (response.data.cantidadRegistros > 0) {

        // products.forEach((produ)=>{
        // if(parseFloat(produ.precioVenta) <=0){
        // console.log("el producto " + produ.nombre + ", #"+produ.idProducto + " tiene precio 0")
        // }
        // })
        setCantidadPaginasBusqueda(Math.ceil(response.data.cantidadRegistros / 10))
        setProducts(products);
      } else {
        // console.log("Producto no encontrado.");
        setCantidadPaginasBusqueda(0)
        setProducts([]);
        showMessage("Descripción o producto no encontrado");
      }
      setProducts(products)

      setPaginaBusqueda(paginaBusqueda + 1)
    },
      () => {
        setPaginaBusqueda(paginaBusqueda + 1)
        setCantidadPaginasBusqueda(0)
        setProducts([])
      })
  }

  const verPaginaAnterior = () => {
    var codigoCliente = 0
    if (cliente) codigoCliente = cliente.codigoCliente

    Product.getInstance().findByDescriptionPaginado({
      description: textSearchProducts,
      codigoCliente: codigoCliente,
      pagina: (paginaBusqueda - 1)
    }, (products, response) => {
      if (response.data.cantidadRegistros > 0) {

        // products.forEach((produ)=>{
        // if(parseFloat(produ.precioVenta) <=0){
        // console.log("el producto " + produ.nombre + ", #"+produ.idProducto + " tiene precio 0")
        // }
        // })
        setCantidadPaginasBusqueda(Math.ceil(response.data.cantidadRegistros / 10))
        setProducts(products);
      } else {
        // console.log("Producto no encontrado.");
        setCantidadPaginasBusqueda(0)
        setProducts([]);
        showMessage("Descripción o producto no encontrado");
      }
      setProducts(products)

      setPaginaBusqueda(paginaBusqueda - 1)
    },
      () => {
        setPaginaBusqueda(paginaBusqueda - 1)
        setCantidadPaginasBusqueda(0)
        setProducts([])
      })
  }

  useEffect(() => {
    console.log("cambio paginaBusqueda", paginaBusqueda)
  }, [paginaBusqueda])

  useEffect(() => {
    console.log("cambio cantidadPaginasBusqueda", cantidadPaginasBusqueda)
  }, [cantidadPaginasBusqueda])


  useEffect(() => {
    // console.log("useffect de buscarCodigoProducto", buscarCodigoProducto)
    if (!cargado) return
    hacerBusquedaCodigoProducto()
  }, [buscarCodigoProducto])

  const hacerBusquedaCodigoProducto = () => {
    if (textSearchProducts.trim() !== "") {
      if (parseInt(textSearchProducts) || 0) {
        handlePluSearchButtonClick();
      } else {
        handleDescripcionSearchButtonClick();
      }
      // } else {
      // showMessage("Ingrese un valor para buscar");
    }
    setBuscarCodigoProducto(false)
  }



  const handleAddProductToSales = (product) => {
    addToSalesData(product);
    setProducts([]); // Cerrar la búsqueda después de agregar el producto
    setTextSearchProducts("")
    setShowTecladoBuscar(false)

    focusSearchInput()
  };


  const validateChangeSearchInput = (e) => {
    if (textSearchProducts.length == 0) {
      setPaginaBusqueda(0)
      setCantidadPaginasBusqueda(0)
    }
    if (Validator.isSearch(e.target.value)) {
      setTextSearchProducts(e.target.value)
    } else if (e.target.value.indexOf("@") > -1) {
      // console.log("tiene @")
      var sinarr = (e.target.value + "").replaceAll("@", "")
      if (Validator.isSearch(sinarr)) {
        setTextSearchProducts(e.target.value)
      }
    }
  }

  const handleKeydownSearchInput = (e, a) => {
    if (e.keyCode == 13) {

      // console.log("Apreto enter")

      if (Validator.isNumeric(textSearchProducts, 20)) {

        // if (textSearchProducts.length < 12) {
        ProductCodeStack.addProductCode(textSearchProducts)
        setTextSearchProducts("")
        // }
        // console.log("apreto enter y es numerico")

      } else {
        // console.log("no es numeric", textSearchProducts)

        if (products.length === 1) {
          handleAddProductToSales(products[0])
        }
      }
    }
  }

  const handleKeyUpSearchInput = (e, a) => {
    // console.log("handleKeyUpSearchInput", e.target.value)
    if (textSearchProducts.length >= 13) {
      setTimeout(() => {
        setBuscarCodigoProducto(!buscarCodigoProducto)
      }, 100);
    }
  }

  useEffect(() => {
    ProductCodeStack.processFunction = procesarBusqueda
    setCargado(true)
  }, [])

  return (
    <Paper
      elevation={13}
      sx={{
        background: "#859398",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        justifyContent: "center",
      }}

    >
      <Grid container item xs={12} md={12} lg={12}>
        <Paper
          elevation={13}
          sx={{
            background: "#859398",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "5px",
            margin: "5px",

            width: "100%",
          }}
        >
          <Grid item xs={12} lg={12} sx={{ minWidth: 200, width: "90%" }}>
            <div style={{ display: "flex" }}>
              <Grid item xs={12} md={12} lg={12} sx={{ margin: "1px" }}>
                <TextField
                  inputProps={{
                    "data-id": "searchinput"
                  }}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "5px",
                  }}
                  inputRef={searchInputRef}
                  fullWidth
                  onClick={() => {
                    setTimeout(() => {
                      setShowTecladoBuscar(true)
                    }, 300);
                  }}
                  focused
                  autoComplete="false"
                  placeholder="Buscar producto"
                  value={textSearchProducts}
                  onKeyDown={handleKeydownSearchInput}
                  onKeyUp={handleKeyUpSearchInput}
                  onChange={validateChangeSearchInput}
                />
              </Grid>
              <Button
                sx={{
                  margin: "1px",
                  backgroundColor: " #283048",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1c1b17 ",
                    color: "white",
                  },
                }}
                size="large"
                onClick={() => {
                  setBuscarCodigoProducto(!buscarCodigoProducto)
                }}
              >
                PLU
              </Button>
            </div>



          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper
          elevation={1}
          sx={{
            // background: "#859398",
            background: "red",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "5px",
            maxHeight: (System.getInstance().getWindowHeight() / 2),
            overflow: "auto",
          }}
        >
          <TableContainer
            component={Paper}
            style={{ overflowX: "auto", maxHeight: "200px" }}
          >
            <Table sx={{ background: "white", height: "30%" }}>
              <TableBody style={{ maxHeight: "100px", overflowY: "auto" }}>
                {textSearchProducts.trim() !== "" && products.length > 0 ? (

                  products.map((product, index) => (
                    <SearchProductItem
                      key={index}
                      itemIndex={index}
                      product={product}
                      products={sales.products}
                      onClick={handleAddProductToSales}
                    />
                  ))
                ) : null}

                {textSearchProducts.trim() !== "" && products.length > 0 && cantidadPaginasBusqueda > 1 && (
                  <TableRow sx={{ height: "15%" }}>
                    <TableCell colSpan={10}>
                      <SmallButton
                        textButton={"Ver anterior"}
                        actionButton={verPaginaAnterior}
                        isDisabled={paginaBusqueda < 2}
                      />
                      <SmallButton
                        textButton={"Ver mas"}
                        actionButton={verProximaPagina}
                        isDisabled={paginaBusqueda >= cantidadPaginasBusqueda}
                      />
                    </TableCell>
                  </TableRow>
                )}


              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper
          elevation={1}
          sx={{
            background: "#859398",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "5px",
            width: "99%",
            // maxHeight: (System.getInstance().getWindowHeight() / 2),
            // overflow: "auto",
          }}
        >
          <TableContainer
            component={Paper}
          // style={{
          //   overflowX: "auto"
          // }}
          >
            <Table>
              <TableHead sx={{
                background: "#859398",
                // height: "30%"
                // height: "60px"
              }}>
                <TableRow>
                  <TableCell sx={{
                    textAlign: "center"
                  }}>Cantidad</TableCell>
                  <TableCell></TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Eliminar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{
                // maxHeight: "400px",
                // maxHeight: "200px",
                // overflowY: "auto"


              }}>
                {salesData.map((productx, indexx, all) => {

                  var index = indexx
                  if (ModelConfig.get("ordenMostrarListado") == OrdenListado.Descendente) {
                    index = all.length - 1 - indexx
                  }

                  const product = all[index]

                  return (
                    <SoldProductItem
                      product={product}
                      itemIndex={index}
                      key={index}
                    />
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
        </Paper>
        {/* <Paper
            sx={{
              width: "99%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "21px",
              margin: "5px",
            }}
            elevation={18}
          >
            <Typography sx={{ fontSize: "25px", }}>Total: ${System.getInstance().en2Decimales(grandTotal)}</Typography>
          </Paper> */}
      </Grid>
    </Paper>

  );
};

export default BoxProducts;
