import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const correct = process.env.ADMIN_PASSWORD;

    if (!correct) {
      return NextResponse.json({ error: 'Admin password not configured' }, { status: 500 });
    }

    if (password === correct) {
      return NextResponse.json({ success: true });
    }

    // Small delay to slow brute force attempts
    await new Promise(r => setTimeout(r, 800));
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
