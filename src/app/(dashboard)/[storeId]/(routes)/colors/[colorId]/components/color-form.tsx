"use client";

import { Color } from "@prisma/client";
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


interface ColorFormProps {
  initialData: Color | null;
}


const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {

    message: 'String must be a valid hex code'
  })
})

type ColorFormValues = z.infer<typeof formSchema>

const ColorForm = ({ initialData }: ColorFormProps) => {


  const params = useParams()

  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)




  const title = initialData ? 'Edit a color' : 'Create a color'
  const description = initialData ? 'Edit a color' : 'Add a new color'
  const toastMessage = initialData ? 'Color updated' : 'Color created'
  const action = initialData ? 'Save changes' : 'Create'



  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
  })


  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
      }
      else {
        await axios.post(`/api/${params.storeId}/colors`, data)
      }

      router.refresh()
      router.push(`/${params.storeId}/colors`)
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
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast.success('Color deleted')


    } catch (error) {
      toast.error('Make sure you removed all products using this color first')

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
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Color name" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="value" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-x-4">
                    <Input placeholder="Color value" disabled={loading} {...field} />
                    <div style={{ background: field.value, }} className="border p-4 rounded-full" />
                  </div>
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

export default ColorForm;
