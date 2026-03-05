import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, FolderOpen, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header title="Dashboard" />

      <div className="p-6 space-y-6">
        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Start creating videos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Create your first project
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scripts Generated</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                AI-powered scripts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10</div>
              <p className="text-xs text-muted-foreground">
                Available credits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create Your First Video</CardTitle>
              <CardDescription>
                Generate TikTok-style UGC content in minutes with AI-powered scripts, avatars, and voices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/videos/new">
                  <Video className="mr-2 h-4 w-4" />
                  Create Video
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Start a New Project</CardTitle>
              <CardDescription>
                Organize your content by client or campaign. Projects help you manage brand guidelines and assets.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link href="/projects">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  View Projects
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent videos placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Videos</CardTitle>
            <CardDescription>
              Your recently generated videos will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Video className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No videos yet</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Create your first AI-generated UGC video to get started.
              </p>
              <Button asChild>
                <Link href="/videos/new">Create Video</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
