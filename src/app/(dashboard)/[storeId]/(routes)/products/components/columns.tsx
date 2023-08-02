"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";
import { ProductSize } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type ProductColumn = {
  id: string;
  name: string;
  price: string,
  sizes: ProductSize[],
  category: string,
  color: string,
  isFeatured: boolean,
  isArchived: boolean,
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "sizes",
    header: "Sizes",
    cell: ({ row }) => (

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Show</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sizes</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {row.original.sizes.map(size => (
            <DropdownMenuItem key={size.id}>{size.name}</DropdownMenuItem>
          ))}


        </DropdownMenuContent>
      </DropdownMenu>


    )
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div style={{
          backgroundColor: row.original.color
        }} className="h-6 w-6 rounded-full border" />
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
