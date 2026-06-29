"use client";

import { ContactForm } from "@/components/contact/ContactForm";

/** Alumni registration routed to contact enquiries with structured defaults */
export function AlumniRegistrationForm() {
  return (
    <ContactForm
      defaultSubject="Alumni Registration"
      defaultMessage={`Batch / Year of passing: 
Programme / Department: 
Current occupation & city: 
Phone (WhatsApp if any): 

I would like to: [ ] receive college updates  [ ] mentor students  [ ] attend reunions`}
    />
  );
}
