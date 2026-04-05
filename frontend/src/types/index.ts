export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Collectible {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  image: string;
  obtainedAt?: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  coins: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  proofRequired: boolean;
}

export interface UserPost {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  challengeId: string;
  challengeTitle: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  joinedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar: string;
  memberCount: number;
  challengesCreated: number;
  ownerId: string;
}

export interface GroupChallenge {
  id: string;
  groupId: string;
  title: string;
  description: string;
  coins: number;
  createdBy: string;
  createdAt: Date;
}