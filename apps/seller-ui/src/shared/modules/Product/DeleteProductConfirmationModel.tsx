import { X } from "lucide-react";
import React from "react";

const DeleteProductConfirmationModel = ({
  product,
  onClose,
  onConfrim,
  onRestore,
}: any) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-45 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-[450px] shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <h3 className="text-xl text-red-600 font-bold">
            <span className="text-red-600">Delete</span> Product
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={22} />
          </button>
        </div>
        {/* Body */}
        <p className="font-semibold text-lg text-white">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-green-500">{product?.title}</span>{" "}
          ?
        </p>
        <p className="text-gray-300 mt-3 ">
          This product will be moved to a{" "}
          <span className="text-red-500 font-medium">Delete State </span> and
          permanently remove after{" "}
          <span className="text-blue-500 font-medium">24 hours</span>. You can
          recover it within Time.
        </p>
        <div className="flex justify-end gap-3 my-2">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white"
          >
            Cancel
          </button>
          <button
            onClick={product?.isDeleted ? onRestore : onConfrim}
            className={`${
              product?.isDeleted
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } px-4 py-2 rounded-md text-white`}
          >
            {product?.isDeleted ? "Restore" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductConfirmationModel;
