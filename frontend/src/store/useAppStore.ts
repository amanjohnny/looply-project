import { create } from 'zustand';
import type {
  User,
  Challenge,
  UserPost,
  Collectible,
  Group,
  Rarity,
  CaseReward,
  CaseType,
  RewardType,
  PostComment,
  CommentReport,
  Story,
  DirectThread,
  DirectMessage,
  GroupMessage,
  ChallengeRequest,
  ChallengeReward,
  ChallengeRequestDestination,
} from '../types';

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  authView: 'login' | 'register';

  // User state
  user: User;

  // Preferences
  preferences: {
    pushNotifications: boolean;
    privateProfile: boolean;
    darkMode: boolean;
  };

  // Challenges
  challenges: Challenge[];
  completedChallenges: string[];

  // Feed
  posts: UserPost[];
  stories: Story[];
  likedPostIds: string[];
  commentsByPost: Record<string, PostComment[]>;
  activeCommentPostId: string | null;
  blockedUserIds: string[];
  reports: CommentReport[];
  challengeRequests: ChallengeRequest[];
  completedChallengeRequestIds: string[];
  reservedCoinAmount: number;
  reservedCollectibleIds: string[];
  storyViewerOpen: boolean;
  activeStoryIndex: number;

  // Collectibles
  collectibles: Collectible[];
  caseOpening: boolean;
  lastOpenRewards: CaseReward[];

  // Groups
  groups: Group[];
  selectedGroup: Group | null;
  groupMessagesById: Record<string, GroupMessage[]>;
  directThreads: DirectThread[];
  activeDirectThreadId: string | null;
  activeGroupChatId: string | null;
  directChatBackgroundByThreadId: Record<string, string>;
  groupChatBackgroundByGroupId: Record<string, string>;
  pinnedGroupMessageIds: Record<string, string[]>;
  communityUsers: User[];
  selectedUser: User | null;
  userCollectibleShowcase: Record<string, Collectible[]>;

  // Navigation
  currentPage: string;
  missionsTab: 'tasks' | 'rewards';

  // Actions
  setAuthView: (view: 'login' | 'register') => void;
  login: () => void;
  logout: () => void;
  setCurrentPage: (page: string) => void;
  completeChallenge: (challengeId: string) => void;
  addPost: (post: UserPost) => void;
  createPost: (payload: { content: string; media?: string; challengeId?: string; challengeTitle?: string }) => { ok: boolean; error?: string };
  togglePostLike: (postId: string) => void;
  addComment: (postId: string, content: string) => { ok: boolean; error?: string };
  deleteComment: (postId: string, commentId: string) => void;
  reportComment: (commentId: string, reason?: string) => void;
  blockUser: (userId: string) => void;
  openComments: (postId: string) => void;
  closeComments: () => void;
  openCase: (caseType: CaseType, casePrice: number) => CaseReward[] | null;
  setCaseOpening: (opening: boolean) => void;
  setLastOpenRewards: (rewards: CaseReward[]) => void;
  addCollectible: (collectible: Collectible) => void;
  selectGroup: (group: Group | null) => void;
  createGroup: (payload: { name: string; description: string; avatar: string; username?: string }) => { ok: boolean; error?: string };
  updateGroupMeta: (groupId: string, payload: { rules?: string; adminIdToAdd?: string }) => void;
  openGroupChat: (groupId: string) => void;
  closeGroupChat: () => void;
  sendGroupMessage: (groupId: string, payload: { content: string; type: GroupMessage['type'] }) => { ok: boolean; error?: string };
  inviteMemberToGroup: (groupId: string) => void;
  addGroupParticipant: (groupId: string, userId: string) => void;
  assignGroupAdmin: (groupId: string, userId: string) => void;
  togglePinGroupMessage: (groupId: string, messageId: string) => void;
  deleteGroup: (groupId: string) => void;
  updateGroupDescription: (groupId: string, description: string) => void;
  addGroupStory: (groupId: string, payload: { caption: string; media?: string }) => { ok: boolean; error?: string };
  openDirectThread: (userId: string) => void;
  closeDirectThread: () => void;
  sendDirectMessage: (threadId: string, payload: { content: string; type: DirectMessage['type'] }) => { ok: boolean; error?: string };
  setDirectChatBackground: (threadId: string, background: string) => void;
  setGroupChatBackground: (groupId: string, background: string) => void;
  openUserProfile: (userId: string) => void;
  openEditProfile: () => void;
  openSettings: () => void;
  updateCurrentUserProfile: (payload: { displayName: string; bio: string; avatar: string }) => void;
  updatePreferences: (payload: Partial<AppState['preferences']>) => void;
  addCoins: (amount: number) => void;
  markStoryViewed: (storyId: string) => void;
  addStory: (payload: { caption: string; media?: string }) => { ok: boolean; error?: string };
  createChallengeRequest: (payload: { title: string; description: string; category: string; difficulty: Challenge['difficulty']; dueDate?: Date; reward: ChallengeReward; destination: ChallengeRequestDestination }) => { ok: boolean; error?: string };
  acceptChallengeRequest: (requestId: string) => { ok: boolean; error?: string };
  submitChallengeProof: (requestId: string, payload: { text: string; image?: string; note?: string }) => { ok: boolean; error?: string };
  reviewChallengeSubmission: (requestId: string, decision: 'approve' | 'reject', note?: string) => { ok: boolean; error?: string };
  openStoryViewer: (storyId: string) => void;
  closeStoryViewer: () => void;
  nextStory: () => void;
  prevStory: () => void;
  setMissionsTab: (tab: 'tasks' | 'rewards') => void;
}

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

