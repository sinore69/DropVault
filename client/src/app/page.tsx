"use client"
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Breadcrumb from './components/Breadcrumb';
import FileGrid from './components/FileGrid';
import ShareModal from './components/ShareModal';
import UploadModal from './components/UploadModal';
import { FileItem, ViewMode } from './types';
import { mockFiles, currentUser } from './data/mockData';

function App() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [shareModalFile, setShareModalFile] = useState<FileItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const currentFolderId = currentPath.length > 0
    ? files.find(f => f.type === 'folder' && f.name === currentPath[currentPath.length - 1])?.id || null
    : null;

  const filteredFiles = useMemo(() => {
    const filtered = files.filter(file => {
      // Filter by current folder
      if (file.parentId !== currentFolderId) return false;

      // Filter by search query
      if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });

    // Sort files (folders first, then by name)
    return filtered.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [files, currentFolderId, searchQuery]);

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath([...currentPath, file.name]);
    }
  };

  const handleNavigate = (path: string[]) => {
    setCurrentPath(path);
  };

  const handleStar = (fileId: string) => {
    setFiles(files.map(file =>
      file.id === fileId ? { ...file, starred: !file.starred } : file
    ));
  };

  const handleShare = (file: FileItem) => {
    setShareModalFile(file);
  };

  const handleDelete = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
  };

  const handleRename = (fileId: string, newName: string) => {
    setFiles(files.map(file =>
      file.id === fileId ? { ...file, name: newName } : file
    ));
  };

  const handleFileUpload = (uploadedFiles: FileList) => {
    const newFiles: FileItem[] = Array.from(uploadedFiles).map((file, index) => ({
      id: Date.now().toString() + index,
      name: file.name,
      type: 'file' as const,
      size: file.size,
      mimeType: file.type,
      createdAt: new Date(),
      modifiedAt: new Date(),
      parentId: currentFolderId,
      shared: false,
      starred: false,
      owner: currentUser.name
    }));

    setFiles([...files, ...newFiles]);
  };

  const handleFolderCreate = (name: string) => {
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name,
      type: 'folder',
      createdAt: new Date(),
      modifiedAt: new Date(),
      parentId: currentFolderId,
      shared: false,
      starred: false,
      owner: currentUser.name
    };

    setFiles([...files, newFolder]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        user={currentUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onNewFolder={() => setShowUploadModal(true)}
          onFileUpload={() => setShowUploadModal(true)}
          currentPath={currentPath}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Breadcrumb path={currentPath} onNavigate={handleNavigate} />

            <FileGrid
              files={filteredFiles}
              viewMode={viewMode}
              onFileDoubleClick={handleFileDoubleClick}
              onStar={handleStar}
              onShare={handleShare}
              onDelete={handleDelete}
              onRename={handleRename}
            />
          </div>
        </main>
      </div>

      {shareModalFile && (
        <ShareModal
          file={shareModalFile}
          onClose={() => setShareModalFile(null)}
        />
      )}

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onFileUpload={handleFileUpload}
          onFolderCreate={handleFolderCreate}
        />
      )}
    </div>
  );
}

export default App;
