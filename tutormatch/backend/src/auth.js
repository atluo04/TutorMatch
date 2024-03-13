import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig.js";



export const signOutUser = async () => {
  return signOut(auth)
    .then(() => {
      //successful signout, put some code here
    })
    .catch((error) => {
      //some error
    });
}

// not test yet
export const email_verification = () => {
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
export const reset_passward = async () =>{
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



// // updata profile
// async function updata_profile(field, new_content){
//   const uid = auth.currentUser.uid;
//   const usersCollection_updata = collection(db, 'users', uid);
//   try {
//     await updateDoc(usersCollection_updata, {
//       field: new_content
//     });
//     //console.log("User information added to collection successfully!");
//   } catch (error) {
//     console.error("Error updating " + field + " :", error);
//   }
// }

// //get data from firebase
//   async function getdata(field){
//     const uid = auth.currentUser.uid;
//     const docRef = doc(db, "users", uid);
//     const docSnap = await getDoc(docRef);
    
//     if (docSnap.exists()) {
//         console.log(docSnap.data().field);
//     } else {
//         console.log("No such Info");
//     }
//   };

//   //reset user data
// async function reset_user_data(){
//   const uid = auth.currentUser.uid;
//   //const usersCollection_updata = collection(db, 'users', uid);
//   try {
//     return setDoc(doc(db, "users", uid), data);
    
//     //console.log("User database reset successfully!");
//   } catch (error) {
//     console.error("Error resetting", error);
//   }
// }
// //delete user's all data
// async function deletel_user_database(){
//   const uid = auth.currentUser.uid;
//   const userDoc= collection(db, 'users', uid);
//   try {
//     return userDoc.delete();
//     //console.log("User information added to collection successfully!");
//   } catch (error) {
//     console.error("Error deleting user database", error);
//   }
// }

