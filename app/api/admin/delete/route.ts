import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function DELETE(request: NextRequest) {
  try {
    const { collection: collectionName, id } = await request.json();

    if (!collectionName || !id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);

    return NextResponse.json({ success: true, message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}