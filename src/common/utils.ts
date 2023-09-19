import { Product } from "../types/types";

export const prepareData = (data: Product) => {
    const dataCopy = { ...data }
    if (dataCopy.id && typeof dataCopy.id === 'string') {
      dataCopy.id = Number(dataCopy.id);
    }
    if (dataCopy.price && typeof dataCopy.price === 'string') {
      dataCopy.price = Number(dataCopy.price);
    }
    return dataCopy;
  }
  