import React, { useState, useContext, useEffect } from "react";
import BoxFamilias from "./BoxFamilias";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BoxProductoFamilia = ({
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


  const handleSelectProduct = (product) => {
    addToSalesData(product)
  }

  return (
    <BoxFamilias onSelect={handleSelectProduct} />
  );
};

export default BoxProductoFamilia;
