import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import extractTextFromPDF from './extractTextFromPDF';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css';

const FileUpload = ({ onFilesUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = async (acceptedFiles) => {
    setIsDragging(false);
    const extractedFiles = await Promise.all(
      acceptedFiles.map((file) => extractTextFromPDF(file))
    );
    toast.success('Resume uploaded successfully!');
    onFilesUploaded(extractedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    accept: 'application/pdf',
    maxSize: 5 * 1024 * 1024, // Limit to 5MB per file
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-100 dark:bg-blue-900'
          : 'border-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      aria-label="File upload area"
    >
        <ToastContainer position="top-right" autoClose={3000} /> {/* Toast container */}
      <input {...getInputProps()} />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v16m8-8H4"
        />
      </svg>
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
        Drag & drop your resume(s) here, or{' '}
        <span className="text-blue-600 underline cursor-pointer">
          click to select files
        </span>
      </p>
      <p className="text-sm text-gray-500 mt-2">
        PDF files only, max size: 5MB per file
      </p>
    </div>
  );
};

export default FileUpload;
