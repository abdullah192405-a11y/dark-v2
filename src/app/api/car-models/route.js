import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');

    if (!make) {
      return NextResponse.json({ models: [] });
    }

    const models = await db.car.findMany({
      where: {
        make: make,
      },
      select: {
        model: true,
      },
      distinct: ['model'],
      orderBy: {
        model: 'asc',
      },
    });

    const uniqueModels = models.map(car => car.model).filter(model => model);

    return NextResponse.json({ models: uniqueModels });
  } catch (error) {
    console.error('Error fetching car models:', error);
    return NextResponse.json({ models: [] });
  }
}
