import { create } from 'zustand';
import type { User, Challenge, UserPost, Collectible, Group, Rarity } from '../types';

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  authView: 'login' | 'register';
  
  // User state
  user: User;
  
  // Challenges
  challenges: Challenge[];
  completedChallenges: string[];
  
  // Feed
  posts: UserPost[];
  stories: { id: string; username: string; avatar: string; hasViewed: boolean }[];
  
  // Collectibles
  collectibles: Collectible[];
  caseOpening: boolean;
  lastOpenResult: Collectible | null;
  
  // Groups
  groups: Group[];
  selectedGroup: Group | null;
  
  // Navigation
  currentPage: string;
  
  // Actions
  setAuthView: (view: 'login' | 'register') => void;
  login: () => void;
  logout: () => void;
  setCurrentPage: (page: string) => void;
  completeChallenge: (challengeId: string) => void;
  addPost: (post: UserPost) => void;
  likePost: (postId: string) => void;
  openCase: () => Collectible;
  setCaseOpening: (opening: boolean) => void;
  setLastOpenResult: (result: Collectible | null) => void;
  addCollectible: (collectible: Collectible) => void;
  selectGroup: (group: Group | null) => void;
  addCoins: (amount: number) => void;
  markStoryViewed: (storyId: string) => void;
}

// Mock data
const mockCollectibles: Collectible[] = [
  { id: '1', name: 'Study Cat', description: 'A cute cat studying hard', rarity: 'common', image: '🐱' },
  { id: '2', name: 'Book Owl', description: 'Wise owl loves reading', rarity: 'common', image: '🦉' },
  { id: '3', name: 'Math Fox', description: 'Smart fox solves equations', rarity: 'rare', image: '🦊' },
  { id: '4', name: 'Science Rabbit', description: 'Curious rabbit experiments', rarity: 'rare', image: '🐰' },
  { id: '5', name: 'Art Panda', description: 'Creative panda paints', rarity: 'epic', image: '🐼' },
  { id: '6', name: 'Music Dragon', description: 'Musical dragon sings', rarity: 'epic', image: '🐉' },
  { id: '7', name: 'Champion Lion', description: 'Ultimate champion lion', rarity: 'legendary', image: '🦁' },
  { id: '8', name: 'Star Unicorn', description: 'Legendary star unicorn', rarity: 'legendary', image: '🦄' },
];

const mockChallenges: Challenge[] = [
  { id: '1', title: 'Morning Study Session', description: 'Study for 30 minutes', coins: 50, category: 'Study', difficulty: 'easy', completed: false, proofRequired: false },
  { id: '2', title: 'Complete Math Homework', description: 'Finish all math assignments', coins: 100, category: 'Homework', difficulty: 'medium', completed: false, proofRequired: true },
  { id: '3', title: 'Read a Chapter', description: 'Read one chapter from any book', coins: 75, category: 'Reading', difficulty: 'easy', completed: false, proofRequired: false },
  { id: '4', title: 'Science Experiment', description: 'Complete a simple science experiment', coins: 150, category: 'Science', difficulty: 'hard', completed: false, proofRequired: true },
  { id: '5', title: 'Practice Instrument', description: 'Practice your instrument for 20 mins', coins: 80, category: 'Music', difficulty: 'medium', completed: false, proofRequired: false },
  { id: '6', title: 'Group Study', description: 'Join a study group session', coins: 120, category: 'Social', difficulty: 'medium', completed: false, proofRequired: true },
];

const mockPosts: UserPost[] = [
  { id: '1', userId: 'u1', username: 'StudyMaster', userAvatar: '🎓', challengeId: '2', challengeTitle: 'Complete Math Homework', content: 'Finally finished my math homework! It was tough but I got it done. Big thanks to my study group! 📚', image: '📝', likes: 42, comments: 8, timestamp: new Date(Date.now() - 3600000) },
  { id: '2', userId: 'u2', username: 'BookWorm99', userAvatar: '📖', challengeId: '3', challengeTitle: 'Read a Chapter', content: 'Just read an amazing chapter from "The Great Gatsby". The imagery is incredible!', likes: 28, comments: 5, timestamp: new Date(Date.now() - 7200000) },
  { id: '3', userId: 'u3', username: 'ScienceGirl', userAvatar: '🔬', challengeId: '4', challengeTitle: 'Science Experiment', content: 'Built a simple volcano experiment! 🌋 The reaction turned out perfect. Science is so cool!', image: '🌋', likes: 89, comments: 23, timestamp: new Date(Date.now() - 10800000) },
  { id: '4', userId: 'u4', username: 'MusicKid', userAvatar: '🎵', challengeId: '5', challengeTitle: 'Practice Instrument', content: 'Practiced my piano for 30 minutes today. Learning a new piece by Chopin! 🎹', likes: 35, comments: 12, timestamp: new Date(Date.now() - 14400000) },
  { id: '5', userId: 'u5', username: 'ArtisticSoul', userAvatar: '🎨', challengeId: '3', challengeTitle: 'Read a Chapter', content: 'Finished reading The Hobbit - what an adventure! Bilbo is such a lovable character. Cant wait to read more!', likes: 56, comments: 15, timestamp: new Date(Date.now() - 18000000) },
];

