import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ListingDetail } from "./ListingDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*, profiles(*)")
    .eq("id", id)
    .single();

  if (!listing) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  let currentProfile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    currentProfile = data;
  }

  return <ListingDetail listing={listing as any} currentProfile={currentProfile as any} />;
}
