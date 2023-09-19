import React, { ChangeEvent, useEffect, useState } from 'react'
import { Product } from '../types/types'
import { useFormik } from 'formik';
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from '../common/useProducts';
import useCategories from '../common/useCategories';
import { TextArea, TextField } from './TextComponents';
import { createNewProduct, deleteProduct, updateProduct } from '../common/ApiService';
import { getCategoryBySubcategoryId } from '../common/utils';
import { useMutation, useQueryClient } from 'react-query';


export default function ProductEditPage() {
  const queryClient = useQueryClient()
  const { id } = useParams();
  const NumberId = id ? Number(id) : undefined
  const isEditPage = typeof id === 'string'
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

  const { categories: fetchedCategories } = useCategories()

  const [fetchetProduct, setFetchedProduct] = useState<Product>(defaultValues)

  const { isLoading, isError, } = useProduct({
    productId: NumberId!, parameters: {
      enabled: id !== undefined,
      cacheTime: 0,
      staleTime: Infinity,
      onSuccess: (data: Product) => {
        setFetchedProduct(data)
      }
    }
  })
  const subcategories = fetchedCategories?.find(cat => cat.id === fetchetProduct.categoryId)?.subcategories

  console.log(subcategories)


  const { mutateAsync: createProductMutation } = useMutation({
    mutationFn: () => createNewProduct(fetchetProduct),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
    }
  })
  const { mutateAsync: updateProductMutation } = useMutation({
    mutationFn: () => updateProduct(fetchetProduct),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
    }
  })
  const { mutateAsync: deleteProductMutation } = useMutation({
    mutationFn: () => deleteProduct(id!),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
    }
  })
  const handleFieldChange = function (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) { setFetchedProduct(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  const handleDeleteProduct = async () => {
    // eslint-disable-next-line no-restricted-globals
    const userResponse = confirm("Are you fucking sure you want to delete this item??");
    userResponse && deleteProductMutation().then(() => {
      navigate('/products')
    }).catch((error) => { alert(error); });
  }

  const formik = useFormik({
    initialValues: defaultValues,
    enableReinitialize: true,
    onSubmit: async () => {
      if (NumberId) {
        updateProductMutation().then(() => navigate('/products')).catch((error) => {
          alert(error.message)
        });
      }
      else {
        createProductMutation().then(() => navigate('/products'))
          .catch((error) => {
            alert(error.message)
          });
      }

    }
  });


  useEffect(() => {
    if (fetchedCategories && fetchetProduct.subcategoryId) {
      const resId = getCategoryBySubcategoryId(fetchedCategories, fetchetProduct.subcategoryId)
      setFetchedProduct(prev => ({ ...prev, categoryId: resId }))
    }
  }, [fetchedCategories, fetchetProduct.subcategoryId])

  if (isLoading) return <div> LOADING...</div>

  if (isError) return <div> ERROR </div>

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        <div className=" justify-center w-full  items-center px-20 pt-20 pb-20">
          <form onSubmit={formik.handleSubmit}>
            <h2 className="pb-10 text-xl font-bold ">{!id ? 'Create' : 'Edit'} product {id ? `'№${id}` : ''} {fetchetProduct.title ?? ""}</h2>
            <button className="block hover:border-white rounded-xl border p-3 border-gray-500 disabled:text-gray-400" onClick={() => { navigate('/products') }}>To the products list</button>

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

            <button className="block rounded-xl border p-3 border-gray-500 disabled:text-gray-400" type="submit" >Save</button>

            {isEditPage && <button onClick={handleDeleteProduct} className="block rounded-xl border p-3 border-gray-500 disabled:text-gray-400 bg-red-200" >Delete product</button>}
          </form ></div>
        <div className="w-1/2 justify-center w-full flex-col items-center px-20 pt-20 pb-20">
          <form >
            <h1 className="pb-10 text-xl font-bold">Categories Edit</h1>
            <TextField name="newCategoryName" label="Add New Category" />
            <button onClick={() => { }} className="block rounded-xl border p-3 border-gray-500 disabled:text-gray-400 bg-green-200" >Add Category</button>

            <TextField name="newSubcategoryName" label={`Add Subcategory for selected Category: ${fetchedCategories?.find(cat => cat.id === fetchetProduct?.categoryId)?.title}`} />
            <button onClick={() => { }} className="block rounded-xl border p-3 border-gray-500 disabled:text-gray-400 bg-green-200" >Add SubCategory</button>

            <button onClick={() => { }} className="block rounded-xl border p-3 border-gray-500 disabled:text-gray-400 bg-red-200" >Delete Selected Category</button>
            <button onClick={() => { }} className="block rounded-xl border p-3 border-gray-500 disabled:text-gray-400 bg-red-200" >Delete Selected SubCategory</button>
          </form>
        </div >
      </div >
    </>
  )
}
