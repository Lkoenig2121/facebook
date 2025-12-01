export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export const posts: Post[] = [
  {
    id: '1',
    userId: '5',
    userName: 'David Martinez',
    userAvatar: 'https://i.pravatar.cc/150?img=13',
    content: 'Just finished an incredible snorkeling session at Thunderball Grotto! The marine life here is absolutely breathtaking 🐠🤿 #BahamasLife #Snorkeling',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    likes: 234,
    comments: [
      {
        id: '1',
        userId: '6',
        userName: 'Lisa Chen',
        userAvatar: 'https://i.pravatar.cc/150?img=10',
        content: 'This looks amazing! I need to visit soon! 😍',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '2',
    userId: '6',
    userName: 'Lisa Chen',
    userAvatar: 'https://i.pravatar.cc/150?img=10',
    content: 'Swimming with sea turtles in the crystal clear waters of the Bahamas! This is what paradise looks like 🐢💙 Best vacation ever!',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 456,
    comments: [
      {
        id: '2',
        userId: '5',
        userName: 'David Martinez',
        userAvatar: 'https://i.pravatar.cc/150?img=13',
        content: 'The sea turtles there are so friendly! Glad you got to experience it! 🐢',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        userId: '9',
        userName: 'Alex Turner',
        userAvatar: 'https://i.pravatar.cc/150?img=14',
        content: 'I take tours there every week and it never gets old!',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '3',
    userId: '7',
    userName: 'James Thompson',
    userAvatar: 'https://i.pravatar.cc/150?img=15',
    content: 'Documenting the beautiful coral reefs of Andros Island. The biodiversity here is incredible! Proud to be working on conservation efforts to protect these treasures 🪸🌊',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    likes: 312,
    comments: [
      {
        id: '4',
        userId: '8',
        userName: 'Sophia Rodriguez',
        userAvatar: 'https://i.pravatar.cc/150?img=47',
        content: 'Thank you for your amazing conservation work! 🙏',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '4',
    userId: '9',
    userName: 'Alex Turner',
    userAvatar: 'https://i.pravatar.cc/150?img=14',
    content: 'Another day in paradise! Snorkeling at Exuma Cays was mind-blowing today. Spotted stingrays, tropical fish, and even a nurse shark! 🦈🐠 #SnorkelingLife #Bahamas',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes: 523,
    comments: [],
  },
  {
    id: '5',
    userId: '8',
    userName: 'Sophia Rodriguez',
    userAvatar: 'https://i.pravatar.cc/150?img=47',
    content: 'Morning yoga session on the beach followed by snorkeling in the turquoise waters... This is what dreams are made of! 🧘‍♀️🌊 Living my best life in Exuma!',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 389,
    comments: [
      {
        id: '5',
        userId: '10',
        userName: 'Maria Santos',
        userAvatar: 'https://i.pravatar.cc/150?img=20',
        content: 'You should host a retreat at our resort! 🏖️',
        timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '6',
    userId: '10',
    userName: 'Maria Santos',
    userAvatar: 'https://i.pravatar.cc/150?img=20',
    content: 'Our guests at Ocean View Resort got to experience the famous swimming pigs today! The joy on their faces is priceless 🐷🏝️ #BahamasExperience',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likes: 678,
    comments: [
      {
        id: '6',
        userId: '2',
        userName: 'Sarah Johnson',
        userAvatar: 'https://i.pravatar.cc/150?img=5',
        content: 'This is on my bucket list! 🐷',
        timestamp: new Date(Date.now() - 5.5 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '7',
    userId: '6',
    userName: 'Lisa Chen',
    userAvatar: 'https://i.pravatar.cc/150?img=10',
    content: 'Golden hour snorkeling hits different when you\'re surrounded by schools of tropical fish in the Bahamas 🌅🐠 Mother Nature showing off!',
    image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 445,
    comments: [],
  },
  {
    id: '8',
    userId: '5',
    userName: 'David Martinez',
    userAvatar: 'https://i.pravatar.cc/150?img=13',
    content: 'Teaching a group of beginners today at Paradise Divers! There\'s nothing like seeing someone\'s face light up when they see their first tropical fish underwater 🤿✨ #DivingInstructor #PassionForTheOcean',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    likes: 267,
    comments: [
      {
        id: '7',
        userId: '9',
        userName: 'Alex Turner',
        userAvatar: 'https://i.pravatar.cc/150?img=14',
        content: 'That\'s the best part of the job! 🤿',
        timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '9',
    userId: '2',
    userName: 'Sarah Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    content: 'Just arrived in the Bahamas and WOW! The water is so clear you can see fish from the boat! Can\'t wait to go snorkeling tomorrow! 🚤🐠 #TravelBlogger #BahamasBound',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likes: 892,
    comments: [
      {
        id: '8',
        userId: '5',
        userName: 'David Martinez',
        userAvatar: 'https://i.pravatar.cc/150?img=13',
        content: 'Hit me up if you need a guide! 🤿',
        timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '9',
        userId: '1',
        userName: 'John Doe',
        userAvatar: 'https://i.pravatar.cc/150?img=12',
        content: 'So jealous! Have an amazing time!',
        timestamp: new Date(Date.now() - 11.5 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '10',
    userId: '7',
    userName: 'James Thompson',
    userAvatar: 'https://i.pravatar.cc/150?img=15',
    content: 'Found a beautiful spotted eagle ray today during our reef survey! These magnificent creatures are a sign of a healthy reef ecosystem 🌊🦅 #MarineBiology #Conservation',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    likes: 534,
    comments: [],
  },
  {
    id: '11',
    userId: '9',
    userName: 'Alex Turner',
    userAvatar: 'https://i.pravatar.cc/150?img=14',
    content: 'Sunset snorkeling session at Dean\'s Blue Hole! The underwater visibility here is absolutely unreal 🌅🤿 Who wants to join next time?',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    likes: 723,
    comments: [
      {
        id: '10',
        userId: '6',
        userName: 'Lisa Chen',
        userAvatar: 'https://i.pravatar.cc/150?img=10',
        content: 'Count me in! 🙋‍♀️',
        timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '12',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    content: 'Just finished working on an amazing project! Feeling accomplished 🚀',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    likes: 42,
    comments: [],
  },
  {
    id: '13',
    userId: '8',
    userName: 'Sophia Rodriguez',
    userAvatar: 'https://i.pravatar.cc/150?img=47',
    content: 'Underwater meditation session complete! There\'s something so peaceful about floating in the warm Caribbean waters surrounded by colorful fish 🧘‍♀️🐠 #UnderwaterYoga #Wellness',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    likes: 401,
    comments: [],
  },
  {
    id: '14',
    userId: '10',
    userName: 'Maria Santos',
    userAvatar: 'https://i.pravatar.cc/150?img=20',
    content: 'Beautiful sunrise from Cable Beach this morning! Another perfect day in paradise begins 🌅 Our resort guests are in for a treat today with our exclusive snorkeling tour!',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    likes: 312,
    comments: [],
  },
  {
    id: '15',
    userId: '3',
    userName: 'Mike Wilson',
    userAvatar: 'https://i.pravatar.cc/150?img=33',
    content: 'Beach workout done! The ocean is the best gym 💪🌊 Time to cool off with some snorkeling!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likes: 156,
    comments: [],
  },
];
