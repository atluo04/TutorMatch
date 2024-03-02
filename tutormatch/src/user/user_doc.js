import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { auth, db ,storage } from "../firebase/firebaseConfig";
import { collection, updateDoc, setDoc, getDoc, doc, Timestamp } from 'firebase/firestore';


//user database
const data = {
    Fullname: "Bruin",
    Username:"",
    Birthday: Timestamp.fromDate(new Date(Date.UTC(1919, 4, 24))),
    Gender:"-",
    Majors: "Computer Science",
    Year: "Freshman",
    profile_pic:"https://www.uclastore.com/site/product-images/606852_blue-01.jpg",
    Phone:"+0 (123) 456 7891",
    Personal_mail:"example@ucla.edu",
    Bio:"Hello, World!",
    created_date: Timestamp.now(),
    Courses: []
}

// updata profile
async function update_profile(field, new_content){
    const uid = auth.currentUser.uid;
    const usersCollection_updata = doc(db, 'users', uid);
    try {
        if(field === 'Courses'){
            const course_list = await getdata('Courses');
            const updatedCourses = [...course_list, ...new_content];
            await updateDoc(usersCollection_updata, {
                [field]: updatedCourses
              });
        }
        else if (field === "Majors") {
          const course_list = await getdata("Majors");
          const updatedCourses = [...course_list, ...new_content];
          await updateDoc(usersCollection_updata, {
            [field]: updatedCourses,
          });
        } else {
          await updateDoc(usersCollection_updata, {
            [field]: new_content,
          });
        }
        
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

async function upload_profile_pic(file){
    const fileref = ref(storage, 'profile_pic/' + auth.currentUser.uid + '.png');

    const snapshot = await uploadBytes(fileref, file);
    const photoURL = await getDownloadURL(fileref);

    update_profile("profile_pic", photoURL)
}

async function remove_course(delete_content){
    const uid = auth.currentUser.uid;
    const usersCollection_updata = doc(db, 'users', uid);
    const course_list = await getdata('courses');
    const updatedCourses = course_list.filter(course => course !== delete_content);
    
    // Update the 'courses' field with the updated array
    await updateDoc(usersCollection_updata, {
        ['courses']: updatedCourses
    })
            
}
  
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

export {update_profile, getdata, reset_user_data, deletel_user_database, upload_profile_pic, remove_course, data };