const collectiblesByRarity: Record<Rarity, Collectible[]> = mockCollectibles.reduce((acc, item) => {
  if (!acc[item.rarity]) acc[item.rarity] = [];
  acc[item.rarity].push(item);
  return acc;
}, {} as Record<Rarity, Collectible[]>);

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

const mockCommentsByPost: Record<string, PostComment[]> = {
  '1': [
    { id: 'c1', postId: '1', userId: 'u2', username: 'BookWorm99', userAvatar: '📖', content: 'Great work! Homework wins always feel amazing 🙌', timestamp: new Date(Date.now() - 3400000) },
    { id: 'c2', postId: '1', userId: 'u3', username: 'ScienceGirl', userAvatar: '🔬', content: 'Proud of your consistency!', timestamp: new Date(Date.now() - 3200000) },
  ],
  '2': [
    { id: 'c3', postId: '2', userId: 'u1', username: 'StudyMaster', userAvatar: '🎓', content: 'Love that book too.', timestamp: new Date(Date.now() - 6800000) },
  ],
};

const mockStories: Story[] = [
  { id: 's1', userId: 'u1', username: 'You', avatar: '🎮', caption: 'Daily progress check-in ✨', media: '📚', hasViewed: false, createdAt: new Date(Date.now() - 5400000) },
  { id: 's2', userId: 'u2', username: 'BookWorm99', avatar: '📖', caption: 'New reading corner unlocked!', media: '☕', hasViewed: true, createdAt: new Date(Date.now() - 7200000) },
  { id: 's3', userId: 'u3', username: 'ScienceGirl', avatar: '🔬', caption: 'Experiment day ⚗️', media: '🧪', hasViewed: false, createdAt: new Date(Date.now() - 9000000) },
  { id: 's4', userId: 'u4', username: 'MusicKid', avatar: '🎵', caption: 'Practice set complete', media: '🎹', hasViewed: false, createdAt: new Date(Date.now() - 9600000) },
];


const normalizeGroupUsername = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20);

