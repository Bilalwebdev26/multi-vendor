import React, { useEffect, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import Input from "../input";
import { Plus, PlusCircle, Trash, X } from "lucide-react";
import { __values } from "tslib";

const CustomSelectProperties = ({ control, errors }: any) => {
  const [properties, setProperties] = useState<
    { label: string; value: string[] }[]
  >([]);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const {} = useFieldArray({
    control,
    name: "custom_specification",
  });
  return (
    <div>
      <div className="flex flex-col gap-3">
        <Controller
          name="customProperties"
          control={control}
          render={({ field }) => {
            useEffect(() => {
              field.onChange(properties);
            }, [properties]);
            //add property
            const addProperty = () => {
              if (!newLabel.trim()) return;
              setProperties([...properties, { label: newLabel, value: [] }]);
              setNewLabel("");
            };
            //add that properties value
            const addValues = (index: number) => {
              if (!newValue.trim()) return;
              const updatedProperties = [...properties];
              updatedProperties[index].value.push(newValue);
              setProperties(updatedProperties);
              setNewValue("");
            };
            //remove Properties
            const removeProperty = (index: number) => {
              setProperties(properties.filter((_, i) => i !== index));
            };
            return (
              <div className="mt-2">
                <label
                  htmlFor=""
                  className="font-semibold block text-gray-300 mb-1"
                >
                  Custom Properties
                </label>
                <div className="flex flex-col gap-3">
                  {/* Existing Properties */}
                  {properties?.map((property, index) => (
                    <div
                      className="border border-gray-700 rounded-lg bg-gray-900"
                      key={index}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">
                          {property.label}
                        </span>
                        <button
                          type="button"
                          className=""
                          onClick={() => removeProperty(index)}
                        >
                          <X size={20} className="text-red-500" />
                        </button>
                      </div>
                      {/* Add value to property */}
                      <div className="flex items-center mt-2 gap-2">
                        <input
                          type="text"
                          className="border outline-none border-gray-700 bg-gray-800 p-2 !rounded-md text-white w-full"
                          placeholder="Enter value..."
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                        />
                        <button
                        type="button"
                          className="px-3 py-1 bg-blue-500 text-white !rounded-md"
                          onClick={() => addValues(index)}
                        >
                          Add
                        </button>
                      </div>
                      {/* SHOW ALL VALUES */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {property?.value?.map((val, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-700 text-white !rounded-md"
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {/* Add new property */}
                  <div className="flex flex-col items-center gap-2 mt-1">
                    <Input
                      placeholder="Enter property label (e.g Material , Warranty)"
                      value={newLabel}
                      onChange={(e: any) => setNewLabel(e.target.value)}
                    />
                    <button
                      className="px-3 py-2 w-full gap-3 bg-blue-500 text-white !rounded-md flex items-center justify-center"
                      type="button"
                      onClick={addProperty}
                    >
                      <Plus size={20} /><span className="font-semibold"> Add custom Label</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default CustomSelectProperties;
