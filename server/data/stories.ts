export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  timestamp: string;
}

export const stories: Story[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Sarah Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=900&fit=crop',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    userId: '3',
    userName: 'Mike Wilson',
    userAvatar: 'https://i.pravatar.cc/150?img=33',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=900&fit=crop',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    userId: '4',
    userName: 'Emma Brown',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=900&fit=crop',
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=900&fit=crop',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
];

