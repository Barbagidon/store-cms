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


import useOrigin from "@/hooks/use-origin";
import AlertModal from "@/components/modals/alert-modal";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import ApiAlert from "@/components/ui/api-alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


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
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const origin = useOrigin()


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
      await axios.patch(`/api/stores/${params.storeId}`, data)
      router.refresh()
      toast.success('Store updated')

    } catch (error) {
      toast.error('Something went wrong')

    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {

    try {
      setLoading(true)
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh()
      router.push('/')
      toast.success('Store deleted')


    } catch (error) {
      toast.error('Make sure you removed all products and categories first')

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
      <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public" />
    </>
  );
};

export default BillboardForm;