const createUniqueInviteCode = (existingCodes: string[]) => {
  let tries = 0;
  while (tries < 20) {
    const candidate = `GL-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    if (!existingCodes.includes(candidate)) return candidate;
    tries += 1;
  }
  return `GL-${Date.now().toString(36).slice(-4).toUpperCase()}`;
};

const mockGroups: Group[] = [
  { id: '1', name: 'Study Buddies', description: 'A supportive group for academic success', avatar: '📚', memberCount: 156, challengesCreated: 45, ownerId: 'u1', username: 'studybuddies', inviteCode: 'GL-BUD1', memberIds: ['u1','u2','u3'], isPrivate: false, adminIds: ['u1'], rules: 'Be respectful and post your real progress.' },
  { id: '2', name: 'Math Wizards', description: 'For those who love mathematics', avatar: '➗', memberCount: 89, challengesCreated: 32, ownerId: 'u2', username: 'mathwizards', inviteCode: 'GL-MATH', memberIds: ['u2','u1','u4'], isPrivate: false, adminIds: ['u2'], rules: 'Help others learn, no answer dumping.' },
  { id: '3', name: 'Book Lovers', description: 'Reading and sharing great books', avatar: '📖', memberCount: 234, challengesCreated: 67, ownerId: 'u3', username: 'booklovers', inviteCode: 'GL-BOOK', memberIds: ['u3','u5'], isPrivate: true, adminIds: ['u3'], rules: 'Spoiler-tag major reveals.' },
  { id: '4', name: 'Science Club', description: 'Explore the wonders of science', avatar: '🔬', memberCount: 178, challengesCreated: 54, ownerId: 'u4', username: 'scienceclub', inviteCode: 'GL-SCI1', memberIds: ['u4','u1','u3'], isPrivate: false, adminIds: ['u4'], rules: 'Safety first when sharing experiments.' },
];

const mockGroupMessagesById: Record<string, GroupMessage[]> = {
  '1': [
    { id: 'g1-1', groupId: '1', senderId: 'u2', type: 'text', content: 'Who is joining tonight focus sprint?', createdAt: new Date(Date.now() - 5400000) },
    { id: 'g1-2', groupId: '1', senderId: 'u1', type: 'emoji', content: '🙋‍♂️', createdAt: new Date(Date.now() - 4800000) },
  ],
};

// Keep a single mockDirectThreads declaration as the source of truth for DM seed data.
const mockDirectThreads: DirectThread[] = [
  {
    id: 'dm-u1-u2',
    participantIds: ['u1', 'u2'],
    updatedAt: new Date(Date.now() - 2400000),
    messages: [
      { id: 'dm1', threadId: 'dm-u1-u2', senderId: 'u2', type: 'text', content: 'Finished your math challenge yet?', createdAt: new Date(Date.now() - 3000000) },
      { id: 'dm2', threadId: 'dm-u1-u2', senderId: 'u1', type: 'emoji', content: '✅📚', createdAt: new Date(Date.now() - 2400000) },
    ],
  },
];

const mockCommunityUsers: User[] = [
  { id: 'u1', displayName: 'Ari Carter', username: 'studentpro', avatar: '🎮', bio: 'Building better study habits every day 📚', level: 12, xp: 2450, coins: 1250, streak: 7, joinedAt: new Date('2024-09-15') },
  { id: 'u2', displayName: 'Mina Page', username: 'bookworm99', avatar: '📖', bio: 'Reading challenges and cozy notes.', level: 10, xp: 1920, coins: 980, streak: 5, joinedAt: new Date('2024-08-12') },
  { id: 'u3', displayName: 'Nora Lin', username: 'sciencegirl', avatar: '🔬', bio: 'Small experiments, big curiosity.', level: 14, xp: 2780, coins: 1330, streak: 9, joinedAt: new Date('2024-07-02') },
  { id: 'u4', displayName: 'Leo Keys', username: 'musickid', avatar: '🎵', bio: 'Study beats + piano practice.', level: 9, xp: 1680, coins: 860, streak: 4, joinedAt: new Date('2024-06-23') },
  { id: 'u5', displayName: 'Ivy Rae', username: 'artisticsoul', avatar: '🎨', bio: 'Sketching ideas between chapters.', level: 11, xp: 2140, coins: 1040, streak: 6, joinedAt: new Date('2024-05-30') },
];

const mockCollectibleShowcase: Record<string, Collectible[]> = {
  u2: [
    { id: 'u2-1', name: 'Book Owl', description: 'Wise owl loves reading', rarity: 'common', image: '🦉' },
    { id: 'u2-2', name: 'Star Unicorn', description: 'Legendary star unicorn', rarity: 'legendary', image: '🦄' },
  ],
  u3: [{ id: 'u3-1', name: 'Science Rabbit', description: 'Curious rabbit experiments', rarity: 'rare', image: '🐰' }],
  u4: [{ id: 'u4-1', name: 'Music Dragon', description: 'Musical dragon sings', rarity: 'epic', image: '🐉' }],
  u5: [{ id: 'u5-1', name: 'Art Panda', description: 'Creative panda paints', rarity: 'epic', image: '🐼' }],
};


const mockChallengeRequests: ChallengeRequest[] = [
  {
    id: 'cr-seed-1',
    creatorId: 'u2',
    creatorName: 'Mina Page',
    creatorAvatar: '📖',
    title: '7-Day Reading Sprint',
    description: 'Read 20 pages each day and post your progress check-in.',
    category: 'Reading',
    difficulty: 'medium',
    reward: { kind: 'coins', amount: 120 },
    destination: { type: 'feed' },
    status: 'open',
    createdAt: new Date(Date.now() - 2600000),
  },
  {
    id: 'cr-seed-2',
    creatorId: 'u3',
    creatorName: 'Nora Lin',
    creatorAvatar: '🔬',
    title: 'Kitchen Science Weekend',
    description: 'Complete one safe experiment and share a short summary.',
    category: 'Science',
    difficulty: 'hard',
    reward: { kind: 'collectible', collectibleId: 'u3-1', collectibleName: 'Science Rabbit', collectibleImage: '🐰' },
    destination: { type: 'feed' },
    status: 'open',
    createdAt: new Date(Date.now() - 5200000),
  },
  {
    id: 'cr-seed-3',
    creatorId: 'u5',
    creatorName: 'Ivy Rae',
    creatorAvatar: '🎨',
    title: 'Sketch + Reflect',
    description: 'Do one 15-minute sketch and write 3 reflection points.',
    category: 'Creativity',
    difficulty: 'easy',
    reward: { kind: 'coins', amount: 80 },
    destination: { type: 'feed' },
    status: 'open',
    createdAt: new Date(Date.now() - 8600000),
  },
];

const caseRewardConfig: Record<CaseType, {
  rewardCount: { min: number; max: number };
  rewardChances: Record<RewardType, number>;
  coinRange: { min: number; max: number };
  xpRange: { min: number; max: number };
}> = {
  basic: {
    rewardCount: { min: 1, max: 1 },
    rewardChances: { collectible: 50, coins: 30, xp: 20 },
    coinRange: { min: 20, max: 60 },
    xpRange: { min: 10, max: 25 },
  },
  premium: {
    rewardCount: { min: 1, max: 3 },
    rewardChances: { collectible: 45, coins: 30, xp: 25 },
    coinRange: { min: 40, max: 120 },
    xpRange: { min: 20, max: 60 },
  },
  deluxe: {
    rewardCount: { min: 2, max: 5 },
    rewardChances: { collectible: 50, coins: 25, xp: 25 },
    coinRange: { min: 80, max: 250 },
    xpRange: { min: 40, max: 120 },
  },
};

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const pickRewardType = (caseType: CaseType): RewardType => {
  const roll = Math.random() * 100;
  const chances = caseRewardConfig[caseType].rewardChances;

  if (roll < chances.collectible) return 'collectible';
  if (roll < chances.collectible + chances.coins) return 'coins';
  return 'xp';
};

const pickRarity = (): Rarity => {
  const roll = Math.random();
  if (roll < 0.5) return 'common';
  if (roll < 0.75) return 'rare';
  if (roll < 0.9) return 'epic';
  return 'legendary';
};

const bannedWords = ['hate', 'idiot', 'stupid', 'kill'];

const sanitizeComment = (text: string) => {
  let hasToxic = false;
  const sanitized = text.replace(/\b([a-zA-Z]+)\b/g, (word) => {
    const hit = bannedWords.includes(word.toLowerCase());
    if (hit) {
      hasToxic = true;
      return '***';
    }
    return word;
  });
  return { sanitized, hasToxic };
};


export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  authView: 'login',

  user: {
    id: 'u1',
    displayName: 'Ari Carter',
    username: 'studentpro',
    avatar: '🎮',
    bio: 'Building better study habits every day 📚',
    level: 12,
    xp: 2450,
    coins: 1250,
    streak: 7,
    joinedAt: new Date('2024-09-15'),
  },

  preferences: {
    pushNotifications: true,
    privateProfile: false,
    darkMode: false,
  },

  challenges: mockChallenges,
  completedChallenges: [],
  posts: mockPosts,
  stories: mockStories,
  likedPostIds: [],
  commentsByPost: mockCommentsByPost,
  activeCommentPostId: null,
  blockedUserIds: [],
  reports: [],
  challengeRequests: mockChallengeRequests,
  completedChallengeRequestIds: [],
  reservedCoinAmount: 0,
  reservedCollectibleIds: [],
  storyViewerOpen: false,
  activeStoryIndex: 0,
  collectibles: [],
  caseOpening: false,
  lastOpenRewards: [],
  groups: mockGroups,
  selectedGroup: null,
  groupMessagesById: mockGroupMessagesById,
  directThreads: mockDirectThreads,
  activeDirectThreadId: null,
  activeGroupChatId: null,
  directChatBackgroundByThreadId: {},
  groupChatBackgroundByGroupId: {},
  pinnedGroupMessageIds: {},
  communityUsers: mockCommunityUsers,
  selectedUser: null,
  userCollectibleShowcase: { ...mockCollectibleShowcase, u1: [] },
  currentPage: 'login',
  missionsTab: 'tasks',

  setAuthView: (view) => set({ authView: view }),

  login: () => set({ isAuthenticated: true, currentPage: 'feed' }),

  logout: () => set({ isAuthenticated: false, currentPage: 'login' }),

  setCurrentPage: (page) => set({ currentPage: page }),
  setMissionsTab: (tab) => set({ missionsTab: tab }),

  completeChallenge: (challengeId) => {
    const challenge = get().challenges.find((c) => c.id === challengeId);
    if (challenge && !challenge.completed) {
      set((state) => ({
        challenges: state.challenges.map((c) => (c.id === challengeId ? { ...c, completed: true } : c)),
        completedChallenges: [...state.completedChallenges, challengeId],
        user: { ...state.user, coins: state.user.coins + challenge.coins, xp: state.user.xp + challenge.coins * 10 },
      }));
    }
  },

  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),

  createPost: ({ content, media, challengeId, challengeTitle }) => {
    const trimmed = content.trim();
    if (!trimmed) return { ok: false, error: 'Post cannot be empty.' };
    if (trimmed.length > 280) return { ok: false, error: 'Post must be 280 characters or less.' };

    set((state) => ({
      posts: [
        {
          id: `p-${Date.now()}`,
          userId: state.user.id,
          username: state.user.displayName,
          userAvatar: state.user.avatar,
          challengeId: challengeId || 'custom',
          challengeTitle: challengeTitle || 'General',
          content: trimmed,
          image: media,
          likes: 0,
          comments: 0,
          timestamp: new Date(),
        },
        ...state.posts,
      ],
    }));

    return { ok: true };
  },

  togglePostLike: (postId) =>
    set((state) => {
      const hasLiked = state.likedPostIds.includes(postId);
      return {
        likedPostIds: hasLiked
          ? state.likedPostIds.filter((id) => id !== postId)
          : [...state.likedPostIds, postId],
        posts: state.posts.map((p) =>
          p.id === postId ? { ...p, likes: Math.max(0, p.likes + (hasLiked ? -1 : 1)) } : p,
        ),
      };
    }),

  addComment: (postId, content) => {
    const trimmed = content.trim();
    if (!trimmed) return { ok: false, error: 'Comment cannot be empty.' };

    const { sanitized, hasToxic } = sanitizeComment(trimmed);

    set((state) => {
      const nextComment: PostComment = {
        id: `${postId}-${Date.now()}`,
        postId,
        userId: state.user.id,
        username: state.user.displayName,
        userAvatar: state.user.avatar,
        content: sanitized,
        timestamp: new Date(),
      };

      return {
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: [...(state.commentsByPost[postId] || []), nextComment],
        },
        posts: state.posts.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p)),
      };
    });

    return hasToxic
      ? { ok: true, error: 'Some words were filtered for safety.' }
      : { ok: true };
  },

  deleteComment: (postId, commentId) =>
    set((state) => {
      const before = state.commentsByPost[postId] || [];
      const next = before.filter((comment) => comment.id !== commentId);
      if (before.length === next.length) return {};

      return {
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: next,
        },
        posts: state.posts.map((p) =>
          p.id === postId ? { ...p, comments: Math.max(0, p.comments - 1) } : p,
        ),
      };
    }),

  reportComment: (commentId, reason = 'abuse') =>
    set((state) => ({
      reports: [
        ...state.reports,
        {
          commentId,
          reason,
          reportedBy: state.user.id,
          createdAt: new Date(),
        },
      ],
    })),

  blockUser: (userId) =>
    set((state) => ({
      blockedUserIds: state.blockedUserIds.includes(userId)
        ? state.blockedUserIds
        : [...state.blockedUserIds, userId],
    })),

  openComments: (postId) => set({ activeCommentPostId: postId, currentPage: 'comments' }),

  closeComments: () => set({ activeCommentPostId: null, currentPage: 'feed' }),

  openCase: (caseType, casePrice) => {
    const currentCoins = get().user.coins;
    if (currentCoins < casePrice) {
      return null;
    }

    const config = caseRewardConfig[caseType];
    const rewardsCount = getRandomInt(config.rewardCount.min, config.rewardCount.max);
    const rewards: CaseReward[] = [];
    const wonCollectibles: Collectible[] = [];
    let wonCoins = 0;
    let wonXp = 0;

    for (let i = 0; i < rewardsCount; i++) {
      const rewardType = pickRewardType(caseType);
      const rewardId = `${Date.now()}-${i}-${Math.floor(Math.random() * 100000)}`;

      if (rewardType === 'collectible') {
        const rarity = pickRarity();
        const pool = collectiblesByRarity[rarity] || [];
        const base = pool[Math.floor(Math.random() * pool.length)] || pool[0];
        const collectible: Collectible = {
          ...base,
          id: `${base.id}-${rewardId}`,
          obtainedAt: new Date(),
        };
        wonCollectibles.push(collectible);
        rewards.push({
          id: rewardId,
          type: 'collectible',
          collectible,
          rarity: collectible.rarity,
        });
      } else if (rewardType === 'coins') {
        const amount = getRandomInt(config.coinRange.min, config.coinRange.max);
        wonCoins += amount;
        rewards.push({
          id: rewardId,
          type: 'coins',
          amount,
        });
      } else {
        const amount = getRandomInt(config.xpRange.min, config.xpRange.max);
        wonXp += amount;
        rewards.push({
          id: rewardId,
          type: 'xp',
          amount,
        });
      }
    }

    set((state) => ({
      user: {
        ...state.user,
        coins: state.user.coins - casePrice + wonCoins,
        xp: state.user.xp + wonXp,
      },
      collectibles: [...state.collectibles, ...wonCollectibles],
      userCollectibleShowcase: {
        ...state.userCollectibleShowcase,
        [state.user.id]: [...(state.userCollectibleShowcase[state.user.id] || []), ...wonCollectibles],
      },
      lastOpenRewards: rewards,
    }));

    return rewards;
  },

  setCaseOpening: (opening) => set({ caseOpening: opening }),

  setLastOpenRewards: (rewards) => set({ lastOpenRewards: rewards }),

  addCollectible: (collectible) =>
    set((state) => ({
      collectibles: [...state.collectibles, collectible],
      userCollectibleShowcase: {
        ...state.userCollectibleShowcase,
        [state.user.id]: [...(state.userCollectibleShowcase[state.user.id] || []), collectible],
      },
    })),

  selectGroup: (group) => set({ selectedGroup: group }),

  createGroup: ({ name, description, avatar, username }) => {
    const groupName = name.trim();
    const groupDescription = description.trim();
    if (!groupName) return { ok: false, error: 'Group name is required.' };

    const state = get();
    const nextUsernameRaw = username?.trim() || groupName;
    const nextUsername = normalizeGroupUsername(nextUsernameRaw);
    if (!nextUsername || nextUsername.length < 3) return { ok: false, error: 'Group username must be at least 3 characters.' };

    const usernameTaken = state.groups.some((group) => group.username.toLowerCase() === nextUsername);
    if (usernameTaken) return { ok: false, error: 'That group username is already taken.' };

    const inviteCode = createUniqueInviteCode(state.groups.map((group) => group.inviteCode));

    set((curr) => ({
      groups: [
        {
          id: `g-${Date.now()}`,
          name: groupName,
          description: groupDescription || 'New Looply group',
          avatar: avatar || '👥',
          memberCount: 1,
          challengesCreated: 0,
          ownerId: curr.user.id,
          username: nextUsername,
          inviteCode,
          memberIds: [curr.user.id],
          isPrivate: false,
          adminIds: [curr.user.id],
          rules: 'Be respectful and stay on topic.',
        },
        ...curr.groups,
      ],
    }));

    return { ok: true };
  },

  updateGroupMeta: (groupId, payload) =>
    set((state) => ({
      groups: state.groups.map((group) => {
        if (group.id !== groupId) return group;
        const nextAdmins = payload.adminIdToAdd
          ? Array.from(new Set([...(group.adminIds || [group.ownerId]), payload.adminIdToAdd]))
          : group.adminIds;
        return {
          ...group,
          adminIds: nextAdmins,
          rules: payload.rules ?? group.rules,
        };
      }),
    })),

  openGroupChat: (groupId) => set({ activeGroupChatId: groupId, selectedGroup: null }),
  closeGroupChat: () => set({ activeGroupChatId: null }),

  sendGroupMessage: (groupId, payload) => {
    const trimmed = payload.content.trim();
    if (!trimmed) return { ok: false, error: 'Message cannot be empty.' };

    set((state) => ({
      groupMessagesById: {
        ...state.groupMessagesById,
        [groupId]: [
          ...(state.groupMessagesById[groupId] || []),
          {
            id: `${groupId}-${Date.now()}`,
            groupId,
            senderId: state.user.id,
            type: payload.type,
            content: trimmed,
            createdAt: new Date(),
          },
        ],
      },
    }));

    return { ok: true };
  },

  inviteMemberToGroup: (groupId) =>
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === groupId ? { ...group, memberCount: group.memberCount + 1 } : group,
      ),
    })),

  addGroupParticipant: (groupId, userId) =>
    set((state) => ({
      groups: state.groups.map((group) => {
        if (group.id !== groupId) return group;
        const nextMembers = Array.from(new Set([...(group.memberIds || [group.ownerId]), userId]));
        return { ...group, memberIds: nextMembers, memberCount: nextMembers.length };
      }),
    })),

  assignGroupAdmin: (groupId, userId) =>
    set((state) => ({
      groups: state.groups.map((group) => {
        if (group.id !== groupId) return group;
        const nextMembers = Array.from(new Set([...(group.memberIds || [group.ownerId]), userId]));
        const nextAdmins = Array.from(new Set([...(group.adminIds || [group.ownerId]), userId]));
        return { ...group, memberIds: nextMembers, adminIds: nextAdmins, memberCount: nextMembers.length };
      }),
    })),

  togglePinGroupMessage: (groupId, messageId) =>
    set((state) => {
      const current = state.pinnedGroupMessageIds[groupId] || [];
      const next = current.includes(messageId) ? current.filter((id) => id !== messageId) : [messageId, ...current].slice(0, 20);
      return {
        pinnedGroupMessageIds: {
          ...state.pinnedGroupMessageIds,
          [groupId]: next,
        },
      };
    }),

  deleteGroup: (groupId) =>
    set((state) => {
      const isDeletingActive = state.activeGroupChatId === groupId;
      const nextGroups = state.groups.filter((group) => group.id !== groupId);
      const nextMessages = { ...state.groupMessagesById };
      delete nextMessages[groupId];
      const nextPinned = { ...state.pinnedGroupMessageIds };
      delete nextPinned[groupId];
      return {
        groups: nextGroups,
        groupMessagesById: nextMessages,
        pinnedGroupMessageIds: nextPinned,
        activeGroupChatId: isDeletingActive ? null : state.activeGroupChatId,
        selectedGroup: state.selectedGroup?.id === groupId ? null : state.selectedGroup,
      };
    }),

  updateGroupDescription: (groupId, description) =>
    set((state) => ({
      groups: state.groups.map((group) => (group.id === groupId ? { ...group, description: description.trim() || group.description } : group)),
    })),

  addGroupStory: (groupId, payload) => {
    const caption = payload.caption.trim();
    if (!caption) return { ok: false, error: 'Story caption cannot be empty.' };
    set((state) => ({
      stories: [
        {
          id: `gs-${Date.now()}`,
          userId: state.user.id,
          username: state.user.displayName,
          avatar: state.user.avatar,
          caption,
          media: payload.media || '✨',
          hasViewed: false,
          groupId,
          createdAt: new Date(),
        },
        ...state.stories,
      ],
    }));
    return { ok: true };
  },

  openDirectThread: (userId) =>
    set((state) => {
      if (userId === state.user.id) return {};
      const existing = state.directThreads.find((thread) => thread.participantIds.includes(state.user.id) && thread.participantIds.includes(userId));
      if (existing) return { activeDirectThreadId: existing.id, activeGroupChatId: null };

      const thread: DirectThread = {
        id: `dm-${state.user.id}-${userId}-${Date.now()}`,
        participantIds: [state.user.id, userId],
        messages: [],
        updatedAt: new Date(),
      };
      return {
        directThreads: [thread, ...state.directThreads],
        activeDirectThreadId: thread.id,
        activeGroupChatId: null,
      };
    }),

  closeDirectThread: () => set({ activeDirectThreadId: null }),

  sendDirectMessage: (threadId, payload) => {
    const trimmed = payload.content.trim();
    if (!trimmed) return { ok: false, error: 'Message cannot be empty.' };

    set((state) => {
      const now = new Date();
      const threads = state.directThreads.map((thread) => {
        if (thread.id !== threadId) return thread;
        const message: DirectMessage = {
          id: `${threadId}-${Date.now()}`,
          threadId,
          senderId: state.user.id,
          type: payload.type,
          content: trimmed,
          createdAt: now,
        };
        return { ...thread, updatedAt: now, messages: [...thread.messages, message] };
      });
      return {
        directThreads: threads.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
      };
    });

    return { ok: true };
  },

  setDirectChatBackground: (threadId, background) =>
    set((state) => ({
      directChatBackgroundByThreadId: {
        ...state.directChatBackgroundByThreadId,
        [threadId]: background,
      },
    })),

  setGroupChatBackground: (groupId, background) =>
    set((state) => ({
      groupChatBackgroundByGroupId: {
        ...state.groupChatBackgroundByGroupId,
        [groupId]: background,
      },
    })),

  openUserProfile: (userId) =>
    set((state) => {
      const selected = state.communityUsers.find((u) => u.id === userId) || null;
      return { selectedUser: selected, currentPage: 'userProfile' };
    }),

  openEditProfile: () => set({ currentPage: 'editProfile' }),

  openSettings: () => set({ currentPage: 'settings' }),

  updateCurrentUserProfile: ({ displayName, bio, avatar }) =>
    set((state) => ({
      user: { ...state.user, displayName, bio, avatar },
      communityUsers: state.communityUsers.map((u) => (u.id === state.user.id ? { ...u, displayName, bio, avatar } : u)),
      posts: state.posts.map((p) =>
        p.userId === state.user.id ? { ...p, username: displayName, userAvatar: avatar } : p,
      ),
    })),

  updatePreferences: (payload) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        ...payload,
      },
    })),

  addCoins: (amount) => set((state) => ({ user: { ...state.user, coins: state.user.coins + amount } })),

  markStoryViewed: (storyId) =>
    set((state) => ({
      stories: state.stories.map((s) => (s.id === storyId ? { ...s, hasViewed: true } : s)),
    })),

  addStory: ({ caption, media }) => {
    const trimmed = caption.trim();
    if (!trimmed) return { ok: false, error: 'Story caption cannot be empty.' };
    if (trimmed.length > 120) return { ok: false, error: 'Story caption must be 120 characters or less.' };

    set((state) => ({
      stories: [
        {
          id: `s-${Date.now()}`,
          userId: state.user.id,
          username: 'You',
          avatar: state.user.avatar,
          caption: trimmed,
          media: media || '✨',
          hasViewed: false,
          createdAt: new Date(),
        },
        ...state.stories,
      ],
    }));

    return { ok: true };
  },



  createChallengeRequest: ({ title, description, category, difficulty, dueDate, reward, destination }) => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle) return { ok: false, error: 'Challenge title is required.' };
    if (!trimmedDescription) return { ok: false, error: 'Challenge description is required.' };

    if (destination.type === 'group' && !destination.groupId) return { ok: false, error: 'Select a group destination.' };
    if (destination.type === 'dm' && !destination.threadId) return { ok: false, error: 'Select a DM destination.' };

    const state = get();
    if (reward.kind === 'coins') {
      const available = state.user.coins - state.reservedCoinAmount;
      if (!Number.isFinite(reward.amount) || reward.amount <= 0) return { ok: false, error: 'Enter a valid coin reward amount greater than 0.' };
      if (reward.amount > available) return { ok: false, error: 'Not enough available coins for that reward.' };
    }

    if (reward.kind === 'collectible') {
      const owns = (state.userCollectibleShowcase[state.user.id] || state.collectibles).some((item) => item.id === reward.collectibleId);
      if (!owns) return { ok: false, error: 'You do not own that collectible.' };
      if (state.reservedCollectibleIds.includes(reward.collectibleId)) return { ok: false, error: 'That collectible is already reserved.' };
    }

    const requestId = `cr-${Date.now()}`;
    const request: ChallengeRequest = {
      id: requestId,
      creatorId: state.user.id,
      creatorName: state.user.displayName,
      creatorAvatar: state.user.avatar,
      title: trimmedTitle,
      description: trimmedDescription,
      category,
      difficulty,
      dueDate,
      reward,
      destination,
      status: 'open',
      createdAt: new Date(),
    };

    set((curr) => {
      const next: Partial<AppState> = {
        challengeRequests: [request, ...curr.challengeRequests],
        reservedCoinAmount: reward.kind === 'coins' ? curr.reservedCoinAmount + reward.amount : curr.reservedCoinAmount,
        reservedCollectibleIds: reward.kind === 'collectible' ? [...curr.reservedCollectibleIds, reward.collectibleId] : curr.reservedCollectibleIds,
      };

      if (destination.type === 'group') {
        next.groupMessagesById = {
          ...curr.groupMessagesById,
          [destination.groupId]: [
            ...(curr.groupMessagesById[destination.groupId] || []),
            {
              id: `${destination.groupId}-${Date.now()}`,
              groupId: destination.groupId,
              senderId: curr.user.id,
              type: 'challenge_request',
              content: `Challenge request: ${trimmedTitle}`,
              challengeRequestId: requestId,
              createdAt: new Date(),
            },
          ],
        };
      }

      if (destination.type === 'dm') {
        next.directThreads = curr.directThreads.map((thread) => thread.id === destination.threadId ? {
          ...thread,
          updatedAt: new Date(),
          messages: [...thread.messages, {
            id: `${thread.id}-${Date.now()}`,
            threadId: thread.id,
            senderId: curr.user.id,
            type: 'challenge_request',
            content: `Challenge request: ${trimmedTitle}`,
            challengeRequestId: requestId,
            createdAt: new Date(),
          }],
        } : thread);
      }

      return next as AppState;
    });

    return { ok: true };
  },

  acceptChallengeRequest: (requestId) => {
    const state = get();
    const request = state.challengeRequests.find((item) => item.id === requestId);
    if (!request) return { ok: false, error: 'Challenge request not found.' };
    if (request.status !== 'open') return { ok: false, error: 'Only open challenges can be accepted.' };
    if (request.creatorId === state.user.id) return { ok: false, error: 'You cannot accept your own challenge.' };

    set((curr) => ({
      challengeRequests: curr.challengeRequests.map((item) => item.id === requestId ? {
        ...item,
        status: 'accepted',
        acceptedByUserId: curr.user.id,
        acceptedByName: curr.user.displayName,
        acceptedByAvatar: curr.user.avatar,
        acceptedAt: new Date(),
      } : item),
    }));

    return { ok: true };
  },

  submitChallengeProof: (requestId, payload) => {
    const state = get();
    const request = state.challengeRequests.find((item) => item.id === requestId);
    if (!request) return { ok: false, error: 'Challenge request not found.' };
    if (request.status !== 'accepted') return { ok: false, error: 'Challenge must be accepted before proof submission.' };
    if (request.acceptedByUserId !== state.user.id) return { ok: false, error: 'Only the accepted user can submit proof.' };

    const trimmedText = payload.text.trim();
    const trimmedNote = payload.note?.trim();
    const trimmedImage = payload.image?.trim();
    if (!trimmedText && !trimmedImage) return { ok: false, error: 'Add proof text or an image placeholder.' };

    set((curr) => ({
      challengeRequests: curr.challengeRequests.map((item) => item.id === requestId ? {
        ...item,
        status: 'submitted',
        proof: {
          text: trimmedText || 'Proof submitted',
          image: trimmedImage || undefined,
          note: trimmedNote || undefined,
          submittedAt: new Date(),
        },
      } : item),
    }));

    return { ok: true };
  },

  reviewChallengeSubmission: (requestId, decision, note) => {
    const state = get();
    const request = state.challengeRequests.find((item) => item.id === requestId);
    if (!request) return { ok: false, error: 'Challenge request not found.' };
    if (request.status !== 'submitted') return { ok: false, error: 'Only submitted challenges can be reviewed.' };
    if (request.creatorId !== state.user.id) return { ok: false, error: 'Only the challenge creator can review this proof.' };

    if (decision === 'reject') {
      set((curr) => ({
        challengeRequests: curr.challengeRequests.map((item) => item.id === requestId ? {
          ...item,
          status: 'rejected',
          reviewedAt: new Date(),
          reviewedByUserId: curr.user.id,
          reviewNote: note?.trim() || undefined,
        } : item),
      }));
      return { ok: true };
    }

    if (!request.acceptedByUserId) return { ok: false, error: 'No accepted user found for this request.' };
    if (request.rewardTransferredAt) return { ok: false, error: 'Reward was already transferred.' };

    const approverId = state.user.id;
    const receiverId = request.acceptedByUserId;
    const now = new Date();
    const coinRewardAmount = request.reward.kind === 'coins' ? request.reward.amount : null;
    const collectibleRewardId = request.reward.kind === 'collectible' ? request.reward.collectibleId : null;

    set((curr) => {
      const approverShowcase = [...(curr.userCollectibleShowcase[approverId] || [])];
      const receiverShowcase = [...(curr.userCollectibleShowcase[receiverId] || [])];
      let nextReservedCoinAmount = curr.reservedCoinAmount;
      let nextReservedCollectibleIds = curr.reservedCollectibleIds;

      if (coinRewardAmount != null) {
        nextReservedCoinAmount = Math.max(0, curr.reservedCoinAmount - coinRewardAmount);
      } else if (collectibleRewardId) {
        nextReservedCollectibleIds = curr.reservedCollectibleIds.filter((id) => id !== collectibleRewardId);
        const collectibleIndex = approverShowcase.findIndex((item) => item.id === collectibleRewardId);
        if (collectibleIndex >= 0) {
          const [item] = approverShowcase.splice(collectibleIndex, 1);
          receiverShowcase.unshift(item);
        }
      }

      const applyCoinDelta = (profile: User, userId: string) => {
        if (coinRewardAmount == null) return profile;
        if (userId === approverId) return { ...profile, coins: Math.max(0, profile.coins - coinRewardAmount) };
        if (userId === receiverId) return { ...profile, coins: profile.coins + coinRewardAmount };
        return profile;
      };

      return {
        challengeRequests: curr.challengeRequests.map((item) => item.id === requestId ? {
          ...item,
          status: 'completed',
          reviewedAt: now,
          reviewedByUserId: approverId,
          reviewNote: note?.trim() || undefined,
          rewardTransferredAt: now,
        } : item),
        completedChallengeRequestIds: curr.completedChallengeRequestIds.includes(requestId)
          ? curr.completedChallengeRequestIds
          : [requestId, ...curr.completedChallengeRequestIds],
        user: applyCoinDelta(curr.user, curr.user.id),
        communityUsers: curr.communityUsers.map((profile) => applyCoinDelta(profile, profile.id)),
        userCollectibleShowcase: {
          ...curr.userCollectibleShowcase,
          [approverId]: approverShowcase,
          [receiverId]: receiverShowcase,
        },
        reservedCoinAmount: nextReservedCoinAmount,
        reservedCollectibleIds: nextReservedCollectibleIds,
      };
    });

    return { ok: true };
  },

  openStoryViewer: (storyId) =>
    set((state) => {
      const index = state.stories.findIndex((story) => story.id === storyId);
      if (index === -1) return {};
      return {
        storyViewerOpen: true,
        activeStoryIndex: index,
        stories: state.stories.map((story, i) => (i === index ? { ...story, hasViewed: true } : story)),
      };
    }),

  closeStoryViewer: () => set({ storyViewerOpen: false }),

  nextStory: () =>
    set((state) => {
      if (state.activeStoryIndex >= state.stories.length - 1) {
        return { storyViewerOpen: false };
      }
      const nextIndex = state.activeStoryIndex + 1;
      return {
        activeStoryIndex: nextIndex,
        stories: state.stories.map((story, i) => (i === nextIndex ? { ...story, hasViewed: true } : story)),
      };
    }),

  prevStory: () =>
    set((state) => ({
      activeStoryIndex: Math.max(0, state.activeStoryIndex - 1),
    })),
}));
