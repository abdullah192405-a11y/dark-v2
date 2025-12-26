import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');
    const model = searchParams.get('model');

    const whereClause = {};
    if (make) {
      whereClause.make = make;
    }
    if (model) {
      whereClause.model = model;
    }

    // Special case: For Kia K5 Astina, only show year 2023
    if (make === "كيا" && model && model.toLowerCase().includes("k5") && model.toLowerCase().includes("أستندر")) {
      whereClause.year = 2023;
    }

    const years = await db.car.findMany({
      where: whereClause,
      select: {
        year: true,
      },
      distinct: ['year'],
      orderBy: {
        year: 'desc',
      },
    });

    const uniqueYears = years.map(car => car.year).filter(year => year).map(year => year.toString());

    return NextResponse.json({ years: uniqueYears });
  } catch (error) {
    console.error('Error fetching car years:', error);
    return NextResponse.json({ years: [] });
  }
}
