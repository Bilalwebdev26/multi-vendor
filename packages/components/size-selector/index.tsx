import React from "react";
import { Controller } from "react-hook-form";
const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const SizeSelector = ({ control, errors }: any) => {
  return (
    <div>
      <label className="font-semibold block">Sizes</label>
      <Controller
        name="size"
        control={control}
        render={({ field }) => (
          <div>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size) => {
                const isSelected = (field.value || []).includes(size);
                console.log("Field.value : ", field.value);
                return (
                  <button
                    type="button"
                    key={size}
                    className={`px-3 py-1 rounded-lg font-Poppins transition-colors ${
                      isSelected
                        ? "bg-gray-700 text-white border border-[#ffffff6b]"
                        : "bg-gray-800 text-gray-300"
                    }`}
                    onClick={() =>
                      field.onChange(
                        isSelected
                          ? field.value.filter((s: string) => s !== size)
                          : [...(field.value || []), size]
                      )
                    }
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      />
      {errors.size && (
        <p className="text-red-500 text-xs mt-1">
          {errors.size.message as string}
        </p>
      )}
    </div>
  );
};

export default SizeSelector;