const mockStories = [
  { id: 's1', username: 'You', avatar: '🎮', hasViewed: false },
  { id: 's2', username: 'StudyMaster', avatar: '🎓', hasViewed: true },
  { id: 's3', username: 'BookWorm99', avatar: '📖', hasViewed: true },
  { id: 's4', username: 'ScienceGirl', avatar: '🔬', hasViewed: false },
  { id: 's5', username: 'MusicKid', avatar: '🎵', hasViewed: false },
  { id: 's6', username: 'ArtisticSoul', avatar: '🎨', hasViewed: true },
];

const mockGroups: Group[] = [
  { id: '1', name: 'Study Buddies', description: 'A supportive group for academic success', avatar: '📚', memberCount: 156, challengesCreated: 45, ownerId: 'u1' },
  { id: '2', name: 'Math Wizards', description: 'For those who love mathematics', avatar: '➗', memberCount: 89, challengesCreated: 32, ownerId: 'u2' },
  { id: '3', name: 'Book Lovers', description: 'Reading and sharing great books', avatar: '📖', memberCount: 234, challengesCreated: 67, ownerId: 'u3' },
  { id: '4', name: 'Science Club', description: 'Explore the wonders of science', avatar: '🔬', memberCount: 178, challengesCreated: 54, ownerId: 'u4' },
];

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  isAuthenticated: false,
  authView: 'login',
  
  user: {
    id: 'u1',
    username: 'StudentPro',
    avatar: '🎮',
    level: 12,
    xp: 2450,
    coins: 1250,
    streak: 7,
    joinedAt: new Date('2024-09-15'),
  },
  challenges: mockChallenges,
  completedChallenges: [],
  posts: mockPosts,
  stories: mockStories,
  collectibles: mockCollectibles,
  caseOpening: false,
  lastOpenResult: null,
  groups: mockGroups,
  selectedGroup: null,
  currentPage: 'login',

  setAuthView: (view) => set({ authView: view }),
  
  login: () => set({ isAuthenticated: true, currentPage: 'feed' }),
  
  logout: () => set({ isAuthenticated: false, currentPage: 'login' }),
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  completeChallenge: (challengeId) => {
    const challenge = get().challenges.find(c => c.id === challengeId);
    if (challenge && !challenge.completed) {
      set((state) => ({
        challenges: state.challenges.map(c => 
          c.id === challengeId ? { ...c, completed: true } : c
        ),
        completedChallenges: [...state.completedChallenges, challengeId],
        user: { ...state.user, coins: state.user.coins + challenge.coins, xp: state.user.xp + challenge.coins * 10 },
      }));
    }
  },
  
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  
  likePost: (postId) => set((state) => ({
    posts: state.posts.map(p => 
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    ),
  })),
  
  openCase: () => {
    const random = Math.random();
    let rarity: Rarity;
    
    if (random < 0.5) rarity = 'common';
    else if (random < 0.75) rarity = 'rare';
    else if (random < 0.9) rarity = 'epic';
    else rarity = 'legendary';
    
    const availableCollectibles = get().collectibles.filter(c => c.rarity === rarity);
    const result = availableCollectibles[Math.floor(Math.random() * availableCollectibles.length)] || availableCollectibles[0];
    
    return { ...result, obtainedAt: new Date() };
  },
  
  setCaseOpening: (opening) => set({ caseOpening: opening }),
  
  setLastOpenResult: (result) => set({ lastOpenResult: result }),
  
  addCollectible: (collectible) => set((state) => ({ collectibles: [...state.collectibles, collectible] })),
  
  selectGroup: (group) => set({ selectedGroup: group }),
  
  addCoins: (amount) => set((state) => ({ user: { ...state.user, coins: state.user.coins + amount } })),
  
  markStoryViewed: (storyId) => set((state) => ({
    stories: state.stories.map(s => 
      s.id === storyId ? { ...s, hasViewed: true } : s
    ),
  })),
}));