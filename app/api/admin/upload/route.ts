import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Lazy-import so initialisation errors surface here, not at module load
    const { storage } = await import('@/lib/firebase-admin');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `images/${uuidv4()}.${fileExtension}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const bucket = storage.bucket();
    console.log('[upload] bucket name:', bucket.name);

    const fileRef = bucket.file(fileName);
    await fileRef.save(buffer, { metadata: { contentType: file.type } });

    // Make the file publicly readable
    await fileRef.makePublic();

    const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    console.log('[upload] success:', url);

    return NextResponse.json({ url }, { status: 200 });
  } catch (error: any) {
    console.error('[upload] error name   :', error?.name);
    console.error('[upload] error message:', error?.message);
    console.error('[upload] error code   :', error?.code);
    return NextResponse.json({ error: error?.message ?? 'Unknown error' }, { status: 500 });
  }
}
