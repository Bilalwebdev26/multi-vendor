"use client";
import ImagePlaceholder from "apps/seller-ui/src/shared/modules/image-placeholder";
import { ChevronRight } from "lucide-react";
import { ColorSelector } from "packages/components/color-selector";
import CustomSelectProperties from "packages/components/custom-select";
import CustomSpecification from "packages/components/custom-specification";
import Input from "packages/components/input";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// type Inputs = {
//   images: file:File|null;
//   exampleRequired: string
// }

const page = () => {
  //states
  const [openImageModel, setOpenImageModel] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
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
  //------
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
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white"
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
            <div className="w-1/2"></div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default page;

// 8:56 -> image uplaod ke liye folder bnana ha w-35% se start kerna
