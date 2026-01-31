/**
 * Sitemap generation for SEO
 * This endpoint generates a dynamic sitemap for all cars and pages
 */

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crown-auto.sa";

    // Fetch all published cars
    const cars = await prisma.car.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        updatedAt: true,
      },
    });

    // Static pages
    const staticPages = [
      {
        url: "/",
        changefreq: "daily",
        priority: "1.0",
      },
      {
        url: "/cars",
        changefreq: "daily",
        priority: "0.9",
      },
      {
        url: "/about",
        changefreq: "monthly",
        priority: "0.7",
      },
      {
        url: "/contact",
        changefreq: "monthly",
        priority: "0.6",
      },
      {
        url: "/banks",
        changefreq: "weekly",
        priority: "0.8",
      },
    ];

    // Generate XML
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.mobile.googlebot.com/schemas/mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("")}
  ${cars
    .map(
      (car) => `
  <url>
    <loc>${baseUrl}/cars/${car.id}</loc>
    <lastmod>${car.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("")}
</urlset>`;

    return new Response(xmlContent, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response(
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"></urlset>",
      {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
        },
        status: 200,
      }
    );
  }
}
