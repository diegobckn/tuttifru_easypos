import IProductSold from "./IProductSold";

type TExtra = {
    agregar: IProductSold[];
    quitar: IProductSold[];
    entrega: string;
}

export const EXTRA_ENTREGA = {
    SERVIR : "SERVIR",
    LLEVAR: "LLEVAR"
}

export const extraDefault = {
    agregar: [],
    quitar: [],
    entrega: ""
}

export const extraDefaultLlevar = extraDefault
extraDefaultLlevar.entrega = EXTRA_ENTREGA.LLEVAR

export const extraDefaultServir = extraDefault
extraDefaultLlevar.entrega = EXTRA_ENTREGA.SERVIR

export default TExtra