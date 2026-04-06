import { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Search, ArrowLeft, Phone, Video, PhoneOff, MicOff, VideoOff, Paperclip, Link2, Image, FileText, X, Download, Mic, Play, MessageSquare, Loader2, Check, CheckCheck, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { getCurrentCreatorContext } from "@/lib/creator-api";

const defaultConversations: Array<{ name: string; participantId: string; last: string; time: string; unread: number }> = [];
const CALL_SYSTEM_PREFIX = "__SYS_CALL__";
const SIGNAL_PREFIX = "__SYS_SIGNAL__";
const STUN_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

type DbMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  content_type: "text" | "file" | "link" | "image" | "audio";
  metadata: Record<string, string> | null;
  created_at: string;
  is_read?: boolean;
};

type UploadRetryPayload = {
  messageType: "file" | "image" | "audio";
  file: File | Blob;
  fileName: string;
  text: string;
  fileSize?: string;
  duration?: string;
};

type MessageType = {
  id?: string;
  from: string;
  text: string;
  time: string;
  type?: "text" | "file" | "link" | "image" | "audio";
  fileName?: string;
  fileSize?: string;
  url?: string;
  duration?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  uploadFailed?: boolean;
  deliveryState?: "sending" | "sent" | "delivered";
  retryPayload?: UploadRetryPayload;
};

const initialMessages: MessageType[] = [
  { from: "them", text: "Your live creator inbox will appear here once you have a real conversation.", time: "2:15 PM" },
];

