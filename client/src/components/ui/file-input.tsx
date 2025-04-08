import * as React from "react";
import { cn } from "@/lib/utils";
import { FormControl, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  preview?: boolean;
  onValueChange?: (value: string) => void;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, preview = true, onValueChange, ...props }, ref) => {
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setPreviewUrl(base64String);
          if (onValueChange) {
            onValueChange(base64String);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex flex-col items-center justify-center w-full">
          <label
            htmlFor={props.id}
            className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-3 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
            <Input
              ref={ref}
              {...props}
              onChange={handleChange}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>
        
        {preview && previewUrl && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-40 max-w-xs rounded-md object-cover"
            />
          </div>
        )}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };

export const FormFileInput = React.forwardRef<
  HTMLInputElement,
  FileInputProps & {
    name: string;
    label?: string;
  }
>(({ name, label, className, ...props }, ref) => {
  return (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <FileInput ref={ref} id={name} name={name} {...props} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
});

FormFileInput.displayName = "FormFileInput";
