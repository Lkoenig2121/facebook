export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'friend_request' | 'post_mention';
  actorId: string;
  actorName: string;
  actorAvatar: string;
  postId?: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const notifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'like',
    actorId: '2',
    actorName: 'Sarah Johnson',
    actorAvatar: 'https://i.pravatar.cc/150?img=5',
    postId: '12',
    message: 'liked your post',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '2',
    userId: '1',
    type: 'comment',
    actorId: '3',
    actorName: 'Mike Wilson',
    actorAvatar: 'https://i.pravatar.cc/150?img=33',
    postId: '12',
    message: 'commented on your post: "This is awesome!"',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '3',
    userId: '1',
    type: 'like',
    actorId: '4',
    actorName: 'Emma Brown',
    actorAvatar: 'https://i.pravatar.cc/150?img=9',
    postId: '12',
    message: 'liked your post',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: '4',
    userId: '2',
    type: 'comment',
    actorId: '1',
    actorName: 'John Doe',
    actorAvatar: 'https://i.pravatar.cc/150?img=12',
    postId: '9',
    message: 'commented on your post',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '5',
    userId: '5',
    type: 'like',
    actorId: '6',
    actorName: 'Lisa Chen',
    actorAvatar: 'https://i.pravatar.cc/150?img=10',
    postId: '1',
    message: 'liked your post',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
  },
];

export function getNotificationsByUserId(userId: string): Notification[] {
  return notifications.filter(n => n.userId === userId).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getUnreadCount(userId: string): number {
  return notifications.filter(n => n.userId === userId && !n.read).length;
}

export function markAsRead(notificationId: string): void {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
}

export function markAllAsRead(userId: string): void {
  notifications.forEach(n => {
    if (n.userId === userId) {
      n.read = true;
    }
  });
}

export function createNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Notification {
  const newNotification: Notification = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...notification,
    timestamp: new Date().toISOString(),
  };
  notifications.unshift(newNotification);
  return newNotification;
}

