import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const year = searchParams.get('year');

    if (!make || !model) {
      return NextResponse.json({ categories: [] });
    }

    // Build where clause
    const whereClause = {
      make: make,
      model: model,
    };

    // Add year filter if provided
    if (year) {
      whereClause.year = parseInt(year);
    }

    const cars = await db.car.findMany({
      where: whereClause,
      select: {
        category: true,
        year: true,
      },
      distinct: ['category', 'year'],
      orderBy: [
        { category: 'asc' },
        { year: 'desc' },
      ],
    });

    const uniqueCategories = [...new Set(cars.map(car => car.category).filter(category => category))];
    const uniqueYears = [...new Set(cars.map(car => car.year).filter(year => year).map(year => year.toString()))];

    return NextResponse.json({ categories: uniqueCategories, years: uniqueYears });
  } catch (error) {
    console.error('Error fetching car categories:', error);
    return NextResponse.json({ categories: [] });
  }
}
