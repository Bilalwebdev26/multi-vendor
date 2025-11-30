"use client";
import { useQuery } from "@tanstack/react-query";
import ImagePlaceholder from "apps/seller-ui/src/shared/modules/image-placeholder";
import { enhancemnets } from "apps/seller-ui/src/utils/AiEnhancemnet";
import { axiosInstance } from "apps/seller-ui/src/utils/axiosInstance";
import { ChevronRight, Wand, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ColorSelector } from "packages/components/color-selector";
import CustomSelectProperties from "packages/components/custom-select";
import CustomSpecification from "packages/components/custom-specification";
import Input from "packages/components/input";
import RichTextEditor from "packages/components/rich-text-editor";
import SizeSelector from "packages/components/size-selector";
import React, { useMemo, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import toast from "react-hot-toast";

interface UploadFileInterface {
  fileName: string;
  file_url: string;
}

const page = () => {
  //states
  const [openImageModel, setOpenImageModel] = useState(false);
  const [isChanged, setIsChanged] = useState(true);
  const [images, setImages] = useState<(UploadFileInterface | null)[]>([null]);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  console.log("Images from Top : ", images);
  const [pictureloading, setPictureloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [aiImage, setAIImage] = useState<string>("");
  const router = useRouter()
  console.log("Ai image : ", aiImage);
  //react hook
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();
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
  //fetch discount codes
  const { data: discountCodes = [], isLoading: discountCodeLoadig } = useQuery({
    queryKey: ["shop-discounts"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/product/api/v1/find-discount-codes"
      );
      return res.data || [];
    },
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
  const convertFileToBase64 = (file: File) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => res(reader.result);
      reader.onerror = (error) => rej(error);
    });
  };
  const handleImageChange = async (file: File | null, index: number) => {
    if (!file) {
      return;
    }
    try {
      const base64Image = await convertFileToBase64(file); //yahe se start kerna 11:48
      console.log("Base64 : ", base64Image);
      setPictureloading(true);
      const res = await axiosInstance.post("/product/api/v1/upload-image", {
        base64Image,
      });

      console.log("Res upload image : ", res);
      console.log("Res from upload image : ", res.data);
      //updated images array
      const updatedImages = [...images];
      const uploadedFile: UploadFileInterface = {
        fileName: res.data.fileName,
        file_url: res.data.file_url,
      };
      updatedImages[index] = uploadedFile;
      console.log("Updating Images : ", updatedImages);
      // updatedImages[index] = file;
      if (index === images.length - 1 && updatedImages.length < 8) {
        updatedImages.push(null);
      }
      setImages(updatedImages);
      console.log("UpdatedImage In api : ", updatedImages);
      console.log("SetImages In api : ", images);
      setValue("images", updatedImages);
    } catch (error) {
      console.log("Error while uploading Images : ", error);
    } finally {
      setPictureloading(false);
    }
  };
  //   const handleRemoveImage = (index: number) => {
  //   setImages((prev) => {
  //     let updated = [...prev];

  //     // delete actual image
  //     updated.splice(index, 1);

  //     // last slot me null hona zaroori hai
  //     if (!updated.includes(null)) {
  //       updated.push(null);
  //     }

  //     // Update form value correctly
  //     setValue("images", updated);

  //     return updated;
  //   });
  // };
  const applyTransformation = async (effect: string) => {
    if (!aiImage || processing) {
      return;
    }
    setProcessing(true);
    setActiveEffect(effect);
    try {
      const transformUrl = `${aiImage}?tr=${effect}`;
      toast.success(transformUrl);
      console.log("Transofrim Url : ", transformUrl);
      setAIImage(transformUrl);
    } catch (error) {
      console.log("Erorr while enhnaced image : ", error);
    } finally {
      setProcessing(false);
    }
  };
  const handleRemoveImage = async (index: number) => {
    try {
      const updatedImages = [...images];
      const imageToDelete = updatedImages[index];
      if (imageToDelete && typeof imageToDelete === "object") {
        //delete our selected picture
        const res = await axiosInstance.post("/product/api/v1/delete-image", {
          fileId: imageToDelete.fileName!,
        });
        console.log("Res upload image : ", res);
      }
      updatedImages.splice(index, 1);
      //add null placeholder
      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }
      setImages(updatedImages);
      setValue("images", updatedImages);
    } catch (error) {
      toast.error("Error while deleting Image");
      console.log("Error while deleting Image : ", error);
    }
    // setImages((prev) => {
    //   console.log("PREV : ",prev)
    //   let removeImage = [...prev];
    //   let img = [...prev];
    //   console.log("img :",img)
    //   if (index === -1) {
    //     removeImage[0] = null;
    //   } else {
    //     removeImage.splice(index, 1);
    //     console.log("REmoveImage :",removeImage)
    //     console.log("img :",img)
    //   }
    //   if (!removeImage.includes(null) && removeImage.length < 8) {
    //     removeImage.push(null);
    //   }
    //   // setValue("images", removeImage);
    //   return removeImage;
    // });
    // setValue("images", images);
  };
  //   const handleRemoveImage = (index: number) => {
  //   setImages((prev) => {
  //     console.log("Prev:", prev);

  //     // 1. Nulls remove karo
  //     // const cleaned = prev.filter((item) => item !== null);
  //     const cleaned: (File | null)[] = prev.filter((item) => item !== null);

  //     // 2. Jis index wali image remove karni ho, wo hatao
  //     cleaned.splice(index, 1);

  //     // 3. Always keep one empty slot at end
  //     if (cleaned.length < 8) {
  //       cleaned.push(null);
  //     }

  //     // 4. Update form correctly
  //     setValue("images", cleaned);

  //     return cleaned;
  //   });
  // };

  const handleSaveDraft = () => {};
  const onSubmit = async(data: any) => {
    console.log("Form Data : ", data);
    try {
      setLoading(true)
      const res = await axiosInstance.post("/product/api/v1/create-product",{data})
      toast.success("Product created successFully")
      router.push("/dashboard/all-products")
    } catch (error) {
      toast.error("Product created failed.")
    }finally{
      setLoading(false)
    }
  };
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
              pictureloading={pictureloading}
              images={images}
              setAIImage={setAIImage}
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
                pictureloading={pictureloading}
                images={images}
                setAIImage={setAIImage}
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
                  <option value="true" className="bg-black">
                    Yes
                  </option>
                  <option value="false" className="bg-black">
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
                  Select Discounted Code
                </label>
                {/* bilal */}
                {discountCodeLoadig ? (
                  <p className="text-gray-300">Loading Dsicount code</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {discountCodes?.discountCodeExist?.map((code: any) => (
                      <button
                        type="button"
                        key={code?.id}
                        className={`px-3 py-1 rounded-md text-sm font-semibold border ${
                          watch("discountCode")?.includes(code.id)
                            ? "bg-blue-600 text-white border-blue-800"
                            : "bg-gray-800 text-gray-300 border-gray-400 hover:border-gray-700"
                        }`}
                        onClick={() => {
                          const currentSelection = watch("discountCode") || [];
                          const updatedSelection = currentSelection?.includes(
                            code.id
                          )
                            ? currentSelection.filter(
                                (id: string) => id !== code.id
                              )
                            : [...currentSelection, code.id];
                          setValue("discountCode", updatedSelection);
                        }}
                      >
                        {code.public_name} ({code.discountValue}
                        {code.discountType === "percentage" ? "%" : "$"})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {openImageModel && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-[450px] text-white">
            <div className="flex justify-between items-center pb-3 mb-4 ">
              <h2 className="text-lg font-semibold">Enhanced Product Image</h2>
              <X
                size={18}
                className="cursor-pointer hover:text-white transition"
                onClick={() => setOpenImageModel(false)}
              />
            </div>
            <div className="w-full h-[250px] overflow-hidden rounded-md  border-2 border-gray-600 relative">
              <Image
                src={aiImage}
                alt="product-image"
                layout="fill"
                className="object-contain"
              />
            </div>
            {aiImage && (
              <div className="mt-4 space-y-2 ">
                <h3 className="text-white text-sm font-semibold">
                  AI Enhancements
                </h3>
                <span className="text-xs text-gray-400 font-semibold">
                  Select any 1 For Enhance Image
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto">
                  {enhancemnets.map(({ label, effect }) => (
                    <button
                      type="button"
                      key={effect}
                      onClick={() => applyTransformation(effect)}
                      disabled={processing}
                      className={`p-2 rounded-md flex items-center gap-2 ${
                        activeEffect === effect
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      <Wand size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white rounded-md px-4 py-2"
        >
          {loading ? "Creating...." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default page;

// 8:56 -> image uplaod ke liye folder bnana ha w-35% se start kerna
