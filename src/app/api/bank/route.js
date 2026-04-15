import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const banks = await db.bank.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: banks });
  } catch (error) {
    console.error("Error fetching banks:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, logoImage, interestRate, loanPolicy } = await request.json();
    if (!name || !logoImage || interestRate === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newBank = await db.bank.create({
      data: {
        name,
        logoImage,
        interestRate,
        loanPolicy,
      },
    });
    revalidateTag('banks');
    return NextResponse.json({ success: true, data: newBank });
  } catch (error) {
    console.error("Error creating bank:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, logoImage, interestRate, loanPolicy } = await request.json();
    if (!id || !name || !logoImage || interestRate === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const updatedBank = await db.bank.update({
      where: { id },
      data: { name, logoImage, interestRate, loanPolicy },
    });
    revalidateTag('banks');
    return NextResponse.json({ success: true, data: updatedBank });
  } catch (error) {
    console.error("Error updating bank:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id field' }, { status: 400 });
    }

    // Unlink any associated loan requests to avoid foreign key constraint errors
    await db.loanRequest.updateMany({
      where: { salaryTransferBankId: id },
      data: { salaryTransferBankId: null },
    });

    try {
      await db.bank.delete({
        where: { id },
      });
    } catch (e) {
      if (e.code === 'P2025') {
        // Record already does not exist, consider it a successful delete
      } else {
        throw e;
      }
    }
    
    revalidateTag('banks');
    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error("Error deleting bank:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const data = await request.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ success: false, error: 'Expected an array of {id, order}' }, { status: 400 });
    }

    const baseTime = Date.now();
    await db.$transaction(
      data.map((item) => {
        const newCreatedAt = new Date(baseTime - (item.order * 10000));
        return db.bank.update({
          where: { id: item.id },
          data: { createdAt: newCreatedAt },
        });
      })
    );

    revalidateTag('banks');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating bank order:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
