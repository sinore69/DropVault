import React from 'react';
import {
  Home,
  Users,
  Clock,
  Star,
  Trash2,
  Cloud,
  HardDrive,
  Plus,
  Upload,
  FolderPlus
} from 'lucide-react';

interface SidebarProps {
  onNewFolder: () => void;
  onFileUpload: () => void;
  currentPath: string[];
  onNavigate: (path: string[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onNewFolder,
  onFileUpload,
  currentPath,
  onNavigate
}) => {
  const menuItems = [
    { icon: Home, label: 'My Drive', path: [], count: null },
    { icon: Users, label: 'Shared with me', path: ['shared'], count: 3 },
    { icon: Clock, label: 'Recent', path: ['recent'], count: null },
    { icon: Star, label: 'Starred', path: ['starred'], count: 2 },
    { icon: Trash2, label: 'Trash', path: ['trash'], count: null }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <button
          onClick={onFileUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>New</span>
        </button>

        <div className="mt-4 space-y-1">
          <button
            onClick={onFileUpload}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3"
          >
            <Upload className="w-4 h-4" />
            <span>File upload</span>
          </button>
          <button
            onClick={onNewFolder}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Folder</span>
          </button>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = JSON.stringify(currentPath) === JSON.stringify(item.path);
            return (
              <li key={item.label}>
                <button
                  onClick={() => onNavigate(item.path)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Cloud className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Storage</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>9.5 GB of 15 GB used</span>
            <HardDrive className="w-3 h-3" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
