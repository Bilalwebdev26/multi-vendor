"use client";
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { axiosInstance } from "apps/seller-ui/src/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Star,
  Trash,
} from "lucide-react";
import DeleteProductConfirmationModel from "apps/seller-ui/src/shared/modules/Product/DeleteProductConfirmationModel";
const fetchProducts = async () => {
  const res = await axiosInstance.get("/product/api/v1/get-shop-products");
  console.log("Products : ", res.data);
  return res?.data?.products;
};
const deleteProductApi = async(productId:string)=>{
  const res = await axiosInstance.delete(`/product/api/v1/delete-product/${productId}`);
  console.log("Products : ", res.data);
  //return res?.data?.updatedProduct;
}
const restoreProductApi = async(productId:string)=>{
  const res = await axiosInstance.put(`/product/api/v1/restore-product/${productId}`);
  console.log("Products : ", res.data);
 // return res?.data?.updatedProduct;
}
const page = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["shop-products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, //->5mins cache
  });
  //delete muation
  const deleteMuation = useMutation({
    mutationFn:deleteProductApi,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["shop-products"]})
      setShowDeleteModel(false)
    }
  })
  //restore muation
  const restoreMuation = useMutation({
    mutationFn:restoreProductApi,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["shop-products"]})
      setShowDeleteModel(false)
    }
  })
  const columns = useMemo(
    () => [
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }: any) => (
          <Image
            src={row.original.images[0].url}
            alt={row.original.images[0].url}
            width={200}
            height={200}
            className="h-12 w-12 rounded-md object-cover"
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Product name",
        cell: ({ row }: any) => {
          const truncatedTitle =
            row.original.title.length > 25
              ? `${row.original.title.substring(0, 25)}...`
              : row.original.title;
          return (
            <Link
              href={`${process.env.NEXT_USER_PUBLIC_SERVER_URL}/product/${row.original.slug}`}
              className="text-blue-400 hover:underline"
              title={row.original.title}
            >
              {truncatedTitle}
            </Link>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }: any) => <span>${row.original.sale_price}</span>,
      },
      {
        accessorKey: "categories",
        header: "Category",
        cell: ({ row }: any) => <span>{row.original.categories}</span>,
      },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }: any) => (
          <span
            className={row.original.stock < 10 ? "text-red-500" : "text-white"}
          >
            {row.original.stock} Left
          </span>
        ),
      },

      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }: any) => (
          <div className="flex gap-3">
            <Link
              href={`/product/${row.original.id}`}
              className="text-blue-400 hover:text-blue-300 transition"
            >
              <Eye size={18} />
            </Link>
            <Link
              href={`/product/edit/${row.original.id}`}
              className="text-yellow-400 hover:text-yellow-300 transition"
            >
              <Pencil size={18} />
            </Link>
            <button
              className="text-green-400 hover:text-green-300 transition"
              // onClick={() => openAnalytics(row.original)}
            >
              <BarChart size={18} />
            </button>
            <button
              className="text-red-400 hover:text-red-300 transition"
              onClick={() => openDeleteModal(row.original)}
            >
              <Trash size={18} />
            </button>
          </div>
        ),
      },
      {
        accessorKey: "ratting",
        header: "Ratting",
        cell: ({ row }: any) => (
          <div className="flex items-center gap-1 text-yellow-400">
            <Star fill="#fde047" size={18} />{" "}
            <span className="text-white">{row.original.rattings || 5}</span>
          </div>
        ),
      },
    ],
    []
  );
  //table
  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  const openDeleteModal = (product: any) => {
    setSelectedProduct(product);
    setShowDeleteModel(true);
  };

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">All Products</h2>
        <Link
          href={"/dashboard/create-products"}
          className="bg-blue-600 hover:bg-blue-700 flex items-center text-white px-4 py-2 rounded-lg "
        >
          <Plus size={18} />
          Add Products
        </Link>
      </div>
      {/* Breadcrumbs */}
      <div className="flex items-center">
        <span className="text-[#80Deea] cursor-pointer">Dashboard</span>
        <ChevronRight size={15} className="opacity-[.8] text-white" />
        <span className="text-white">All Product</span>
      </div>
      {/* Search bar */}
      <div className="mb-4 flex items-center bg-gray-800 p-2 rounded-md flex-1">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search Products..."
          className="w-full bg-transparent text-white outline-none"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      {/* Table 13:04 */}
      <div className="overflow-x-auto bg-gray-900 rounded-lg p-4">
        {isLoading ? (
          <p className="text-center text-white">Loading Products...</p>
        ) : (
          <table className="w-full text-white">
            <thead>
              {table.getHeaderGroups().map((headerGroups) => (
                <tr key={headerGroups.id} className="border-b border-gray-800">
                  {headerGroups.headers.map((header) => (
                    <th key={header.id} className="p-3 text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-800 hover:bg-gray-900 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Show delete model*/}
        {showDeleteModel && (
          <DeleteProductConfirmationModel
            product={selectedProduct}
            onClose={() => setShowDeleteModel(false)}
            onConfrim={() => deleteMuation.mutate(selectedProduct?.id)}
            onRestore={()=>restoreMuation.mutate(selectedProduct?.id)}
          />
        )}
      </div>
    </div>
  );
};

export default page;
