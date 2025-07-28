export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  mimeType?: string;
  createdAt: Date;
  modifiedAt: Date;
  parentId: string | null;
  shared: boolean;
  starred: boolean;
  owner: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export type ViewMode = 'grid' | 'list';
export type SortBy = 'name' | 'modified' | 'size';
export type SortOrder = 'asc' | 'desc';
