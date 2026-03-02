import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Search } from "lucide-react";

const conversations = [
  { name: "TechFlow Inc.", last: "We'd love to discuss the campaign details.", time: "5m ago", unread: 1 },
  { name: "StyleCo", last: "Your portfolio looks great!", time: "30m ago", unread: 0 },
  { name: "GadgetHub", last: "Can you share your rates for YouTube?", time: "2h ago", unread: 2 },
  { name: "FitLife", last: "Thanks for applying! We'll review soon.", time: "1d ago", unread: 0 },
];

const messages = [
  { from: "them", text: "Hi Sarah! We reviewed your profile and we're very impressed with your content.", time: "2:15 PM" },
  { from: "them", text: "We'd love to discuss the campaign details with you. Are you available this week?", time: "2:16 PM" },
  { from: "me", text: "Thank you so much! I'd be happy to discuss. I'm available tomorrow afternoon or Thursday morning.", time: "2:20 PM" },
  { from: "them", text: "Thursday morning works. Let's schedule a call at 10 AM EST?", time: "2:22 PM" },
  { from: "me", text: "Perfect! I'll be ready. Looking forward to it! 🎬", time: "2:25 PM" },
];

const CreatorMessages = () => (
  <DashboardLayout sidebar={<CreatorSidebar />} title="Messages" userInitials="SJ">
    <Card className="h-[calc(100vh-8rem)]">
      <div className="flex h-full">
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8 h-9" />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {conversations.map((c, i) => (
              <div key={c.name} className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary/50 transition-colors ${i === 0 ? 'bg-secondary/50' : ''}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                  {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">TF</div>
            <div><p className="text-sm font-medium">TechFlow Inc.</p><p className="text-xs text-success">Online</p></div>
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

export default CreatorMessages;
