import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Plus } from 'lucide-react';
import Link from 'next/link';

export default function VideosPage() {
  return (
    <div className="flex flex-col">
      <Header title="Videos" />

      <div className="p-6">
        {/* Header with create button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium">All Videos</h2>
            <p className="text-sm text-muted-foreground">
              Manage your generated UGC videos
            </p>
          </div>

          <Button asChild>
            <Link href="/videos/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Video
            </Link>
          </Button>
        </div>

        {/* Empty state */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No videos yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4 text-center max-w-sm">
              Generate your first AI-powered UGC video with custom scripts, avatars, and voices.
            </p>
            <Button asChild>
              <Link href="/videos/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Video
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
