import { getCarFilters } from "@/actions/car-listing";
import React, { Suspense } from "react";
import CarFilters from "./_components/CarFilters";
import CarListings from "./_components/CarListings";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "السيارات | Click Car",
  description: "تصفح وابحث عن سيارة أحلامك",
};

export const dynamic = "force-dynamic"; // prevent prerender errors

const CarsPage = async () => {
  const filtersData = await getCarFilters();

  return (
    <>
      <div className="w-full px-4 md:px-8">
        <h1 className="text-2xl md:text-4xl mb-4 gradient-title">تصفح السيارات</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-80 flex-shrink-0">
            {/* filters */}
            <CarFilters filters={filtersData} />
          </div>

          <div className="flex-1">
            {/* Listings MUST be wrapped in Suspense */}
            <Suspense fallback={<div>Loading...</div>}>
              <CarListings />
            </Suspense>
          </div>
        </div>
      </div>

      {/* WhatsApp Button for Cars Page */}
      <WhatsAppButton 
        phoneNumber="+201000000000" 
        label="لم تجد سياراتك؟"
        text="السلام عليكم%0Aلقد بحثت عن سيارة ولم أجدها%0Aهل يمكنكم مساعدتي؟"
        bottomOffset="bottom-4 md:bottom-6"
        leftOffset="left-4 md:left-6"
      />
    </>
  );
};

export default CarsPage;
