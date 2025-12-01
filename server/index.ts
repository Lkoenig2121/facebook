import express, { Request, Response } from 'express';
import cors from 'cors';
import { users, User } from './data/users';
import { posts, Post } from './data/posts';
import { stories } from './data/stories';
import { getFriendsByUserId } from './data/friends';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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
  const { action } = req.body; // 'like' or 'unlike'
  
  if (post) {
    if (action === 'unlike' && post.likes > 0) {
      post.likes -= 1;
    } else if (action === 'like') {
      post.likes += 1;
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
    // Generate a unique ID using timestamp and random number
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newComment = {
      id: uniqueId,
      ...req.body,
      timestamp: new Date().toISOString(),
    };
    post.comments.push(newComment);
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

