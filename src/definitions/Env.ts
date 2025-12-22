import productoSinImagenLocal from './../assets/producto-sin-imagen.jpg'

export const Env = {
    urlBase: (import.meta.env.VITE_URL_BASE),
    licencia: (import.meta.env.VITE_CLIENTE),
    unidadNegocio: (import.meta.env.VITE_UNIDAD_NEGOCIO),
    productoSinImagen: productoSinImagenLocal,
}


export default Env