const CreatorMessages = () => {
  const [conversations, setConversations] = useState(defaultConversations);
  const [selectedChat, setSelectedChat] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<MessageType[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState("Creator");
  const [userInitials, setUserInitials] = useState("CR");
  const [downloadingMessageIds, setDownloadingMessageIds] = useState<string[]>([]);
  const [downloadProgressById, setDownloadProgressById] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const connectedAtRef = useRef<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [activeCall, setActiveCall] = useState<{ room: string; kind: "audio" | "video" } | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ room: string; kind: "audio" | "video"; callerName: string; offer?: RTCSessionDescriptionInit } | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);
  const { toast } = useToast();
  const selectedParticipant = conversations[selectedChat] ?? { name: "No conversation", participantId: "", last: "", time: "", unread: 0 };
  const hasSelectedConversation = Boolean(selectedParticipant.participantId);

  const conversationKey = currentUserId ? [currentUserId, selectedParticipant.participantId].sort().join(":") : "";

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatConversationPreview = (content: string) => {
    if (content.startsWith(SIGNAL_PREFIX)) return "";
    if (content.startsWith(CALL_SYSTEM_PREFIX)) {
      const [, event, kind, actor] = content.split("|");
      if (event === "started") return `${actor} started a ${kind} call`;
      if (event === "joined") return `${actor} joined the call`;
      if (event === "left") return `${actor} left the call`;
      return `${actor} ended the call`;
    }
    return content;
  };
  const formatCallDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const makeTempId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const sendSignalToDb = async (content: string, metadata?: Record<string, string>) => {
    if (!currentUserId || !selectedParticipant.participantId) return;
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from("messages").insert({
      sender_id: currentUserId,
      receiver_id: selectedParticipant.participantId,
      content,
      content_type: "text",
      metadata: metadata ?? null,
    });
  };

  const sendSignal = async (
    type: "invite" | "offer" | "answer" | "ice" | "decline" | "end",
    kind: "audio" | "video",
    room: string,
    extra?: Record<string, string>,
  ) => {
    await sendSignalToDb(`${SIGNAL_PREFIX}|${type}|${kind}|${currentUserName}|${room}`, extra);
  };

  const cleanupCall = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    connectedAtRef.current = null;
    setCallDurationSeconds(0);
    setRemoteStream(null);
    setActiveCall(null);
    setIsMuted(false);
    setIsCameraOff(false);
    pendingIceCandidatesRef.current = [];
  };

  const createPeerConnection = (kind: "audio" | "video", room: string) => {
    const pc = new RTCPeerConnection(STUN_CONFIG);
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) void sendSignal("ice", kind, room, { candidate: JSON.stringify(candidate) });
    };
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0] ?? null);
    };
    peerConnectionRef.current = pc;
    return pc;
  };

  const sendCallSystemMessage = async (event: "started" | "joined" | "left" | "ended", kind: "audio" | "video", room: string) => {
    await sendMessage(`${CALL_SYSTEM_PREFIX}|${event}|${kind}|${currentUserName}|${room}`, "text");
  };

  const handleDownload = async (url: string, fileName: string, messageId: string) => {
    setDownloadingMessageIds((prev) => (prev.includes(messageId) ? prev : [...prev, messageId]));
    setDownloadProgressById((prev) => ({ ...prev, [messageId]: 0 }));
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed.");
      const total = Number(response.headers.get("content-length") ?? 0);
      let blob: Blob;

      if (response.body && total > 0) {
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            received += value.length;
            const percent = Math.min(100, Math.round((received / total) * 100));
            setDownloadProgressById((prev) => ({ ...prev, [messageId]: percent }));
          }
        }

        blob = new Blob(chunks);
      } else {
        blob = await response.blob();
        setDownloadProgressById((prev) => ({ ...prev, [messageId]: 100 }));
      }

      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName || "attachment";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to download file.";
      toast({ title: "Download failed", description: message, variant: "destructive" });
    } finally {
      setDownloadingMessageIds((prev) => prev.filter((id) => id !== messageId));
      setDownloadProgressById((prev) => {
        const next = { ...prev };
        delete next[messageId];
        return next;
      });
    }
  };

  const mapDbMessage = (message: DbMessage): MessageType => ({
    id: message.id,
    from: message.sender_id === currentUserId ? "me" : "them",
    text: message.content,
    time: new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    type: message.content_type,
    fileName: message.metadata?.fileName,
    fileSize: message.metadata?.fileSize,
    url: message.metadata?.url,
    duration: message.metadata?.duration,
    deliveryState: message.sender_id === currentUserId ? "delivered" : undefined,
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const loadContextAndConversations = async () => {
      try {
        const context = await getCurrentCreatorContext();
        setCurrentUserId(context.userId);
        setCurrentUserName(context.fullName || "Creator");
        setUserInitials(context.initials);

        const { data: messages, error } = await supabase
          .from("messages")
          .select("sender_id, receiver_id, content, created_at")
          .or(`sender_id.eq.${context.userId},receiver_id.eq.${context.userId}`)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const counterpartIds = new Set<string>();
        (messages ?? []).forEach((message) => {
          counterpartIds.add(message.sender_id === context.userId ? message.receiver_id : message.sender_id);
        });

        if (!counterpartIds.size) return;

        const { data: profileRows, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", Array.from(counterpartIds));
        if (profileError) throw profileError;

        const profileMap = new Map((profileRows ?? []).map((profile) => [profile.id, profile.full_name]));
        const conversationMap = new Map<string, { name: string; participantId: string; last: string; time: string; unread: number }>();

        (messages ?? []).forEach((message) => {
          if (message.content.startsWith(SIGNAL_PREFIX)) return;
          const participantId = message.sender_id === context.userId ? message.receiver_id : message.sender_id;
          if (conversationMap.has(participantId)) return;

          conversationMap.set(participantId, {
            name: profileMap.get(participantId) ?? "Brand",
            participantId,
            last: formatConversationPreview(message.content),
            time: new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            unread: 0,
          });
        });

        const nextConversations = Array.from(conversationMap.values());
        if (nextConversations.length) {
          setConversations(nextConversations);
          setSelectedChat(0);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load conversations.";
        toast({ title: "Messages error", description: message, variant: "destructive" });
      }
    };

    void loadContextAndConversations();
  }, [toast]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setChatMessages(initialMessages);
      return;
    }

    if (!currentUserId || !selectedParticipant.participantId) {
      return;
    }

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, sender_id, receiver_id, content, content_type, metadata, created_at, is_read")
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedParticipant.participantId}),and(sender_id.eq.${selectedParticipant.participantId},receiver_id.eq.${currentUserId})`)
        .order("created_at", { ascending: true });

      if (error) {
        toast({ title: "Unable to load messages", description: error.message, variant: "destructive" });
        return;
      }

      setChatMessages((data as DbMessage[]).filter((m) => !m.content.startsWith(SIGNAL_PREFIX)).map(mapDbMessage));
    };

    void loadMessages();

    const channel = supabase
      .channel(`messages:${conversationKey}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_key=eq.${conversationKey}`,
        },
        (payload) => {
          const msg = payload.new as DbMessage;
          if (msg.content.startsWith(SIGNAL_PREFIX)) return; // handled by global signal listener
          const incoming = mapDbMessage(msg);
          setChatMessages((prev) => (prev.some((message) => message.id === incoming.id) ? prev : [...prev, incoming]));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationKey, currentUserId, selectedParticipant.participantId, toast]);

  // Global signal listener — works regardless of which conversation is open
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !currentUserId) return;

    const signalCh = supabase
      .channel(`signals:${currentUserId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `receiver_id=eq.${currentUserId}` },
        (payload) => {
          const msg = payload.new as DbMessage;
          if (!msg.content.startsWith(SIGNAL_PREFIX)) return;
          const [, sigType, sigKind, sigActor, sigRoom] = msg.content.split("|");
          const callKind: "audio" | "video" = sigKind === "video" ? "video" : "audio";
          if (sigType === "offer" && msg.metadata?.sdp) {
            const offer = JSON.parse(msg.metadata.sdp) as RTCSessionDescriptionInit;
            setIncomingCall({ room: sigRoom, kind: callKind, callerName: sigActor, offer });
          } else if (sigType === "answer" && msg.metadata?.sdp) {
            const answer = JSON.parse(msg.metadata.sdp) as RTCSessionDescriptionInit;
            void peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer)).then(() => {
              for (const c of pendingIceCandidatesRef.current) {
                void peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(c));
              }
              pendingIceCandidatesRef.current = [];
            });
          } else if (sigType === "ice" && msg.metadata?.candidate) {
            const candidate = JSON.parse(msg.metadata.candidate) as RTCIceCandidateInit;
            if (peerConnectionRef.current?.remoteDescription) {
              void peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
              pendingIceCandidatesRef.current.push(candidate);
            }
          } else if (sigType === "decline") {
            cleanupCall();
            toast({ title: `${sigActor} declined the call` });
          } else if (sigType === "end") {
            cleanupCall();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(signalCh);
    };
  }, [currentUserId]);

  useEffect(() => {
    if (activeCall && localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [activeCall]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (!activeCall || !remoteStream) {
      connectedAtRef.current = null;
      setCallDurationSeconds(0);
      return;
    }

    if (!connectedAtRef.current) {
      connectedAtRef.current = Date.now();
    }

    setCallDurationSeconds(Math.floor((Date.now() - connectedAtRef.current) / 1000));
    const timer = window.setInterval(() => {
      if (!connectedAtRef.current) return;
      setCallDurationSeconds(Math.floor((Date.now() - connectedAtRef.current) / 1000));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeCall, remoteStream]);

  const sendMessage = async (
    content: string,
    type: "text" | "file" | "link" | "image" | "audio" = "text",
    metadata?: Record<string, string>,
  ): Promise<boolean> => {
    if (!content.trim()) return false;
    if (!currentUserId) {
      toast({ title: "Unable to send", description: "Creator session not loaded yet.", variant: "destructive" });
      return false;
    }
    if (!selectedParticipant.participantId) return false;

    if (!isSupabaseConfigured || !supabase) {
      setChatMessages((prev) => [
        ...prev,
        {
          from: "me",
          text: content,
          time: now(),
          type,
          fileName: metadata?.fileName,
          fileSize: metadata?.fileSize,
          url: metadata?.url,
          duration: metadata?.duration,
          deliveryState: "sent",
        },
      ]);
      return true;
    }

    const { error } = await supabase.from("messages").insert({
      sender_id: currentUserId,
      receiver_id: selectedParticipant.participantId,
      content,
      content_type: type,
      metadata: metadata ?? null,
    });

    if (error) {
      toast({ title: "Unable to send", description: error.message, variant: "destructive" });
      return false;
    }

    return true;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const isLink = /^https?:\/\//.test(inputValue.trim());
    void sendMessage(inputValue.trim(), isLink ? "link" : "text", isLink ? { url: inputValue.trim() } : undefined);
    setInputValue("");
  };

  const uploadToStorage = async (
    fileOrBlob: File | Blob,
    fileName: string,
    onProgress?: (percent: number) => void,
  ): Promise<string | null> => {
    if (!supabase || !currentUserId) return null;
    onProgress?.(0);
    let progress = 0;
    const progressTimer = window.setInterval(() => {
      progress = Math.min(progress + 8, 90);
      onProgress?.(progress);
    }, 180);
    const ext = fileName.split(".").pop() ?? "bin";
    const path = `${currentUserId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("chat-attachments")
      .upload(path, fileOrBlob, { contentType: fileOrBlob.type || "application/octet-stream" });
    window.clearInterval(progressTimer);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return null;
    }
    const { data } = await supabase.storage.from("chat-attachments").createSignedUrl(path, 365 * 24 * 3600);
    onProgress?.(100);
    return data?.signedUrl ?? null;
  };

  const updateTempMessage = (tempId: string, patch: Partial<MessageType>) => {
    setChatMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, ...patch } : m)));
  };

  const finalizeUploadMessage = async (tempId: string, payload: UploadRetryPayload) => {
    updateTempMessage(tempId, { isUploading: true, uploadFailed: false, uploadProgress: 0, deliveryState: "sending" });
    const url = await uploadToStorage(payload.file, payload.fileName, (percent) => {
      updateTempMessage(tempId, { uploadProgress: percent });
    });

    if (!url) {
      updateTempMessage(tempId, { isUploading: false, uploadFailed: true, deliveryState: "sent" });
      return;
    }

    const sent = await sendMessage(payload.text, payload.messageType, {
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      duration: payload.duration,
      url,
    });

    if (!sent) {
      updateTempMessage(tempId, { isUploading: false, uploadFailed: true, deliveryState: "sent", uploadProgress: 100 });
      return;
    }

    setChatMessages((prev) => prev.filter((m) => m.id !== tempId));
    setShowAttachMenu(false);
  };

  const retryUpload = async (messageId: string) => {
    const message = chatMessages.find((m) => m.id === messageId);
    if (!message?.retryPayload) return;
    await finalizeUploadMessage(messageId, message.retryPayload);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "file" | "image") => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    const fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    const tempId = makeTempId();
    const retryPayload: UploadRetryPayload = {
      messageType: type === "image" ? "image" : "file",
      file,
      fileName: file.name,
      text: file.name,
      fileSize,
    };
    setChatMessages((prev) => [
      ...prev,
      {
        id: tempId,
        from: "me",
        text: file.name,
        time: now(),
        type: type === "image" ? "image" : "file",
        fileName: file.name,
        fileSize,
        isUploading: true,
        uploadProgress: 0,
        deliveryState: "sending",
        retryPayload,
      },
    ]);
    await finalizeUploadMessage(tempId, retryPayload);
  };

  const handleCall = async (type: "audio" | "video") => {
    if (!selectedParticipant.participantId || !conversationKey) {
      toast({ title: "No active chat", description: "Open a conversation first.", variant: "destructive" });
      return;
    }
    const room = `at-${conversationKey.replace(/[^a-zA-Z0-9]/g, "-")}`;
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        type === "video" ? { audio: true, video: true } : { audio: true, video: false },
      );
      localStreamRef.current = stream;
      const pc = createPeerConnection(type, room);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await sendSignal("offer", type, room, { sdp: JSON.stringify(offer) });
      void sendCallSystemMessage("started", type, room);
      setActiveCall({ room, kind: type });
    } catch {
      toast({ title: "Camera/mic access denied", description: "Allow access to start a call.", variant: "destructive" });
      cleanupCall();
    }
  };

  const handleEndCall = () => {
    if (!activeCall) return;
    void sendSignal("end", activeCall.kind, activeCall.room);
    void sendCallSystemMessage("ended", activeCall.kind, activeCall.room);
    cleanupCall();
  };

  const answerCall = async () => {
    if (!incomingCall?.offer) return;
    const { room, kind, offer } = incomingCall;
    setIncomingCall(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        kind === "video" ? { audio: true, video: true } : { audio: true, video: false },
      );
      localStreamRef.current = stream;
      const pc = createPeerConnection(kind, room);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      for (const c of pendingIceCandidatesRef.current) {
        await pc.addIceCandidate(new RTCIceCandidate(c));
      }
      pendingIceCandidatesRef.current = [];
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await sendSignal("answer", kind, room, { sdp: JSON.stringify(answer) });
      void sendCallSystemMessage("joined", kind, room);
      setActiveCall({ room, kind });
    } catch {
      toast({ title: "Camera/mic access denied", description: "Allow access to answer the call.", variant: "destructive" });
      cleanupCall();
    }
  };

  const declineCall = async () => {
    if (!incomingCall) return;
    const { room, kind } = incomingCall;
    setIncomingCall(null);
    await sendSignal("decline", kind, room);
  };

  const toggleMute = () => {
    if (!localStreamRef.current) return;
    const next = !isMuted;
    localStreamRef.current.getAudioTracks().forEach((t) => { t.enabled = !next; });
    setIsMuted(next);
  };

  const toggleCamera = () => {
    if (!localStreamRef.current) return;
    const next = !isCameraOff;
    localStreamRef.current.getVideoTracks().forEach((t) => { t.enabled = !next; });
    setIsCameraOff(next);
  };

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    const durationSeconds = Math.max(5, Math.round(file.size / 16000));
    const duration = `${Math.floor(durationSeconds / 60)}:${(durationSeconds % 60).toString().padStart(2, "0")}`;
    const tempId = makeTempId();
    const retryPayload: UploadRetryPayload = {
      messageType: "audio",
      file,
      fileName: file.name,
      text: "Voice note",
      duration,
    };
    setChatMessages((prev) => [
      ...prev,
      {
        id: tempId,
        from: "me",
        text: "Voice note",
        time: now(),
        type: "audio",
        fileName: file.name,
        duration,
        isUploading: true,
        uploadProgress: 0,
        deliveryState: "sending",
        retryPayload,
      },
    ]);
    await finalizeUploadMessage(tempId, retryPayload);
  };

  const handleMicRecord = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const fileName = `voice-${Date.now()}.webm`;
        const secs = Math.max(1, Math.round(blob.size / 16000));
        const dur = `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, "0")}`;
        const tempId = makeTempId();
        const retryPayload: UploadRetryPayload = {
          messageType: "audio",
          file: blob,
          fileName,
          text: "Voice note",
          duration: dur,
        };
        setChatMessages((prev) => [
          ...prev,
          {
            id: tempId,
            from: "me",
            text: "Voice note",
            time: now(),
            type: "audio",
            fileName,
            duration: dur,
            isUploading: true,
            uploadProgress: 0,
            deliveryState: "sending",
            retryPayload,
          },
        ]);
        await finalizeUploadMessage(tempId, retryPayload);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      toast({ title: "Recording...", description: "Tap the mic again to stop" });
    } catch {
      toast({ title: "Mic access denied", description: "Allow microphone access to record voice notes.", variant: "destructive" });
    }
  };

  const renderMessage = (message: MessageType, index: number) => {
    const isMine = message.from === "me";
    const bubbleClass = isMine ? "gradient-primary text-primary-foreground" : "bg-secondary";
    const timeClass = isMine ? "text-primary-foreground/70" : "text-muted-foreground";

    const renderFooter = () => (
      <div className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${timeClass}`}>
        <span>{message.time}</span>
        {isMine && !message.uploadFailed && (message.deliveryState === "delivered" ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
      </div>
    );

    if (message.type === "text" && message.text.startsWith(CALL_SYSTEM_PREFIX)) {
      const [, event, kind, actor, room] = message.text.split("|");
      const label =
        event === "started"
          ? `${actor} started a ${kind} call`
          : event === "joined"
          ? `${actor} joined the call`
          : event === "left"
          ? `${actor} left the call`
          : `${actor} ended the call`;

      return (
        <div key={message.id ?? index} className="flex justify-center">
          <div className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-[11px] text-muted-foreground">
            <span>{label}</span>
          </div>
        </div>
      );
    }

    if (message.type === "file") {
      return (
        <div key={message.id ?? index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${bubbleClass}`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isMine ? "bg-primary-foreground/20" : "bg-muted"}`}>
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{message.fileName}</p>
                <p className={`text-[10px] ${timeClass}`}>
                  {message.isUploading ? `Uploading... ${message.uploadProgress ?? 0}%` : message.fileSize}
                </p>
                {!message.isUploading && message.id && downloadingMessageIds.includes(message.id) && (
                  <p className={`text-[10px] ${timeClass}`}>Downloading... {downloadProgressById[message.id] ?? 0}%</p>
                )}
                {message.isUploading && (
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-primary-foreground/20">
                    <div className="h-1.5 rounded-full bg-primary-foreground transition-all" style={{ width: `${message.uploadProgress ?? 0}%` }} />
                  </div>
                )}
              </div>
              {message.isUploading ? (
                <span className="shrink-0 rounded-lg p-1.5 opacity-80"><Loader2 className="h-4 w-4 animate-spin" /></span>
              ) : message.url ? (
                <button
                  type="button"
                  onClick={() => message.id && void handleDownload(message.url!, message.fileName ?? "attachment", message.id)}
                  className={`shrink-0 rounded-lg p-1.5 hover:bg-primary-foreground/10 ${isMine ? "" : "hover:bg-muted"}`}
                >
                  {message.id && downloadingMessageIds.includes(message.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <span className="shrink-0 rounded-lg p-1.5 opacity-30"><Download className="h-4 w-4" /></span>
              )}
            </div>
            {message.uploadFailed && message.id && (
              <button
                type="button"
                onClick={() => void retryUpload(message.id!)}
                className="mt-2 inline-flex items-center gap-1 rounded-md border border-current/20 px-2 py-1 text-[10px]"
              >
                <RotateCcw className="h-3 w-3" /> Retry
              </button>
            )}
            {renderFooter()}
          </div>
        </div>
      );
    }

    if (message.type === "link") {
      return (
        <div key={message.id ?? index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[85%] rounded-2xl px-4 py-2 sm:max-w-[70%] ${bubbleClass}`}>
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 shrink-0" />
              <a href={message.url} target="_blank" rel="noopener noreferrer" className="truncate text-sm underline underline-offset-2">
                {message.url}
              </a>
            </div>
            {renderFooter()}
          </div>
        </div>
      );
    }

    if (message.type === "audio") {
      return (
        <div key={message.id ?? index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${bubbleClass}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Mic className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <p className="truncate text-xs font-medium opacity-80">{message.fileName ?? "Voice note"}</p>
            </div>
            {message.url ? (
              <audio controls src={message.url} className="w-full max-w-[220px] rounded" style={{ height: "32px" }} />
            ) : (
              <div className="flex items-center gap-2 text-xs opacity-60">
                <Play className="h-3 w-3" /><span>{message.duration ?? "0:00"}</span>
              </div>
            )}
            {message.isUploading && (
              <div className="mt-1 flex items-center gap-1 text-[10px] opacity-80">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Uploading voice... {message.uploadProgress ?? 0}%</span>
              </div>
            )}
            {message.uploadFailed && message.id && (
              <button
                type="button"
                onClick={() => void retryUpload(message.id!)}
                className="mt-2 inline-flex items-center gap-1 rounded-md border border-current/20 px-2 py-1 text-[10px]"
              >
                <RotateCcw className="h-3 w-3" /> Retry
              </button>
            )}
            {renderFooter()}
          </div>
        </div>
      );
    }

    return (
      <div key={message.id ?? index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-[85%] rounded-2xl px-4 py-2 sm:max-w-[70%] ${bubbleClass}`}>
          <p className="text-sm">{message.text}</p>
          {renderFooter()}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout
      sidebar={<CreatorSidebar />}
      title="Messages"
      userInitials={userInitials}
      hideMobileNav={showChat || Boolean(activeCall) || Boolean(incomingCall)}
    >
      <div className="-m-3 flex h-[calc(100dvh-3.5rem)] min-h-[32rem] sm:-m-6">
        <div className={`${showChat ? "hidden md:flex" : "flex"} w-full flex-col border-r border-border bg-background md:w-80`}>
          <div className="sticky top-0 z-10 border-b border-border bg-background/95 p-3 backdrop-blur md:static md:bg-background">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="h-9 pl-8" />
            </div>
          </div>
          <div className="flex-1 overflow-auto px-3 pb-28 pt-3 md:px-0 md:pb-0 md:pt-0">
            {!conversations.length && (
              <p className="p-4 text-sm text-muted-foreground">No conversations yet. Accept an invitation or wait for a new message.</p>
            )}
            {conversations.map((conversation, index) => (
              <div
                key={conversation.participantId}
                onClick={() => { setSelectedChat(index); setShowChat(true); }}
                className={`mb-2 flex cursor-pointer items-center gap-3 rounded-2xl border p-3 shadow-sm transition-colors backdrop-blur md:mb-0 md:rounded-none md:border-0 md:bg-transparent md:shadow-none ${index === selectedChat ? "border-primary/20 bg-primary/5" : "border-border/60 bg-card/70 hover:bg-secondary/70 md:hover:bg-secondary/50"}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground shadow-md shadow-primary/20">
                  {conversation.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-medium">{conversation.name}</span>
                    <span className="ml-2 shrink-0 text-[10px] text-muted-foreground">{conversation.time}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{conversation.last || "No recent message"}</p>
                </div>
                {conversation.unread > 0 && (
                  <Badge className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 text-[10px] gradient-primary text-primary-foreground">
                    {conversation.unread}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={`${showChat ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col bg-background`}>
          {hasSelectedConversation ? (
            <>
              <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <button onClick={() => setShowChat(false)} className="shrink-0 rounded p-1 hover:bg-muted md:hidden">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                    {selectedParticipant.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{selectedParticipant.name}</p>
                    <p className="text-xs text-success">Online</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => void handleCall("audio")}>
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => void handleCall("video")}>
                    <Video className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-auto bg-muted/30 p-3 pb-24 md:pb-3">
                {chatMessages.map((message, index) => renderMessage(message, index))}
              </div>

              {showAttachMenu && (
                <div className="bg-background px-3 pb-2">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-2">
                    <Button variant="ghost" size="sm" className="gap-2 text-xs" onClick={() => fileInputRef.current?.click()}>
                      <FileText className="h-4 w-4" /> File
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-xs" onClick={() => imageInputRef.current?.click()}>
                      <Image className="h-4 w-4" /> Image
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-xs" onClick={() => audioInputRef.current?.click()}>
                      <Mic className="h-4 w-4" /> Audio
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-xs"
                      onClick={() => {
                        const link = prompt("Paste a link:");
                        if (link) {
                          void sendMessage(link, "link", { url: link });
                          setShowAttachMenu(false);
                        }
                      }}
                    >
                      <Link2 className="h-4 w-4" /> Link
                    </Button>
                    <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={() => setShowAttachMenu(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 border-t border-border bg-background px-3 py-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => setShowAttachMenu(!showAttachMenu)}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className={`h-9 w-9 shrink-0 transition-colors ${isRecording ? "text-destructive animate-pulse" : ""}`} onClick={() => void handleMicRecord()}>
                  <Mic className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  value={inputValue}
                  disabled={!currentUserId}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleSend()}
                />
                <Button size="icon" className="gradient-primary h-9 w-9 shrink-0 rounded-full text-primary-foreground" onClick={handleSend} disabled={!currentUserId}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="hidden h-full flex-1 items-center justify-center bg-muted/20 p-6 md:flex">
              <div className="max-w-sm rounded-3xl border border-border/70 bg-card/90 p-8 text-center shadow-sm backdrop-blur">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MessageSquare className="h-7 w-7" />
                </div>
                <h2 className="text-lg font-semibold">No active conversation</h2>
                <p className="mt-2 text-sm text-muted-foreground">Accept an invitation or open an existing thread to start messaging brands in real time.</p>
              </div>
            </div>
          )}

          <input type="file" ref={fileInputRef} className="hidden" onChange={(event) => handleFileUpload(event, "file")} />
          <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={(event) => handleFileUpload(event, "image")} />
          <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" onChange={handleAudioUpload} />
        </div>
      </div>

      {activeCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-0 backdrop-blur-xl sm:p-3">
          <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden rounded-none border-0 bg-card/95 shadow-2xl backdrop-blur-xl sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-3xl sm:rounded-[2rem] sm:border sm:border-border/60">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_30%),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.16),transparent_28%)]" />
            <div className="relative flex items-center justify-between border-b border-border/50 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">AlignThrive Call</p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {activeCall.kind === "video" ? "Video Call" : "Audio Call"} • {selectedParticipant.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{remoteStream ? formatCallDuration(callDurationSeconds) : "00:00"}</p>
              </div>
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${remoteStream ? "border-success/30 bg-success/10 text-success" : "border-warning/30 bg-warning/10 text-warning-foreground"}`}>
                <div className={`h-2 w-2 rounded-full ${remoteStream ? "bg-success" : "bg-warning animate-pulse"}`} />
                <span className="hidden sm:inline">{remoteStream ? "Connected" : "Calling..."}</span>
              </div>
            </div>
            {activeCall.kind === "video" ? (
              <div className="relative m-0 flex-1 overflow-hidden border-border/40 bg-secondary/40 sm:m-4 sm:flex-none sm:rounded-[1.5rem] sm:border" style={{ aspectRatio: "16/9" }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.22),transparent_32%),linear-gradient(180deg,hsl(var(--card)),hsl(var(--secondary)))]" />
                <video ref={remoteVideoRef} autoPlay playsInline className="relative h-full w-full object-cover" />
                <video ref={localVideoRef} autoPlay playsInline muted className="absolute bottom-4 right-4 h-24 w-32 rounded-2xl border border-white/30 bg-black/20 object-cover shadow-xl backdrop-blur" />
                {!remoteStream && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full gradient-primary text-3xl font-bold text-primary-foreground shadow-lg shadow-primary/30">
                      {selectedParticipant.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <p className="mt-4 text-xl font-semibold text-foreground">{selectedParticipant.name}</p>
                    <p className="mt-2 animate-pulse text-sm text-muted-foreground">Waiting for the other person to join...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative mx-0 my-0 flex flex-1 flex-col justify-center overflow-hidden border-border/40 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.22),transparent_32%),linear-gradient(180deg,hsl(var(--card)),hsl(var(--secondary)))] px-6 py-16 text-center sm:mx-4 sm:my-4 sm:flex-none sm:rounded-[1.5rem] sm:border">
                <video ref={remoteVideoRef} autoPlay className="hidden" />
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full gradient-primary text-4xl font-bold text-primary-foreground shadow-xl shadow-primary/25">
                  {selectedParticipant.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <p className="mt-5 text-2xl font-semibold text-foreground">{selectedParticipant.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{remoteStream ? formatCallDuration(callDurationSeconds) : "Ringing..."}</p>
              </div>
            )}
            <div className="relative flex flex-wrap items-center justify-center gap-3 border-t border-border/50 px-5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
              <button
                type="button"
                onClick={toggleMute}
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition-all ${isMuted ? "border-destructive/30 bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25" : "border-border/60 bg-background/80 text-foreground hover:bg-secondary"}`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              {activeCall.kind === "video" && (
                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition-all ${isCameraOff ? "border-accent/30 bg-accent text-accent-foreground shadow-lg shadow-accent/25" : "border-border/60 bg-background/80 text-foreground hover:bg-secondary"}`}
                  title={isCameraOff ? "Turn on camera" : "Turn off camera"}
                >
                  {isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </button>
              )}
              <button
                type="button"
                onClick={handleEndCall}
                className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-destructive/30 bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30 transition-all hover:scale-105 hover:bg-destructive/90"
                title="End call"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {incomingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 p-4 backdrop-blur-xl">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-border/60 bg-card/90 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.2),transparent_34%),radial-gradient(circle_at_bottom,hsl(var(--accent)/0.16),transparent_36%)]" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Incoming Call</p>
              <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full gradient-primary text-2xl font-bold text-primary-foreground shadow-xl shadow-primary/25">
                {incomingCall.callerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <p className="mt-5 text-2xl font-semibold text-foreground">{incomingCall.callerName}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {incomingCall.kind === "video" ? "Wants to start a video call" : "Wants to start an audio call"}
              </p>
              {!incomingCall.offer && (
                <p className="mt-2 animate-pulse text-xs text-muted-foreground">Preparing secure connection...</p>
              )}
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => void declineCall()}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-destructive/30 bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30 transition-all hover:scale-105 hover:bg-destructive/90"
                  title="Decline"
                >
                  <PhoneOff className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => void answerCall()}
                  disabled={!incomingCall.offer}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-success/30 bg-success text-success-foreground shadow-lg shadow-success/30 transition-all hover:scale-105 hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Answer"
                >
                  <Phone className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CreatorMessages;
