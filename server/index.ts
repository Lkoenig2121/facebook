import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { users, User } from './data/users';
import { posts, Post } from './data/posts';
import { stories } from './data/stories';
import { 
  getFriendsByUserId, 
  getFriendRequestsForUser,
  getSentFriendRequests,
  areFriends,
  hasPendingRequest,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend
} from './data/friends';
import { 
  getNotificationsByUserId, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead,
  createNotification 
} from './data/notifications';

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Auth routes
app.post('/api/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get all users (for login screen)
app.get('/api/users', (req: Request, res: Response) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json(usersWithoutPasswords);
});

// Get user by ID
app.get('/api/users/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Update user profile
app.put('/api/users/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...req.body, id: userId };
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Get all posts
app.get('/api/posts', (req: Request, res: Response) => {
  res.json(posts);
});

// Upload image endpoint
app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  
  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl, filename: req.file.filename });
});

// Upload multiple images
app.post('/api/upload/multiple', upload.array('images', 10), (req: Request, res: Response) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    res.status(400).json({ error: 'No files uploaded' });
    return;
  }
  
  const urls = req.files.map(file => ({
    url: `http://localhost:${PORT}/uploads/${file.filename}`,
    filename: file.filename
  }));
  res.json({ urls });
});

// Create a new post
app.post('/api/posts', (req: Request, res: Response) => {
  // Generate a unique ID using timestamp and random number
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newPost: Post = {
    id: uniqueId,
    ...req.body,
    timestamp: new Date().toISOString(),
    likes: 0,
    comments: [],
  };
  posts.unshift(newPost);
  res.json(newPost);
});

// Like/Unlike a post
app.post('/api/posts/:id/like', (req: Request, res: Response) => {
  const post = posts.find(p => p.id === req.params.id);
  const { action, userId, userName, userAvatar } = req.body;
  
  if (post) {
    if (action === 'unlike' && post.likes > 0) {
      post.likes -= 1;
    } else if (action === 'like') {
      post.likes += 1;
      
      // Create notification for post owner (if not liking own post)
      if (post.userId !== userId) {
        createNotification({
          userId: post.userId,
          type: 'like',
          actorId: userId,
          actorName: userName,
          actorAvatar: userAvatar,
          postId: post.id,
          message: 'liked your post',
          read: false,
        });
      }
    }
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Add comment to post
app.post('/api/posts/:id/comment', (req: Request, res: Response) => {
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    const { userId, userName, userAvatar, content } = req.body;
    
    // Generate a unique ID using timestamp and random number
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newComment = {
      id: uniqueId,
      userId,
      userName,
      userAvatar,
      content,
      timestamp: new Date().toISOString(),
    };
    post.comments.push(newComment);
    
    // Create notification for post owner (if not commenting on own post)
    if (post.userId !== userId) {
      const commentPreview = content.length > 50 ? content.substring(0, 50) + '...' : content;
      createNotification({
        userId: post.userId,
        type: 'comment',
        actorId: userId,
        actorName: userName,
        actorAvatar: userAvatar,
        postId: post.id,
        message: `commented on your post: "${commentPreview}"`,
        read: false,
      });
    }
    
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Delete a post
app.delete('/api/posts/:id', (req: Request, res: Response) => {
  const postIndex = posts.findIndex(p => p.id === req.params.id);
  if (postIndex !== -1) {
    posts.splice(postIndex, 1);
    res.json({ success: true, message: 'Post deleted' });
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Get all stories
app.get('/api/stories', (req: Request, res: Response) => {
  res.json(stories);
});

// Get friends by user ID
app.get('/api/friends/:userId', (req: Request, res: Response) => {
  const friends = getFriendsByUserId(req.params.userId);
  res.json(friends);
});

// Get friend requests for user
app.get('/api/friend-requests/:userId', (req: Request, res: Response) => {
  const requests = getFriendRequestsForUser(req.params.userId);
  res.json(requests);
});

// Get sent friend requests
app.get('/api/friend-requests/:userId/sent', (req: Request, res: Response) => {
  const requests = getSentFriendRequests(req.params.userId);
  res.json(requests);
});

// Check friendship status
app.get('/api/friendship-status/:userId/:targetId', (req: Request, res: Response) => {
  const { userId, targetId } = req.params;
  const isFriend = areFriends(userId, targetId);
  const hasPending = hasPendingRequest(userId, targetId);
  res.json({ isFriend, hasPendingRequest: hasPending });
});

// Send friend request
app.post('/api/friend-requests', (req: Request, res: Response) => {
  const { fromUser, toUser } = req.body;
  
  // Check if already friends
  if (areFriends(fromUser.id, toUser.id)) {
    res.status(400).json({ message: 'Already friends' });
    return;
  }
  
  // Check if request already exists
  if (hasPendingRequest(fromUser.id, toUser.id)) {
    res.status(400).json({ message: 'Friend request already pending' });
    return;
  }
  
  const request = sendFriendRequest(fromUser, toUser);
  
  // Create notification for the recipient
  createNotification({
    userId: toUser.id,
    type: 'friend_request',
    actorId: fromUser.id,
    actorName: fromUser.name,
    actorAvatar: fromUser.avatar,
    message: 'sent you a friend request',
    read: false,
  });
  
  res.json(request);
});

// Accept friend request
app.post('/api/friend-requests/:id/accept', (req: Request, res: Response) => {
  const success = acceptFriendRequest(req.params.id);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ message: 'Friend request not found' });
  }
});

// Decline friend request
app.post('/api/friend-requests/:id/decline', (req: Request, res: Response) => {
  const success = declineFriendRequest(req.params.id);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ message: 'Friend request not found' });
  }
});

// Remove friend
app.delete('/api/friends/:userId/:friendId', (req: Request, res: Response) => {
  const { userId, friendId } = req.params;
  const success = removeFriend(userId, friendId);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ message: 'Friendship not found' });
  }
});

// Notifications endpoints
app.get('/api/notifications/:userId', (req: Request, res: Response) => {
  const userNotifications = getNotificationsByUserId(req.params.userId);
  res.json(userNotifications);
});

app.get('/api/notifications/:userId/unread-count', (req: Request, res: Response) => {
  const count = getUnreadCount(req.params.userId);
  res.json({ count });
});

app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
  markAsRead(req.params.id);
  res.json({ success: true });
});

app.post('/api/notifications/:userId/mark-all-read', (req: Request, res: Response) => {
  markAllAsRead(req.params.userId);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

