import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { setDoc, doc } from 'firebase/firestore';
import { data } from "./user_doc"
import { update_profile } from "./user_doc";



function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      //create profile
      return setDoc(doc(db, "users", user.uid), data).then(() => {
        // After successfully creating the profile, update additional user data
        return update_profile("personal_email", user.email);
      });
    })
    .catch((error) => {
      const errorCode = error.code; //could be ignored
      const errorMessage = error.message;
      return error;
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
      const errorCode = error.code; //could be ignored
      const errorMessage = error.message;
      return error;
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

// not test yet
function email_verification(){
  const user = auth.currentUser;
  if (user) {
    user.sendEmailVerification()
      .then(() => {
        // Email verification sent successfully
        console.log("Email verification sent successfully!");
      })
      .catch((error) => {
        // An error occurred while sending email verification
        console.error("Error sending email verification:", error);
      });
  } else {
    // User is not signed in
    console.error("No user is currently signed in.");
  }
}

// not test yet
function reset_passward(){
  const user = auth.currentUser;
  if (user) {
    user.sendPasswordResetEmail()
        .then(() => {
            // Password reset email sent successfully
            console.log("Password reset email sent successfully!");
        })
        .catch((error) => {
            // An error occurred while sending password reset email
            console.error("Error sending password reset email:", error);
        });
  } else {
    // No user is currently signed in
    console.error("No user is currently signed in.");
  }
}


export { registerUser, signInUser, signOutUser, email_verification, reset_passward };
