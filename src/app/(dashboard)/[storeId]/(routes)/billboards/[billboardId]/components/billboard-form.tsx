"use client";

import { Billboard, Store } from "@prisma/client";
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
import ImageUpload from "@/components/ui/Image-upload";


interface BillboardFormProps {
  initialData: Billboard | null;
}


const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1)
})

type BillboardFormValues = z.infer<typeof formSchema>

const BillboardForm = ({ initialData }: BillboardFormProps) => {


  const params = useParams()
  console.log(initialData)
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)




  const title = initialData ? 'Edit a billboard' : 'Create a new billboard'
  const description = initialData ? 'Edit billboard' : 'Add a new billboard'
  const toastMessage = initialData ? 'Billboard updated' : 'Billboard created'
  const action = initialData ? 'Save changes' : 'Create'



  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  })


  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
      }
      else {
        await axios.post(`/api/${params.storeId}/billboards`, data)
      }

      router.refresh()
      router.push(`/${params.storeId}/billboards`)
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
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
      router.refresh()
      router.push('/')
      toast.success('Billboard deleted')


    } catch (error) {
      toast.error('Make sure you removed all categories using this billboard first')

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
          <FormField name="imageUrl" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Background image</FormLabel>
              <FormControl>
                <ImageUpload onRemove={() => field.onChange("")} onChange={(url) => field.onChange(url)} disabled={loading} value={field.value ? [field.value] : []} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="grid grid-cols-3 gap-8">
            <FormField name="label" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input placeholder="Billboard name" disabled={loading} {...field} />

                </FormControl>
                <FormMessage />
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

export default BillboardForm;
