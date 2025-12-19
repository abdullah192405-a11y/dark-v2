import React from "react";
import ContactList from "./_components/ContactList";

export const metadata = {
  title: "الرسائل | Click Car Admin",
  description: "إدارة رسائل التواصل في السوق الخاص بك",
};

const ContactsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-right">إدارة الرسائل</h1>
      <ContactList />
    </div>
  );
};

export default ContactsPage;
