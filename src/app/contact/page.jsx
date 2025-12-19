"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatBot from "@/components/ChatBot";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="pt-20 flex flex-col bg-black min-h-screen text-white">
      <section className="py-16 px-6 md:px-12 container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">تواصل معنا</h1>
        <p className="text-lg mb-10 text-center text-gray-300">
          هل لديك سؤال أو تحتاج إلى مساعدة؟ يرجى ملء النموذج أدناه وسنعود إليك قريبًا.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6" dir="rtl" noValidate>
            <div>
              <label htmlFor="name" className="block mb-2 font-semibold">
                الاسم الكامل
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="أدخل اسمك الكامل"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 font-semibold">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block mb-2 font-semibold">
                الموضوع
              </label>
              <Input
                id="subject"
                name="subject"
                type="text"
                placeholder="موضوع الرسالة"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 font-semibold">
                الرسالة
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="اكتب رسالتك هنا"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-white shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-center">
              <Button type="submit" size="lg" className="px-12">
                إرسال
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center text-green-400 text-xl font-semibold">
            تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا.
          </div>
        )}
      </section>

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  );
}
