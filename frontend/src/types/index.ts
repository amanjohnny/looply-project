export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type CaseType = 'basic' | 'premium' | 'deluxe';
export type RewardType = 'collectible' | 'coins' | 'xp';

export interface Collectible {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  image: string;
  obtainedAt?: Date;
}

export interface CaseReward {
  id: string;
  type: RewardType;
  amount?: number;
  collectible?: Collectible;
  rarity?: Rarity;
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

export interface CommentReport {
  commentId: string;
  reason: string;
  reportedBy: string;
  createdAt: Date;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  caption: string;
  media?: string;
  hasViewed: boolean;
  groupId?: string;
  createdAt: Date;
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
  displayName: string;
  username: string;
  avatar: string;
  bio: string;
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
  username: string;
  inviteCode: string;
  memberIds?: string[];
  isPrivate?: boolean;
  adminIds?: string[];
  rules?: string;
}

export interface DirectMessage {
  id: string;
  threadId: string;
  senderId: string;
  type: 'text' | 'emoji' | 'sticker' | 'image' | 'video' | 'audio' | 'document' | 'gift';
  content: string;
  createdAt: Date;
}

export interface DirectThread {
  id: string;
  participantIds: [string, string];
  messages: DirectMessage[];
  updatedAt: Date;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  type: 'text' | 'emoji' | 'sticker' | 'image' | 'video' | 'audio';
  content: string;
  createdAt: Date;
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
