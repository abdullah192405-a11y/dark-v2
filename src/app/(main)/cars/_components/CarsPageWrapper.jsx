"use client";

import { useEffect, useState } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getWhatsAppNumber } from "@/actions/site-management";

export default function CarsPageWrapper() {
  const [whatsappNumber, setWhatsappNumber] = useState(null);

  useEffect(() => {
    const fetchWhatsAppNumber = async () => {
      try {
        const result = await getWhatsAppNumber();
        if (result.success && result.data) {
          setWhatsappNumber(result.data);
        }
      } catch (error) {
        console.error("Error fetching WhatsApp number:", error);
      }
    };
    fetchWhatsAppNumber();
  }, []);

  return (
    <WhatsAppButton 
      phoneNumber={whatsappNumber}
      label="لم تجد سياراتك؟"
      text="السلام عليكم%0Aلقد بحثت عن سيارة ولم أجدها%0Aهل يمكنكم مساعدتي؟"
      bottomOffset="bottom-4 md:bottom-6"
      rightOffset="right-4 md:right-6"
    />
  );
}
