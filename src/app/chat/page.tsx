import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatClient } from "./ChatClient";

interface Props {
  searchParams: Promise<{ conversation?: string }>;
}

export default async function ChatPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { conversation: activeConvId } = await searchParams;

  const [{ data: profile }, { data: conversations }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("conversations")
      .select(`
        *,
        listings(id, title, type, price, district),
        buyer:profiles!conversations_buyer_id_fkey(*),
        seller:profiles!conversations_seller_id_fkey(*)
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order("created_at", { ascending: false }),
  ]);

  if (!profile?.is_un_staff) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="luxury-card rounded-sm p-10 max-w-md text-center">
          <div className="w-16 h-16 rounded-sm bg-[var(--navy)] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="font-serif text-2xl text-[var(--navy)] mb-3">UN Staff Only</h2>
          <p className="font-sans text-sm text-[var(--warm-gray)] leading-relaxed">
            The messaging system is exclusively available to verified UNIDO, UN, IAEA and CTBTO staff members.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ChatClient
      conversations={(conversations as any) || []}
      currentUserId={user.id}
      activeConvId={activeConvId || null}
    />
  );
}
