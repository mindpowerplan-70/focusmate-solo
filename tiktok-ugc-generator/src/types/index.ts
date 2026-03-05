// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'admin' | 'member' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
}

// Project types
export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  clientName?: string;
  description?: string;
  brandGuidelines?: BrandGuidelines;
  status: 'active' | 'archived';
  createdAt: Date;
}

export interface BrandGuidelines {
  colors?: string[];
  fonts?: string[];
  toneRules?: string[];
}

// Script types
export interface Script {
  id: string;
  projectId: string;
  title?: string;
  content: string;
  hookType?: HookType;
  tone?: Tone;
  durationSeconds?: number;
  generationPrompt?: string;
  isGenerated: boolean;
  createdAt: Date;
}

export type HookType = 'pov' | 'wait_for_it' | 'things_i_wish' | 'unpopular_opinion' | 'story_time';
export type Tone = 'casual' | 'professional' | 'humorous' | 'urgent' | 'educational';

// Avatar types
export interface Avatar {
  id: string;
  provider: 'heygen' | 'did';
  providerAvatarId: string;
  name: string;
  gender?: 'male' | 'female' | 'non-binary';
  ageRange?: string;
  ethnicity?: string;
  style?: 'casual' | 'professional' | 'fitness' | 'lifestyle';
  thumbnailUrl?: string;
  isCustom: boolean;
  workspaceId?: string;
  createdAt: Date;
}

// Voice types
export interface Voice {
  id: string;
  provider: 'elevenlabs' | 'playht';
  providerVoiceId: string;
  name: string;
  gender?: 'male' | 'female';
  accent?: string;
  style?: 'conversational' | 'professional' | 'energetic';
  sampleUrl?: string;
  isCloned: boolean;
  workspaceId?: string;
  createdAt: Date;
}

// Video types
export interface Video {
  id: string;
  projectId: string;
  scriptId: string;
  avatarId: string;
  voiceId: string;
  settings: VideoSettings;
  status: VideoStatus;
  progress: number;
  errorMessage?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  creditsUsed?: number;
  providerCostCents?: number;
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
}

export type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface VideoSettings {
  emotion?: 'happy' | 'excited' | 'serious' | 'concerned' | 'surprised';
  pace?: 'slow' | 'normal' | 'fast';
  background?: string;
}

// Script generation types
export interface ScriptGenerationRequest {
  productName: string;
  productDescription: string;
  keyBenefits: string[];
  targetAudience: string;
  tone: Tone;
  duration: 15 | 30 | 60;
  hookType?: HookType;
}

export interface GeneratedScript {
  hook: string;
  body: string;
  cta: string;
  estimatedDuration: number;
  tone: Tone;
  hookType: HookType;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
