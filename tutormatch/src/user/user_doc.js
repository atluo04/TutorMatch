import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { collection, updateDoc, setDoc, getDoc, doc, Timestamp } from 'firebase/firestore';


//user database
const data = {
    Fullname: "Bruin",
    Username:"",
    Birthday: Timestamp.fromDate(new Date(Date.UTC(1919, 4, 24))),
    Sex:"-",
    Major: "Computer Science",
    profile_pic:"https://www.uclastore.com/site/product-images/606852_blue-01.jpg",
    Phone:"+0 (123) 456 7891",
    Personal_mail:"example@ucla.edu",
    Bio:"Hello, World!",
    created_date: Timestamp.now()
}

// updata profile
async function updata_profile(field, new_content){
    const uid = auth.currentUser.uid;
    const usersCollection_updata = doc(db, 'users', uid);
    try {
        await updateDoc(usersCollection_updata, {
          [field]: new_content
        });
      //console.log("User information added to collection successfully!");
    } catch (error) {
        console.error("Error updating -" + field + "- :", error);
    }
}
  
  //get data from firebase
async function getdata(field){
    const uid = auth.currentUser.uid;
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
      
    if (docSnap.exists()) {
        //console.log(docSnap.data()[field]);
        const user_data = docSnap.data()[field]
        if(user_data == null){
            //console.log("null data, creating new one")
            await updateDoc(docRef, {
                [field]: data[field]
              });
              return data[field];
            }
        return docSnap.data()[field];
    } else {
        await setDoc(docRef, data);
        console.log("No such Info");
        return "Null";
    }
};
  
    //reset user data
async function reset_user_data(){
    const uid = auth.currentUser.uid;
    //const usersCollection_updata = collection(db, 'users', uid);
    try {
        return setDoc(doc(db, "users", uid), data);
      
        //console.log("User database reset successfully!");
    } catch (error) {
        console.error("Error resetting", error);
    }
}
  //delete user's all data
async function deletel_user_database(){
    const uid = auth.currentUser.uid;
    const userDoc= collection(db, 'users', uid);
    try {
        return userDoc.delete();
      //console.log("User information added to collection successfully!");
    } catch (error) {
        console.error("Error deleting user database", error);
    }
}

export {updata_profile, getdata, reset_user_data, deletel_user_database, data };
