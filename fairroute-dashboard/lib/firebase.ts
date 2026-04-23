import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  onSnapshot,
  DocumentData
} from "firebase/firestore";

// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (Prevents "app already exists" error during Next.js hot reloads)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

// 2. Exported Functions

/**
 * Saves an audit result to Firestore with a server-side timestamp.
 */
export async function saveAuditResult(auditData: object): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "audits"), {
      ...auditData,
      timestamp: serverTimestamp(),
    });
    console.log("Audit saved with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
}

/**
 * Fetches the single most recent audit result.
 */
export async function getLatestAudit(): Promise<DocumentData | null> {
  try {
    const auditsRef = collection(db, "audits");
    const q = query(auditsRef, orderBy("timestamp", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    return {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    };
  } catch (error) {
    console.error("Error fetching latest audit: ", error);
    return null;
  }
}

/**
 * Sets up a real-time listener for the audits collection.
 * returns an unsubscribe function.
 */
export function subscribeToAudits(callback: (audits: DocumentData[]) => void): () => void {
  const auditsRef = collection(db, "audits");
  const q = query(auditsRef, orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const audits = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(audits);
  }, (error) => {
    console.error("Snapshot listener error: ", error);
  });

  return unsubscribe;
}