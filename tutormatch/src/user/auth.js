import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs } from 'firebase/firestore';

function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      //...
    })
    .catch((error) => {
      const errorCode = error.code;   //could be ignored
      const errorMessage = error.message;
      return error
    });
}

function signInUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;  //could be ignored
      const errorMessage = error.message;
      return error
    });
}

function signOutUser() {
  return signOut(auth)
    .then(() => {
      //successful signout, put some code here
    })
    .catch((error) => {
      //some error
    });
}

// simple create profile
async function create_profile(){
  const uid = auth.currentUser.uid;
  const usersCollectionRef = collection(db, 'users');
  try {
    await addDoc(usersCollectionRef, {
      uid: uid,
      name: 'bb',
      year: '2024'
      // Add more fields as needed
    });

    //console.log("User information added to collection successfully!");
  } catch (error) {
    console.error("Error adding user information to collection:", error);
  }
}

  //simple getdata from firebase, not finish
  async function getdata(){
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
    console.log(`${doc.id}`);
    });
  };


export { registerUser, signInUser, signOutUser, create_profile };
