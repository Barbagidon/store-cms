"use client";

import { Product, Image, Color, Category, Size } from "@prisma/client";
import * as z from 'zod'
import React, { useState } from "react";


import { Trash } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";



import AlertModal from "@/components/modals/alert-modal";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ImageUpload from "@/components/ui/Image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import SizeSelect from "./size-select";


interface ProductFormProps {
  initialData: Product & {
    images: Image[]
  } | null;
  colors: Color[],
  categories: Category[],
  sizes: Size[]
}


const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.string().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizes: z.array(
    z.object({
      sizeId: z.string().min(1),
      quantity: z.number().min(0),
    })
  ),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

const ProductForm = ({ initialData, colors, categories, sizes }: ProductFormProps) => {




  const params = useParams()

  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)




  const title = initialData ? 'Edit a product' : 'Create a new product'
  const description = initialData ? 'Edit product' : 'Add a new product'
  const toastMessage = initialData ? 'Product updated' : 'Product created'
  const action = initialData ? 'Save changes' : 'Create'



  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      images: [],
      price: '0',
      categoryId: '',
      colorId: '',
      sizes: [],
      isFeatured: false,
      isArchived: false,
    }
  })




  const onSubmit = async (data: ProductFormValues) => {

    try {
      setLoading(true)
      if (initialData) {


        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
      }
      else {
        await axios.post(`/api/${params.storeId}/products`, data)
      }

      router.refresh()
      router.push(`/${params.storeId}/products`)
      toast.success(toastMessage)

    } catch (error) {
      toast.error('Something went wrong')

    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {

    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
      router.refresh()
      router.push(`/${params.storeId}/products`)
      toast.success('Product deleted')


    } catch (error) {
      toast.error('Something went wrong')

    } finally {
      setLoading(false)
    }
  }



  return (
    <>
      <div className="flex items-center justify-between">
        {open && <AlertModal loading={loading} onConfirm={onDelete} isOpen={open} onClose={() => setOpen(false)} />}
        <Heading description={description} title={title} />
        {initialData && <Button disabled={loading} onClick={() => { setOpen(true) }} size="sm" variant={"destructive"}>
          <Trash className="h-4 w-4" />
        </Button>}

      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField name="images" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImageUpload onRemove={(url) => field.onChange([...field.value.filter(cur => cur.url !== url)])} onChange={(url) => field.onChange([...field.value, { url }])} disabled={loading} value={field.value.map(image => image.url)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="grid grid-cols-3 gap-8">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" disabled={loading} {...field} />

                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="price" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="9.99" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => {

                return <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              }}
            />
            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => {

                return <FormItem>
                  <FormLabel>Sizes</FormLabel>
                  {/* <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}> */}
                  <FormControl>
                    {/* <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a size" />
                      </SelectTrigger> */}
                    <SizeSelect onChange={(v) => field.onChange(v.map(item => ({
                      sizeId: item.value,
                      quantity: 10
                    })))} data={sizes} />
                  </FormControl>
                  {/* <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>{size.value}</SelectItem>
                      ))}
                    </SelectContent> */}
                  {/* </Select> */}


                  <FormMessage />
                </FormItem>
              }}
            />

            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => {

                return <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              }}
            />
            <FormField name="isFeatured" control={form.control} render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    //@ts-ignore
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">

                  <FormLabel>
                    Featured
                  </FormLabel>
                  <FormDescription>
                    This product will appear on the home page
                  </FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField name="isArchived" control={form.control} render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    //@ts-ignore
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">

                  <FormLabel>
                    Archived
                  </FormLabel>
                  <FormDescription>
                    This product will not appear anywhere in this store
                  </FormDescription>
                </div>
              </FormItem>
            )} />
          </div>

          <Button type="submit" className="ml-auto" disabled={loading}>
            {action}
          </Button>
        </form>

      </Form>
      <Separator />

    </>
  );
};

export default ProductForm;
