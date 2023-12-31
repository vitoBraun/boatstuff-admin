export type ICategory = {
  id?: number;
  title: string;
  description: string;
  subcategories?: Subcategory[];
};

export type Subcategory = {
  id?: number;
  title: string;
  description: string;
  categoryId: number | null;
};

export type Product = {
  id?: number;
  title: string;
  shortDescription: string;
  description: string;
  price: number | null;
  isNew: boolean;
  isAvailable: boolean;
  subcategoryId: number | null;
  categoryId: number | null;
  images?: string | string[];
};
