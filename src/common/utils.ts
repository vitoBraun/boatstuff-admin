import { ICategory, Product } from "../types/types";
import { conf } from "./config";

export function convertArrayToString(array: string[]): string {
  return array?.join(",");
}

export function convertStringToArray(string: string): string[] {
  if (string === "") {
    return []; // Return an empty array
  }
  return string?.split(",");
}

export function makeImgUrl(url: string) {
  return `${conf.API_URL}${url}`;
}

export const prepareData = (data: Product) => {
  const dataCopy = { ...data };
  if (dataCopy.id && typeof dataCopy.id === "string") {
    dataCopy.id = Number(dataCopy.id);
  }
  if (dataCopy.price && typeof dataCopy.price === "string") {
    dataCopy.price = Number(dataCopy.price);
  }
  dataCopy.images = convertArrayToString(dataCopy.images as string[]);
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
