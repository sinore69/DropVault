import React, { useState } from 'react';
import { X, Copy, Link, Mail, Users, Globe } from 'lucide-react';
import { FileItem } from '../types';

interface ShareModalProps {
  file: FileItem | null;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ file, onClose }) => {
  const [shareSettings, setShareSettings] = useState('restricted');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');

  if (!file) return null;

  const shareLink = `https://drive.example.com/file/d/${file.id}/view`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Share "{file.name}"</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Link className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="w-full bg-transparent text-sm text-gray-700 border-none focus:outline-none"
              />
            </div>
            <button
              onClick={copyLink}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center space-x-1"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add people and groups
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="Add email addresses"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="viewer">Viewer</option>
                <option value="commenter">Commenter</option>
                <option value="editor">Editor</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Send
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              General access
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="access"
                  value="restricted"
                  checked={shareSettings === 'restricted'}
                  onChange={(e) => setShareSettings(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Restricted</div>
                  <div className="text-xs text-gray-500">Only people with access can open with the link</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="access"
                  value="organization"
                  checked={shareSettings === 'organization'}
                  onChange={(e) => setShareSettings(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Anyone in your organization</div>
                  <div className="text-xs text-gray-500">Anyone in your organization can find and access</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="access"
                  value="public"
                  checked={shareSettings === 'public'}
                  onChange={(e) => setShareSettings(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Anyone with the link</div>
                  <div className="text-xs text-gray-500">Anyone on the internet with the link can view</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
