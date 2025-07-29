import React, { useState, useRef } from 'react';
import { X, Upload, File, FolderPlus } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onFileUpload: (files: FileList) => void;
  onFolderCreate: (name: string) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onFileUpload, onFolderCreate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  };

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    setUploadStatus(null);

    const file = files[0]; // assuming single file upload

    try {
      const res = await fetch(`http://localhost:8080/upload?key=${encodeURIComponent(file.name)}`, {
        //const res = await fetch(`http://localhost:8080/upload?key=image.png`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file, // send raw file binary
      });

      if (!res.ok) throw new Error('Upload failed');

      setUploadStatus('success');
      onFileUpload(files);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const handleFolderCreate = () => {
    if (folderName.trim()) {
      onFolderCreate(folderName.trim());
      setFolderName('');
      setShowFolderInput(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">New</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {showFolderInput ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder name
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="New folder"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFolderInput(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFolderCreate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={uploading}
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop files here to upload
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to select files
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={uploading}
                >
                  <File className="w-4 h-4 mr-2" />
                  Select files
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={() => setShowFolderInput(true)}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FolderPlus className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-gray-700">New folder</span>
              </button>
            </div>
          )}
          {uploading && (
            <div className="flex items-center justify-center space-x-2 text-blue-600 text-sm mt-4">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Uploading...</span>
            </div>
          )}

          {uploadStatus === 'success' && (
            <p className="text-green-600 text-sm text-center mt-4">Upload successful!</p>
          )}

          {uploadStatus === 'error' && (
            <p className="text-red-600 text-sm text-center mt-4">Upload failed. Try again.</p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default UploadModal;

