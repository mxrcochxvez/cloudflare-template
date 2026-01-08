import type { MetaFunction } from "@remix-run/cloudflare";
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";

export const meta: MetaFunction = () => {
  return [
    { title: "Content Management | Admin" },
  ];
};

// Example data - in real app, this would come from database
const contentItems = [
  { id: 1, title: "Welcome to Our Platform", status: "published", type: "Page", updated: "2 hours ago" },
  { id: 2, title: "Getting Started Guide", status: "published", type: "Doc", updated: "1 day ago" },
  { id: 3, title: "API Reference", status: "draft", type: "Doc", updated: "3 days ago" },
  { id: 4, title: "Pricing Plans", status: "published", type: "Page", updated: "1 week ago" },
  { id: 5, title: "Feature Announcement", status: "draft", type: "Post", updated: "2 weeks ago" },
];

export default function AdminContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content</h1>
          <p className="text-muted-foreground mt-1">
            Manage your pages, posts, and documentation.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Content
        </Button>
      </div>

      {/* Content Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Content</CardTitle>
              <CardDescription>
                A list of all content items in your application.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search content..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Updated</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contentItems.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-medium">{item.title}</td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{item.type}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={item.status === "published" ? "success" : "secondary"}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{item.updated}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination placeholder */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing 1 to 5 of 5 results
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This is a placeholder content management interface. 
            Connect it to your Drizzle ORM database to manage real content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
