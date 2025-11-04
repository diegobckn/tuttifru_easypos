import dayjs from "dayjs";
import TiposPasarela from "./TiposPasarela";
import MetodosPago from "./MetodosPago";
import ModosTrabajoConexion from "./ModosConexion";
import OrdenListado from "./OrdenesListado";
import EmitirDetalle from "./EmisionesDetalle";
import ModosImpresion from "./ModosImpresion";
import Env from "./Env";

const BaseConfig = {
    urlBase: Env.urlBase,
    licencia: Env.licencia,
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

    checkOfertas: false,
    refreshInfoEspejo: 3,
    reflejarInfoEspejo: false,
    
    trabajarConApp: false,
    
    crearProductoNoEncontrado: true,
    pedirAutorizacionParaAplicarDescuentos: true,
};

export default BaseConfig;