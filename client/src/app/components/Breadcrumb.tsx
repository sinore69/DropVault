import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  path: string[];
  onNavigate: (path: string[]) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
      <button
        onClick={() => onNavigate([])}
        className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>My Drive</span>
      </button>

      {path.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => onNavigate(path.slice(0, index + 1))}
            className="hover:text-blue-600 transition-colors"
          >
            {segment}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
