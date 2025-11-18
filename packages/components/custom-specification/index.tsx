import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import Input from "../input";
import { PlusCircle, Trash } from "lucide-react";

const CustomSpecification = ({ control, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "custom_specification",
  });
  return (
    <div>
      <label htmlFor="" className="block font-semibold text-gray-300 mb-1">
        Custom Specification
      </label>
      <div className="flex flex-col gap-3">
        {fields?.map((item, index) => (
          <div key={index} className="flex flex-col gap-2 items-center">
            <Controller
              name={`custom_specification.${index}.name`}
              control={control}
              rules={{ required: "Specification name is required." }}
              render={(field) => (
                <Input
                  label="Specification Name"
                  placeholder="e.g Battery Life , weight , Material"
                  {...field}
                />
              )}
            />
            <Controller
              name={`custom_specification.${index}.name`}
              control={control}
              rules={{ required: "Value is required." }}
               render={(field) => (
                <Input
                  label="Value"
                  placeholder="e.g 4000maH , 120lbs , Plastic"
                  {...field}
                />
              )}
            />
             <button type="button" className="flex items-center justify-center text-white bg-red-500 w-full p-2 !rounded text-center hover:bg-red-700" onClick={()=>remove(index)}>
                <Trash size={20} className="text-center "/> <span className="font-semibold">Delete Custom Property</span>
             </button>
          </div>
        ))}
        <button type="button" className="flex items-center gap-2 text-blue-500 hover:text-blue-700" onClick={()=>append({name:"",value:""})}>
            <PlusCircle size={20}/>Add specification
        </button>
      </div>
      {errors?.custom_specification && (
        <p className="text-red-500 text-xs mt-1">
            {errors?.custom_specification.message as string}
        </p>
      )}
    </div>
  );
};

export default CustomSpecification;
