'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

interface PostProps {
  post: {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    image?: string;
    timestamp: string;
    likes: number;
    comments: Comment[];
  };
  onUpdate: () => void;
}

export default function Post({ post, onUpdate }: PostProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwnPost = user?.id === post.userId;

  const handleLike = async () => {
    try {
      await fetch(`http://localhost:3001/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: liked ? 'unlike' : 'like' }),
      });
      setLiked(!liked);
      onUpdate();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${post.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !user) return;

    try {
      await fetch(`http://localhost:3001/api/posts/${post.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          content: commentText,
        }),
      });
      setCommentText('');
      onUpdate();
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md mb-6">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <Link href={`/profile/${post.userId}`}>
            <div className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer bg-gray-200">
              {post.userAvatar ? (
                <Image
                  src={post.userAvatar}
                  alt={post.userName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                  {post.userName.charAt(0)}
                </div>
              )}
            </div>
          </Link>
          <div className="flex-1">
            <Link href={`/profile/${post.userId}`}>
              <h3 className="font-semibold text-gray-800 hover:underline cursor-pointer">
                {post.userName}
              </h3>
            </Link>
            <p className="text-sm text-gray-500">{getTimeAgo(post.timestamp)}</p>
          </div>
          {isOwnPost && (
            <div className="relative">
              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              {showDeleteConfirm && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowDeleteConfirm(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete Post</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="relative w-full h-96">
          <Image
            src={post.image}
            alt="Post image"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-600 border-b border-gray-200">
        <div className="flex items-center space-x-1">
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </div>
          <span>{post.likes}</span>
        </div>
        <div className="space-x-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline"
          >
            {post.comments.length} comments
          </button>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 flex items-center justify-around border-b border-gray-200">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center ${
            liked ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span className="font-semibold">{liked ? 'Unlike' : 'Like'}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 flex-1 justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-semibold">Comment</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 flex-1 justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="font-semibold">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3">
          {/* Existing Comments */}
          {post.comments.map(comment => (
            <div key={comment.id} className="flex space-x-2 mb-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                {comment.userAvatar ? (
                  <Image
                    src={comment.userAvatar}
                    alt={comment.userName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-semibold">
                    {comment.userName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl px-3 py-2">
                  <h4 className="font-semibold text-sm text-gray-800">{comment.userName}</h4>
                  <p className="text-gray-800 text-sm">{comment.content}</p>
                </div>
                <div className="mt-1 px-3 text-xs text-gray-500">
                  {getTimeAgo(comment.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Add Comment */}
          {user && (
            <div className="flex space-x-2 mt-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-semibold">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                  placeholder="Write a comment..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

