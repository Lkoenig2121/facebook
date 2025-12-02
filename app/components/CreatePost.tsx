'use client';

import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be less than 10MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;
    
    setUploadProgress(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.url;
      }
      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploadProgress(false);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !selectedImage) return;

    setIsPosting(true);
    try {
      let imageUrl = null;
      
      // Upload image first if selected
      if (selectedImage) {
        imageUrl = await uploadImage();
      }
      
      const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          content,
          image: imageUrl,
        }),
      });

      if (response.ok) {
        setContent('');
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setIsPosting(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex space-x-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-200">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
              {user.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
            className="w-full bg-gray-100 rounded-3xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-3 relative">
          <div className="relative rounded-xl overflow-hidden bg-gray-100">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-96 object-contain"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-2 hover:bg-opacity-90 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        className="hidden"
      />

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            >
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">Photo/Video</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">Feeling/Activity</span>
            </button>
          </div>
          <button
            onClick={handlePost}
            disabled={(!content.trim() && !selectedImage) || isPosting || uploadProgress}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              (!content.trim() && !selectedImage) || isPosting || uploadProgress
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {uploadProgress ? 'Uploading...' : isPosting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
