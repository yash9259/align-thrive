import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Terminal, Hash, Zap, Users, Key } from "lucide-react";

const ApiDocs = () => (
  <div className="min-h-screen bg-background">
    <PublicNavbar />

    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Code className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-4">API Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Build integrations with the Align API to manage campaigns, creators, and analytics programmatically.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mb-12">
          {[
            {
              icon: Terminal,
              title: "Getting Started",
              desc: "Authentication, base URL, rate limits, and making your first API call.",
              method: "GET",
              endpoint: "/v1/auth",
            },
            {
              icon: Users,
              title: "Campaigns",
              desc: "List, create, update, and manage brand campaigns and their statuses.",
              method: "GET/POST",
              endpoint: "/v1/campaigns",
            },
            {
              icon: Hash,
              title: "Creators",
              desc: "Search and filter creators by niche, RACK score, engagement, and more.",
              method: "GET",
              endpoint: "/v1/creators",
            },
            {
              icon: Zap,
              title: "Proposals",
              desc: "Manage creator proposals, accept or reject submissions, and track progress.",
              method: "GET/PATCH",
              endpoint: "/v1/proposals",
            },
            {
              icon: Code,
              title: "Analytics",
              desc: "Retrieve campaign performance metrics, engagement data, and reporting.",
              method: "GET",
              endpoint: "/v1/analytics",
            },
            {
              icon: Key,
              title: "Webhooks",
              desc: "Subscribe to real-time events like new proposals, status changes, and payments.",
              method: "POST",
              endpoint: "/v1/webhooks",
            },
          ].map((endpoint) => (
            <Card key={endpoint.title} className="hover:border-primary/20 transition-all duration-300 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <endpoint.icon className="h-4 w-4 text-primary" />
                  {endpoint.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{endpoint.desc}</p>
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs">
                  <span className={`font-bold ${endpoint.method.includes("PATCH") ? "text-warning" : endpoint.method === "POST" ? "text-success" : "text-primary"}`}>
                    {endpoint.method}
                  </span>{" "}
                  <span className="text-foreground">{endpoint.endpoint}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              All API requests require an API key passed in the <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">Authorization</code> header.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs text-foreground">
              Authorization: Bearer YOUR_API_KEY
            </div>
            <p>
              To get your API key, navigate to your brand or creator dashboard settings. API access is available on Pro and Enterprise plans.
            </p>
            <p>
              For full documentation, examples, and SDKs, visit our developer portal or contact{" "}
              <a href="mailto:support@thealign.net" className="text-primary hover:underline">support@thealign.net</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>

    <PublicFooter />
  </div>
);

export default ApiDocs;