import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

interface FirebaseDoc {
  id: string;
  [key: string]: any;
}

// Helper to handle the mapping and logging consistently
async function fetchCollection(collectionName: string): Promise<FirebaseDoc[]> {
  try {
    // Remove leading slashes as they can cause issues in the JS SDK
    const cleanPath = collectionName.replace(/^\//, '');
    const colRef = collection(db, cleanPath);
    const snapshot = await getDocs(colRef);

    console.log(`📦 ${cleanPath} Snapshot size:`, snapshot.size);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`❌ Error fetching ${collectionName}:`, error);
    return [];
  }
}

export async function getAnatomyTopics(): Promise<FirebaseDoc[]> {
  // FIXED: Added missing 'return' statement
  return fetchCollection('anatomy_topics');
}

export async function getPhilosophyTopics(): Promise<FirebaseDoc[]> {
  // FIXED: Removed leading slash '/'
  return fetchCollection('philosophy_topics');
}

export async function getPostures(): Promise<FirebaseDoc[]> {
  // FIXED: Removed leading slash '/'
  return fetchCollection('postures');
}

export async function getPosturesByCategory(category: string): Promise<FirebaseDoc[]> {
  if (category === 'All') return getPostures();
  try {
    const q = query(collection(db, 'postures'), where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('❌ Error fetching postures by category:', error);
    return [];
  }
}

export async function getTeamMembers(): Promise<FirebaseDoc[]> {
  return fetchCollection('team_members');
}

export async function getTeachingGuidelines(): Promise<FirebaseDoc[]> {
  return fetchCollection('teaching_guidelines');
}