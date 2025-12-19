export async function getArticles() {
  try {
    // When running in the browser, use a relative URL so it hits the same origin.
    // If a specific base URL is provided at build time, fall back to it.
    const base = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_BASE_URL || '');
    const res = await fetch(`${base}/api/article`);
    const data = await res.json();
    if (data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { success: false, error: error.message };
  }
}
