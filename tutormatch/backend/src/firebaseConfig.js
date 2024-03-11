import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCACICYQQ8oOBjEl56WaVTRt8joOhsBR-U",
  authDomain: "tutormatch-789d9.firebaseapp.com",
  projectId: "tutormatch-789d9",
  storageBucket: "tutormatch-789d9.appspot.com",
  messagingSenderId: "956855862545",
  appId: "1:956855862545:web:e5f1b79a82ce1c45c138b0",
  measurementId: "G-V25ZNBDNCD",
  storageBucket: "gs://tutormatch-789d9.appspot.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
