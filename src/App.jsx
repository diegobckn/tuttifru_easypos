/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PuntoVenta from "./Pages/PuntoVenta";
import PreVenta from "./Pages/PreVenta";
import EspejoPuntoVenta from "./Pages/EspejoPuntoVenta";
import SinLicencia from "./Pages/SinLicencia";
import Login from "./Pages/Login";
import EstadosDePedidos from "./Pages/EstadosDePedidos";
import PreparacionPedidos from "./Pages/PreparacionPedidos";
import VentasVolantes from "./Pages/VendedoresVolantes";
import GenerarNumeroAtencion from "./Pages/GenerarNumeroAtencion";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { SelectedOptionsProvider } from "./Components/Context/SelectedOptionsProvider";
import { ProviderModales } from "./Components/Context/ProviderModales";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ProviderModales>
          <SelectedOptionsProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/punto-venta" element={<PuntoVenta />} />
              <Route path="/espejo-punto-venta" element={<EspejoPuntoVenta />} />
              <Route path="/pre-venta" element={<PreVenta />} />
              <Route path="/sin-licencia" element={<SinLicencia />} />
              <Route path="/estados-pedidos" element={<EstadosDePedidos />} />
              <Route path="/preparacion-pedidos" element={<PreparacionPedidos />} />
              <Route path="/vendedores-volantes" element={<VentasVolantes />} />
              <Route path="/generar-numero-atencion" element={<GenerarNumeroAtencion />} />
            </Routes>
          </SelectedOptionsProvider>
        </ProviderModales>
      </LocalizationProvider>
    </Router>
  );
}

export default App;
