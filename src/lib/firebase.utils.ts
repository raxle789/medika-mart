import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
} from "firebase/firestore";
import "firebase/compat/firestore";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const PopupSignIn = () => signInWithPopup(auth, provider);
export const RedirectSignIn = () => signInWithRedirect(auth, provider);
export const signOutUser = async () => await signOut(auth);

// firestore
export const db = getFirestore();
// user
export type TUserDoc = {
  username: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  phoneNumber: string;
  paypalId: string;
};

export const addOrChangeUserData = async (
  uid: string,
  objectsToAdd: TUserDoc
) => {
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, objectsToAdd, { merge: true });
};

export const getUserField = async (uid: string) => {
  const userDocRef = doc(db, "users", uid);
  const docSnapshot = await getDoc(userDocRef);
  if (docSnapshot.exists()) {
    return docSnapshot.data();
  } else {
    return "undefined";
  }
};

// user's activity
export const addCollectionAndDocument = async (
  uid: string,
  docTitle: string,
  objectsToAdd: any
) => {
  const userDocRef = doc(db, "users", uid);
  const collectionRef = collection(userDocRef, "user's activity");
  const docRef = doc(collectionRef, docTitle);
  await setDoc(docRef, objectsToAdd, { merge: true });
};

export const getActivityDoc = async (uid: string, docTitle: string) => {
  const userDocRef = doc(db, "users", uid);
  const docRef = doc(collection(userDocRef, "user's activity"), docTitle);
  const docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists()) {
    const data = docSnapshot.data();
    return data;
  } else {
    return { message: "data not found" };
  }
};
