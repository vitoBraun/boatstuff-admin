import { useQuery } from "react-query";
import { ICategory } from "../types/types";
import { fetchCategories } from "./ApiService";

export default function useCategories() {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<ICategory[]>("categories", () => fetchCategories(), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  return {
    categories,
    isLoading,
    isError,
  };
}
