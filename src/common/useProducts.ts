import { useQuery } from "react-query";
import { Product } from "../types/types";
import { conf } from "./config";

const fetchProducts = async (productId?: number) => {
  const response = await fetch(
    `${conf.API_URL}/product/${productId ? productId : "list"}`
  );
  return response.json();
};
export default function useProducts(productId?: number, parameters?: any) {
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery<Product[] | Product>(
    "products",
    () => fetchProducts(Number(productId)),
    parameters
  );
  return {
    products,
    isLoading,
    isError,
    refetch,
  };
}
