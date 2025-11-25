"use client";
import { useQuery } from "@tanstack/react-query";
import ImagePlaceholder from "apps/seller-ui/src/shared/modules/image-placeholder";
import { axiosInstance } from "apps/seller-ui/src/utils/axiosInstance";
import { ChevronRight } from "lucide-react";
import { ColorSelector } from "packages/components/color-selector";
import CustomSelectProperties from "packages/components/custom-select";
import CustomSpecification from "packages/components/custom-specification";
import Input from "packages/components/input";
import RichTextEditor from "packages/components/rich-text-editor";
import SizeSelector from "packages/components/size-selector";
import React, { useMemo, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// type Inputs = {
//   images: file:File|null;
//   exampleRequired: string
// }

const page = () => {
  //states
  const [openImageModel, setOpenImageModel] = useState(false);
  const [isChanged, setIsChanged] = useState(true);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);
  //react hook
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);
  //------fetch categories
  const {
    data: categoryData,
    isLoading: categoryloading,
    isError: categoryError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/product/api/v1/categories");
        return res.data;
      } catch (error) {
        toast.error("Error while fetching data");
        console.log("Error while fetching categories : ", error);
      }
    },
    staleTime: 1000 * 60 * 5, //->cache for 5 min
    retry: 2,
  });
  console.log("categoryData : ", categoryData);
  const categories = categoryData?.categories || [];
  const subCategories = categoryData?.categories.subCategory || {};
  const selectedCategory = watch("categories");
  const regularPrice = watch("regular_price");
  const subCatData = useMemo(() => {
    return selectedCategory ? subCategories[selectedCategory] || [] : [];
  }, [selectedCategory, subCategories]);
  console.log("Categories : ", categories);
  console.log("Sub Categories : ", subCategories);
  console.log("Sub Categories Electronics : ", subCategories[selectedCategory]);
  console.log("selectedCategory : ", selectedCategory);
  const handleImageChange = (file: File | null, index: number) => {
    const updatedImages = [...images];
    updatedImages[index] = file;
    if (index === images.length - 1 && images.length < 8) {
      updatedImages.push(null);
    } //1=0,2=1,3=2
    setImages(updatedImages);
    setValue("images", updatedImages);
  };
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      let removeImage = [...prev];
      if (index === -1) {
        removeImage[0] = null;
      } else {
        removeImage.splice(index, 1);
      }
      if (!removeImage.includes(null) && removeImage.length < 8) {
        removeImage.push(null);
      }
      return removeImage;
    });
    setValue("images", images);
  };
  const handleSaveDraft = () => {};
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white font-Roboto"
    >
      <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
        Create Product
      </h2>
      <div className="flex items-center">
        <span className="text-[#80Deea] cursor-pointer">Dashboard</span>
        <ChevronRight size={15} className="opacity-[.8]" />
        <span>Create Product</span>
      </div>
      {/* Conetent Layout */}
      {/* left-40% right 60% */}
      <div className="py-4 w-full flex gap-6">
        {/* Left image side 40% - image upload */}
        <div className="md:w-[35%]">
          {images?.length > 0 && (
            <ImagePlaceholder
              size="765×850"
              setOpenImageModel={setOpenImageModel}
              small={false}
              index={0}
              onImageChange={handleImageChange}
              onRemove={handleRemoveImage}
            />
          )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {images.slice(1).map((_, index) => (
              <ImagePlaceholder
                size="765×850"
                setOpenImageModel={setOpenImageModel}
                small={true}
                key={index}
                index={index + 1}
                onImageChange={handleImageChange}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        </div>

        {/* Right side - form Input */}
        <div className="md:w-[65%]">
          <div className="w-full flex gap-6">
            {/* Product inputs */}
            {/*half Left side  */}
            <div className="w-1/2">
              <Input
                label="Product Title"
                placeholder="Enter Product Title"
                type="text"
                {...register("title", {
                  required: "Product Title is Required.",
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message as string}
                </p>
              )}
              <div className="mt-2">
                <Input
                  label="Product Description max(150 words)"
                  placeholder="Enter Product Description"
                  type="textarea"
                  rows={7}
                  cols={10}
                  {...register("description", {
                    required: "Product Description is Required.",
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        `Description cannot exceed 150 words (Current : ${wordCount})`
                      );
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Tags"
                  placeholder="apple,flagship"
                  type="text"
                  {...register("tags", {
                    required: "Seperate related products tags with a comma.",
                  })}
                />
                {errors.tags && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tags.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Warranty"
                  placeholder="1 year / No warranty"
                  type="text"
                  {...register("warranty", {
                    required: "warranty is required.",
                  })}
                />
                {errors.warranty && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.warranty.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Slug"
                  placeholder="product_slug"
                  type="text"
                  {...register("slug", {
                    required: "slug is required.",
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message:
                        "Invalid slug format! use only lowercase letters numbers and ",
                    },
                    minLength: {
                      value: 3,
                      message: "Min length should be greater than 3 character.",
                    },
                    maxLength: {
                      value: 50,
                      message: "Max length should be in 50 chracters",
                    },
                  })}
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.slug.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Brand"
                  placeholder="Dell"
                  type="text"
                  {...register("brand", {
                    required: "brand is required.",
                  })}
                />
                {errors.brand && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.brand.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                {/* COlor */}
                <ColorSelector control={control} errors={errors} />
              </div>
              <div className="mt-2">
                {/* COlor */}
                <CustomSpecification control={control} errors={errors} />
              </div>
              <div className="mt-2">
                {/* COlor */}
                <CustomSelectProperties control={control} errors={errors} />
              </div>
              <div className="mt-2">
                <label
                  htmlFor=""
                  className="font-semibold block text-gray-300 mb-1"
                >
                  Cash On Delivery
                </label>
                <select
                  {...register("cash_on_delivery", {
                    required: "Select True or False",
                  })}
                  defaultValue={"yes"}
                  className="w-full border outline-none border-gray-700 bg-transparent p-1"
                >
                  <option value="yes" className="bg-black">
                    Yes
                  </option>
                  <option value="no" className="bg-black">
                    No
                  </option>
                </select>
                {errors.cash_on_delivery && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cash_on_delivery.message as string}
                  </p>
                )}
              </div>
            </div>
            {/* Half right side */}
            <div className="w-1/2">
              {/* Categories */}
              <label htmlFor="" className="block font-semibold">
                Category
              </label>
              {categoryloading ? (
                <p className="text-gray-400">Loading Categories</p>
              ) : categoryError ? (
                <p className="text-red-500">Failed to load categories</p>
              ) : (
                <Controller
                  name="categories"
                  control={control}
                  rules={{ required: "Category is Required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none border-gray-700 bg-transparent p-2"
                    >
                      <option value="" className="bg-black text-white">
                        Select Category
                      </option>
                      {categories.categories?.map((cat: any, index: number) => (
                        <option className="bg-black" key={index}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}
              {errors.categories && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categories.message as string}
                </p>
              )}
              <div className="mt-2">
                {/*Sub Categories */}
                <label htmlFor="" className="block font-semibold">
                  Sub Category
                </label>
                {categoryloading ? (
                  <p className="text-gray-400">Loading Sub-Categories</p>
                ) : categoryError ? (
                  <p className="text-red-500">Failed to load sub categories</p>
                ) : (
                  <Controller
                    name="subCategory"
                    control={control}
                    rules={{ required: "Sub-Category is Required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full border outline-none border-gray-700 bg-transparent p-2"
                      >
                        <option value="" className="bg-black text-white">
                          Select Sub-Category
                        </option>
                        {subCatData.map((cat: any, index: number) => (
                          <option className="bg-black" key={index}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                )}
                {errors.subCategory && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subCategory.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <label htmlFor="" className="block font-semibold">
                  Detailed Description * (Min 100 words)
                </label>
                <Controller
                  name="detailed_description"
                  control={control}
                  rules={{
                    required: "Detailed Description is required",
                    validate: (value) => {
                      const wordCount = value
                        .split(/\s+/)
                        .filter((word: string) => word).length;
                      return (
                        wordCount >= 100 || "Description must be 100 words"
                      );
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.detailed_description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.detailed_description.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Video URL"
                  type="text"
                  placeholder="https://www.youtube.com/embed/xyz789"
                  {...register("video_url", {
                    pattern: {
                      value:
                        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/,
                      message: "Invalid Youtube embeded URL! user format",
                    },
                  })}
                />
                {errors.video_url && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.video_url.message as string}
                  </p>
                )}
              </div>
              {/* Regular Price */}
              <div className="mt-2">
                <Input
                  label="Regular Price"
                  type="text"
                  placeholder="20$"
                  {...register("regular_price", {
                    valueAsNumber: true,
                    required: "Regular Price is required.",
                    min: {
                      value: 1,
                      message: "Price must be atleast 1 dollar",
                    },
                    validate: (value) =>
                      !isNaN(value) || "Only numbers are allowed",
                  })}
                />
                {errors.regular_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.regular_price.message as string}
                  </p>
                )}
              </div>
              {/* Sale Price */}
              <div className="mt-2">
                <Input
                  label="Sale Price"
                  type="text"
                  placeholder="15$"
                  {...register("sale_price", {
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Price must be atleast 1 dollar",
                    },
                    validate: (value) => {
                      if (value >= regularPrice)
                        return "Sale Price should be less than regular Price";
                      if (value <= 0)
                        return "Sale Price must be atleast 1 dollar";
                      if (isNaN(value)) "Only numbers are allowed";
                      return true;
                    },
                  })}
                />
                {errors.sale_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sale_price.message as string}
                  </p>
                )}
              </div>
              {/* Stock */}
              <div className="mt-2">
                <Input
                  label="Stock"
                  type="text"
                  placeholder="1298"
                  {...register("stock", {
                    required: "Product Stock is required.",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Stock must be atleast 1",
                    },
                    max: {
                      value: 10000,
                      message: "Stock must be no more than  10,000",
                    },
                    validate: (value) => {
                      if (isNaN(value)) "Only numbers are allowed";
                      if (!Number.isInteger(value))
                        "Stock number should be in whole number";
                      return true;
                    },
                  })}
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stock.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <SizeSelector control={control} errors={errors} />
              </div>
              <div className="mt-3">
                <label htmlFor="" className="font-semibold block">
                  Discounted Code
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        {isChanged && (
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-gray-700 text-white rounded-md"
          >
            Save Draft
          </button>
          
        )}
        <button type="submit" disabled={loading} className="bg-blue-700 text-white rounded-md px-4 py-2">{loading?"Creating....":"Create"}</button>
      </div>
    </form>
  );
};

export default page;

// 8:56 -> image uplaod ke liye folder bnana ha w-35% se start kerna
