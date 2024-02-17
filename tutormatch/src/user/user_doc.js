import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { collection, updateDoc, setDoc, getDoc, doc } from 'firebase/firestore';


//user database
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
          console.log(docSnap.data()[field]);
          return docSnap.data()[field];
      } else {
          console.log("No such Info");
          return "rr";
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

  export {updata_profile, getdata, reset_user_data, deletel_user_database };
