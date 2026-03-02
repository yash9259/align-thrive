import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Flame, ArrowLeft, DollarSign, Calendar, Building, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const CreatorProjectDetails = () => (
  <DashboardLayout sidebar={<CreatorSidebar />} title="Project Details" userInitials="SJ">
    <div className="space-y-6">
      <Link to="/creator/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <Badge className="bg-primary/10 text-primary mb-2">Applied</Badge>
              <h2 className="text-2xl font-bold mb-1">Reel Promotion Campaign</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4"><Building className="h-4 w-4" />TechFlow Inc.</p>
              <p className="text-sm text-muted-foreground mb-6">
                Create engaging Instagram Reels showcasing our new SaaS product. Content should highlight key features, user benefits, and include a clear CTA. We're looking for authentic, relatable content that resonates with tech-savvy audiences.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <DollarSign className="h-4 w-4 mx-auto mb-1 text-success" />
                  <p className="text-lg font-bold">$800</p>
                  <p className="text-xs text-muted-foreground">Budget</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <Calendar className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">Mar 22</p>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <Flame className="h-4 w-4 mx-auto mb-1 text-accent" />
                  <p className="text-lg font-bold">20</p>
                  <p className="text-xs text-muted-foreground">Chillies Req.</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <CheckCircle className="h-4 w-4 mx-auto mb-1 text-success" />
                  <p className="text-lg font-bold">2</p>
                  <p className="text-xs text-muted-foreground">Deliverables</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Deliverables</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["2x Instagram Reels (30-60 seconds each)", "1x Behind-the-scenes Story sequence"].map((d, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3">
                    <CheckCircle className="h-4 w-4 text-success shrink-0" />
                    <span className="text-sm">{d}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Brand Preview */}
          <Card>
            <CardHeader><CardTitle className="text-base">Brand Profile</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-sm font-bold text-primary-foreground">TF</div>
                <div>
                  <p className="font-semibold">TechFlow Inc.</p>
                  <p className="text-xs text-muted-foreground">Technology • San Francisco, CA • 24 campaigns posted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" /> Submit Your Bid
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Your Bid Amount ($)</Label>
                <Input type="number" defaultValue="350" />
              </div>
              <div>
                <Label>Cover Message</Label>
                <Textarea defaultValue="Hi! I'd love to create engaging reels for your product. I have 3+ years of experience in tech content creation..." rows={4} />
              </div>
              <div className="rounded-lg bg-accent/10 p-3">
                <p className="text-xs font-medium text-accent flex items-center gap-1 mb-1">
                  <Flame className="h-3 w-3" /> Chillies Boost
                </p>
                <p className="text-xs text-muted-foreground">This project requires 20 Chillies. Using Chillies gives your bid priority placement.</p>
                <p className="text-xs font-medium text-accent mt-1">Your balance: 245 Chillies ✓</p>
              </div>
              <Button className="w-full gradient-primary text-primary-foreground">Submit Bid (20 🌶️)</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Project Stats</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Bids</span><span className="font-medium">18</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Avg Bid</span><span className="font-medium">$320</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium">Tech</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Platform</span><span className="font-medium">Instagram</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default CreatorProjectDetails;
