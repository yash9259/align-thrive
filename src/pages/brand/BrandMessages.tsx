import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BrandSidebar from "@/components/layout/BrandSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Search, ArrowLeft, Phone, Video, Paperclip, Link2, Image, FileText, X, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const conversations = [
  { name: "Sarah Johnson", last: "Sounds great! I'll start on the reels tomorrow.", time: "2m ago", unread: 2 },
  { name: "Priya Kapoor", last: "Can we discuss the deliverables in more detail?", time: "15m ago", unread: 0 },
  { name: "Mike Thompson", last: "I've uploaded the first draft for review.", time: "1h ago", unread: 1 },
  { name: "Emma Chen", last: "Thank you for the opportunity!", time: "3h ago", unread: 0 },
  { name: "Jordan Williams", last: "When is the deadline for the stories?", time: "5h ago", unread: 0 },
];

type MessageType = {
  from: string;
  text: string;
  time: string;
  type?: "text" | "file" | "link" | "image";
  fileName?: string;
  fileSize?: string;
  url?: string;
};

const initialMessages: MessageType[] = [
  { from: "them", text: "Hi! I'm very interested in your Brand Awareness Campaign.", time: "10:30 AM" },
  { from: "me", text: "Great to hear, Sarah! We loved your portfolio. Can you share your rates for Instagram reels?", time: "10:32 AM" },
  { from: "them", text: "Sure! For a 30-second reel with full production, my rate is $350. I can also do stories for $100 each.", time: "10:35 AM" },
  { from: "them", text: "Campaign_Brief.pdf", time: "10:36 AM", type: "file", fileName: "Campaign_Brief.pdf", fileSize: "2.4 MB" },
  { from: "me", text: "That works for our budget. We'd like 1 reel and 3 stories. Can you start next week?", time: "10:38 AM" },
  { from: "them", text: "Sounds great! I'll start on the reels tomorrow. 🎬", time: "10:40 AM" },
  { from: "them", text: "https://instagram.com/sarahjcreates/portfolio", time: "10:41 AM", type: "link", url: "https://instagram.com/sarahjcreates/portfolio" },
];

const BrandMessages = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<MessageType[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const isLink = /^https?:\/\//.test(inputValue.trim());
    setChatMessages(prev => [...prev, {
      from: "me",
      text: inputValue.trim(),
      time: now(),
      type: isLink ? "link" : "text",
      ...(isLink && { url: inputValue.trim() }),
    }]);
    setInputValue("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "image") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setChatMessages(prev => [...prev, {
      from: "me",
      text: file.name,
      time: now(),
      type: type === "image" ? "image" : "file",
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    }]);
    setShowAttachMenu(false);
    toast({ title: `${type === "image" ? "Image" : "File"} sent`, description: file.name });
  };

  const handleCall = (type: "audio" | "video") => {
    toast({
      title: `${type === "video" ? "Video" : "Audio"} Call Started`,
      description: `Calling Sarah Johnson...`,
    });
  };

  const renderMessage = (m: MessageType, i: number) => {
    const isMine = m.from === "me";
    const bubbleClass = isMine ? "gradient-primary text-primary-foreground" : "bg-secondary";
    const timeClass = isMine ? "text-primary-foreground/70" : "text-muted-foreground";

    if (m.type === "file") {
      return (
        <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${bubbleClass}`}>
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${isMine ? "bg-primary-foreground/20" : "bg-muted"}`}>
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{m.fileName}</p>
                <p className={`text-[10px] ${timeClass}`}>{m.fileSize}</p>
              </div>
              <button className={`p-1.5 rounded-lg hover:bg-primary-foreground/10 shrink-0 ${isMine ? "" : "hover:bg-muted"}`}>
                <Download className="h-4 w-4" />
              </button>
            </div>
            <p className={`text-[10px] mt-1.5 ${timeClass}`}>{m.time}</p>
          </div>
        </div>
      );
    }

    if (m.type === "link") {
      return (
        <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2 ${bubbleClass}`}>
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 shrink-0" />
              <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-2 truncate">
                {m.url}
              </a>
            </div>
            <p className={`text-[10px] mt-1 ${timeClass}`}>{m.time}</p>
          </div>
        </div>
      );
    }

    return (
      <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2 ${bubbleClass}`}>
          <p className="text-sm">{m.text}</p>
          <p className={`text-[10px] mt-1 ${timeClass}`}>{m.time}</p>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout sidebar={<BrandSidebar />} title="Messages" userInitials="TF">
      <Card className="h-[calc(100vh-8rem)]">
        <div className="flex h-full">
          {/* Conversation list */}
          <div className={`${showChat ? "hidden md:flex" : "flex"} w-full md:w-80 border-r border-border flex-col`}>
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-8 h-9" />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {conversations.map((c, i) => (
                <div
                  key={c.name}
                  onClick={() => { setSelectedChat(i); setShowChat(true); }}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary/50 transition-colors ${i === selectedChat ? "bg-secondary/50" : ""}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{c.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.last}</p>
                  </div>
                  {c.unread > 0 && (
                    <Badge className="gradient-primary text-primary-foreground h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] shrink-0">
                      {c.unread}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className={`${showChat ? "flex" : "hidden md:flex"} flex-1 flex-col`}>
            {/* Chat header with call buttons */}
            <div className="flex items-center justify-between p-2 sm:p-4 border-b border-border gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button onClick={() => setShowChat(false)} className="md:hidden p-1 hover:bg-muted rounded shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">SJ</div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">Sarah Johnson</p>
                  <p className="text-xs text-success">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => handleCall("audio")}>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => handleCall("video")}>
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-4">
              {chatMessages.map((m, i) => renderMessage(m, i))}
            </div>

            {/* Attach menu */}
            {showAttachMenu && (
              <div className="px-3 sm:px-4 pb-2">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-2">
                  <Button variant="ghost" size="sm" className="gap-2 text-xs" onClick={() => fileInputRef.current?.click()}>
                    <FileText className="h-4 w-4" /> File
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 text-xs" onClick={() => imageInputRef.current?.click()}>
                    <Image className="h-4 w-4" /> Image
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-xs"
                    onClick={() => {
                      const link = prompt("Paste a link:");
                      if (link) {
                        setChatMessages(prev => [...prev, { from: "me", text: link, time: now(), type: "link", url: link }]);
                        setShowAttachMenu(false);
                      }
                    }}
                  >
                    <Link2 className="h-4 w-4" /> Link
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto" onClick={() => setShowAttachMenu(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Input bar */}
            <div className="p-3 sm:p-4 border-t border-border flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => setShowAttachMenu(!showAttachMenu)}>
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type a message..."
                className="flex-1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button className="gradient-primary text-primary-foreground shrink-0" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Hidden file inputs */}
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileUpload(e, "file")} />
            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "image")} />
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default BrandMessages;