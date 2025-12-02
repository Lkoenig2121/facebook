# Facebook Clone

A modern Facebook clone built with Next.js, TypeScript, Express, and Node.js featuring authentication, posts, stories, user profiles, real-time notifications, and friend requests.

## Features

- 🔐 **Login System** - Select from dummy users to login
- 📝 **Posts** - Create, like, unlike, delete, and comment on posts
- ❤️ **Double-Tap to Like** - Instagram-style double-tap on images to like
- 📖 **Stories** - View stories with navigation arrows and keyboard controls
- 👤 **Profile Pages** - View and edit user profiles with Posts, Friends, and Photos tabs
- 👥 **Friends System** - Send, accept, and decline friend requests
- 🔔 **Real-Time Notifications** - Get notified of likes, comments, and friend requests
- 📱 **Mobile Menu** - Responsive hamburger menu for mobile devices
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ⚡ **Real-time Updates** - Dynamic content with auto-polling

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

### Running the Application

Simply run one command to start both servers:

```bash
npm run dev
```

This will concurrently start:

- **Backend Server** on `http://localhost:3001`
- **Frontend Application** on `http://localhost:3000`

#### Alternative: Run Servers Separately

If you prefer to run them separately:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Accessing the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You'll be redirected to the login page
3. Select any of the dummy users to login
4. Start exploring!

## Dummy Users

All users have the password: `password123`

- **John Doe** - john@example.com - Software Developer from Austin, TX
- **Sarah Johnson** - sarah@example.com - Travel Blogger from Denver, CO
- **Mike Wilson** - mike@example.com - Fitness Coach from Phoenix, AZ
- **Emma Brown** - emma@example.com - Artist from Seattle, WA
- And more...

## Project Structure

```
facebook-clone/
├── app/                      # Next.js app directory
│   ├── components/          # React components
│   │   ├── Navbar.tsx      # Navigation bar with mobile menu
│   │   ├── Notifications.tsx # Notification bell & dropdown
│   │   ├── Stories.tsx     # Stories component
│   │   ├── CreatePost.tsx  # Post creation
│   │   ├── Post.tsx        # Post display with like/comment
│   │   ├── Sidebar.tsx     # Left navigation sidebar
│   │   └── FriendsList.tsx # Right sidebar friends list
│   ├── context/            # React context
│   │   └── AuthContext.tsx # Authentication context
│   ├── login/              # Login page
│   ├── profile/[id]/       # Profile pages
│   ├── friends/            # Friends management page
│   ├── watch/              # Watch video page
│   ├── messages/           # Messages page
│   ├── groups/             # Groups page
│   ├── gaming/             # Gaming page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (feed)
├── server/                  # Express backend
│   ├── data/               # Mock data
│   │   ├── users.ts        # User data
│   │   ├── posts.ts        # Post data
│   │   ├── stories.ts      # Story data
│   │   ├── friends.ts      # Friends & friend requests
│   │   └── notifications.ts # Notification data
│   └── index.ts            # Express server
└── package.json            # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start both frontend and backend servers concurrently
- `npm run client` - Start Next.js development server only
- `npm run server` - Start Express backend server only
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication

- `POST /api/login` - Login with email and password
- `GET /api/users` - Get all users

### Users

- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

### Posts

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `DELETE /api/posts/:id` - Delete a post
- `POST /api/posts/:id/like` - Like or unlike a post
- `POST /api/posts/:id/comment` - Comment on a post

### Stories

- `GET /api/stories` - Get all stories

### Friends

- `GET /api/friends/:userId` - Get user's friends list
- `DELETE /api/friends/:userId/:friendId` - Remove a friend

### Friend Requests

- `GET /api/friend-requests/:userId` - Get pending friend requests
- `GET /api/friend-requests/:userId/sent` - Get sent friend requests
- `GET /api/friendship-status/:userId/:targetId` - Check friendship status
- `POST /api/friend-requests` - Send a friend request
- `POST /api/friend-requests/:id/accept` - Accept a friend request
- `POST /api/friend-requests/:id/decline` - Decline a friend request

### Notifications

- `GET /api/notifications/:userId` - Get user's notifications
- `GET /api/notifications/:userId/unread-count` - Get unread notification count
- `POST /api/notifications/:id/read` - Mark notification as read
- `POST /api/notifications/:userId/mark-all-read` - Mark all notifications as read

## Features in Detail

### Login Screen

- Displays all available users with their avatars and names
- Select any user to login (no actual password required for demo)
- Stores user session in localStorage

### Feed

- View all posts from users
- Create new posts
- Like and comment on posts
- Double-tap images to like (Instagram-style with heart animation)
- View stories at the top of the feed

### Stories

- Browse stories from different users
- Click to view full-screen story
- Previous/Next navigation arrows
- Keyboard navigation (←/→ arrows, Esc to close)
- Automatic progress indication

### Profile

- View user information
- Edit your own profile (bio, location, work, education, relationship)
- Posts, Friends, and Photos tabs
- Click photos to navigate to original post
- Add Friend / Message buttons on other profiles
- Profile picture lightbox modal

### Friends System

- **Friends List**: View all friends with online status
- **Friend Requests**: Accept or decline incoming requests
- **Suggestions**: Discover new people to add
- **Send Requests**: Add friends from profiles or suggestions
- **Remove Friends**: Unfriend from profile or friends page

### Notifications

- Real-time notification bell in navbar
- Unread count badge
- Types: Likes, Comments, Friend Requests
- Mark as read / Mark all as read
- Auto-polling every 10 seconds

### Mobile Support

- Responsive three-column layout
- Hamburger menu with full navigation
- Bottom tab bar on friends page
- Touch-friendly interactions

## Future Enhancements

- Real database integration (MongoDB, PostgreSQL)
- Image upload functionality
- Messaging system with real-time chat
- Search functionality
- News feed algorithm
- Video posts
- Reactions (love, laugh, etc.)
- WebSocket for true real-time updates

## License

This is a demo project for educational purposes.
