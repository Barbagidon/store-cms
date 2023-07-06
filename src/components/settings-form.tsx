"use client";

import { Store } from "@prisma/client";
import * as z from 'zod'
import React, { useState } from "react";
import Heading from "./ui/heading";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Separator } from "./ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

interface SettingsFormProps {
  initialData: Store;
}


const formSchema = z.object({
  name: z.string().min(1)
})

type SettingsFormValues = z.infer<typeof formSchema>

const SettingsForm = ({ initialData }: SettingsFormProps) => {

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)



  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })


  const onSubmit = async (data: SettingsFormValues) => {
    console.log(data)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading description="Manage store preferences" title="description" />
        <Button disabled={loading} onClick={() => { setOpen(true) }} size="sm" variant={"destructive"}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Store name" disabled={loading} {...field} />

                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <Button type="submit" className="ml-auto" disabled={loading}>
            Save changes
          </Button>
        </form>

      </Form>
    </>
  );
};

export default SettingsForm;
