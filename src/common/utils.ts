import { ICategory, Product } from "../types/types";

export const prepareData = (data: Product) => {
  const dataCopy = { ...data };
  if (dataCopy.id && typeof dataCopy.id === "string") {
    dataCopy.id = Number(dataCopy.id);
  }
  if (dataCopy.price && typeof dataCopy.price === "string") {
    dataCopy.price = Number(dataCopy.price);
  }
  return dataCopy;
};

export function getCategoryBySubcategoryId(
  categories: ICategory[],
  subcategoryId: number
) {
  for (const category of categories) {
    const subcategories = category.subcategories;
    for (const subcategory of subcategories!) {
      if (subcategory.id === subcategoryId) {
        return category.id;
      }
    }
  }

  return null;
}
