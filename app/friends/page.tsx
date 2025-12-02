"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";

interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  status: "online" | "offline";
}

interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  toUserName: string;
  toUserAvatar: string;
  status: "pending" | "accepted" | "declined";
  timestamp: string;
}

interface Suggestion {
  id: string;
  name: string;
  avatar: string;
  location?: string;
}

export default function FriendsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeTab, setActiveTab] = useState<
    "all" | "requests" | "suggestions"
  >("all");
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(
    new Set()
  );

  const fetchFriends = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/friends/${user.id}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }, [user]);

  const fetchFriendRequests = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/friend-requests/${user.id}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setFriendRequests(data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  }, [user]);

  const fetchSuggestions = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch("http://localhost:3001/api/users");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const allUsers = await response.json();

      // Filter out current user and existing friends
      const friendIds = new Set(friends.map((f) => f.friendId));
      const pendingRequestIds = new Set([
        ...friendRequests.map((r) => r.fromUserId),
      ]);

      const filteredSuggestions = allUsers
        .filter(
          (u: {
            id: string;
            name: string;
            avatar: string;
            location?: string;
          }) =>
            u.id !== user.id &&
            !friendIds.has(u.id) &&
            !pendingRequestIds.has(u.id)
        )
        .slice(0, 6);

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, [user, friends, friendRequests]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchFriends();
    fetchFriendRequests();
  }, [user, router, fetchFriends, fetchFriendRequests]);

  useEffect(() => {
    if (activeTab === "suggestions") {
      fetchSuggestions();
    }
  }, [activeTab, fetchSuggestions]);

  const handleAcceptRequest = async (requestId: string) => {
    setProcessingRequests((prev) => new Set(prev).add(requestId));

    try {
      const response = await fetch(
        `http://localhost:3001/api/friend-requests/${requestId}/accept`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        fetchFriendRequests();
        fetchFriends();
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    setProcessingRequests((prev) => new Set(prev).add(requestId));

    try {
      const response = await fetch(
        `http://localhost:3001/api/friend-requests/${requestId}/decline`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        fetchFriendRequests();
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleSendRequest = async (targetUser: Suggestion) => {
    if (!user) return;

    try {
      const response = await fetch(
        "http://localhost:3001/api/friend-requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromUser: {
              id: user.id,
              name: user.name,
              avatar: user.avatar,
            },
            toUser: {
              id: targetUser.id,
              name: targetUser.name,
              avatar: targetUser.avatar,
            },
          }),
        }
      );

      if (response.ok) {
        setSuggestions((prev) => prev.filter((s) => s.id !== targetUser.id));
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/friends/${user.id}/${friendId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchFriends();
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-6 px-4 pb-12">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-20">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Friends</h1>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "all"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">All Friends</p>
                    <p className="text-xs text-gray-500">
                      {friends.length} friends
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("requests")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "requests"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Friend Requests</p>
                    <p className="text-xs text-gray-500">
                      {friendRequests.length} requests
                    </p>
                  </div>
                  {friendRequests.length > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {friendRequests.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("suggestions")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "suggestions"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z" />
                  </svg>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Suggestions</p>
                    <p className="text-xs text-gray-500">People you may know</p>
                  </div>
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Tabs */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
            <div className="flex">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 py-3 text-center ${
                  activeTab === "all"
                    ? "text-blue-600 border-t-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                <svg
                  className="w-6 h-6 mx-auto mb-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="text-xs">Friends</span>
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`flex-1 py-3 text-center relative ${
                  activeTab === "requests"
                    ? "text-blue-600 border-t-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                <svg
                  className="w-6 h-6 mx-auto mb-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                <span className="text-xs">Requests</span>
                {friendRequests.length > 0 && (
                  <span className="absolute top-2 right-1/4 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {friendRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("suggestions")}
                className={`flex-1 py-3 text-center ${
                  activeTab === "suggestions"
                    ? "text-blue-600 border-t-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                <svg
                  className="w-6 h-6 mx-auto mb-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z" />
                </svg>
                <span className="text-xs">Suggestions</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 pb-20 lg:pb-0">
            {activeTab === "all" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    All Friends ({friends.length})
                  </h2>
                  <input
                    type="text"
                    placeholder="Search friends..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {friends.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                      >
                        <Link href={`/profile/${friend.friendId}`}>
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gray-200">
                            {friend.friendAvatar && (
                              <Image
                                src={friend.friendAvatar}
                                alt={friend.friendName}
                                fill
                                className="object-cover"
                              />
                            )}
                            {friend.status === "online" && (
                              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {friend.friendName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {friend.status === "online"
                              ? "Active now"
                              : "Offline"}
                          </p>
                        </Link>
                        <button
                          onClick={() => handleRemoveFriend(friend.friendId)}
                          className="mt-3 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                          Remove Friend
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <p className="text-gray-500">No friends yet</p>
                    <button
                      onClick={() => setActiveTab("suggestions")}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Find Friends
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "requests" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Friend Requests ({friendRequests.length})
                </h2>

                {friendRequests.length > 0 ? (
                  <div className="space-y-4">
                    {friendRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                      >
                        <Link
                          href={`/profile/${request.fromUserId}`}
                          className="flex items-center space-x-4"
                        >
                          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                            {request.fromUserAvatar ? (
                              <Image
                                src={request.fromUserAvatar}
                                alt={request.fromUserName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl text-gray-500 font-semibold">
                                {request.fromUserName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {request.fromUserName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {getTimeAgo(request.timestamp)}
                            </p>
                          </div>
                        </Link>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
                            disabled={processingRequests.has(request.id)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingRequests.has(request.id)
                              ? "Confirming..."
                              : "Confirm"}
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(request.id)}
                            disabled={processingRequests.has(request.id)}
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    <p className="text-gray-500">No pending friend requests</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "suggestions" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  People You May Know
                </h2>

                {suggestions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <Link href={`/profile/${suggestion.id}`}>
                          <div className="relative w-full aspect-square bg-gray-200">
                            {suggestion.avatar ? (
                              <Image
                                src={suggestion.avatar}
                                alt={suggestion.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500 font-semibold">
                                {suggestion.name.charAt(0)}
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link href={`/profile/${suggestion.id}`}>
                            <h3 className="font-semibold text-gray-800 mb-1 hover:underline">
                              {suggestion.name}
                            </h3>
                          </Link>
                          {suggestion.location && (
                            <p className="text-sm text-gray-500 mb-3">
                              {suggestion.location}
                            </p>
                          )}
                          <button
                            onClick={() => handleSendRequest(suggestion)}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          >
                            Add Friend
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-gray-500">
                      No suggestions available right now
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
