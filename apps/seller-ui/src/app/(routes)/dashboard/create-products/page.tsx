"use client";
import ImagePlaceholder from "apps/seller-ui/src/shared/modules/image-placeholder";
import { ChevronRight } from "lucide-react";
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
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {images.slice(1).map((_,index)=>(
             <ImagePlaceholder
              size="765×850"
              setOpenImageModel={setOpenImageModel}
              small={true}
              key={index}
              index={index+1}
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
        <div className="w-1/2"></div>
        </div>
      </div>
    </form>
  );
};

export default page;

// 8:56 -> image uplaod ke liye folder bnana ha w-35% se start kerna
