import DashboardLayout from "@/components/layout/DashboardLayout";
import BrandSidebar from "@/components/layout/BrandSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Search } from "lucide-react";

const conversations = [
  { name: "Sarah Johnson", last: "Sounds great! I'll start on the reels tomorrow.", time: "2m ago", unread: 2 },
  { name: "Priya Kapoor", last: "Can we discuss the deliverables in more detail?", time: "15m ago", unread: 0 },
  { name: "Mike Thompson", last: "I've uploaded the first draft for review.", time: "1h ago", unread: 1 },
  { name: "Emma Chen", last: "Thank you for the opportunity!", time: "3h ago", unread: 0 },
  { name: "Jordan Williams", last: "When is the deadline for the stories?", time: "5h ago", unread: 0 },
];

const messages = [
  { from: "them", text: "Hi! I'm very interested in your Brand Awareness Campaign.", time: "10:30 AM" },
  { from: "me", text: "Great to hear, Sarah! We loved your portfolio. Can you share your rates for Instagram reels?", time: "10:32 AM" },
  { from: "them", text: "Sure! For a 30-second reel with full production, my rate is $350. I can also do stories for $100 each.", time: "10:35 AM" },
  { from: "me", text: "That works for our budget. We'd like 1 reel and 3 stories. Can you start next week?", time: "10:38 AM" },
  { from: "them", text: "Sounds great! I'll start on the reels tomorrow. 🎬", time: "10:40 AM" },
];

const BrandMessages = () => (
  <DashboardLayout sidebar={<BrandSidebar />} title="Messages" userInitials="TF">
    <Card className="h-[calc(100vh-8rem)]">
      <div className="flex h-full">
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-8 h-9" />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {conversations.map((c, i) => (
              <div key={c.name} className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary/50 transition-colors ${i === 0 ? 'bg-secondary/50' : ''}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.last}</p>
                </div>
                {c.unread > 0 && <Badge className="gradient-primary text-primary-foreground h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">{c.unread}</Badge>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">SJ</div>
            <div>
              <p className="text-sm font-medium">Sarah Johnson</p>
              <p className="text-xs text-success">Online</p>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${m.from === 'me' ? 'gradient-primary text-primary-foreground' : 'bg-secondary'}`}>
                  <p className="text-sm">{m.text}</p>
                  <p className={`text-[10px] mt-1 ${m.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border flex gap-2">
            <Input placeholder="Type a message..." className="flex-1" />
            <Button className="gradient-primary text-primary-foreground"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </Card>
  </DashboardLayout>
);

export default BrandMessages;
