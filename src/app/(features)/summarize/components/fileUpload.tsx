import React, { useRef, useState } from "react";
import { Upload, File as FileIcon, X, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  validTypes?: string[];
  maxSizeInMB?: number;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  validTypes = [
    "application/pdf",
    "application/msword",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  maxSizeInMB = 10,
  title = "Click or drag and drop your document",
  description = "PDF, DOCX, or TXT files",
  icon = <Upload className="h-12 w-12 text-indigo-500 animate-bounce" />,
  className = "",
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!validTypes.includes(file.type)) {
      return "Invalid file type. Please upload a supported file format.";
    }
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeInMB}MB.`;
    }
    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setFile(file);
    onFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer 
          transition-all duration-200 ease-in-out
          ${
            isDragging
              ? "border-indigo-600 bg-indigo-50"
              : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
          }
          ${error ? "border-red-300 bg-red-50" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleAreaClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={validTypes.join(",")}
          onChange={handleFileChange}
        />

        {!file ? (
          <div className="space-y-4">
            <div className="relative flex justify-center">
              {icon}
              <div className="absolute inset-0 h-12 w-12 rounded-full bg-indigo-100 -z-10 animate-ping" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">{title}</p>
              <p className="mt-2 text-sm text-gray-500">
                {description} up to {maxSizeInMB}MB
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center">
              <FileIcon className="h-8 w-8 text-indigo-600" />
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
