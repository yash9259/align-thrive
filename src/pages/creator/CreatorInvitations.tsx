import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Building2, DollarSign, Calendar, Clock, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getCurrentCreatorContext,
  fetchCreatorInvitations,
  updateCreatorInvitationStatus,
  type CreatorInvitationItem,
} from "@/lib/creator-api";

const CreatorInvitations = () => {
  const [invitations, setInvitations] = useState<CreatorInvitationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [creatorId, setCreatorId] = useState<string>("");
  const [userInitials, setUserInitials] = useState("CR");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const ctx = await getCurrentCreatorContext();
        if (!ctx) return;
        setCreatorId(ctx.userId);
        setUserInitials(ctx.initials);
        const data = await fetchCreatorInvitations(ctx.userId);
        setInvitations(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleAccept = async (id: string) => {
    const inv = invitations.find((i) => i.id === id);
    setActionLoading(id);
    try {
      await updateCreatorInvitationStatus(creatorId, id, "accepted");
      setInvitations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "accepted" as const } : i))
      );
      toast({
        title: "Invitation Accepted! 🎉",
        description: `You accepted the invite from ${inv?.brand}. Redirecting to messages...`,
      });
      setTimeout(() => navigate("/creator/messages"), 1500);
    } catch {
      toast({ title: "Error", description: "Could not accept invitation.", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (id: string) => {
    const inv = invitations.find((i) => i.id === id);
    setActionLoading(id);
    try {
      await updateCreatorInvitationStatus(creatorId, id, "declined");
      setInvitations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "declined" as const } : i))
      );
      toast({ title: "Invitation Declined", description: `You declined the invite from ${inv?.brand}.` });
    } catch {
      toast({ title: "Error", description: "Could not decline invitation.", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const pending = invitations.filter((i) => i.status === "pending");
  const responded = invitations.filter((i) => i.status !== "pending");

  return (
    <DashboardLayout sidebar={<CreatorSidebar />} title="Brand Invitations" userInitials={userInitials}>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold">Invitations</h2>
            <p className="text-sm text-muted-foreground">Brands that want to work with you</p>
          </div>
          {!isLoading && (
            <Badge variant="secondary" className="bg-primary/10 text-primary text-sm px-3 py-1">
              {pending.length} Pending
            </Badge>
          )}
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Card key={n}>
                <CardContent className="p-6 space-y-3">
                  <div className="flex gap-4">
                    <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-16 w-full rounded-lg" />
                      <div className="flex gap-3">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pending Invitations */}
        {!isLoading && pending.length > 0 && (
          <div className="space-y-4">
            {pending.map((inv) => (
              <Card key={inv.id} className="border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl gradient-primary text-sm font-bold text-primary-foreground">
                      {inv.brandInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-base">{inv.campaign}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{inv.brand}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
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

                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => handleAccept(inv.id)}
                          disabled={actionLoading === inv.id}
                          className="gradient-primary text-primary-foreground gap-2"
                          size="sm"
                        >
                          <Check className="h-4 w-4" /> Accept & Message
                        </Button>
                        <Button
                          onClick={() => handleDecline(inv.id)}
                          disabled={actionLoading === inv.id}
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
        )}

        {/* Empty state */}
        {!isLoading && pending.length === 0 && responded.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No pending invitations</p>
              <p className="text-sm text-muted-foreground/70 mt-1">When brands invite you, they'll appear here</p>
            </CardContent>
          </Card>
        )}

        {/* Responded */}
        {!isLoading && responded.length > 0 && (
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
                      className={
                        inv.status === "accepted"
                          ? "bg-success/10 text-success"
                          : inv.status === "declined"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {inv.status === "accepted" ? "Accepted" : inv.status === "declined" ? "Declined" : "Expired"}
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
