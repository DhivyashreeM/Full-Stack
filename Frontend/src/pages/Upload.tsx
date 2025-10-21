import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, AlertCircle, Zap, Database, X } from 'lucide-react';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileUpload = async () => {
  if (!selectedFile) return;
  
  setIsUploading(true);
  
  try {
    // Create FormData for the actual upload
    const formData = new FormData();
    formData.append('fastaFile', selectedFile);
    formData.append('fileName', selectedFile.name);
    formData.append('fileSize', selectedFile.size.toString());
    
    // In a real application, you would send this to your backend
    console.log('Uploading file:', selectedFile.name, 'Size:', selectedFile.size);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate file ID
    const fileId = 'file_' + Date.now();
    
    // Navigate to processing with file data
    navigate('/processing', { 
      state: { 
        fileId: fileId,
        fileName: selectedFile.name,
        fileSize: selectedFile.size
      } 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    alert('Upload failed. Please try again.');
  } finally {
    setIsUploading(false);
  }
};

  const removeFile = () => {
    setSelectedFile(null);
  };

  const features = [
    {
      icon: Database,
      title: 'Multiple Formats',
      description: 'Supports FASTA, FA, FNA, FFN, FAS, FAA, and FRN files'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Quick analysis with our optimized processing pipeline'
    },
    {
      icon: FileText,
      title: 'Detailed Reports',
      description: 'Comprehensive biodiversity analysis and visualization'
    },
    {
      icon: AlertCircle,
      title: 'Quality Control',
      description: 'Automatic quality assessment and validation'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg border border-slate-200">
              <UploadIcon className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Upload FASTA File
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your FASTA file for comprehensive biodiversity analysis. 
            Get detailed taxonomic distribution, sequence statistics, and quality metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload Area */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              {!selectedFile ? (
                <div
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <UploadIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Choose a FASTA file or drag and drop here
                  </h3>
                  <p className="text-slate-500 mb-6">
                    FASTA, FA, FNA, FFN, FAS, FAA, FRN files up to 100 MB
                  </p>
                  <label className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 cursor-pointer inline-block">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      accept=".fasta,.fa,.fna,.ffn,.fas,.faa,.frn,.txt"
                      onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                    />
                  </label>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {selectedFile.name}
                    </h3>
                    <p className="text-slate-500 mb-4">
                      {(selectedFile.size / 1024).toFixed(2)} KB • Ready to upload
                    </p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={removeFile}
                        className="border border-slate-300 hover:border-slate-400 text-slate-700 font-medium py-2 px-6 rounded-xl transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleFileUpload}
                        disabled={isUploading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <span>Analyze FASTA File</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Processing Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <Zap className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-3 text-lg">
                    What happens during analysis?
                  </h4>
                  <ul className="text-blue-800 space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>Sequence parsing and validation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>Taxonomic classification</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>Biodiversity metrics calculation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>Quality assessment and visualization</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>Report generation with interactive charts</span>
                    </li>
                  </ul>
                  <p className="text-blue-700 text-sm mt-3 font-medium">
                    Typical processing time: 1-5 minutes depending on file size
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Supported Features
              </h3>
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                        <Icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 text-sm">
                          {feature.title}
                        </div>
                        <div className="text-slate-600 text-xs">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* File Requirements */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-teal-900 mb-3">
                File Requirements
              </h3>
              <ul className="text-teal-800 text-sm space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                  <span>Maximum file size: 100MB</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                  <span>Valid FASTA format required</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                  <span>Sequences must start with &gt; header</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                  <span>Nucleotide or protein sequences supported</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
