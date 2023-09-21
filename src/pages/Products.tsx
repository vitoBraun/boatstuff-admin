import React, { ReactElement, memo, useState, } from "react";
import { useProducts } from "../common/useProducts";
import { Product } from "../types/types";
import { useNavigate } from 'react-router-dom';
import { convertStringToArray, makeImgUrl } from "../common/utils";
import { conf } from "../common/config";



function Products() {
  const { isLoading, isError } = useProducts({
    parameters: {
      onSuccess: (products: Product[]) => {
        const transformedProducts = products?.map(product => ({ ...product, images: convertStringToArray(product.images as string) }))
        setFetchedProducts(transformedProducts)
      }
    }
  });

  const [fetchedProducts, setFetchedProducts] = useState<Product[]>()
  const navigate = useNavigate();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  const Headers = [
    "id",
    "image",
    "title",
    "short description",
    "availability",
    "subcategory",
    "price",
  ];

  const Cell = ({
    text,
  }: {
    text?: string | number | ReactElement | string[] | null;
  }): ReactElement => {
    return (
      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {text}
      </td>
    );
  };
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-white border-b">
                <tr>
                  {Headers.map((header) => (
                    <th key={header}
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(fetchedProducts as Product[])?.map((product) => (
                  <tr key={product.id}
                    className="bg-gray-100 border-b hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                    }}
                  >
                    <Cell text={product.id} />
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {product.images?.length ? <img className="max-h-10" src={makeImgUrl(product?.images?.[0])} alt="pic" /> : null}
                    </td>
                    <Cell text={product.title} />
                    <Cell text={product.shortDescription} />
                    <Cell text={product.isAvailable ? "YES" : "NO"} />
                    <Cell text={product.subcategoryId} />
                    <Cell text={product.price} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <button className="block rounded-xl border p-3 border-gray-500 disabled:text-gray-400 bg-green-200 w-1/2" onClick={() => { navigate('/product') }}>Add new product</button>
    </div>
  );
}

export default memo(Products)
