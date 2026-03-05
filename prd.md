# Product Requirements Document: TikTok UGC Generator

## 1. Problem Statement & Solution Overview

### Problem
Marketing agencies face significant challenges producing high-volume, authentic-looking user-generated content (UGC) for TikTok campaigns:
- **High costs**: Hiring real creators costs $200-2,000+ per video
- **Slow turnaround**: Creator coordination takes 1-3 weeks per batch
- **Inconsistent quality**: Variable performance across different creators
- **Limited iteration**: Difficult to A/B test messaging variations quickly
- **Scaling bottleneck**: Can't produce 50+ video variations cost-effectively

### Solution
A web-based platform that enables marketing agencies to generate unlimited TikTok-style UGC videos using:
- AI-powered script generation optimized for TikTok hooks and formats
- Realistic AI avatars that mimic authentic creator aesthetics
- Natural voice synthesis with emotion and pacing control
- Built-in video editor for captions, effects, and final touches

### Value Proposition
- **10x faster**: Generate videos in minutes, not weeks
- **90% cost reduction**: $1-5 per video vs. $200+ for real creators
- **Unlimited iterations**: Test 50 variations of the same concept instantly
- **Consistent brand voice**: Maintain messaging control across all content

---

## 2. Target Users

### Primary: Agency Creative Teams
**Role**: Content strategists, creative directors, social media managers

**Needs**:
- Produce 20-100+ video variations per client campaign
- Quick turnaround for client approvals and revisions
- Maintain brand guidelines across all content
- Track performance to optimize future content

**Pain Points**:
- Spending 60%+ of budget on creator fees
- Missing trend windows due to slow production
- Clients requesting endless revisions

### Secondary: Agency Clients (View-Only Access)
**Role**: Brand managers, marketing directors at client companies

**Needs**:
- Review and approve generated content
- Provide feedback within the platform
- Access performance analytics
- Download approved assets

**Pain Points**:
- Lack of visibility into creative process
- Slow approval workflows via email chains

---

## 3. Core Features

### 3.1 Script Generation Engine
- **Hook library**: Pre-built templates for proven TikTok hooks ("POV:", "Wait for it", "Things I wish I knew")
- **AI script writer**: Generate scripts from product briefs using GPT-4
- **Tone controls**: Casual, professional, humorous, urgent, educational
- **Length presets**: 15s, 30s, 60s optimized structures
- **Trend integration**: Suggest trending sounds/formats to incorporate

### 3.2 AI Avatar System
- **Avatar marketplace**: 50+ diverse AI avatars (age, ethnicity, style)
- **Custom avatars**: Upload client-provided talent for custom avatar creation
- **Expression control**: Happy, excited, serious, concerned, surprised
- **Framing options**: Selfie-style, sitting, walking, multiple angles
- **Outfit variations**: Casual, professional, fitness, lifestyle

### 3.3 Voice Synthesis
- **Voice library**: 100+ natural voices with regional accents
- **Voice cloning**: Clone client-approved voices (with consent)
- **Emotion controls**: Excitement level, pace, emphasis words
- **Sound mixing**: Background music, sound effects integration
- **Lip-sync accuracy**: Real-time adjustment for natural movement

### 3.4 Video Editor
- **Auto-captions**: Animated captions in TikTok-native styles
- **B-roll insertion**: Stock footage and product shot overlays
- **Effects library**: Zoom, shake, transitions, emoji overlays
- **Green screen**: Background replacement for avatars
- **Export presets**: TikTok (9:16), Instagram Reels, YouTube Shorts

### 3.5 Project Management
- **Campaign organization**: Group videos by client/campaign
- **Approval workflows**: Submit for review, request changes, approve
- **Version history**: Track all iterations and changes
- **Asset library**: Store approved scripts, voices, avatars per client
- **Team collaboration**: Comments, assignments, notifications

---

## 4. Recommended Tech Stack

### Frontend
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | Next.js 14 (App Router) | SSR for SEO, API routes, excellent DX |
| Styling | Tailwind CSS + shadcn/ui | Rapid development, consistent design |
| State | Zustand | Lightweight, simple state management |
| Video Player | Video.js | Robust playback with custom controls |
| Rich Text | TipTap | Script editing with formatting |

### Backend
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Runtime | Node.js 20 | JavaScript ecosystem, async-friendly |
| API | Next.js API Routes | Unified codebase, edge functions |
| Database | PostgreSQL (Supabase) | Relational data, row-level security |
| Auth | Supabase Auth | Built-in, supports team invites |
| File Storage | Supabase Storage / S3 | Video file hosting, CDN delivery |
| Queue | Inngest / BullMQ | Async video generation jobs |

