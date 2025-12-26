import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const year = searchParams.get('year');
    const category = searchParams.get('category');

    if (!make || !model || !year) {
      return NextResponse.json(
        { success: false, message: 'معايير البحث الأساسية مطلوبة (الماركة، الموديل، السنة)' },
        { status: 400 }
      );
    }

    // Build where clause
    const whereClause = {
      make: make,
      model: model,
      year: parseInt(year),
    };

    // Add category filter only if provided and not empty
    if (category && category.trim() !== '') {
      whereClause.category = category;
    }

    // Find car by make, model, year, and optionally category
    const car = await db.car.findFirst({
      where: whereClause,
    });

    if (!car) {
      return NextResponse.json(
        { success: false, message: 'لم يتم العثور على سيارة بهذه المواصفات' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: car,
    });

  } catch (error) {
    console.error('Error searching car:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في البحث عن السيارة' },
      { status: 500 }
    );
  }
}
