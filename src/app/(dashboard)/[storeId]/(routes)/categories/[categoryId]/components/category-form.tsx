"use client";

import { Billboard, Category, Store } from "@prisma/client";
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

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[]
}


const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1)
})

type CategoryFormValues = z.infer<typeof formSchema>

const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {







  const params = useParams()

  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)




  const title = initialData ? 'Edit a category' : 'Create a new category'
  const description = initialData ? 'Edit category' : 'Add a new category'
  const toastMessage = initialData ? 'Category updated' : 'Category created'
  const action = initialData ? 'Save changes' : 'Create'



  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: ''
    }
  })


  const onSubmit = async (data: CategoryFormValues) => {

    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
      }
      else {
        await axios.post(`/api/${params.storeId}/categories`, data)
      }

      router.refresh()
      router.push(`/${params.storeId}/categories`)
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
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
      router.refresh()
      router.push(`/${params.storeId}/categories`)
      toast.success('Category deleted')


    } catch (error) {
      toast.error('Make sure you removed all products using this category first')

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

          <div className="grid grid-cols-3 gap-8">
            <FormField name="name" control={form.control} render={({ field }) => {
              return <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Category name" disabled={loading} {...field} />

                </FormControl>
                <FormMessage />
              </FormItem>
            }} />

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => {
                return <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>{billboard.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              }}
            />
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

export default CategoryForm;
