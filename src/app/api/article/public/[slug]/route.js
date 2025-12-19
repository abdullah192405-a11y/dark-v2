import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const article = await db.article.findFirst({
      where: {
        slug,
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
    });

    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    // Parse contentSections from the content field
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

    const processedArticle = {
      ...article,
      contentSections,
    };

    return NextResponse.json({ success: true, data: processedArticle });
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
