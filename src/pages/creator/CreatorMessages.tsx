import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Send, Search, ArrowLeft, Phone, Video, Paperclip, Link2, Image, FileText, X, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const conversations = [
  { name: "TechFlow Inc.", last: "We'd love to discuss the campaign details.", time: "5m ago", unread: 1 },
  { name: "StyleCo", last: "Your portfolio looks great!", time: "30m ago", unread: 0 },
  { name: "GadgetHub", last: "Can you share your rates for YouTube?", time: "2h ago", unread: 2 },
  { name: "FitLife", last: "Thanks for applying! We'll review soon.", time: "1d ago", unread: 0 },
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
  { from: "them", text: "Hi Sarah! We reviewed your profile and we're very impressed with your content.", time: "2:15 PM" },
  { from: "them", text: "We'd love to discuss the campaign details with you. Are you available this week?", time: "2:16 PM" },
  { from: "me", text: "Thank you so much! I'd be happy to discuss. I'm available tomorrow afternoon or Thursday morning.", time: "2:20 PM" },
  { from: "them", text: "Campaign_Details.pdf", time: "2:21 PM", type: "file", fileName: "Campaign_Details.pdf", fileSize: "1.8 MB" },
  { from: "them", text: "Thursday morning works. Let's schedule a call at 10 AM EST?", time: "2:22 PM" },
  { from: "me", text: "Perfect! I'll be ready. Looking forward to it! 🎬", time: "2:25 PM" },
  { from: "me", text: "https://sarahjcreates.com/portfolio", time: "2:26 PM", type: "link", url: "https://sarahjcreates.com/portfolio" },
];

const CreatorMessages = () => {
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
      description: `Calling TechFlow Inc...`,
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
    <DashboardLayout sidebar={<CreatorSidebar />} title="Messages" userInitials="SJ">
      <Card className="h-[calc(100vh-8rem)]">
        <div className="flex h-full">
          {/* Conversation list */}
          <div className={`${showChat ? "hidden md:flex" : "flex"} w-full md:w-80 border-r border-border flex-col`}>
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-8 h-9" />
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
                    {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
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
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowChat(false)} className="md:hidden p-1 hover:bg-muted rounded">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">TF</div>
                <div>
                  <p className="text-sm font-medium">TechFlow Inc.</p>
                  <p className="text-xs text-success">Online</p>
                </div>
              </div>
              <TooltipProvider>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleCall("audio")}>
                        <Phone className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voice Call</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleCall("video")}>
                        <Video className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Video Call</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
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

export default CreatorMessages;