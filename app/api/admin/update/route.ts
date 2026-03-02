import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function PUT(request: NextRequest) {
  try {
    const { collection: collectionName, id, data } = await request.json();

    if (!collectionName || !id || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);

    return NextResponse.json({ success: true, message: 'Updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}