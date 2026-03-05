// Environment configuration with validation

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnvVar(key: string): string | undefined {
  return process.env[key];
}

export const config = {
  // App
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    name: process.env.NEXT_PUBLIC_APP_NAME || 'TikTok UGC Generator',
  },

  // Database
  database: {
    url: getOptionalEnvVar('DATABASE_URL'),
  },

  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: getOptionalEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
  },

  // OpenAI
  openai: {
    apiKey: getOptionalEnvVar('OPENAI_API_KEY'),
  },

  // HeyGen
  heygen: {
    apiKey: getOptionalEnvVar('HEYGEN_API_KEY'),
    baseUrl: 'https://api.heygen.com/v2',
  },

  // D-ID (alternative)
  did: {
    apiKey: getOptionalEnvVar('DID_API_KEY'),
    baseUrl: 'https://api.d-id.com',
  },

  // ElevenLabs
  elevenlabs: {
    apiKey: getOptionalEnvVar('ELEVENLABS_API_KEY'),
    baseUrl: 'https://api.elevenlabs.io/v1',
  },

  // PlayHT (alternative)
  playht: {
    apiKey: getOptionalEnvVar('PLAYHT_API_KEY'),
    userId: getOptionalEnvVar('PLAYHT_USER_ID'),
    baseUrl: 'https://api.play.ht/api/v2',
  },

  // AWS S3 (optional)
  aws: {
    accessKeyId: getOptionalEnvVar('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getOptionalEnvVar('AWS_SECRET_ACCESS_KEY'),
    region: getOptionalEnvVar('AWS_REGION') || 'us-east-1',
    s3Bucket: getOptionalEnvVar('AWS_S3_BUCKET'),
  },
} as const;

// Validate required configs for specific features
export function validateOpenAIConfig(): void {
  if (!config.openai.apiKey) {
    throw new Error('OpenAI API key is required for script generation');
  }
}

export function validateHeyGenConfig(): void {
  if (!config.heygen.apiKey) {
    throw new Error('HeyGen API key is required for avatar video generation');
  }
}

export function validateElevenLabsConfig(): void {
  if (!config.elevenlabs.apiKey) {
    throw new Error('ElevenLabs API key is required for voice synthesis');
  }
}
