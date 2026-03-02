// app/api/admin/add/route.ts
// This is your Next.js API route for adding data to Firebase

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { collection: collectionName, data } = await request.json();

    // Validate required fields based on collection
    if (!collectionName || !data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Add document to Firestore
    const docRef = await addDoc(collection(db, collectionName), data);

    return NextResponse.json(
      { 
        success: true, 
        id: docRef.id,
        message: 'Document added successfully' 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error adding document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add document' },
      { status: 500 }
    );
  }
}