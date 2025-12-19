import fetch from 'node-fetch';

async function testArticleContent() {
  try {
    console.log('Testing article content API...');

    // Test the public articles list
    const listResponse = await fetch('http://localhost:3000/api/article/public');
    const listData = await listResponse.json();

    if (listData.success && listData.data.length > 0) {
      const firstArticle = listData.data[0];
      console.log('First article:', {
        title: firstArticle.title,
        contentSectionsLength: firstArticle.contentSections?.length || 0,
        hasContent: !!firstArticle.content,
        contentPreview: firstArticle.content?.substring(0, 100) + '...'
      });

      // Test individual article if slug exists
      if (firstArticle.slug) {
        const detailResponse = await fetch(`http://localhost:3000/api/article/public/${firstArticle.slug}`);
        const detailData = await detailResponse.json();

        if (detailData.success) {
          const article = detailData.data;
          console.log('Article detail:', {
            title: article.title,
            contentSectionsLength: article.contentSections?.length || 0,
            contentSections: article.contentSections
          });
        }
      }
    } else {
      console.log('No published articles found');
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testArticleContent();
