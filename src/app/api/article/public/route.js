import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET() {
  try {
    const articles = await db.article.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    });

    // Parse contentSections for each article from the content field
    const processedArticles = articles.map(article => {
      let contentSections = [];
      if (article.content) {
        try {
          // Try to parse as JSON (new format)
          const parsed = JSON.parse(article.content);
          if (Array.isArray(parsed)) {
            contentSections = parsed;
          } else {
            // If it's not an array, treat as plain text and create a paragraph section
            contentSections = [{ id: 'legacy-content', type: 'paragraph', content: article.content }];
          }
        } catch (e) {
          // If parsing fails, treat as plain text
          contentSections = [{ id: 'legacy-content', type: 'paragraph', content: article.content }];
        }
      }
      return {
        ...article,
        contentSections,
      };
    });

    return NextResponse.json({ success: true, data: processedArticles });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
