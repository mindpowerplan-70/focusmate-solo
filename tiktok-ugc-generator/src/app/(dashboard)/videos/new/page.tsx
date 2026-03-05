'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  FileText,
  User,
  Mic,
  Play,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

type Step = 'script' | 'avatar' | 'voice' | 'preview';

const steps: { id: Step; title: string; icon: React.ElementType }[] = [
  { id: 'script', title: 'Script', icon: FileText },
  { id: 'avatar', title: 'Avatar', icon: User },
  { id: 'voice', title: 'Voice', icon: Mic },
  { id: 'preview', title: 'Preview', icon: Play },
];

const hookTypes = [
  { value: 'pov', label: 'POV:' },
  { value: 'wait_for_it', label: 'Wait for it...' },
  { value: 'things_i_wish', label: 'Things I wish I knew' },
  { value: 'unpopular_opinion', label: 'Unpopular opinion' },
  { value: 'story_time', label: 'Story time' },
];

const tones = [
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'educational', label: 'Educational' },
];

// Mock avatars for UI demonstration
const mockAvatars = [
  { id: '1', name: 'Sarah', style: 'casual', thumbnail: '/avatars/sarah.jpg' },
  { id: '2', name: 'Mike', style: 'professional', thumbnail: '/avatars/mike.jpg' },
  { id: '3', name: 'Emma', style: 'lifestyle', thumbnail: '/avatars/emma.jpg' },
  { id: '4', name: 'James', style: 'casual', thumbnail: '/avatars/james.jpg' },
];

// Mock voices for UI demonstration
const mockVoices = [
  { id: '1', name: 'Rachel', accent: 'American', style: 'conversational' },
  { id: '2', name: 'Josh', accent: 'American', style: 'energetic' },
  { id: '3', name: 'Bella', accent: 'British', style: 'professional' },
  { id: '4', name: 'Antoni', accent: 'American', style: 'conversational' },
];

export default function NewVideoPage() {
  const [currentStep, setCurrentStep] = useState<Step>('script');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col">
      <Header title="Create New Video" />

      <div className="p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                    currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : index < currentStepIndex
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {index < currentStepIndex ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                  <span className="font-medium">{step.title}</span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-12 h-0.5 mx-2',
                      index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-3xl mx-auto">
          {/* Script Step */}
          {currentStep === 'script' && (
            <Card>
              <CardHeader>
                <CardTitle>Generate Script</CardTitle>
                <CardDescription>
                  Enter your product details and we&apos;ll generate TikTok-optimized scripts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="product">Product Name</Label>
                    <Input id="product" placeholder="e.g., Glow Serum" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Video Duration</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">60 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Product Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product and its key benefits..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hook">Hook Style</Label>
                    <Select defaultValue="pov">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hookTypes.map((hook) => (
                          <SelectItem key={hook.value} value={hook.value}>
                            {hook.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select defaultValue="casual">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map((tone) => (
                          <SelectItem key={tone.value} value={tone.value}>
                            {tone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    placeholder="e.g., Women 25-35 interested in skincare"
                  />
                </div>

                <Button
                  onClick={handleGenerateScript}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Scripts
                    </>
                  )}
                </Button>

                {/* Generated scripts would appear here */}
                <div className="border rounded-lg p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground text-center">
                    Generated scripts will appear here. Fill in the details above and click &quot;Generate Scripts&quot;.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Avatar Step */}
          {currentStep === 'avatar' && (
            <Card>
              <CardHeader>
                <CardTitle>Select Avatar</CardTitle>
                <CardDescription>
                  Choose an AI avatar to present your content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {mockAvatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={cn(
                        'relative rounded-lg border-2 p-2 transition-all',
                        selectedAvatar === avatar.id
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-muted-foreground/50'
                      )}
                    >
                      <div className="aspect-square rounded-md bg-muted flex items-center justify-center">
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium">{avatar.name}</p>
                        <Badge variant="secondary" className="mt-1">
                          {avatar.style}
                        </Badge>
                      </div>
                      {selectedAvatar === avatar.id && (
                        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Voice Step */}
          {currentStep === 'voice' && (
            <Card>
              <CardHeader>
                <CardTitle>Select Voice</CardTitle>
                <CardDescription>
                  Choose a voice for your avatar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockVoices.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice.id)}
                      className={cn(
                        'w-full flex items-center justify-between rounded-lg border-2 p-4 transition-all',
                        selectedVoice === voice.id
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-muted-foreground/50'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Mic className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{voice.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {voice.accent} • {voice.style}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                        {selectedVoice === voice.id && (
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview Step */}
          {currentStep === 'preview' && (
            <Card>
              <CardHeader>
                <CardTitle>Preview & Generate</CardTitle>
                <CardDescription>
                  Review your selections and generate the video.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Script</Label>
                      <p className="mt-1 text-sm">
                        POV: You just discovered the skincare product that actually works...
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Avatar</Label>
                      <p className="mt-1 text-sm">
                        {mockAvatars.find((a) => a.id === selectedAvatar)?.name || 'Not selected'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Voice</Label>
                      <p className="mt-1 text-sm">
                        {mockVoices.find((v) => v.id === selectedVoice)?.name || 'Not selected'}
                      </p>
                    </div>
                  </div>
                  <div className="aspect-[9/16] bg-muted rounded-lg flex items-center justify-center max-w-[200px] mx-auto">
                    <div className="text-center">
                      <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Video Preview</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Video
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={goToPrevStep}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={goToNextStep}
              disabled={currentStepIndex === steps.length - 1}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
