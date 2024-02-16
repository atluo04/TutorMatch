import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { collection, updateDoc, setDoc, getDoc, doc } from 'firebase/firestore';

const data = {
  Fullname: "++",
  Username:"",
  Birthday:"",
  Sex:"",
  Major: "",
  profile_pic:"https://www.uclastore.com/site/product-images/606852_blue-01.jpg",
  Phone:"",
  Personal_mail:"",
  Bio:"",
  created_date:""
}

function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      //create profile
      return setDoc(doc(db, "users", user.uid), data);
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

// updata profile
async function updata_profile(field, new_content){
  const uid = auth.currentUser.uid;
  const usersCollection_updata = collection(db, 'users', uid);
  try {
    await updateDoc(usersCollection_updata, {
      field: new_content
    });
    //console.log("User information added to collection successfully!");
  } catch (error) {
    console.error("Error updating " + field + " :", error);
  }
}

//get data from firebase
  async function getdata(field){
    const uid = auth.currentUser.uid;
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        console.log(docSnap.data().field);
    } else {
        console.log("No such Info");
    }
  };


export { registerUser, signInUser, signOutUser, updata_profile, getdata, email_verification, reset_passward };
