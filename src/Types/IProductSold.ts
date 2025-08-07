import IProduct from "./IProduct";

interface IProductSold extends IProduct {
    quantity: number,
    total: number,

    ocultarEnListado: boolean | undefined
    esAgregado: boolean | undefined
};

export default IProductSold;