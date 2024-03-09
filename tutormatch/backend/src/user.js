import { db } from "./firebaseConfig.js";
import {
  updateDoc,
  setDoc,
  getDoc,
  doc,
  Timestamp,
} from "firebase/firestore";



export const data = {
  Fullname: "",
  Username: "",
  Birthday: Timestamp.fromDate(new Date(Date.UTC(1919, 4, 24))),
  Gender: "-",
  Majors: [],
  Year: "Freshman",
  profile_pic:
    "https://www.uclastore.com/site/product-images/606852_blue-01.jpg",
  Phone: "+0 (123) 456 7891",
  Personal_mail: "",
  Bio: "Hello, World!",
  created_date: Timestamp.now(),
  Courses: [],
  Tags: [],
};
  //get data from firebase
export const getdata = async (uid, field) =>{
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    //console.log("getting ", field);
    if (docSnap.exists()) {
        //console.log(docSnap.data()[field]);
        //const user_data = docSnap.data()[field]
        //console.log("getting ", field);
        
        await check_field_exist(docRef, field);
        //console.log(docSnap.data()[field])
        return docSnap.data()[field];     // not sure if this works
    } else {
        await setDoc(docRef, data);
        //console.log("No such Info");
        return "Null";
    }
};

export const update_profile = async (uid, field, new_content) => {
    const usersCollection_updata = doc(db, 'users', uid);
    try {
        if(field === 'Courses'){
            const course_list = await getdata(uid, 'Courses');
            const updatedCourses = [...course_list, ...new_content];
            await updateDoc(usersCollection_updata, {
                [field]: updatedCourses
              });
        }
        else if (field === "Majors") {
          const majors_list = await getdata(uid, "Majors");
          const updatedCourses = [...majors_list, ...new_content];
          await updateDoc(usersCollection_updata, {
            [field]: updatedCourses,
          });
        }
        else if (field === "Tags") {
          const tags_list = await getdata(uid, "Tags");
          const updatedCourses = [...tags_list, ...new_content];
          await updateDoc(usersCollection_updata, {
            [field]: updatedCourses,
          });
        } else {
          if(await check_field_exist(usersCollection_updata, field, new_content)){
            await updateDoc(usersCollection_updata, {
              [field]: new_content,
            });
          } 
        }
      //console.log("User information added to collection successfully!");
    } catch (error) {
        console.error("Error updating -" + field + "- :", error);
        throw new Error("Error updating -" + field + "- :", error);
    }
}


export const check_field_exist = async (docRef, field, new_data = null) =>{
  // const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  const user_data = docSnap.data()[field];
  // check if data exist
  if (user_data === null || user_data === undefined) {
    //console.log("user=", user_data)
    //check if need to use input value
    if (new_data == null) {
      // no input, use default
      //console.log("createing", field)
      await updateDoc(docRef, {
        [field]: data[field],
      });
      return false;
    } else {
      await updateDoc(docRef, {
        [field]: new_data,
      });
      return false;
    }
  }
  //console.log("user has =", user_data)
  return true;
}

// export const upload_profile_pic = async (uid, file) =>{
//   const fileref = ref(storage, 'profile_pic/' + uid + '.png');
//   console.log("--", file.size)
//   try {
//     await uploadBytes(fileref, file);
//     const photoURL = await getDownloadURL(fileref);
//     console.log(photoURL);
//     await update_profile(uid, "profile_pic", photoURL)
//     console.log("Profile picture uploaded successfully");
//   } catch (error) {
//     console.error("Error uploading profile picture:", error);
//     throw error; // Rethrow the error to handle it in the calling function
//   }
  
// }

