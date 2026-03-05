import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Video, Mic, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">UGC Generator</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Generate TikTok UGC
            <br />
            <span className="text-primary">in Minutes, Not Weeks</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Create authentic-looking user-generated content with AI avatars,
            voice synthesis, and optimized scripts. Perfect for marketing agencies
            scaling content production.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Start Creating
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/50 py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold">
              Everything You Need to Create UGC at Scale
            </h2>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI Script Generation</h3>
                <p className="mt-2 text-muted-foreground">
                  Generate TikTok-optimized scripts with proven hooks, engaging body
                  copy, and compelling CTAs in seconds.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Realistic AI Avatars</h3>
                <p className="mt-2 text-muted-foreground">
                  Choose from 50+ diverse AI presenters or create custom avatars
                  for authentic UGC-style videos.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Natural Voice Synthesis</h3>
                <p className="mt-2 text-muted-foreground">
                  100+ natural voices with emotion control. Clone voices for
                  consistent brand representation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 text-center md:grid-cols-3">
              <div>
                <div className="text-4xl font-bold text-primary">10x</div>
                <div className="mt-2 text-muted-foreground">Faster Production</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">90%</div>
                <div className="mt-2 text-muted-foreground">Cost Reduction</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">$2-5</div>
                <div className="mt-2 text-muted-foreground">Per Video</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold">Ready to Scale Your Content?</h2>
            <p className="mx-auto mt-4 max-w-xl opacity-90">
              Start generating TikTok UGC videos today. No credit card required for trial.
            </p>
            <Button size="lg" variant="secondary" className="mt-8" asChild>
              <Link href="/dashboard">
                <Zap className="mr-2 h-4 w-4" />
                Get Started Free
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 UGC Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
