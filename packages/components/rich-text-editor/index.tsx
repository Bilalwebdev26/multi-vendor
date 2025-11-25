import React, { useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Custom toolbar options
const RichTextEditor = ({ value, onChange }:{value:string,onChange:(content:string)=>void}) => {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          ["clean"],
        ],
      },

      // Image Resize Support (Optional)
      imageResize: {
        displayStyles: {
          backgroundColor: "black",
          border: "none",
          color: "black",
        },
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="w-full">
      <div className="bg-[#1a1a1a] border border-black rounded-md">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Write detailed and formatted product description..."
          className="text-black quill-content placeholder:text-white"
          style={{ minHeight: 250 }}
        />
      </div>

   <style>
  {`
    /* Editor Text - fine/small */
    .ql-editor {
      min-height: 180px;
      color: black;
      font-size: 14px;       /* regular size */
      font-weight: 400;      /* normal weight */
      line-height: 1.5;      /* readable spacing */
    }

    /* Toolbar Background */
    .ql-toolbar {
      background: #111;
      border-color: #333 !important;
    }

    /* Toolbar Buttons White & smaller icons */
    .ql-toolbar .ql-picker,
    .ql-toolbar .ql-stroke,
    .ql-toolbar .ql-fill,
    .ql-toolbar button svg {
      color: white !important;
      stroke: white !important;
      fill: white !important;
      width: 18px;           /* smaller icons */
      height: 18px;          /* smaller icons */
    }

    /* Dropdown icons white */
    .ql-picker-label,
    .ql-picker-item {
      color: white !important;
      font-size: 13px;       /* smaller text in dropdown */
    }

    /* Active & Hover states */
    .ql-toolbar button:hover .ql-stroke,
    .ql-toolbar button:hover .ql-fill,
    .ql-toolbar button.ql-active .ql-stroke,
    .ql-toolbar button.ql-active .ql-fill {
      stroke: #fff !important;
      fill: #fff !important;
    }

    /* Picker dropdown background */
    .ql-picker-options {
      background: #222 !important;
      border: 1px solid #444 !important;
    }

    /* Editor Area */
    .ql-container {
      border-color: #333 !important;
      background: #ffffff;
    }
  `}
</style>


    </div>
  );
};

export default RichTextEditor;
