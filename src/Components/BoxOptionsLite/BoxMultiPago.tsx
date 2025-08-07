import React, { useContext, useState, useEffect } from "react";
import {
  Grid,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";
import BoxSelectPayMethod from "./BoxSelectPayMethod"
import BotonClienteOUsuario from "../ScreenDialog/BotonClienteOUsuario";
import BuscarUsuario from "../ScreenDialog/BuscarUsuario";
import Client from "../../Models/Client";
import PagoTransferencia from "../ScreenDialog/PagoTransferencia";
import ModelConfig from "../../Models/ModelConfig";
import Product from "../../Models/Product";

import TPago from '../../Types/TPago'

const BoxMultiPago = ({
  pagarCon,
  setPagarCon,
  vuelto,
  setVuelto,
  redondeo,
  setRedondeo,
  descuentos,
  totalVentas,
  totalYDescuentoYRedondeo,
  setTotalYDescuentoYRedondeo,
  yaApretoPrimeraTecla,
  setYaApretoPrimerTecla,
  pagos,
  setPagos,
  totalPagos,
  setTotalPagos,
  setAplicaRedondeo,
  setFaltaPagar,
  setTotalFinal,
  excluirMetodos = [],
  paraFactura = false
}) => {
  const {
    cliente,
    setCliente,
    setAskLastSale,
    setShowDialogSelectClient,
    showAlert,
  } = useContext(SelectedOptionsContext);

  // DECLARACIONES
  // DECLARACIONES


  const [metodoPago, setMetodoPago] = useState("");



  const [showSelectClientUser, setShowSelectClientUser] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [showDialogSelectUser, setShowDialogSelectUser] = useState(false);
  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);


  // ACCIONES
  // ACCIONES
  const agregarPago = (pagoNuevo: TPago) => {
    if (pagoNuevo.montoMetodoPago <= 0) return
    // console.log("agregarPago")
    // console.log("pagoNuevo",pagoNuevo)
    setTotalPagos(totalPagos + pagoNuevo.montoMetodoPago)
    setPagos([...pagos, pagoNuevo])
  }

  const confirmPagoTransferencia = (dataTransferencia) => {
    agregarPago({
      "montoMetodoPago": parseFloat(pagarCon),
      "metodoPago": "TRANSFERENCIA",
      "transferencia": dataTransferencia
    } as TPago)

    setMetodoPago("")
    setPagarCon(0)

    // console.log("cambio yaApretoPrimeraTecla cuando hace pago transferencia")
    setYaApretoPrimerTecla(false)
  }

  const confirmSelectUser = (dataUser) => {
    agregarPago({
      "montoMetodoPago": parseFloat(pagarCon),
      "metodoPago": "CUENTACORRIENTE",
      "data": dataUser
    } as TPago)

    // console.log("datauser", dataUser)
    setMetodoPago("")
    setPagarCon(0)
    setUsuario(null)
  }

  const confirmSelectClient = (dataClient) => {
    // console.log("confirmSelectClient")
    // console.log("dataClient", dataClient)
    agregarPago({
      "montoMetodoPago": parseFloat(pagarCon),
      "metodoPago": "CUENTACORRIENTE",
      "data": dataClient
    } as TPago)

    setMetodoPago("")
    if (!paraFactura) {
      setCliente(null)
    }
    setPagarCon(0)

    // console.log("cambio yaApretoPrimeraTecla cuando hace pago cc cliente")
    setYaApretoPrimerTecla(false)

  }

  const confirmarPagoEfectivo = (nuevoMonto) => {
    var yaTenia1 = false

    var totalPagosx = 0
    var totalEfectivo = 0
    const copiaPagos = System.clone(pagos)
    pagos.forEach((pago, ix) => {
      if (pago.metodoPago === "EFECTIVO") {
        totalEfectivo = copiaPagos[ix].montoMetodoPago + nuevoMonto
        copiaPagos[ix].montoMetodoPago = totalEfectivo + Product.logicaRedondeoUltimoDigito(totalEfectivo)
        yaTenia1 = true
      }
      totalPagosx += copiaPagos[ix].montoMetodoPago
    })

    if (yaTenia1) {
      setPagos([...copiaPagos])
      setTotalPagos(totalPagosx)
    } else {
      agregarPago({
        "montoMetodoPago": nuevoMonto + Product.logicaRedondeoUltimoDigito(nuevoMonto),
        "metodoPago": "EFECTIVO"
      } as TPago)
      totalPagosx += nuevoMonto
    }

    // setTotalYDescuentoYRedondeo(totalVentas - descuentos + logicaRedondeo(totalVentas - descuentos))
    setMetodoPago("")
    setPagarCon(0)

    // console.log("cambio yaApretoPrimeraTecla cuando confirma pago efectivo")
    setYaApretoPrimerTecla(false)

  }


  const confirmarPagoTarjeta = (tipo) => {
    agregarPago({
      "montoMetodoPago": parseFloat(pagarCon),
      "metodoPago": "TARJETA",
      "tipoTarjeta": tipo
    } as TPago)

    setTotalYDescuentoYRedondeo(totalVentas - descuentos)
    setMetodoPago("")
    setPagarCon(0)

    // console.log("cambio yaApretoPrimeraTecla cuando confirma pago con tarjeta")
    setYaApretoPrimerTecla(false)
  }



  const checkPayMethod = (metodoPago) => {
    // console.log("checkPayMethod")
    // console.log("metodoPago",metodoPago)
    setMetodoPago(metodoPago)
    if (metodoPago == "EFECTIVO") {
      confirmarPagoEfectivo(parseFloat(pagarCon))
    } else {
      // setVuelto(0);
      setRedondeo(0)
      setTotalYDescuentoYRedondeo(totalVentas - descuentos)

      const maximo = totalVentas - descuentos
      var correccionMontoAPagar = parseInt(pagarCon) + 0

      if (parseInt(pagarCon) + totalPagos > maximo) {
        showAlert("No se puede pagar mas del maximo. Se corregira a $" + (maximo - totalPagos))
        correccionMontoAPagar = maximo - totalPagos
        setPagarCon(correccionMontoAPagar)
        setMetodoPago("")
        return
      }

      if (metodoPago == "CUENTACORRIENTE") {
        if (!cliente) {
          setShowSelectClientUser(true)//mostrar alert
        } else {
          confirmSelectClient(cliente)
        }
      } else if (metodoPago == "TRANSFERENCIA") {

        if (ModelConfig.get("pedirDatosTransferencia")) {
          setOpenTransferenciaModal(true);
        } else {
          confirmPagoTransferencia({
            "idCuentaCorrientePago": 0,
            "nombre": "string",
            "rut": "string",
            "banco": "string",
            "tipoCuenta": "string",
            "nroCuenta": "string",
            "fecha": "1999-01-01T00:00:00.000Z",
            "nroOperacion": "string"
          })
        }
        // setVuelto(0);
        // setPagarCon(totalYDescuentoYRedondeo - totalPagos)
      } else if (metodoPago == "CREDITO" || metodoPago == "DEBITO") {
        confirmarPagoTarjeta(metodoPago);
        // setVuelto(0);
        // setPagarCon(totalYDescuentoYRedondeo - totalPagos)
      } else {
        // setVuelto(0);
        // setPagarCon(totalVentas - descuentos + logicaRedondeo(totalVentas - descuentos))
      }
    }
  }

  const onChangePayMethod = (method) => {
    checkPayMethod(method);
  }

  const logicaRedondeo = (total) => {
    if (!total) total = totalVentas - descuentos
    setRedondeo(Product.logicaRedondeoUltimoDigito(total))
    return 0
  }

  const calcularVuelto = () => {
    // const cambio = pagarCon - (grandTotal - descuentos + redondeo);
    var vueltox = 0
    if (totalPagos > totalYDescuentoYRedondeo) {
      vueltox = totalPagos - (totalYDescuentoYRedondeo + redondeo);
    }

    return vueltox;
  };

  const abrirDialogCliente = () => {
    setAskLastSale(false)
    setShowDialogSelectClient(true)
  }

  // OBSERVERS
  // OBSERVERS
  useEffect(() => {
    // console.log("cambio yaApretoPrimeraTecla..cuando inicia multipago")
    setYaApretoPrimerTecla(false)

    if (!paraFactura) {
      setCliente(null)
    }
    setUsuario(null)
  }, []);


  useEffect(() => {
    // console.log("carga inicial")
    if (totalVentas > 0) {
      // setTotalYDescuentoYRedondeo(totalVentas - descuentos + redondeo)
      setTotalYDescuentoYRedondeo(totalVentas - descuentos)
    }
    // console.log("sale carga inicial")
  }, [totalVentas]);

  useEffect(() => {
    // console.log("cambio pagarCon", pagarCon)
    if (pagarCon > totalYDescuentoYRedondeo + 20000) {
      setPagarCon(totalYDescuentoYRedondeo)
      alert("monto incorrecto");
    }

    if (!yaApretoPrimeraTecla && pagarCon > totalYDescuentoYRedondeo) {
      setPagarCon(totalYDescuentoYRedondeo)
    }

  }, [pagarCon]);


  useEffect(() => {
    // console.log("cambio totalPagos", totalPagos)
    // console.log("pagos", pagos)
    if (pagarCon == 0) {
      var nw = totalYDescuentoYRedondeo - totalPagos
      if (nw < 0) nw = 0
      setPagarCon(nw)
    }
    setVuelto(calcularVuelto())

    var aplicaRedondeox = false
    if (totalPagos >= (totalYDescuentoYRedondeo - 10)) {
      pagos.forEach((pago) => {
        if (pago.metodoPago == "EFECTIVO") {
          aplicaRedondeox = true
          logicaRedondeo(pago.montoMetodoPago)
        }
      })
      if (!aplicaRedondeox) setRedondeo(0)
      setAplicaRedondeo(aplicaRedondeox)
    } else {
      setRedondeo(0)
    }
  }, [totalPagos]);

  const pagaConEfectivo = () => {
    var conEfectivo = false
    pagos.forEach((pago) => {
      if (pago.metodoPago == "EFECTIVO") {
        conEfectivo = true
      }
    })
    return conEfectivo
  }

  useEffect(() => {
    setTotalFinal(totalYDescuentoYRedondeo + redondeo)

    if (totalPagos >= totalYDescuentoYRedondeo) {
      setFaltaPagar(0)
    } else {
      const faltaPagarx = totalYDescuentoYRedondeo - totalPagos
      if (faltaPagarx <= 5) {
        if (pagaConEfectivo()) {
          setFaltaPagar(0)
          setRedondeo(-1 * Math.abs(faltaPagarx))
          setPagarCon(0)
        } else {
          setFaltaPagar((totalYDescuentoYRedondeo - totalPagos) + Product.logicaRedondeoUltimoDigito(totalYDescuentoYRedondeo - totalPagos))
          setPagarCon((totalYDescuentoYRedondeo - totalPagos) + Product.logicaRedondeoUltimoDigito(totalYDescuentoYRedondeo - totalPagos))
        }
        // console.log("faltaPagarx", faltaPagarx)
      } else if (pagaConEfectivo()) {

        setFaltaPagar((totalYDescuentoYRedondeo - totalPagos) + Product.logicaRedondeoUltimoDigito(totalYDescuentoYRedondeo - totalPagos))
        setPagarCon((totalYDescuentoYRedondeo - totalPagos) + Product.logicaRedondeoUltimoDigito(totalYDescuentoYRedondeo - totalPagos))
      } else {
        setFaltaPagar((totalYDescuentoYRedondeo - totalPagos))
        setPagarCon((totalYDescuentoYRedondeo - totalPagos))
      }
    }

  }, [totalPagos, redondeo, vuelto, totalYDescuentoYRedondeo]);

  useEffect(() => {

    if (redondeo == 0 && totalPagos > totalYDescuentoYRedondeo) {
      // console.log("caso raro")
      const redondeoVuelto = Product.logicaInversaRedondeoUltimoDigito(vuelto)

      // console.log(" setVuelto( vuelto + redondeoVuelto )")
      // console.log(" setVuelto (  " + vuelto + " + " + redondeoVuelto + " ) ")
      // console.log(" setVuelto (  " + (vuelto + redondeoVuelto) + " ) ")
      // console.log("setRedondeo( redondeoVuelto * -1)")
      // console.log("setRedondeo( " + redondeoVuelto + " * -1)")
      // console.log(" setRedondeo( "+ redondeoVuelto  * -1 + ")") 

      setVuelto(vuelto + redondeoVuelto)
      setRedondeo(redondeoVuelto * -1)
    }


  }, [vuelto]);


  useEffect(() => {
    // setTotalYDescuentoYRedondeo(totalVentas - descuentos + redondeo)
    setTotalYDescuentoYRedondeo(totalVentas - descuentos)
  }, [descuentos]);


  useEffect(() => {
    if (!yaApretoPrimeraTecla && pagarCon == 0) {
      setPagarCon(totalYDescuentoYRedondeo - totalPagos)
    }
  }, [totalYDescuentoYRedondeo]);



  useEffect(() => {
    setShowDialogSelectUser(false)
    setShowSelectClientUser(false)
    if (usuario != null) {
      setCliente(null)
      Client.getInstance().sesion.truncate();
      confirmSelectUser(usuario)
    }
  }, [usuario]);

  useEffect(() => {
    setShowDialogSelectClient(false)
    setShowSelectClientUser(false)
    if (cliente != null && metodoPago == "CUENTACORRIENTE") {
      setUsuario(null)
      confirmSelectClient(cliente)
    }
  }, [cliente]);



  return (
    <>
      <BotonClienteOUsuario
        setOpenDialog={setShowSelectClientUser}
        openDialog={showSelectClientUser}
        onSelect={(opcion) => {
          if (opcion == "cliente") {
            abrirDialogCliente()
          } else {
            setShowDialogSelectUser(true)
          }
        }}
      />

      <BuscarUsuario
        setOpenDialog={setShowDialogSelectUser}
        openDialog={showDialogSelectUser}
        onSelect={(usuario) => {
          setUsuario(usuario)
        }}
      />
      <Grid container spacing={2} style={{
        marginLeft: "-20px",
        padding: "20px",
      }}>

        <Grid item xs={12} sm={12} md={8} lg={8}>
          <BoxSelectPayMethod
            metodoPago={metodoPago}
            onChange={onChangePayMethod}
            excludes={excluirMetodos}
          />
        </Grid>

      </Grid>

      <PagoTransferencia
        openDialog={openTransferenciaModal}
        setOpenDialog={setOpenTransferenciaModal}
        onConfirm={(data) => {
          // console.log("onConfirm ", data)

          confirmPagoTransferencia(data)
        }}
      />
    </>
  );
};

export default BoxMultiPago;
