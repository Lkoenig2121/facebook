export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  status: 'online' | 'offline';
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  toUserName: string;
  toUserAvatar: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
}

// Friend requests
export const friendRequests: FriendRequest[] = [
  {
    id: 'fr-1',
    fromUserId: '5',
    fromUserName: 'Alex Turner',
    fromUserAvatar: 'https://i.pravatar.cc/150?img=59',
    toUserId: '1',
    toUserName: 'John Doe',
    toUserAvatar: 'https://i.pravatar.cc/150?img=12',
    status: 'pending',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fr-2',
    fromUserId: '6',
    fromUserName: 'Lisa Chen',
    fromUserAvatar: 'https://i.pravatar.cc/150?img=10',
    toUserId: '1',
    toUserName: 'John Doe',
    toUserAvatar: 'https://i.pravatar.cc/150?img=12',
    status: 'pending',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fr-3',
    fromUserId: '7',
    fromUserName: 'David Martinez',
    fromUserAvatar: 'https://i.pravatar.cc/150?img=68',
    toUserId: '2',
    toUserName: 'Sarah Johnson',
    toUserAvatar: 'https://i.pravatar.cc/150?img=5',
    status: 'pending',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock friends relationships (bidirectional)
export const friendships: Friend[] = [
  // John Doe's friends
  {
    id: '1',
    userId: '1',
    friendId: '2',
    friendName: 'Sarah Johnson',
    friendAvatar: 'https://i.pravatar.cc/150?img=5',
    status: 'online',
  },
  {
    id: '2',
    userId: '1',
    friendId: '3',
    friendName: 'Mike Wilson',
    friendAvatar: 'https://i.pravatar.cc/150?img=33',
    status: 'online',
  },
  {
    id: '3',
    userId: '1',
    friendId: '4',
    friendName: 'Emma Brown',
    friendAvatar: 'https://i.pravatar.cc/150?img=9',
    status: 'offline',
  },
  
  // Sarah Johnson's friends
  {
    id: '4',
    userId: '2',
    friendId: '1',
    friendName: 'John Doe',
    friendAvatar: 'https://i.pravatar.cc/150?img=12',
    status: 'online',
  },
  {
    id: '5',
    userId: '2',
    friendId: '4',
    friendName: 'Emma Brown',
    friendAvatar: 'https://i.pravatar.cc/150?img=9',
    status: 'offline',
  },
  {
    id: '6',
    userId: '2',
    friendId: '3',
    friendName: 'Mike Wilson',
    friendAvatar: 'https://i.pravatar.cc/150?img=33',
    status: 'online',
  },
  
  // Mike Wilson's friends
  {
    id: '7',
    userId: '3',
    friendId: '1',
    friendName: 'John Doe',
    friendAvatar: 'https://i.pravatar.cc/150?img=12',
    status: 'online',
  },
  {
    id: '8',
    userId: '3',
    friendId: '2',
    friendName: 'Sarah Johnson',
    friendAvatar: 'https://i.pravatar.cc/150?img=5',
    status: 'online',
  },
  
  // Emma Brown's friends
  {
    id: '9',
    userId: '4',
    friendId: '1',
    friendName: 'John Doe',
    friendAvatar: 'https://i.pravatar.cc/150?img=12',
    status: 'online',
  },
  {
    id: '10',
    userId: '4',
    friendId: '2',
    friendName: 'Sarah Johnson',
    friendAvatar: 'https://i.pravatar.cc/150?img=5',
    status: 'online',
  },
];

export function getFriendsByUserId(userId: string): Friend[] {
  return friendships.filter(f => f.userId === userId);
}

export function getFriendRequestsForUser(userId: string): FriendRequest[] {
  return friendRequests.filter(fr => fr.toUserId === userId && fr.status === 'pending')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getSentFriendRequests(userId: string): FriendRequest[] {
  return friendRequests.filter(fr => fr.fromUserId === userId && fr.status === 'pending');
}

export function areFriends(userId1: string, userId2: string): boolean {
  return friendships.some(f => f.userId === userId1 && f.friendId === userId2);
}

export function hasPendingRequest(fromUserId: string, toUserId: string): boolean {
  return friendRequests.some(fr => 
    ((fr.fromUserId === fromUserId && fr.toUserId === toUserId) ||
     (fr.fromUserId === toUserId && fr.toUserId === fromUserId)) &&
    fr.status === 'pending'
  );
}

export function sendFriendRequest(
  fromUser: { id: string; name: string; avatar: string },
  toUser: { id: string; name: string; avatar: string }
): FriendRequest {
  const newRequest: FriendRequest = {
    id: `fr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fromUserId: fromUser.id,
    fromUserName: fromUser.name,
    fromUserAvatar: fromUser.avatar,
    toUserId: toUser.id,
    toUserName: toUser.name,
    toUserAvatar: toUser.avatar,
    status: 'pending',
    timestamp: new Date().toISOString(),
  };
  friendRequests.push(newRequest);
  return newRequest;
}

export function acceptFriendRequest(requestId: string): boolean {
  const request = friendRequests.find(fr => fr.id === requestId);
  if (!request || request.status !== 'pending') return false;
  
  request.status = 'accepted';
  
  // Add bidirectional friendship
  const newFriendshipId1 = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newFriendshipId2 = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-2`;
  
  friendships.push({
    id: newFriendshipId1,
    userId: request.fromUserId,
    friendId: request.toUserId,
    friendName: request.toUserName,
    friendAvatar: request.toUserAvatar,
    status: 'online',
  });
  
  friendships.push({
    id: newFriendshipId2,
    userId: request.toUserId,
    friendId: request.fromUserId,
    friendName: request.fromUserName,
    friendAvatar: request.fromUserAvatar,
    status: 'online',
  });
  
  return true;
}

export function declineFriendRequest(requestId: string): boolean {
  const request = friendRequests.find(fr => fr.id === requestId);
  if (!request || request.status !== 'pending') return false;
  
  request.status = 'declined';
  return true;
}

export function removeFriend(userId: string, friendId: string): boolean {
  const index1 = friendships.findIndex(f => f.userId === userId && f.friendId === friendId);
  const index2 = friendships.findIndex(f => f.userId === friendId && f.friendId === userId);
  
  if (index1 !== -1) friendships.splice(index1, 1);
  if (index2 !== -1) friendships.splice(index2 > index1 ? index2 - 1 : index2, 1);
  
  return index1 !== -1 || index2 !== -1;
}
