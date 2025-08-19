import dayjs from "dayjs";
import TiposPasarela from "./TiposPasarela";
import MetodosPago from "./MetodosPago";

export const OrdenListado = {
    Ascendente: 1,
    Descendente: 2
}

export const EmitirDetalle = {
    NUNCA: 1,
    SIEMPRE: 2,
    PREGUNTAR: 3
}

export const ModosTrabajoConexion = {
    SOLO_OFFLINE: 1,
    SOLO_ONLINE: 3,
    OFFLINE_INTENTAR_ENVIAR: 2,
    PREGUNTAR: 4,
}

export const ModosImpresion = {
    IMPRESORA_PREDETERMINADA: 1,
    SERVIDOR: 2,
}

export const TiposDescuentos = {
    PORCENTAJE: 1,
    MONTO: 2,
}

export const TiposProductos = [
    {
        "idTipo": 1,
        "descripcion": "Normal"
    },
    {
        "idTipo": 2,
        "descripcion": "Pesable"
    }
]

const BaseConfig = {
    urlBase: (import.meta.env.VITE_URL_BASE),
    licencia: (import.meta.env.VITE_CLIENTE),
    sesionStart: dayjs().format('DD/MM/YYYY-HH:mm:ss'),
    sesionExprire: 2 * 60 * 1000, //en milisegundos

    codBalanza: "250", //
    largoIdProdBalanza: 4, //
    largoPesoBalanza: 5, //
    digitosPesoEnterosBalanza: 1, //

    codBalanzaVentaUnidad: "270", //
    largoIdProdBalanzaVentaUnidad: 4, //
    largoPesoBalanzaVentaUnidad: 5, //

    cantidadProductosBusquedaRapida: 20,

    showPrintButton: false,
    delayBetwenPrints: "1",//in seconds
    sucursal: "-1",
    sucursalNombre: "",
    puntoVenta: "-1",
    puntoVentaNombre: "",
    afterLogin: TiposPasarela.CAJA,

    delayCloseWindowPrints: "0.3",//in seconds
    widthPrint: "80px",
    modoImpresion: ModosImpresion.IMPRESORA_PREDETERMINADA,
    buttonDelayClick: 1500, //en milisegundos

    suspenderYRecuperar: true,
    pedirDatosTransferencia: false,
    pagarConCuentaCorriente: true,

    pedirPermisoBorrarProducto: false,
    permitirVentaPrecio0: false,
    cantidadTicketImprimir: 1,


    ordenMostrarListado: OrdenListado.Descendente,

    verBotonPreventa: true,
    verBotonEnvases: true,
    verBotonPagarFactura: true,
    detectarPeso: false,

    permitirAgregarYQuitarExtras: false,
    agruparProductoLinea: true,
    fijarFamilia: false,
    fijarBusquedaRapida: false,

    emitirBoleta: true,
    tienePasarelaPago: true,
    excluirMediosEnBoleta: [
        // MetodosPago.EFECTIVO,
        // MetodosPago.TRANSFERENCIA,
        // MetodosPago.CUENTA_CORRIENTE
    ],
    trabajarConComanda: false,

    abirTecladosTouchSiempre: true,
    urlServicioDeteccionPeso: "ws://localhost:8765",
    urlServicioImpresion: "ws://localhost:8760",
    urlServicioImpresionComanda: "ws://localhost:8760",

    puertoImpresiones: "COM6",
    puertoImpresionComanda: "COM6",
    zoomImpresiones: "1.2",
    zoomImpresionComanda: "1.2",

    emitirDetalle: EmitirDetalle.SIEMPRE,
    conNumeroAtencion: false,
    modoTrabajoConexion: ModosTrabajoConexion.SOLO_ONLINE,

    imprimirPapelComanda: EmitirDetalle.SIEMPRE,
    modoImpresionComanda: ModosImpresion.IMPRESORA_PREDETERMINADA,

    checkOfertas: false

};

export default BaseConfig;