import Image from "next/image";
import React, { useState } from "react";

const ProductDetail = ({
  data,
  setOpen,
}: {
  data: any;
  setOpen: (open: boolean) => void;
}) => {
  const [activeImage, setActiveImage] = useState(0);
  return (
    <div
      onClick={() => setOpen(false)}
      className="fixed top-0 left-0 w-full h-screen bg-[#0000001d] bg-opacity-45 z-50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] md:w-[70%] md:mt-14 2xl:mt-0 h-max overflow-scroll min-h-[70vh] p-4 md:p-6 bg-white shadow-md rounded-lg"
      >
        <div className="w-full flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-full">
            <Image
              src={data.images?.[activeImage]?.url}
              alt=""
              height={400}
              width={400}
              className="w-full rounded-lg object-contain"
            />
            <div className="flex gap-2 mt-4">
              {data.images?.map((img: any, index: number) => (
                <div className="">
                  <Image
                    src={data.images?.[index]?.url}
                    alt=""
                    width={100}
                    height={100}
                    className="w-full rounded-lg object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
