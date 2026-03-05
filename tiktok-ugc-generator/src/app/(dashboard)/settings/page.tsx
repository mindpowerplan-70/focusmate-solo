import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <Header title="Settings" />

      <div className="p-6">
        <Tabs defaultValue="profile" className="max-w-2xl">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account details here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@agency.com" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>
                  Configure your AI service API keys. These are stored securely.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai">OpenAI API Key</Label>
                  <Input id="openai" type="password" placeholder="sk-..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heygen">HeyGen API Key</Label>
                  <Input id="heygen" type="password" placeholder="Enter API key" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="elevenlabs">ElevenLabs API Key</Label>
                  <Input id="elevenlabs" type="password" placeholder="Enter API key" />
                </div>
                <Button>Save API Keys</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Credits</CardTitle>
                <CardDescription>
                  Manage your subscription and purchase credits.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Current Plan</p>
                    <p className="text-sm text-muted-foreground">Free Trial</p>
                  </div>
                  <Button variant="outline">Upgrade</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Credits Balance</p>
                    <p className="text-sm text-muted-foreground">10 credits remaining</p>
                  </div>
                  <Button variant="outline">Buy Credits</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
