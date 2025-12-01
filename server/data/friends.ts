export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  status: 'online' | 'offline';
}

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

