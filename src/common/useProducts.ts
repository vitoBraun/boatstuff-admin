import { useQuery } from "react-query";
import { Product } from "../types/types";
import { conf } from "./config";

const fetchProducts = async () => {
  const response = await fetch(`${conf}/product/list`);
  return response.json();
};
export default function useProducts() {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<Product[]>("products", fetchProducts);
  return {
    products,
    isLoading,
    isError,
  };
}
