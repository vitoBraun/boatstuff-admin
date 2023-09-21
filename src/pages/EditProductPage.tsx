import React, { ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { ICategory, Product, Subcategory } from '../types/types'
import { useFormik } from 'formik';
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from '../common/useProducts';
import useCategories from '../common/useCategories';
import { TextArea, TextField } from '../components/TextComponents';
import { createNewCategory, createNewProduct, createNewSubcategory, deleteCategory, deleteProduct, deleteSubcategory, logout, updateProduct } from '../common/ApiService';
import { convertStringToArray, getCategoryBySubcategoryId } from '../common/utils';
import { useMutation, useQueryClient } from 'react-query';
import ImageUpload from '../components/ImageUpload';
import { conf } from '../common/config';
import ImageCard from '../components/ImageCard';


const defaultValues: Product = {
  id: undefined,
  title: '',
  shortDescription: '',
  description: '',
  price: null,
  isNew: true,
  isAvailable: true,
  subcategoryId: null,
  categoryId: null,
  images: []
}

const defaultNewCategoryValues = {
  title: '',
  description: ''
}

const defaultNewSubcategoryValues = {
  title: '',
  description: '',
  categoryId: null
}

function EditProductPage() {
  const queryClient = useQueryClient()
  const { id } = useParams();
  const NumberId = id ? Number(id) : undefined
  const isEditPage = typeof id === 'string'
  const navigate = useNavigate();

  const [fetchedProduct, setFetchedProduct] = useState<Product>(defaultValues)
  const [fetchedCategories, setFetchedCategories] = useState<ICategory[]>([])

  const [newCategory, setNewCategory] = useState<ICategory>(defaultNewCategoryValues)
  const [newSubcategory, setNewSubcategory] = useState<Subcategory>(defaultNewSubcategoryValues)

  const addImageUrl = (image: string) => {
    setFetchedProduct((prev) => {
      return { ...prev, images: (prev.images ?? []).concat(image) || [] }
    })
  }

  const { isLoading, isError, } = useProduct({
    productId: NumberId!, parameters: {
      enabled: id !== undefined,
      cacheTime: 0,
      staleTime: Infinity,
      onSuccess: (data: Product) => {
        data.images = convertStringToArray(data.images as string)
        setFetchedProduct(data)
      }
    }
  })


  const { isLoading: IsCategoriesLoading } = useCategories({
    parameters: {
      staleTime: 0,
      cacheTime: 0,
      onSuccess: (data: ICategory[]) => {
        setFetchedCategories(data)
        const categoryId = getCategoryBySubcategoryId(data, fetchedProduct?.subcategoryId!)
        if (categoryId) {
          setFetchedProduct(prev => ({ ...prev, categoryId }))
        }
      }
    }
  })

  const selectedCategory = useMemo(() => fetchedCategories?.find(cat => cat.id === fetchedProduct?.categoryId), [fetchedCategories,
    fetchedProduct])

  const subcategoriesOfSelectedCategory = useMemo(() => fetchedCategories?.find(cat => cat.id === selectedCategory?.id)?.subcategories, [fetchedCategories,
    selectedCategory])

  const selectedSubCategory = useMemo(() =>
    subcategoriesOfSelectedCategory?.find(subcat => subcat.id === fetchedProduct.subcategoryId)
    , [fetchedProduct, subcategoriesOfSelectedCategory])


  const { mutateAsync: createProductMutation } = useMutation({
    mutationFn: () => createNewProduct(fetchedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      navigate('/products')
    },
    onError: (err) => {
      alert(
        `Bro, there is some error with adding new product, probably empty fields or incorrect data. Product was not added`
      );
    }
  })
  const { mutateAsync: updateProductMutation } = useMutation({
    mutationFn: () => updateProduct(fetchedProduct),
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

  const { mutateAsync: deleteCategoryMutation } = useMutation({
    mutationFn: () => deleteCategory(selectedCategory?.id?.toString()!),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
    },

  })

  const { mutateAsync: deleteSubcategoryMutation } = useMutation({
    mutationFn: () => deleteSubcategory(selectedSubCategory?.id?.toString()!),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
    }
  })

  const { mutateAsync: createCategoryMutation } = useMutation({
    mutationFn: () => createNewCategory(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
      setNewCategory(defaultNewCategoryValues)
    }
  })

  const { mutateAsync: createSubcategoryMutation } = useMutation({
    mutationFn: () =>
      createNewSubcategory(newSubcategory),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
      setNewSubcategory(defaultNewSubcategoryValues)
    }
  })

  const handleFieldChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setFetchedProduct(prev => ({ ...prev, [e.target.name]: e.target.value })) }, [])

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
        createProductMutation()
      }
    }
  });

  const onDeleteImage = useCallback((img: string,) => {
    setFetchedProduct(prev => ({ ...prev, images: (prev.images as string[])?.filter((exisTimg) => exisTimg !== img) }))
  }, [])

  useEffect(() => {
    setNewSubcategory(prev => ({ ...prev, categoryId: Number(selectedCategory?.id) }))
  }, [selectedCategory])

  if (isLoading) return <div className=" justify-center w-full  items-center px-20 pt-20 pb-20">
    <h2 className="pb-10 text-xl font-bold ">LOADING...</h2></div>

  if (isError) return <div className=" justify-center w-full  items-center px-20 pt-20 pb-20">
    <h2 className="pb-10 text-xl font-bold ">ERROR!!</h2></div>

  return (
    <>
      <button className="m-4 block hover:border-white rounded-xl border p-3 border-gray-500 disabled:text-gray-400" onClick={() => {
        logout().finally(() => {
          navigate('/login')
        })
      }}>LOGOUT</button>
      <button className="m-4 block hover:border-white rounded-xl border p-3 border-gray-500 disabled:text-gray-400" onClick={() => { navigate('/products') }}>To the products list</button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        <div className=" justify-center w-full  items-center px-10 pt-20 pb-20">

          <h2 className="pb-10 text-xl font-bold ">{!id ? 'Create' : 'Edit'} product {id ? `'№${id}` : ''} {fetchedProduct.title ?? ""}</h2>

          <TextField name="title" label="Title" value={fetchedProduct.title} onChange={handleFieldChange} />
          <TextField name="shortDescription" label="Short description" value={fetchedProduct.shortDescription} onChange={handleFieldChange} />
          <TextArea name="description" label="Description" value={fetchedProduct.description} onChange={handleFieldChange} />
          <TextField name="price" label="Price" value={fetchedProduct.price} onChange={handleFieldChange} />

          <label htmlFor="categoryId" className="text-sm text-navy-700 font-bold">Category</label>
          <div className="inline-flex w-full h-10 space-x-2">
            <select name="categoryId" className=" w-full items-center justify-center rounded-xl border bg-white/0 p-1 text-sm outline-none border-gray-500" value={selectedCategory?.id ?? ''} onChange={(e) => {
              setFetchedProduct(prev => ({ ...prev, categoryId: Number(e.target.value) }))
            }}>
              {fetchedProduct?.categoryId === null && <option> -- It's not choosen, bro ---</option>}
              {IsCategoriesLoading ? <option>Loadding...</option> : fetchedCategories?.length && fetchedCategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
            </select> <button onClick={() => deleteCategoryMutation()} className="disabled:bg-gray-300 block rounded-xl border p-2 border-gray-500 disabled:text-gray-400 bg-red-200" disabled={!selectedCategory}>Delete</button></div>
          <div className="block">Description: {selectedCategory?.description}</div>


          <label htmlFor="subcategoryId" className="mt-150  text-sm text-navy-700 font-bold">Subcategory</label>
          <div className="inline-flex w-full h-10 space-x-2">
            <select value={selectedSubCategory?.id ?? ''} name="subcategoryId" className="w-full items-center justify-center rounded-xl border bg-white/0 p-1 text-sm outline-none border-gray-500" onChange={(e) => {
              setFetchedProduct(prev => ({ ...prev, subcategoryId: Number(e.target.value) }))
            }}>
              {!selectedSubCategory && <option> -- It's not choosen, bro ---</option>}
              {IsCategoriesLoading ? <option>Loadding...</option> : subcategoriesOfSelectedCategory?.length && subcategoriesOfSelectedCategory.map((cat) => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
            </select>        <button onClick={() => { deleteSubcategoryMutation() }} className="block rounded-xl border p-2 border-gray-500 disabled:bg-gray-200 disabled:text-gray-400 bg-red-200" disabled={!selectedSubCategory?.id}>Delete</button></div>
          <div>Description: {selectedSubCategory?.description}</div>


          <div className='block'>
            <label className="inline-flex items-center mt-3">
              <input name="isNew" onChange={(e) => { setFetchedProduct(prev => ({ ...prev, isNew: !prev.isNew })) }} type="checkbox" className="form-checkbox h-5 w-5 text-red-600" checked={fetchedProduct.isNew} /><span className="ml-2 text-gray-700" >New Product</span>
            </label></div>
          <div className='block'>
            <label className="inline-flex  items-center mt-3">
              <input name="isAvailable" checked={fetchedProduct.isAvailable} onChange={(e) => { setFetchedProduct(prev => ({ ...prev, isAvailable: !prev.isAvailable })) }} type="checkbox" className="form-checkbox h-5 w-5 tsext-red-600" /><span className=" ml-2 text-gray-700">Available</span>
            </label></div>

          <button disabled={!selectedCategory} className="m-5 bg-green-200 inline-block rounded-xl border p-3 border-gray-500 disabled:bg-gray-300" type="submit" onClick={() => formik.submitForm()}>Save Product</button>

          {isEditPage && <button onClick={handleDeleteProduct} className="m-5 bg-red-200 inline-block rounded-xl border p-3 border-gray-500 disabled:bg-gray-300" >Delete product</button>}

          <h2 className="pb-10 text-xl font-bold mt-20">Add Images</h2>
          <ImageUpload setImageUrl={addImageUrl} />
          <div className="grid grid-cols-2 gap-2">
            {Array.isArray(fetchedProduct?.images) && fetchedProduct?.images.map(img =>
              <ImageCard key={img} onDelete={() => onDeleteImage(img)}>
                <img src={`${conf.API_URL}${img}`} alt="item" className="object-cover" />
              </ImageCard >
            )}
          </div>
        </div>

        <div className="w-1 /2 justify-center w-full flex-col items-center px-10 pt-20 pb-20">
          <h1 className="pb-10 text-xl font-bold">Add Category</h1>
          <TextField value={newCategory.title} label="Category Title" onChange={(e) => setNewCategory(prev => ({ ...prev, title: e.target.value }))} />
          <TextField value={newCategory.description} label="Category Description" onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))} />
          <button onClick={() => { createCategoryMutation() }} className="block rounded-xl border p-3 border-gray-500 disabled:text-gray-400 bg-green-200" >Add Category</button>

          <h2 className="mt-10">{`Add Subcategory for selected Category: ${selectedCategory?.title ?? ''}`}</h2>
          <TextField label={'Subcategory title'} value={newSubcategory.title} onChange={(e) => setNewSubcategory(prev => ({ ...prev, title: e.target.value }))} />
          <TextField label={`Subcategory description`} value={newSubcategory.description} onChange={(e) => setNewSubcategory(prev => ({ ...prev, description: e.target.value }))} />
          <button onClick={() => createSubcategoryMutation()} className="disabled:bg-gray-300 block rounded-xl border p-3 border-gray-500 disabled:text-gray-400 bg-green-200" disabled={!selectedCategory}>Add SubCategory</button>
        </div >
      </div >
    </>
  )
}

export default memo(EditProductPage)
