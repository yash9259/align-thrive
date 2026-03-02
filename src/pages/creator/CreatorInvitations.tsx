import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Building2, DollarSign, Calendar, Clock, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Invitation {
  id: string;
  brand: string;
  brandInitials: string;
  campaign: string;
  budget: string;
  deadline: string;
  message: string;
  receivedAt: string;
  status: "pending" | "accepted" | "rejected";
}

const initialInvitations: Invitation[] = [
  {
    id: "1",
    brand: "TechFlow Inc.",
    brandInitials: "TF",
    campaign: "Product Launch Video Series",
    budget: "$800 - $1,200",
    deadline: "March 20, 2026",
    message: "Hi Sarah! We loved your tech reviews. We'd like to invite you to create a 3-part video series for our new product launch. Let us know if you're interested!",
    receivedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: "2",
    brand: "StyleCo",
    brandInitials: "SC",
    campaign: "Spring Collection Reels",
    budget: "$400 - $600",
    deadline: "March 15, 2026",
    message: "Hey! Your Instagram aesthetic is exactly what we're looking for. Would you like to collaborate on our Spring Collection campaign?",
    receivedAt: "5 hours ago",
    status: "pending",
  },
  {
    id: "3",
    brand: "FitLife",
    brandInitials: "FL",
    campaign: "30-Day Fitness Challenge",
    budget: "$1,500 - $2,000",
    deadline: "April 1, 2026",
    message: "We're launching a 30-day fitness challenge and would love to have you as our featured creator. Great compensation and long-term partnership potential!",
    receivedAt: "1 day ago",
    status: "pending",
  },
  {
    id: "4",
    brand: "GadgetHub",
    brandInitials: "GH",
    campaign: "Unboxing & Review",
    budget: "$300 - $500",
    deadline: "March 10, 2026",
    message: "We have a new gadget dropping next week. Interested in doing an unboxing and honest review?",
    receivedAt: "2 days ago",
    status: "pending",
  },
];

const CreatorInvitations = () => {
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAccept = (id: string) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "accepted" as const } : inv))
    );
    const inv = invitations.find((i) => i.id === id);
    toast({
      title: "Invitation Accepted! 🎉",
      description: `You accepted the invite from ${inv?.brand}. Redirecting to messages...`,
    });
    setTimeout(() => navigate("/creator/messages"), 1500);
  };

  const handleReject = (id: string) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "rejected" as const } : inv))
    );
    const inv = invitations.find((i) => i.id === id);
    toast({
      title: "Invitation Declined",
      description: `You declined the invite from ${inv?.brand}.`,
    });
  };

  const pending = invitations.filter((i) => i.status === "pending");
  const responded = invitations.filter((i) => i.status !== "pending");

  return (
    <DashboardLayout sidebar={<CreatorSidebar />} title="Brand Invitations" userInitials="SJ">
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold">Invitations</h2>
            <p className="text-sm text-muted-foreground">Brands that want to work with you</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary text-sm px-3 py-1">
            {pending.length} Pending
          </Badge>
        </div>

        {/* Pending Invitations */}
        {pending.length > 0 ? (
          <div className="space-y-4">
            {pending.map((inv) => (
              <Card key={inv.id} className="border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Brand avatar */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl gradient-primary text-sm font-bold text-primary-foreground">
                      {inv.brandInitials}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-base">{inv.campaign}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{inv.brand}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {inv.receivedAt}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 bg-muted/40 rounded-lg p-3">
                        "{inv.message}"
                      </p>

                      <div className="flex flex-wrap gap-4 mb-5 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <DollarSign className="h-4 w-4 text-success" />
                          <span className="font-medium text-foreground">{inv.budget}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>Deadline: {inv.deadline}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleAccept(inv.id)}
                          className="gradient-primary text-primary-foreground gap-2"
                          size="sm"
                        >
                          <Check className="h-4 w-4" /> Accept & Message
                        </Button>
                        <Button
                          onClick={() => handleReject(inv.id)}
                          variant="outline"
                          size="sm"
                          className="gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/30"
                        >
                          <X className="h-4 w-4" /> Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No pending invitations</p>
              <p className="text-sm text-muted-foreground/70 mt-1">When brands invite you, they'll appear here</p>
            </CardContent>
          </Card>
        )}

        {/* Responded */}
        {responded.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Responded</h3>
            <div className="space-y-3">
              {responded.map((inv) => (
                <Card key={inv.id} className="border-border/30 opacity-70">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold">
                        {inv.brandInitials}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{inv.campaign}</p>
                        <p className="text-xs text-muted-foreground">{inv.brand}</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={inv.status === "accepted" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}
                    >
                      {inv.status === "accepted" ? "Accepted" : "Declined"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreatorInvitations;
