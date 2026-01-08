import type { MetaFunction } from "@remix-run/cloudflare";
import { Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const meta: MetaFunction = () => {
  return [
    { title: "Settings | Admin" },
  ];
};

export default function AdminSettings() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your application settings and preferences.
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Basic information about your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Site Name</label>
                  <Input defaultValue="My Application" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Site URL</label>
                  <Input defaultValue="https://example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input defaultValue="A modern web application built with Remix and Cloudflare" />
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How users can reach you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Support Email</label>
                  <Input type="email" defaultValue="support@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Customize the look and feel of your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Color</label>
                  <div className="flex gap-2">
                    <Input defaultValue="#0ea5e9" className="flex-1" />
                    <div className="w-10 h-10 rounded-md bg-primary border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Border Radius</label>
                  <Input defaultValue="0.5rem" />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-6">
          <Alert variant="info">
            <AlertTitle>Database Configuration</AlertTitle>
            <AlertDescription>
              Database settings are configured via environment variables and wrangler.toml. 
              See the documentation for details on setting up Cloudflare D1.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Drizzle ORM Setup</CardTitle>
              <CardDescription>
                Follow these steps to configure your database.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 font-mono text-sm bg-muted rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <span className="text-muted-foreground select-none">1.</span>
                  <div>
                    <p className="text-foreground">Create a D1 database:</p>
                    <code className="text-primary">wrangler d1 create your-db-name</code>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-muted-foreground select-none">2.</span>
                  <div>
                    <p className="text-foreground">Update wrangler.toml with your database_id</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-muted-foreground select-none">3.</span>
                  <div>
                    <p className="text-foreground">Generate migrations:</p>
                    <code className="text-primary">npm run db:generate</code>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-muted-foreground select-none">4.</span>
                  <div>
                    <p className="text-foreground">Apply migrations:</p>
                    <code className="text-primary">npm run db:migrate:prod</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
