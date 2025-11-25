import React, { forwardRef, HTMLElementType } from "react";
interface BaseProps {
  label?: string;
  type?: "text" | "number" | "password" | "email" | "textarea";
  className?: string;
}
type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type Props = InputProps | TextareaProps;
const Input = forwardRef<HTMLElement | HTMLTextAreaElement, Props>(
  ({ label, type = "text", className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block font-semibold  mb-1">
            {label}
          </label>
        )}
        {type === "textarea" ? (
          <textarea
            className={`w-full border outline-none border-gray-700 bg-transparent p-2 rounded-md text-white ${className}`}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            {...(props as TextareaProps)}
          ></textarea>
        ) : (
          <input
            type={type}
            ref={ref as React.Ref<HTMLInputElement>}
            className={`w-full border !rounded  outline-none border-gray-700 bg-transparent p-2  text-white ${className}`}
            {...(props as InputProps)}
          />
        )}
      </div>
    );
  }
);

Input.displayName="input"
export default Input