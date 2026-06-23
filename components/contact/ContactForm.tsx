"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactEnquiry } from "@/lib/actions/contact";
import { DpdpConsent } from "@/components/legal/DpdpConsent";

export function ContactForm({
  defaultSubject = "",
  defaultMessage = "",
}: {
  defaultSubject?: string;
  defaultMessage?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      toast.error("Please accept the privacy consent to continue");
      return;
    }
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = await submitContactEnquiry({
      full_name: fd.get("name"),
      email:     fd.get("email"),
      phone:     fd.get("phone") || undefined,
      subject:   fd.get("subject"),
      message:   fd.get("message"),
      website:   fd.get("website") || undefined,
      dpdp_consent: true as const,
    });
    setLoading(false);
    if (!result.ok) { toast.error(result.error); return; }
    setSent(true);
    toast.success("Message sent! We'll get back to you soon.");
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <p className="text-green-700 font-semibold mb-2">Thank you for contacting us!</p>
        <p className="text-sm text-gray-500">We will respond within 2–3 working days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" placeholder="Your name" className="mt-1.5 min-h-11" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="your@email.com" className="mt-1.5 min-h-11" required />
        </div>
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" placeholder="+91 XXXXX XXXXX" className="mt-1.5 min-h-11" />
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="How can we help?" className="mt-1.5 min-h-11" required defaultValue={defaultSubject} />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" placeholder="Your message..." className="mt-1.5 min-h-[140px]" required defaultValue={defaultMessage} />
      </div>
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <DpdpConsent checked={consent} onChange={setConsent} id="contact-dpdp-consent" />
      <Button type="submit" disabled={loading || !consent} className="w-full bg-[#C8201A] hover:bg-[#9B1812] text-white min-h-11 font-semibold">
        {loading ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
