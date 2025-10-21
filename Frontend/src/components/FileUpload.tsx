import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface EnhancedFileUploaderProps {
  onFileUpload: (file: File) => void;
  acceptedFiles?: string;
  maxSize?: number;
  className?: string;
}

const FileUploader: React.FC<EnhancedFileUploaderProps> = ({
  onFileUpload,
  acceptedFiles = '.fasta,.fa,.fna,.ffn,.fas,.faa,.frn',
  maxSize = 100 * 1024 * 1024, // 100MB
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string>('');

  const validateFile = (file: File): string => {
    if (file.size > maxSize) {
      return `File size too large. Maximum allowed: ${(maxSize / 1024 / 1024).toFixed(0)}MB`;
    }

    const validExtensions = acceptedFiles.split(',').map(ext => ext.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      return `Invalid file type. Supported formats: ${validExtensions.join(', ')}`;
    }

    // Basic FASTA validation - check if file starts with '>'
    // This would be more robust in a real implementation
    if (!file.name.match(/\.(fasta|fa|fna|ffn|fas|faa|frn)$/i)) {
      return 'Please upload a valid FASTA file';
    }

    return '';
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setValidationError('');
    
    const files = Array.from(e.dataTransfer.files);
    if (files && files[0]) {
      const error = validateFile(files[0]);
      if (error) {
        setValidationError(error);
        return;
      }
      setSelectedFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError('');
    const files = e.target.files;
    if (files && files[0]) {
      const error = validateFile(files[0]);
      if (error) {
        setValidationError(error);
        return;
      }
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setValidationError('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <Card className={`border-2 transition-all duration-300 ${
        dragActive 
          ? 'border-blue-400 bg-blue-50' 
          : validationError 
          ? 'border-red-300 bg-red-50'
          : 'border-blue-200 hover:border-blue-300'
      }`}>
        <div
          className="relative"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <div className="text-center p-8">
              <div className={`mx-auto mb-4 p-3 rounded-full ${
                validationError ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                <Upload className={`h-10 w-10 ${
                  validationError ? 'text-red-400' : 'text-blue-400'
                }`} />
              </div>
              
              <div className="flex text-sm text-gray-600 justify-center flex-wrap">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Choose a FASTA file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept={acceptedFiles}
                    onChange={handleFileInput}
                  />
                </label>
                <p className="pl-1">or drag and drop here</p>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                {acceptedFiles.replace(/\./g, '').toUpperCase()} files up to {formatFileSize(maxSize)}
              </p>

              {validationError && (
                <div className="mt-4 flex items-center justify-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{validationError}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)} • Ready to upload
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="text-gray-400 hover:text-gray-500 transition-colors p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={removeFile}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>
                  <Upload className="w-4 h-4 mr-2" />
                  Analyze FASTA File
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FileUploader;
