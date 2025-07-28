import { FileItem, User } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1'
};

export const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    createdAt: new Date('2024-01-15'),
    modifiedAt: new Date('2024-01-20'),
    parentId: null,
    shared: false,
    starred: true,
    owner: 'John Doe'
  },
  {
    id: '2',
    name: 'Photos',
    type: 'folder',
    createdAt: new Date('2024-01-10'),
    modifiedAt: new Date('2024-01-18'),
    parentId: null,
    shared: true,
    starred: false,
    owner: 'John Doe'
  },
  {
    id: '3',
    name: 'Project Proposal.pdf',
    type: 'file',
    size: 2048576,
    mimeType: 'application/pdf',
    createdAt: new Date('2024-01-16'),
    modifiedAt: new Date('2024-01-16'),
    parentId: '1',
    shared: false,
    starred: true,
    owner: 'John Doe'
  },
  {
    id: '4',
    name: 'Presentation.pptx',
    type: 'file',
    size: 5242880,
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    createdAt: new Date('2024-01-14'),
    modifiedAt: new Date('2024-01-17'),
    parentId: '1',
    shared: true,
    starred: false,
    owner: 'John Doe'
  },
  {
    id: '5',
    name: 'Budget.xlsx',
    type: 'file',
    size: 1048576,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    createdAt: new Date('2024-01-12'),
    modifiedAt: new Date('2024-01-19'),
    parentId: '1',
    shared: false,
    starred: false,
    owner: 'John Doe'
  },
  {
    id: '6',
    name: 'vacation-photo.jpg',
    type: 'file',
    size: 3145728,
    mimeType: 'image/jpeg',
    createdAt: new Date('2024-01-08'),
    modifiedAt: new Date('2024-01-08'),
    parentId: '2',
    shared: true,
    starred: true,
    owner: 'John Doe'
  },
  {
    id: '7',
    name: 'team-meeting.mp4',
    type: 'file',
    size: 15728640,
    mimeType: 'video/mp4',
    createdAt: new Date('2024-01-13'),
    modifiedAt: new Date('2024-01-13'),
    parentId: null,
    shared: false,
    starred: false,
    owner: 'John Doe'
  },
  {
    id: '8',
    name: 'README.md',
    type: 'file',
    size: 2048,
    mimeType: 'text/markdown',
    createdAt: new Date('2024-01-11'),
    modifiedAt: new Date('2024-01-15'),
    parentId: null,
    shared: false,
    starred: false,
    owner: 'John Doe'
  }
];
