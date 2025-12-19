import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma'; // Changed from prisma to db

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    // Query your cars table
    const cars = await db.car.findMany({
      where: {
        OR: [
          { make: { contains: query, mode: 'insensitive' } },
          { model: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        make: true,
        model: true,
      },
      take: 8,
      distinct: ['make', 'model'],
    });

    // Format results
    const suggestions = cars.map(car => `${car.make} ${car.model}`);
    
    // Remove duplicates
    const uniqueSuggestions = [...new Set(suggestions)];

    return NextResponse.json({ suggestions: uniqueSuggestions });
  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}