### AI/ML Services
| Component | Service | Rationale |
|-----------|---------|-----------|
| Script Generation | OpenAI GPT-4 | Best quality for creative writing |
| Avatar Video | HeyGen API | Most realistic, good API |
| Avatar Video (Alt) | D-ID API | Lower cost alternative |
| Voice Synthesis | ElevenLabs | Best voice quality and cloning |
| Voice (Budget) | PlayHT | Lower cost, still good quality |
| Captions | AssemblyAI | Accurate transcription |

### Infrastructure
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Hosting | Vercel | Next.js optimized, global CDN |
| Database Host | Supabase | Managed Postgres, auth, storage |
| Video CDN | Cloudflare R2 | Cost-effective video delivery |
| Monitoring | Sentry + Vercel Analytics | Error tracking, performance |

---

## 5. MVP Scope & Phasing

### Phase 1: MVP (Weeks 1-6)
**Goal**: Prove core value proposition with minimal viable workflow

**Included**:
- User authentication (email/password)
- Single workspace (no multi-tenant)
- Script generation with 5 hook templates
- 10 pre-built AI avatars (HeyGen)
- 20 voice options (ElevenLabs)
- Basic video editor (captions only)
- Video generation queue with status
- Simple project organization
- Video download (MP4)

**Excluded from MVP**:
- Custom avatar creation
- Voice cloning
- Advanced video effects
- Client approval workflows
- Analytics dashboard
- Team collaboration
- API access

### Phase 2: Agency Features (Weeks 7-10)
- Multi-tenant workspaces
- Client portal with approval workflows
- Team roles and permissions
- Expanded avatar library (50+)
- Advanced video editor
- Brand kit management

### Phase 3: Scale & Optimize (Weeks 11-14)
- Custom avatar creation
- Voice cloning
- Performance analytics
- A/B testing tools
- Bulk generation
- API access for power users

---

## 6. User Flows

### 6.1 Video Creation Flow
```
[Dashboard]
    → [New Video]
    → [Enter Product Brief]
    → [Generate Script Options (3)]
    → [Select/Edit Script]
    → [Choose Avatar]
    → [Select Voice]
    → [Preview Audio]
    → [Generate Video] (async, 2-5 min)
    → [Edit Captions/Effects]
    → [Export/Download]
```

### 6.2 Script Generation Flow
```
Input:
- Product name
- Key benefits (3-5 bullets)
- Target audience
- Desired tone
- Video length
- Hook style preference

Output:
- 3 script variations
- Each with: hook, body, CTA
- Estimated duration
- Suggested avatar type
```

### 6.3 Approval Flow (Phase 2)
```
[Creator submits for review]
    → [Client notified via email]
    → [Client views in portal]
    → [Approve / Request Changes]
    → [Creator notified]
    → [Final download available]
```

---

## 7. Database Schema

```sql
-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'member', -- admin, member, viewer
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Workspaces (Agencies)
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'starter', -- starter, pro, enterprise
    credits_balance INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Workspace Membership
CREATE TABLE workspace_members (
    workspace_id UUID REFERENCES workspaces(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'member', -- owner, admin, member, client
    PRIMARY KEY (workspace_id, user_id)
);

-- Projects (Client Campaigns)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id),
    name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    description TEXT,
    brand_guidelines JSONB, -- colors, fonts, tone rules
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Scripts
CREATE TABLE scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    title VARCHAR(255),
    content TEXT NOT NULL,
    hook_type VARCHAR(100),
    tone VARCHAR(100),
    duration_seconds INTEGER,
    generation_prompt TEXT, -- Original prompt used
    is_generated BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI Avatars
CREATE TABLE avatars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) NOT NULL, -- heygen, did
    provider_avatar_id VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    gender VARCHAR(50),
    age_range VARCHAR(50),
    ethnicity VARCHAR(100),
    style VARCHAR(100), -- casual, professional, fitness
    thumbnail_url TEXT,
    is_custom BOOLEAN DEFAULT false,
    workspace_id UUID REFERENCES workspaces(id), -- NULL for global
    created_at TIMESTAMP DEFAULT NOW()
);

-- Voices
CREATE TABLE voices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) NOT NULL, -- elevenlabs, playht
    provider_voice_id VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    gender VARCHAR(50),
    accent VARCHAR(100),
    style VARCHAR(100), -- conversational, professional, energetic
    sample_url TEXT,
    is_cloned BOOLEAN DEFAULT false,
    workspace_id UUID REFERENCES workspaces(id), -- NULL for global
    created_at TIMESTAMP DEFAULT NOW()
);

-- Generated Videos
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    script_id UUID REFERENCES scripts(id),
    avatar_id UUID REFERENCES avatars(id),
    voice_id UUID REFERENCES voices(id),

    -- Generation settings
    settings JSONB, -- emotion, pace, background, etc.

    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    progress INTEGER DEFAULT 0,
    error_message TEXT,

    -- Output
    video_url TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,

    -- Costs
    credits_used INTEGER,
    provider_cost_cents INTEGER,

    -- Metadata
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Video Versions (for edits)
CREATE TABLE video_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID REFERENCES videos(id),
    version_number INTEGER NOT NULL,
    video_url TEXT NOT NULL,
    changes_description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Approval Workflow (Phase 2)
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID REFERENCES videos(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, changes_requested
    reviewer_id UUID REFERENCES users(id),
    feedback TEXT,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Credit Transactions
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id),
    amount INTEGER NOT NULL, -- positive for purchases, negative for usage
    type VARCHAR(50), -- purchase, video_generation, refund
    description TEXT,
    video_id UUID REFERENCES videos(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 8. API Integrations & Cost Estimates

### 8.1 HeyGen (Primary Avatar Provider)
**Endpoint**: `https://api.heygen.com/v2/video/generate`

