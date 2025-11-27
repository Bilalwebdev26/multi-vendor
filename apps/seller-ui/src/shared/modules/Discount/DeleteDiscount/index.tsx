import { X } from "lucide-react";
import React from "react";

const DeleteDiscountCodeModel = ({
  discount,
  onClose,
  onConfrim,
}: {
  discount: any;
  onClose: () => void;
  onConfrim: any;
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-45 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-[450px] shadow-lg">
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-xl text-white">Delete Discount Code</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={22} />
          </button>
        </div>
        {/* Warning message */}
        <p className="text-gray-300 my-2">
          Are you sure you wan't to delete{" "}
          <span className="font-semibold text-red-500">
            {discount.public_name}
          </span>
          ?<br />
          This action <span className="font-semibold text-red-500">**</span>
          cannot be undone
          <span className="font-semibold text-red-500">**</span>
        </p>
        {/* action  button */}
        <div className="flex items-center w-full justify-end my-2 gap-2">
          <button onClick={onClose} className="text-white font-bold bg-blue-500 w-[50%] p-2 rounded-md">Cancel</button>
          <button onClick={onConfrim} className="text-white font-bold bg-red-500 w-[50%] p-2 rounded-md">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDiscountCodeModel;
