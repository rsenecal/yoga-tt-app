import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    if (!sessionId) return NextResponse.json({ completedModules: [] });
    const ref  = doc(db, 'progress', sessionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return NextResponse.json({ completedModules: [] });
    return NextResponse.json(snap.data());
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, moduleId, completed } = await request.json();
    if (!sessionId || !moduleId) {
      return NextResponse.json({ error: 'Missing sessionId or moduleId' }, { status: 400 });
    }
    const ref  = doc(db, 'progress', sessionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        completedModules: completed ? [moduleId] : [],
        updatedAt: new Date().toISOString(),
      });
    } else {
      const current: string[] = snap.data().completedModules ?? [];
      const next = completed
        ? Array.from(new Set([...current, moduleId]))
        : current.filter((id: string) => id !== moduleId);
      await updateDoc(ref, { completedModules: next, updatedAt: new Date().toISOString() });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
