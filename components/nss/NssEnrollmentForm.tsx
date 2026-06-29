"use client";

import { ContactForm } from "@/components/contact/ContactForm";

export function NssEnrollmentForm() {
  return (
    <ContactForm
      defaultSubject="NSS Enrollment"
      defaultMessage={`Student name: 
Programme / Year: 
Roll number (if assigned): 
Phone: 

Why do you want to join NSS?
`}
    />
  );
}
