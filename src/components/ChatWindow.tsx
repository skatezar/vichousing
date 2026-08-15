"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Message, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherUser: Profile;
}

export function ChatWindow({ conversationId, currentUserId, otherUser }: ChatWindowProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load existing messages
    supabase
      .from("messages")
      .select("*, profiles(*)")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data }: { data: any }) => {
        if (data) setMessages(data as any);
      });

    // Subscribe to real-time
    const channel = supabase
      .channel(`conv-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload: any) => {
          const { data } = await supabase
            .from("messages")
            .select("*, profiles(*)")
            .eq("id", payload.new.id)
            .single();
          if (data) {
            setMessages((prev) => [...prev, data as any]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(type: "chat" | "email" = "chat") {
    if (!input.trim()) return;
    setSending(true);

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: input.trim(),
      type,
    });

    setSending(false);
    if (!error) setInput("");
  }

  return (
    <div className="flex flex-col h-full">
      {/* Other user header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b divider bg-white">
        <div className="w-9 h-9 rounded-full bg-[var(--navy)] flex items-center justify-center">
          <span className="font-sans text-white text-sm font-semibold">
            {otherUser.full_name?.[0]?.toUpperCase() || "?"}
          </span>
        </div>
        <div>
          <p className="font-sans text-sm font-semibold text-[var(--navy)]">
            {otherUser.full_name}
          </p>
          <p className="font-sans text-xs text-[var(--warm-gray)]">
            {otherUser.organization} · {otherUser.email}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[var(--cream)]">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="font-sans text-sm text-[var(--warm-gray)]">
              No messages yet. Start the conversation below.
            </p>
          </div>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={cn("flex", isOwn ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] px-4 py-2.5",
                  isOwn ? "chat-bubble-out" : "chat-bubble-in"
                )}
              >
                {msg.type === "email" && (
                  <div className="flex items-center gap-1 mb-1 opacity-60">
                    <Mail size={11} />
                    <span className="font-sans text-[10px] uppercase tracking-wider">
                      via email
                    </span>
                  </div>
                )}
                <p className="font-sans text-sm leading-relaxed">{msg.content}</p>
                <p className={cn(
                  "font-sans text-[10px] mt-1",
                  isOwn ? "text-white/60 text-right" : "text-[var(--warm-gray)]"
                )}>
                  {new Date(msg.created_at).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t divider bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage("chat")}
            placeholder="Type a message..."
            className="luxury-input flex-1 px-4 py-2.5 rounded-sm font-sans text-sm"
          />
          <button
            onClick={() => sendMessage("chat")}
            disabled={sending || !input.trim()}
            className="btn-gold px-4 py-2.5 rounded-sm disabled:opacity-40"
            title="Send chat message"
          >
            <Send size={16} />
          </button>
          <button
            onClick={() => sendMessage("email")}
            disabled={sending || !input.trim()}
            className="btn-outline px-4 py-2.5 rounded-sm disabled:opacity-40"
            title="Send as email"
          >
            <Mail size={16} />
          </button>
        </div>
        <p className="font-sans text-[10px] text-[var(--warm-gray)] mt-2 opacity-70">
          Chat sends instantly · Mail icon sends as email copy to both parties
        </p>
      </div>
    </div>
  );
}
