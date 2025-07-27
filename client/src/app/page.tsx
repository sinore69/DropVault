'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [files, setFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    const res = await fetch('http://localhost:8080/api/files');
    const data = await res.json();
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('media', file);

    await fetch('http://localhost:8080/api/upload', {
      method: 'POST',
      body: formData,
    });

    await fetchFiles();
    setUploading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">📁 Local Drive</h1>

        <label className="block w-full cursor-pointer mb-6">
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
          />
          <div className="w-full text-center py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition">
            {uploading ? 'Uploading...' : 'Click to upload photo/video'}
          </div>
        </label>

        <h2 className="text-xl font-semibold mb-2">Your Files:</h2>
        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {files.map((file) => (
            <li key={file}>
              <a
                href={`http://localhost:8080/api/download?file=${file}`}
                className="text-blue-600 hover:underline break-all"
                download
              >
                {file}
              </a>
            </li>
          ))}
          {files.length === 0 && (
            <p className="text-gray-500 italic">No files uploaded yet.</p>
          )}
        </ul>
      </div>
    </main>
  );
}

