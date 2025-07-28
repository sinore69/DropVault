import React, { useState } from 'react';
import {
  Folder,
  MoreVertical,
  Star,
  Share2,
  Download,
  Trash2,
  Edit,
  Copy
} from 'lucide-react';
import { FileItem as FileItemType, ViewMode } from '../types';
import { formatFileSize, formatDate, getFileIcon } from '../utils/fileUtils';

interface FileItemProps {
  file: FileItemType;
  viewMode: ViewMode;
  onDoubleClick: (file: FileItemType) => void;
  onStar: (fileId: string) => void;
  onShare: (file: FileItemType) => void;
  onDelete: (fileId: string) => void;
  onRename: (fileId: string, newName: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({
  file,
  viewMode,
  onDoubleClick,
  onStar,
  onShare,
  onDelete,
  onRename
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.name);

  const handleRename = () => {
    if (newName.trim() && newName !== file.name) {
      onRename(file.id, newName.trim());
    }
    setIsRenaming(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewName(file.name);
      setIsRenaming(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="flex items-center px-4 py-2 hover:bg-gray-50 border-b border-gray-100 group">
        <div className="flex items-center flex-1 min-w-0">
          <div className="flex-shrink-0 mr-3">
            {file.type === 'folder' ? (
              <Folder className="w-5 h-5 text-blue-600" />
            ) : (
              <span className="text-lg">{getFileIcon(file.mimeType || '')}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isRenaming ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyPress}
                className="w-full text-sm font-medium text-gray-900 bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <p
                className="text-sm font-medium text-gray-900 truncate cursor-pointer"
                onDoubleClick={() => onDoubleClick(file)}
              >
                {file.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <span className="w-16 text-right">{file.owner}</span>
          <span className="w-20 text-right">{formatDate(file.modifiedAt)}</span>
          <span className="w-16 text-right">
            {file.type === 'file' && file.size ? formatFileSize(file.size) : '-'}
          </span>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onStar(file.id)}
              className={`p-1 rounded hover:bg-gray-200 transition-colors ${file.starred ? 'text-yellow-500' : 'text-gray-400 opacity-0 group-hover:opacity-100'
                }`}
            >
              <Star className="w-4 h-4" fill={file.starred ? 'currentColor' : 'none'} />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 rounded hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[160px]">
                  <button
                    onClick={() => {
                      onShare(file);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsRenaming(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Rename</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <Copy className="w-4 h-4" />
                    <span>Make a copy</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      onDelete(file.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Move to trash</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 group cursor-pointer">
      <div className="p-4" onDoubleClick={() => onDoubleClick(file)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-shrink-0">
            {file.type === 'folder' ? (
              <Folder className="w-12 h-12 text-blue-600" />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                {getFileIcon(file.mimeType || '')}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStar(file.id);
              }}
              className={`p-1 rounded hover:bg-gray-200 transition-colors ${file.starred ? 'text-yellow-500' : 'text-gray-400'
                }`}
            >
              <Star className="w-4 h-4" fill={file.starred ? 'currentColor' : 'none'} />
            </button>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[160px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare(file);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRenaming(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Rename</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <Copy className="w-4 h-4" />
                    <span>Make a copy</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(file.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Move to trash</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyPress}
              className="w-full text-sm font-medium text-gray-900 bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <h3 className="text-sm font-medium text-gray-900 truncate mb-1">{file.name}</h3>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatDate(file.modifiedAt)}</span>
            {file.type === 'file' && file.size && (
              <span>{formatFileSize(file.size)}</span>
            )}
          </div>

          {file.shared && (
            <div className="flex items-center mt-2 text-xs text-blue-600">
              <Share2 className="w-3 h-3 mr-1" />
              <span>Shared</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileItem;
