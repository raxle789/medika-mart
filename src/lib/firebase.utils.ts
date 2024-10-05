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
  deleteDoc,
  collection,
} from "firebase/firestore";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3tu5cGDP6NMhbL93THjWfCdSQVRNdcs4",
  authDomain: "medikamart-24e8c.firebaseapp.com",
  projectId: "medikamart-24e8c",
  storageBucket: "medikamart-24e8c.appspot.com",
  messagingSenderId: "728173955510",
  appId: "1:728173955510:web:dda0a481af256fb8fa5917",
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
};

export const addUser = async (uid: string, objectsToAdd: TUserDoc) => {
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, objectsToAdd, { merge: true });
  console.log("done add user");
};

export const getUserField = async (uid: string) => {
  const userDocRef = doc(db, "users", uid);
  const docSnapshot = await getDoc(userDocRef);
  if (docSnapshot.exists()) {
    return docSnapshot.data();
  } else {
    console.log("user doesn't exist");
    return "undefined";
  }
};