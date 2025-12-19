import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/getAuthenticatedUser';
import supabase from '@/lib/supabaseClient';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const articles = await db.article.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';

    let title, slug, content, contentSections, excerpt, published, tags, imageFile, contentImageFiles, contentVideoFiles;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = formData.get('title');
      slug = formData.get('slug');
      content = formData.get('content');
      contentSections = formData.get('contentSections');
      excerpt = formData.get('excerpt');
      published = formData.get('published') === 'true';
      tags = formData.get('tags') ? JSON.parse(formData.get('tags')) : [];
      imageFile = formData.get('image');
      contentImageFiles = formData.getAll('contentImages');
      contentVideoFiles = formData.getAll('contentVideos');
    } else if (contentType.includes('application/json')) {
      try {
        const jsonData = await request.json();
        title = jsonData.title;
        slug = jsonData.slug;
        content = jsonData.content;
        contentSections = jsonData.contentSections;
        excerpt = jsonData.excerpt;
        published = jsonData.published;
        tags = jsonData.tags || [];
        // For JSON requests, files would need to be handled differently (e.g., base64 encoded)
        imageFile = null;
        contentImageFiles = [];
        contentVideoFiles = [];
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: 'Invalid JSON format or request body too large. For large content or media uploads, use multipart/form-data instead.'
        }, { status: 400 });
      }
    } else {
      return NextResponse.json({
        success: false,
        error: 'Content-Type must be multipart/form-data or application/json'
      }, { status: 400 });
    }

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
      const fileName = `article-${Date.now()}-${imageFile.name}`;
      const { data, error } = await supabase.storage
        .from('car-images')
        .upload(fileName, imageFile);

      if (error) {
        return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
      }

      imageUrl = supabase.storage.from('car-images').getPublicUrl(fileName).data.publicUrl;
    }

    let processedContentSections = [];
    if (contentSections) {
      // If contentSections is already an object (from JSON request), use it directly
      // If it's a string (from form data), parse it
      processedContentSections = typeof contentSections === 'string'
        ? JSON.parse(contentSections)
        : contentSections;
    }

    // Upload content images and videos
    const uploadedContentImages = {};
    const uploadedContentVideos = {};

    for (const file of contentImageFiles) {
      if (file.size > 0) {
        const fileName = `article-content-${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('car-images')
          .upload(fileName, file);

        if (error) {
          return NextResponse.json({ success: false, error: 'Failed to upload content image' }, { status: 500 });
        }

        const publicUrl = supabase.storage.from('car-images').getPublicUrl(fileName).data.publicUrl;
        uploadedContentImages[file.name] = publicUrl;
      }
    }

    for (const file of contentVideoFiles) {
      if (file.size > 0) {
        const fileName = `article-content-${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('car-images')
          .upload(fileName, file);

        if (error) {
          return NextResponse.json({ success: false, error: 'Failed to upload content video' }, { status: 500 });
        }

        const publicUrl = supabase.storage.from('car-images').getPublicUrl(fileName).data.publicUrl;
        uploadedContentVideos[file.name] = publicUrl;
      }
    }

    // Update contentSections with uploaded URLs
    processedContentSections = processedContentSections.map(section => {
      if (section.type === 'image' && section.src && section.src.startsWith('data:')) {
        // Find the uploaded URL for this base64 image
        const uploadedUrl = Object.values(uploadedContentImages).find(url => url);
        return { ...section, src: uploadedUrl || section.src };
      } else if (section.type === 'video' && section.src && section.src.startsWith('data:')) {
        // Find the uploaded URL for this base64 video
        const uploadedUrl = Object.values(uploadedContentVideos).find(url => url);
        return { ...section, src: uploadedUrl || section.src };
      }
      return section;
    });

    // Use contentSections if provided, otherwise fall back to simple content
    const articleContent = processedContentSections.length > 0 ? JSON.stringify(processedContentSections) : content || '';

    const newArticle = await db.article.create({
      data: {
        title,
        slug,
        content: articleContent,
        excerpt,
        authorId: user.id,
        published: published || false,
        publishedAt: published ? new Date() : null,
        image: imageUrl,
        tags: tags || [],
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

    return NextResponse.json({ success: true, data: newArticle });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';

    let id, title, slug, content, contentSections, excerpt, published, tags, imageFile, contentImageFiles, contentVideoFiles, formData, jsonData;

    if (contentType.includes('multipart/form-data')) {
      formData = await request.formData();
      id = formData.get('id');
      title = formData.get('title');
      slug = formData.get('slug');
      content = formData.get('content');
      contentSections = formData.get('contentSections');
      excerpt = formData.get('excerpt');
      published = formData.get('published') === 'true';
      tags = formData.get('tags') ? JSON.parse(formData.get('tags')) : [];
      imageFile = formData.get('image');
      contentImageFiles = formData.getAll('contentImages');
      contentVideoFiles = formData.getAll('contentVideos');
    } else if (contentType.includes('application/json')) {
      try {
        jsonData = await request.json();
        id = jsonData.id;
        title = jsonData.title;
        slug = jsonData.slug;
        content = jsonData.content;
        contentSections = jsonData.contentSections;
        excerpt = jsonData.excerpt;
        published = jsonData.published;
        tags = jsonData.tags || [];
        // For JSON requests, handle base64 encoded images
        imageFile = jsonData.image && jsonData.image.startsWith('data:image/') ? jsonData.image : null;
        contentImageFiles = [];
        contentVideoFiles = [];
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: 'Invalid JSON format or request body too large. For large content or media uploads, use multipart/form-data instead.'
        }, { status: 400 });
      }
    } else {
      return NextResponse.json({
        success: false,
        error: 'Content-Type must be multipart/form-data or application/json'
      }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id field' }, { status: 400 });
    }

    // Fetch existing article to preserve values not provided in the update
    const existingArticle = await db.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    // Use provided values or fall back to existing ones
    title = title !== undefined ? title : existingArticle.title;
    slug = slug !== undefined ? slug : existingArticle.slug;
    content = content !== undefined ? content : existingArticle.content;
    contentSections = contentSections !== undefined ? contentSections : existingArticle.contentSections;
    excerpt = excerpt !== undefined ? excerpt : existingArticle.excerpt;
    published = published !== undefined ? published : existingArticle.published;
    tags = tags !== undefined ? tags : existingArticle.tags;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Preserve existing image URL or use provided existingImage
    let imageUrl = existingArticle.image || '';
    if (contentType.includes('multipart/form-data')) {
      const existingImage = formData.get('existingImage');
      if (existingImage) {
        imageUrl = existingImage;
      }
    } else if (contentType.includes('application/json')) {
      const existingImage = jsonData.existingImage;
      if (existingImage) {
        imageUrl = existingImage;
      }
    }

    // Upload new image if provided
    if (imageFile) {
      if (typeof imageFile === 'string' && imageFile.startsWith('data:image/')) {
        // Handle base64 image from JSON request
        try {
          const base64Data = imageFile.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          const mimeType = imageFile.split(';')[0].split(':')[1];
          const fileExtension = mimeType.split('/')[1];
          const fileName = `article-${Date.now()}-image.${fileExtension}`;

          const { data, error } = await supabase.storage
            .from('car-images')
            .upload(fileName, buffer, {
              contentType: mimeType,
            });

          if (error) {
            return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
          }

          imageUrl = supabase.storage.from('car-images').getPublicUrl(fileName).data.publicUrl;
        } catch (error) {
          return NextResponse.json({ success: false, error: 'Invalid base64 image format' }, { status: 400 });
        }
      } else if (imageFile.size > 0) {
        // Handle file upload from form data
        const fileName = `article-${Date.now()}-${imageFile.name}`;
        const { data, error } = await supabase.storage
          .from('car-images')
          .upload(fileName, imageFile);

        if (error) {
          return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
        }

        imageUrl = supabase.storage.from('car-images').getPublicUrl(fileName).data.publicUrl;
      }
    }

    let processedContentSections = [];
    if (contentSections) {
      // If contentSections is already an object (from JSON request), use it directly
      // If it's a string (from form data), parse it
      processedContentSections = typeof contentSections === 'string'
        ? JSON.parse(contentSections)
        : contentSections;
    }

    // Upload content images and videos
    const uploadedContentImages = {};
    const uploadedContentVideos = {};

    for (const file of contentImageFiles) {
      if (file.size > 0) {
        const fileName = `article-content-${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('car-images')
          .upload(fileName, file);

        if (error) {
          return NextResponse.json({ success: false, error: 'Failed to upload content image' }, { status: 500 });
        }

        const publicUrl = supabase.storage.from('car-images').getPublicUrl(fileName).data.publicUrl;
        uploadedContentImages[file.name] = publicUrl;
      }
    }

    for (const file of contentVideoFiles) {
      if (file.size > 0) {
        const fileName = `article-content-${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('car-images')
          .upload(fileName, file);

        if (error) {
          return NextResponse.json({ success: false, error: 'Failed to upload content video' }, { status: 500 });
        }

        const publicUrl = supabase.storage.from('car-images').getPublicUrl(fileName).data.publicUrl;
        uploadedContentVideos[file.name] = publicUrl;
      }
    }

    // Update contentSections with uploaded URLs
    processedContentSections = processedContentSections.map(section => {
      if (section.type === 'image' && section.src && section.src.startsWith('data:')) {
        // Find the uploaded URL for this base64 image
        const uploadedUrl = Object.values(uploadedContentImages).find(url => url);
        return { ...section, src: uploadedUrl || section.src };
      } else if (section.type === 'video' && section.src && section.src.startsWith('data:')) {
        // Find the uploaded URL for this base64 video
        const uploadedUrl = Object.values(uploadedContentVideos).find(url => url);
        return { ...section, src: uploadedUrl || section.src };
      }
      return section;
    });

    // Use contentSections if provided, otherwise fall back to simple content
    const articleContent = processedContentSections.length > 0 ? JSON.stringify(processedContentSections) : content || '';

    const updatedArticle = await db.article.update({
      where: { id },
      data: {
        title,
        slug,
        content: articleContent,
        excerpt,
        published,
        publishedAt: published ? new Date() : null,
        image: imageUrl,
        tags: tags || [],
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

    return NextResponse.json({ success: true, data: updatedArticle });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id field' }, { status: 400 });
    }

    await db.article.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
