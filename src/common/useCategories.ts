import { useQuery } from "react-query";
import { ICategory } from "../types/types";
import { conf } from "./config";

const fetchProducts = async () => {
  const response = await fetch(`${conf.API_URL}/category/list/`);
  return response.json();
};
export default function useCategories() {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<ICategory[]>("categories", () => fetchProducts(), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  return {
    categories,
    isLoading,
    isError,
  };
}
