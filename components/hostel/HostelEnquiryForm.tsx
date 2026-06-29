"use client";

import { ContactForm } from "@/components/contact/ContactForm";

/** Hostel admission enquiry — routes to contact_enquiries for warden review */
export function HostelEnquiryForm() {
  return (
    <ContactForm
      defaultSubject="Hostel Admission Enquiry"
      defaultMessage={`Applicant name: 
Age / Class or Programme: 
Village / Abujhmarh area: 
Parent/Guardian phone: 

Reason for hostel request:
`}
    />
  );
}
