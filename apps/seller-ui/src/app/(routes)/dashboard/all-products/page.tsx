"use client";
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { axiosInstance } from "apps/seller-ui/src/utils/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
const fetchProducts = async () => {
  const res = await axiosInstance.get("/product/api/v1/get-shop-products");
  return res?.data?.products;
};
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
  const columns = useMemo(() => [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }: any) => (
        <Image
          src={row.original.image}
          alt={row.original.image}
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
            href={`${process.env.NEXT_PUBLIC_SERVER_URL}/product/${row.original.slug}`}
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
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }: any) => (
        <span
          className={row.original.stock < 10 ? "text-red-500" : "text-white"}
        >
          ${row.original.stock} Left
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
            // onClick={() => openDeleteModal(row.original)}
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
  ]);
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
          onChange={(e)=>setGlobalFilter(e.target.value)}
        />
      </div>
      {/* Table 13:04 */}
    </div>
  );
};

export default page;
