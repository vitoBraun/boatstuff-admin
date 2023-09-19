import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { ICategory, Product } from '../types/types'
import { useFormik } from 'formik';
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from '../common/useProducts';
import useCategories from '../common/useCategories';
import { TextArea, TextField } from './TextComponents';

function getCategoryBySubcategoryId(categories: ICategory[], subcategoryId: number) {
  for (const category of categories) {
    const subcategories = category.subcategories;
    for (const subcategory of subcategories) {
      if (subcategory.id === subcategoryId) {
        return category.id;
      }
    }
  }

  return null;
}
const prepareData = (data: Product) => {
  const dataCopy = { ...data }
  if (dataCopy.id && typeof dataCopy.id === 'string') {
    dataCopy.id = Number(dataCopy.id);
  }
  if (dataCopy.price && typeof dataCopy.price === 'string') {
    dataCopy.price = Number(dataCopy.price);
  }
  return dataCopy;
}

const updateProduct = async (productData: Product) => {
  const response = await fetch('http://localhost:1333/product', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(prepareData(productData)),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Something went wrong');
  }
  return data;
}

const createNewProduct = async (newData: Product) => {
  const response = await fetch('http://localhost:1333/product/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(prepareData(newData)),
  });

  const data = await response.json();
  return data;
};

export default function ProductEditPage({ initialValues }: { initialValues?: Product }) {
  const { id } = useParams();
  const NumberId = id ? Number(id) : undefined
  const navigate = useNavigate();
  const defaultValues: Product = {
    id: undefined,
    title: '',
    shortDescription: '',
    description: '',
    price: null,
    isNew: true,
    isAvailable: true,
    subcategoryId: null,
    categoryId: null
  }

  const { product, isLoading, isError, refetch } = useProduct({
    productId: NumberId!, parameters: {
      enabled: id !== undefined,
      // staleTime: Infinity,
      cacheTime: 0,
    }
  })


  const { categories: fetchedCategories } = useCategories()

  const [fetchetProduct, setFetchedProduct] = useState<Product>(defaultValues)

  const hasLoaded = useRef(false)

  const handleFieldChange = function (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) { setFetchedProduct(prev => ({ ...prev, [e.target.name]: e.target.value })) }


  const formik = useFormik({
    initialValues: defaultValues,
    enableReinitialize: true,
    onSubmit: () => {
      if (NumberId) {
        updateProduct(fetchetProduct).then((data) => {
          // refetch()
          navigate('/products')
        }
        ).catch((error) => {
          alert(error.message)
        });


      }
      else {
        createNewProduct(fetchetProduct).then((data) => { navigate('/products') }
        ).catch((error) => {
          alert(error.message)
        });
      }

    }
  });


  useEffect(() => {
    if (!hasLoaded.current) {

      if (product) {
        setFetchedProduct(product)
        formik.setValues(product)
        hasLoaded.current = true
      }
    }

  }, [product])

  useEffect(() => {
    if (fetchedCategories && fetchetProduct.subcategoryId) {
      const resId = getCategoryBySubcategoryId(fetchedCategories, fetchetProduct.subcategoryId)
      setFetchedProduct(prev => ({ ...prev, categoryId: resId }))
    }
  }, [fetchedCategories, fetchetProduct.subcategoryId])


  console.log(formik.values)

  if (isLoading) return <div> LOADING...</div>

  if (isError) return <div> ERROR </div>



  const subcategories = fetchedCategories?.find(cat => cat.id === fetchetProduct.categoryId)?.subcategories

  return (
    <div className="flex flex-col justify-center items-center h-[100vh]">
      <h2>{!id ? 'Create' : 'Edit'} product {id ? `'№${id}` : ''} {fetchetProduct.title ?? ""}</h2>
      <form className="px-20 w-1/2" onSubmit={formik.handleSubmit}>
        <TextField name="title" label="Title" value={fetchetProduct.title} onChange={handleFieldChange} />
        <TextField name="shortDescription" label="Short description" value={fetchetProduct.shortDescription} onChange={handleFieldChange} />
        <TextArea name="description" label="Description" value={fetchetProduct.description} onChange={handleFieldChange} />
        <TextField name="price" label="Price" value={fetchetProduct.price} onChange={handleFieldChange} />

        <label htmlFor="categoryId" className="text-sm text-navy-700 font-bold">Category</label>
        <select name="categoryId" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-500" value={fetchetProduct.categoryId ?? ''} onChange={(e) => {
          setFetchedProduct(prev => ({ ...prev, categoryId: Number(e.target.value) }))
        }}>

          {fetchedCategories?.length && fetchedCategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
        </select>

        <label htmlFor="subcategoryId" className="text-sm text-navy-700 font-bold">Subcategory</label>
        <select value={fetchetProduct.subcategoryId ?? ''} name="subcategoryId" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-500" onChange={(e) => {
          setFetchedProduct(prev => ({ ...prev, subcategoryId: Number(e.target.value) }))
        }}>
          {subcategories?.length && subcategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
        </select>
        <div className='block'>
          <label className="inline-flex items-center mt-3">
            <input name="isNew" onChange={(e) => { setFetchedProduct(prev => ({ ...prev, isNew: !prev.isNew })) }} type="checkbox" className="form-checkbox h-5 w-5 text-red-600" checked={fetchetProduct.isNew} /><span className="ml-2 text-gray-700" >New Product</span>
          </label></div>
        <div className='block'>
          <label className="inline-flex  items-center mt-3">
            <input name="isAvailable" checked={fetchetProduct.isAvailable} onChange={(e) => { setFetchedProduct(prev => ({ ...prev, isAvailable: !prev.isAvailable })) }} type="checkbox" className="form-checkbox h-5 w-5 tsext-red-600" /><span className=" ml-2 text-gray-700">Available</span>
          </label></div>
        <button className="block rounded-xl border p-3 border-gray-500 disabled:text-gray-400" >Save</button>
      </form>
    </div >
  )
}
