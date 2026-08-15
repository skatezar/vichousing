"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { ChatWindow } from "@/components/ChatWindow";
import { formatPrice, cn } from "@/lib/utils";
import type { Conversation, Profile } from "@/lib/types";

interface Props {
  conversations: (Conversation & { buyer: Profile; seller: Profile })[];
  currentUserId: string;
  activeConvId: string | null;
}

export function ChatClient({ conversations, currentUserId, activeConvId }: Props) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(activeConvId);

  const activeConv = conversations.find((c) => c.id === activeId);
  const otherUser = activeConv
    ? activeConv.buyer_id === currentUserId
      ? activeConv.seller
      : activeConv.buyer
    : null;

  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-6 py-0 sm:py-8">
      <div className="luxury-card rounded-none sm:rounded-sm overflow-hidden" style={{ height: "calc(100vh - 120px)" }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className={cn(
            "w-full sm:w-72 flex-shrink-0 border-r divider flex flex-col",
            activeId ? "hidden sm:flex" : "flex"
          )}>
            {/* Header */}
            <div className="px-5 py-4 border-b divider">
              <h1 className="font-serif text-xl text-[var(--navy)]">Messages</h1>
              <p className="font-sans text-xs text-[var(--warm-gray)] mt-0.5">
                {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle size={24} className="text-[var(--gold-dark)] mx-auto mb-2 opacity-40" />
                  <p className="font-sans text-xs text-[var(--warm-gray)]">
                    No conversations yet. Contact a seller to start chatting.
                  </p>
                  <Link href="/listings" className="btn-gold text-xs px-4 py-2 rounded-sm mt-4 inline-block">
                    Browse Listings
                  </Link>
                </div>
              ) : (
                conversations.map((conv) => {
                  const other = conv.buyer_id === currentUserId ? conv.seller : conv.buyer;
                  const isActive = conv.id === activeId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setActiveId(conv.id);
                        router.replace(`/chat?conversation=${conv.id}`, { scroll: false });
                      }}
                      className={cn(
                        "w-full text-left px-5 py-4 border-b divider hover:bg-[var(--cream)] transition-colors",
                        isActive && "bg-[var(--cream)] border-l-2 border-l-[var(--gold)]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--navy)] flex items-center justify-center flex-shrink-0">
                          <span className="font-sans text-white text-sm font-semibold">
                            {other?.full_name?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm font-semibold text-[var(--navy)] truncate">
                            {other?.full_name || "Unknown"}
                          </p>
                          <p className="font-sans text-xs text-[var(--warm-gray)] truncate">
                            {(conv as any).listings?.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat panel */}
          <div className={cn(
            "flex-1 flex flex-col",
            !activeId ? "hidden sm:flex" : "flex"
          )}>
            {activeConv && otherUser ? (
              <>
                {/* Mobile back */}
                <div className="sm:hidden flex items-center gap-2 px-4 py-3 border-b divider bg-white">
                  <button
                    onClick={() => setActiveId(null)}
                    className="text-[var(--warm-gray)] hover:text-[var(--navy)]"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-semibold truncate">{otherUser.full_name}</p>
                    <p className="font-sans text-xs text-[var(--warm-gray)] truncate">
                      {(activeConv as any).listings?.title}
                    </p>
                  </div>
                </div>

                {/* Listing context bar */}
                <div className="hidden sm:flex items-center gap-3 px-5 py-3 bg-[var(--cream)] border-b divider">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs text-[var(--warm-gray)] uppercase tracking-wider">
                      Re: {(activeConv as any).listings?.title}
                    </p>
                  </div>
                  <Link
                    href={`/listings/${activeConv.listing_id}`}
                    className="font-sans text-xs text-[var(--gold-dark)] hover:underline"
                  >
                    View listing →
                  </Link>
                </div>

                <ChatWindow
                  conversationId={activeConv.id}
                  currentUserId={currentUserId}
                  otherUser={otherUser}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle size={40} className="text-[var(--gold-dark)] mx-auto mb-3 opacity-30" />
                  <p className="font-sans text-sm text-[var(--warm-gray)]">
                    Select a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
