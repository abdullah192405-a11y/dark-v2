import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    const whereClause = {};
    if (year) {
      whereClause.year = parseInt(year);
    }

    const makes = await db.car.findMany({
      where: whereClause,
      select: {
        make: true,
      },
      distinct: ['make'],
      orderBy: {
        make: 'asc',
      },
    });

    const uniqueMakes = makes.map(car => car.make).filter(make => make);

    return NextResponse.json({ makes: uniqueMakes });
  } catch (error) {
    console.error('Error fetching car makes:', error);
    return NextResponse.json({ makes: [] });
  }
}