**Pricing** (as of 2024):
- Creator plan: $29/month for 15 credits (videos)
- Business plan: $89/month for 30 credits
- Enterprise: Custom pricing, ~$1-3 per video at scale

**Per-Video Cost Estimate**: $2-4 depending on length

**Integration Points**:
```javascript
// Generate avatar video
POST /v2/video/generate
{
  "video_inputs": [{
    "character": {
      "type": "avatar",
      "avatar_id": "josh_lite3_20230714"
    },
    "voice": {
      "type": "text",
      "input_text": "Script content here",
      "voice_id": "elevenlabs_voice_id"
    }
  }],
  "dimension": { "width": 1080, "height": 1920 }
}

// Check status
GET /v2/video/{video_id}
```

### 8.2 D-ID (Alternative Avatar Provider)
**Endpoint**: `https://api.d-id.com/talks`

**Pricing**:
- Lite: $5.90/month for 10 minutes
- Pro: $49/month for 15 minutes
- Enterprise: ~$0.05-0.10 per second

**Per-Video Cost Estimate**: $1-2 (more affordable, slightly less realistic)

### 8.3 ElevenLabs (Voice Synthesis)
**Endpoint**: `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`

**Pricing**:
- Starter: $5/month for 30,000 characters
- Creator: $22/month for 100,000 characters
- Pro: $99/month for 500,000 characters

**Per-Video Cost Estimate**: $0.10-0.30 (30-second script ~500 chars)

**Integration Points**:
```javascript
// Generate speech
POST /v1/text-to-speech/{voice_id}
{
  "text": "Script content",
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.8,
    "style": 0.5,
    "use_speaker_boost": true
  }
}
```

### 8.4 OpenAI (Script Generation)
**Endpoint**: `https://api.openai.com/v1/chat/completions`

**Pricing** (GPT-4 Turbo):
- Input: $0.01 / 1K tokens
- Output: $0.03 / 1K tokens

**Per-Script Cost Estimate**: $0.05-0.10 (generating 3 variations)

### 8.5 Total Cost Per Video
| Component | Low Estimate | High Estimate |
|-----------|--------------|---------------|
| Avatar Video (HeyGen) | $2.00 | $4.00 |
| Voice (ElevenLabs) | $0.10 | $0.30 |
| Script (OpenAI) | $0.03 | $0.10 |
| Captions (AssemblyAI) | $0.05 | $0.10 |
| **Total** | **$2.18** | **$4.50** |

**Recommended Pricing Model**:
- Charge $5-10 per video credit to customers
- ~60% gross margin at scale

---

## 9. 6-Week MVP Timeline

### Week 1: Foundation
- [ ] Project setup (Next.js, Supabase, Tailwind)
- [ ] Authentication flow (signup, login, password reset)
- [ ] Basic dashboard layout
- [ ] Database schema implementation
- [ ] CI/CD pipeline setup

### Week 2: Script Generation
- [ ] Product brief input form
- [ ] OpenAI integration for script generation
- [ ] Hook template library (5 templates)
- [ ] Script editor with formatting
- [ ] Script saving and management

### Week 3: Avatar & Voice Selection
- [ ] HeyGen API integration
- [ ] Avatar gallery UI (10 avatars)
- [ ] ElevenLabs API integration
- [ ] Voice preview functionality
- [ ] Selection persistence

