import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

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

export { registerUser, signInUser, signOutUser };
