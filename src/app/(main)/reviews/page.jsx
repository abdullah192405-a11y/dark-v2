import ReviewCard from "@/components/ReviewCard";

async function getReviews() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/reviews`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      console.error('Failed to fetch reviews:', res.status, res.statusText);
      return [];
    }
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
    console.error('API returned success false:', data);
    return [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export default async function ReviewsPage() {
  const reviews = await getReviews();
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 px-6 md:px-12">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            آراء العملاء
          </h1>
          <p className="text-yellow-600 text-base max-w-2xl mx-auto">
            اقرأ تجارب العملاء الحقيقية والتقييمات الصادقة لخدماتنا
          </p>
        </div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
