/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React,{useState} from 'react'


export const BotonSuspender = () => {
  const [selectedSaleEntry, setSelectedSaleEntry] = useState(salesData);

  const handleSuspenderVenta = async () => {
    setSelectedSaleEntry();

    setOpenDescriptionDialog(true);
    try {
      // Verificar si hay algún producto en la venta antes de suspender
      if (salesData.length > 0) {
        // Assuming you want the productInfo from the first item in salesData
        const productInfo = salesData[0];

        // Assuming you want the selectedQuantity from the sum of quantities in salesData
        const currentSelectedQuantity = salesData.reduce(
          (total, sale) => total + sale.quantity,
          0
        );

        // Use setProductInfo and setSelectedQuantity to update the context values
        setProductInfo(productInfo);
        setSelectedQuantity(currentSelectedQuantity);

        // Lógica para suspender la venta
        await suspenderVenta(productInfo, currentSelectedQuantity);

        // Puedes realizar otras acciones después de suspender la venta si es necesario
      } else {
        console.warn("No hay productos en la venta para suspender.");
      }
    } catch (error) {
      console.error("Error al suspender la venta:", error);
      // Manejar errores en caso de que la solicitud falle
    }
  };
  return (
    <div>BotonSuspender</div>
  )
}

