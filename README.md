# Facebook Clone

A modern Facebook clone built with Next.js, TypeScript, Express, and Node.js featuring authentication, posts, stories, and user profiles.

## Features

- 🔐 **Login System** - Select from dummy users to login
- 📝 **Posts** - Create, like, and comment on posts
- 📖 **Stories** - View stories from other users
- 👤 **Profile Pages** - View and edit user profiles
- 👥 **Friends Feed** - See your friends list with online status indicators
- 📱 **Three-Column Layout** - Left sidebar with navigation, center feed, right sidebar with friends
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ⚡ **Real-time Updates** - Dynamic content updates

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

- **John Doe** - john@example.com - Software Developer from Manchester
- **Sarah Johnson** - sarah@example.com - Travel Blogger from London
- **Mike Wilson** - mike@example.com - Fitness Coach from Birmingham
- **Emma Brown** - emma@example.com - Artist from Edinburgh

## Project Structure

```
facebook-clone/
├── app/                      # Next.js app directory
│   ├── components/          # React components
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── Stories.tsx     # Stories component
│   │   ├── CreatePost.tsx  # Post creation
│   │   └── Post.tsx        # Post display
│   ├── context/            # React context
│   │   └── AuthContext.tsx # Authentication context
│   ├── login/              # Login page
│   ├── profile/[id]/       # Profile pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (feed)
├── server/                  # Express backend
│   ├── data/               # Dummy data
│   │   ├── users.ts        # User data
│   │   ├── posts.ts        # Post data
│   │   └── stories.ts      # Story data
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
- `POST /api/posts/:id/like` - Like a post
- `POST /api/posts/:id/comment` - Comment on a post

### Stories

- `GET /api/stories` - Get all stories

### Friends

- `GET /api/friends/:userId` - Get user's friends list

## Features in Detail

### Login Screen

- Displays all available users with their avatars and names
- Select any user to login (no actual password required for demo)
- Stores user session in localStorage

### Feed

- View all posts from users
- Create new posts
- Like and comment on posts
- View stories at the top of the feed

### Stories

- Browse stories from different users
- Click to view full-screen story
- Automatic progress indication

### Profile

- View user information
- Edit your own profile (bio, location, work, education, relationship)
- Change profile picture and cover photo (UI only)
- View user's posts

### Friends & Layout

- **Left Sidebar**: Quick navigation with shortcuts to Profile, Friends, Watch, Messages, Groups, and Gaming
- **Right Sidebar**: Friends list showing online/offline status with green indicators
- Click any friend to visit their profile
- Three-column responsive layout (desktop) that collapses on mobile

## Future Enhancements

- Real database integration (MongoDB, PostgreSQL)
- Image upload functionality
- Real-time notifications
- Friend requests and friends list
- Messaging system
- Search functionality
- News feed algorithm
- Video posts
- Reactions (love, laugh, etc.)

## License

This is a demo project for educational purposes.
