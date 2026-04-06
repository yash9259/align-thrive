import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  fetchCreatorCommunityDirectory,
  getCurrentCreatorContext,
  respondToCreatorCommunityRequest,
  sendCreatorCommunityRequest,
  type CreatorCommunityMember,
} from "@/lib/creator-api";

const CreatorCommunity = () => {
  const [activeTab, setActiveTab] = useState<"all" | "incoming" | "following" | "requested">("all");
  const [creatorId, setCreatorId] = useState<string>("");
  const [userInitials, setUserInitials] = useState("CR");
  const [members, setMembers] = useState<CreatorCommunityMember[]>([]);
  const [followingCount, setFollowingCount] = useState(0);
  const [incomingCount, setIncomingCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadDirectory = async (id: string) => {
    const directory = await fetchCreatorCommunityDirectory(id, "creator");
    setMembers(directory.members);
    setFollowingCount(directory.followingCount);
    setIncomingCount(directory.incomingCount);
    setPendingCount(directory.pendingCount);
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const context = await getCurrentCreatorContext();
        if (!active) return;
        setCreatorId(context.userId);
        setUserInitials(context.initials);
        await loadDirectory(context.userId);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load creator community.";
        toast({ title: "Community error", description: message, variant: "destructive" });
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [toast]);

  const handleSendRequest = async (targetId: string) => {
    if (!creatorId) return;
    setActionId(targetId);
    try {
      const result = await sendCreatorCommunityRequest(creatorId, targetId, "Let's connect in the creator community.");
      await loadDirectory(creatorId);
      toast({
        title: result.status === "accepted" ? "Connection accepted" : "Request sent",
        description: result.status === "accepted" ? "Connection is active now." : "Waiting for acceptance.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send request.";
      toast({ title: "Action failed", description: message, variant: "destructive" });
    } finally {
      setActionId(null);
    }
  };

  const handleRespond = async (requestId: string, action: "accepted" | "declined") => {
    if (!creatorId) return;
    setActionId(requestId);
    try {
      await respondToCreatorCommunityRequest(creatorId, requestId, action);
      await loadDirectory(creatorId);
      toast({
        title: action === "accepted" ? "Request accepted" : "Request declined",
        description: action === "accepted" ? "You can now message this creator." : "Request was declined.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update request.";
      toast({ title: "Action failed", description: message, variant: "destructive" });
    } finally {
      setActionId(null);
    }
  };

  const acceptedFollowingCount = useMemo(
    () => members.filter((member) => member.status === "following").length,
    [members],
  );

  const displayedMembers = useMemo(() => {
    if (activeTab === "incoming") {
      return members.filter((member) => member.status === "incoming");
    }

    if (activeTab === "following") {
      return members.filter((member) => member.status === "following");
    }

    if (activeTab === "requested") {
      return members.filter((member) => member.status === "requested");
    }

    return members;
  }, [activeTab, members]);

  return (
    <DashboardLayout sidebar={<CreatorSidebar />} title="Creator Community" userInitials={userInitials}>
      <div className="max-w-5xl space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{followingCount}</p>
              <p className="text-xs text-muted-foreground">Following + requested</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{incomingCount}</p>
              <p className="text-xs text-muted-foreground">Incoming requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending sent requests</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Creators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "incoming" | "following" | "requested")}>
              <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                <TabsTrigger value="all">All ({members.length})</TabsTrigger>
                <TabsTrigger value="incoming">Incoming ({incomingCount})</TabsTrigger>
                <TabsTrigger value="following">Following ({acceptedFollowingCount})</TabsTrigger>
                <TabsTrigger value="requested">Requested ({pendingCount})</TabsTrigger>
              </TabsList>
            </Tabs>

            {isLoading && <p className="text-sm text-muted-foreground">Loading creators...</p>}
            {!isLoading && !displayedMembers.length && <p className="text-sm text-muted-foreground">No creators found in this tab.</p>}

            {!isLoading && displayedMembers.map((member) => (
              <div key={member.id} className="flex flex-col gap-3 rounded-lg border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{member.name}</p>
                    {member.isVerified && <Badge className="bg-success/10 text-success">Verified</Badge>}
                    <Badge variant="outline">{member.headline}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.location}</p>
                  <p className="text-xs text-muted-foreground">{member.audienceLabel}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {member.status === "following" && <Badge className="bg-success/10 text-success">Following</Badge>}
                  {member.status === "requested" && <Badge variant="secondary">Requested</Badge>}

                  {member.status === "none" && (
                    <Button size="sm" onClick={() => void handleSendRequest(member.id)} disabled={actionId === member.id}>
                      {actionId === member.id ? "Sending..." : "Send Request"}
                    </Button>
                  )}

                  {member.status === "incoming" && member.requestId && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => void handleRespond(member.requestId as string, "accepted")}
                        disabled={actionId === member.requestId}
                      >
                        {actionId === member.requestId ? "Saving..." : "Accept + Message"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void handleRespond(member.requestId as string, "declined")}
                        disabled={actionId === member.requestId}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreatorCommunity;