### Week 4: Video Generation Pipeline
- [ ] Job queue setup (Inngest)
- [ ] Video generation workflow
- [ ] Status tracking and progress UI
- [ ] Error handling and retries
- [ ] Video storage (S3/R2)

### Week 5: Video Editor & Export
- [ ] Video player with controls
- [ ] Auto-caption generation
- [ ] Caption styling options
- [ ] Export functionality
- [ ] Download management

### Week 6: Polish & Launch Prep
- [ ] Project organization
- [ ] Credit system implementation
- [ ] Onboarding flow
- [ ] Error states and edge cases
- [ ] Performance optimization
- [ ] Bug fixes and QA

---

## 10. Success Metrics

### Product Metrics
| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| Videos generated | 500 | 5,000 |
| Active workspaces | 20 | 100 |
| Videos per workspace/week | 5 | 15 |
| Generation success rate | 95% | 98% |
| Avg. time to first video | < 10 min | < 5 min |

### Business Metrics
| Metric | Target (Month 3) | Target (Month 6) |
|--------|------------------|------------------|
| MRR | $5,000 | $25,000 |
| Paying customers | 25 | 100 |
| Avg. revenue per customer | $200 | $250 |
| Churn rate | < 10% | < 7% |
| CAC payback | 3 months | 2 months |

### Quality Metrics
| Metric | Target |
|--------|--------|
| Video quality rating (user survey) | 4.2/5 |
| Script relevance rating | 4.0/5 |
| Support tickets per 100 videos | < 5 |
| NPS | > 40 |

---

## 11. Open Questions

### Technical Decisions Needed
1. **Avatar provider**: HeyGen (more realistic, $2-4/video) vs D-ID (cheaper, $1-2/video)?
2. **Voice provider**: ElevenLabs only, or offer PlayHT as budget option?
3. **Video storage**: Supabase Storage vs Cloudflare R2 vs AWS S3?
4. **Job queue**: Inngest (managed) vs BullMQ (self-hosted)?

### Business Decisions Needed
1. **Pricing model**: Credit-based vs subscription with limits vs hybrid?
2. **Target price point**: $99/month starter or $199/month?
3. **Free trial**: Yes (how many videos?) or no?
4. **Custom avatars**: Include in MVP or Phase 2?

### Legal/Compliance Questions
1. **Avatar consent**: What documentation needed for custom avatars?
2. **Voice cloning rights**: Terms for cloning client voices?
3. **Content moderation**: How to prevent misuse (deepfakes, etc.)?
4. **Platform ToS**: TikTok's stance on AI-generated content disclosure?

### UX Questions
1. **Onboarding**: Guided tutorial vs self-serve?
2. **Script generation**: Show AI "thinking" or instant results?
3. **Video preview**: Generate low-res preview first or full quality only?
4. **Collaboration**: Real-time editing or async comments?

---

## Appendix A: Competitor Analysis

| Feature | Opus Clip | Pictory | Synthesia | Our App |
|---------|-----------|---------|-----------|---------|
| AI Avatars | No | No | Yes | Yes |
| UGC Style | No | No | No | Yes |
| Script Gen | No | Yes | No | Yes |
| Voice Clone | No | No | Yes | Phase 2 |
| TikTok Focus | Partial | No | No | Yes |
| Price/video | $0.50 | $0.80 | $2.50 | $2-5 |

**Differentiation**: Only solution specifically designed for TikTok UGC with authentic creator aesthetics.

---

## Appendix B: Sample API Response Structures

### Script Generation Response
```json
{
  "scripts": [
    {
      "id": "script_001",
      "hook": "POV: You just discovered the skincare product that actually works",
      "body": "I was SO skeptical at first, but after 2 weeks my skin has completely transformed. The secret? [Product name]'s unique formula with...",
      "cta": "Link in bio to get 20% off your first order",
      "estimated_duration": 28,
      "tone": "excited",
      "hook_type": "pov"
    }
  ],
  "suggestions": {
    "trending_sounds": ["original sound - skincare guru"],
    "recommended_avatars": ["avatar_casual_f_25"]
  }
}
```

### Video Generation Status Response
```json
{
  "video_id": "vid_abc123",
  "status": "processing",
  "progress": 65,
  "steps": {
    "audio_generation": "completed",
    "avatar_rendering": "in_progress",
    "caption_overlay": "pending",
    "final_export": "pending"
  },
  "estimated_completion": "2024-01-15T10:35:00Z"
}
```

---

*Document Version: 1.0*
*Last Updated: January 2025*
*Author: Product Team*
