const { db } = require("@/lib/prisma");

async function initHeroSection() {
  try {
    // Check if hero section exists
    let heroSection = await db.heroSection.findFirst();

    if (!heroSection) {
      // Create default hero section
      heroSection = await db.heroSection.create({
        data: {
          videoUrl: "/hero1.mp4",
          title: "مرحباً بك",
          subtitle: "بحث ذكي عن السيارات واختبار القيادة من بين مئات المركبات.",
          posterImage: null,
          isActive: true,
          autoplay: true,
          loop: true,
          muted: true,
        },
      });
      console.log("✅ Hero section created:", heroSection);
    } else {
      console.log("✅ Hero section already exists:", heroSection);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

initHeroSection();
