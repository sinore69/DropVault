import React from 'react';
import { FileItem as FileItemType, ViewMode } from '../types';
import FileItem from './FileItem';

interface FileGridProps {
  files: FileItemType[];
  viewMode: ViewMode;
  onFileDoubleClick: (file: FileItemType) => void;
  onStar: (fileId: string) => void;
  onShare: (file: FileItemType) => void;
  onDelete: (fileId: string) => void;
  onRename: (fileId: string, newName: string) => void;
}

const FileGrid: React.FC<FileGridProps> = ({
  files,
  viewMode,
  onFileDoubleClick,
  onStar,
  onShare,
  onDelete,
  onRename
}) => {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
        </div>
        <p className="text-lg font-medium mb-2">No files here</p>
        <p className="text-sm">Drop files here or use the New button to upload</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="flex-1">Name</div>
          <div className="w-16 text-right">Owner</div>
          <div className="w-20 text-right mx-6">Last modified</div>
          <div className="w-16 text-right mr-12">File size</div>
        </div>
        <div>
          {files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              viewMode={viewMode}
              onDoubleClick={onFileDoubleClick}
              onStar={onStar}
              onShare={onShare}
              onDelete={onDelete}
              onRename={onRename}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          viewMode={viewMode}
          onDoubleClick={onFileDoubleClick}
          onStar={onStar}
          onShare={onShare}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </div>
  );
};

export default FileGrid;
