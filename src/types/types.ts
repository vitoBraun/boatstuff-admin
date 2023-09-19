export type ICategory = {
  id: number;
  title: string;
  description: string;
  level: number;
};

export type Product = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  isNew: boolean;
  isAvailable: boolean;
  categories: ICategory[];
  images?: string[];
};
