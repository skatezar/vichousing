"use client";

import { useState } from "react";
import { X, Calendar, Clock, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ViewingModalProps {
  listingId: string;
  listingTitle: string;
  onClose: () => void;
}

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

export function ViewingModal({ listingId, listingTitle, onClose }: ViewingModalProps) {
  const supabase = createClient();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  async function handleSubmit() {
    if (!date || !time) {
      setError("Please select a date and time.");
      return;
    }

    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be signed in to schedule a viewing.");
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.from("viewings").insert({
      listing_id: listingId,
      requester_id: user.id,
      proposed_date: date,
      proposed_time: time,
      notes: notes || null,
      status: "pending",
    });

    setLoading(false);
    if (err) {
      setError("Failed to schedule viewing. Please try again.");
    } else {
      setSuccess(true);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="luxury-card rounded-sm w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b divider">
          <div>
            <h2 className="font-serif text-xl text-[var(--navy)]">Schedule Viewing</h2>
            <p className="font-sans text-sm text-[var(--warm-gray)] mt-0.5 truncate max-w-[280px]">
              {listingTitle}
            </p>
          </div>
          <button onClick={onClose} className="text-[var(--warm-gray)] hover:text-[var(--navy)] transition-colors">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="font-serif text-xl text-[var(--navy)] mb-2">Viewing Requested</h3>
            <p className="font-sans text-sm text-[var(--warm-gray)]">
              Your request for{" "}
              <strong>{date} at {time}</strong>{" "}
              has been sent. The host will confirm shortly.
            </p>
            <button
              onClick={onClose}
              className="btn-gold mt-6 px-6 py-2.5 rounded-sm text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Date */}
            <div>
              <label className="stat-label block mb-2 flex items-center gap-1.5">
                <Calendar size={12} />
                Preferred Date
              </label>
              <input
                type="date"
                min={minDateStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="luxury-input w-full px-4 py-2.5 rounded-sm font-sans text-sm"
              />
            </div>

            {/* Time slots */}
            <div>
              <label className="stat-label block mb-2 flex items-center gap-1.5">
                <Clock size={12} />
                Preferred Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={`px-3 py-2 rounded-sm border font-sans text-sm transition-all ${
                      time === slot
                        ? "bg-[var(--navy)] text-white border-[var(--navy)]"
                        : "border-[#ddd5c8] text-[var(--navy)] hover:border-[var(--gold)]"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="stat-label block mb-2">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any questions or special requests..."
                rows={3}
                className="luxury-input w-full px-4 py-2.5 rounded-sm font-sans text-sm resize-none"
              />
            </div>

            {error && (
              <p className="font-sans text-sm text-red-500">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-gold w-full py-3 rounded-sm text-sm disabled:opacity-60"
            >
              {loading ? "Sending request..." : "Request Viewing"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
