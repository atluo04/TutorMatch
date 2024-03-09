import express from "express";
import multer from "multer";
import { app, db, auth, storage } from "./firebaseConfig.js";
import { createAlgoliaClient } from "./algoliaConfig.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getdata, update_profile, data } from "./user.js";
import { Timestamp } from "firebase/firestore";
import { addNewComment, deleteComment, getCommentsByLikes, increaseLike } from "./comment.js";
import { uploadBytes, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { createNewChat, sendMessage, receiveMessage, getConversations, getMessages, storeFile, getUserInfo, findUserByEmail } from "./chat.js";
import { addPost } from "./post.js";


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
  //   const data = {
  //     Fullname: "",
  //     Username: "",
  //     Birthday: Timestamp.fromDate(new Date(Date.UTC(1919, 4, 24))),
  //     Gender: "-",
  //     Majors: [],
  //     Year: "Freshman",
  //     profile_pic:
  //       "https://www.uclastore.com/site/product-images/606852_blue-01.jpg",
  //     Phone: "+0 (123) 456 7891",
  //     Personal_mail: email,
  //     Bio: "Hello, World!",
  //     created_date: Timestamp.now(),
  //     Courses: [],
  //     Tags: ["JSX"],
  //   };
    const user_info = data;
    user_info["Personal_mail"] = email;

    let uid = '';
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, user_info);
        uid = user.uid;
      })
      .catch((error) => {
        throw new Error("Registration failed: " + error.message);
      });   
    res.status(200).json({
      success: true,
      message: "Signed up successfully!",
      uid: uid
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
});

router.post("/signin", async (req, res) => {

  const { email, password } = req.body;

  if (email === undefined || password === undefined) {
    return res.status(401).json({
      success: false,
      message: "Missing email and/or password in request body.",
    });
  }
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Logged in
      const user = userCredential.user;
      res.status(200).json({
        success: true,
        message: "Logged in successfully!",
        uid: user.uid,
      });
    })
    .catch((error) => {
      res.status(401).json({ success: false, message: error.message });
    });
});

router.post("/create-user-info", async (req, res) => {
  const { uid, Fullname, Phone, Majors, Gender, Year, Courses, Tags } = req.body;
  try {
    update_profile(uid, "Fullname", Fullname);
    update_profile(uid, "Phone", Phone);
    update_profile(uid, "Majors", Majors);
    update_profile(uid, "Gender", Gender);
    update_profile(uid, "Year", Year);
    update_profile(uid, "Courses", Courses);
    update_profile(uid, "Tags", Tags);
    res.status(200).json({success: true});
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
})

router.post("/add-comment", async (req, res) => {
  const {uid, content, fromUid} = req.body;
  try {
    await addNewComment(uid, content, fromUid);
    return res.status(200).json({success: true})
  } catch(error){
    res.status(500).json({success: false, message: error.message});
  }
})

router.post("/get-comments", async (req, res) => {
  const {uid} = req.body;
  try {
    const fetchedComments = await getCommentsByLikes(uid);
    res.status(200).json({success: true, value: fetchedComments});
  }catch (error){
    res.status(500).json({success: false, message: error.message});
  }
})

router.post("/delete-comment", async (req, res) => {
  const {uid, commentId, fromUid} = req.body;
  try {
    const deleted = await deleteComment(uid, commentId, fromUid);
    res.status(200).json({success: true, value : deleted});
  } catch(error) {
    res.status(500).json({success: false , message: error.message});
  }
})

router.post("/like-comment", async (req, res) => {
  const {uid, commentId, fromUid} = req.body;
  try {
    await increaseLike(uid, commentId, fromUid);
    res.status(200).json({success: true})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})


router.get("/profile-setting/main", async (req, res) => {
  const { uid } = req.query;
  //console.log("getting ");
  try {
    const Fullname = await getdata(uid, "Fullname");
    const Majors = await getdata(uid, "Majors");
    const Year = await getdata(uid, "Year");
    const Pic = await getdata(uid, "profile_pic");
    const Tags = await getdata(uid, "Tags");
    const Courses = await getdata(uid, "Courses");
    
    res.status(200).json({ success: true, Fullname, Majors, Year, Pic, Courses, Tags });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/profile-setting/main", upload.single('Pic'), async (req, res) => {
  const { uid, Fullname, Year } = req.body;
  //const Pic = req.file;
  try {
    update_profile(uid, "Fullname", Fullname);
    update_profile(uid, "Year", Year);
    //let url = null; // Initialize the URL variable

    if (req.file) {
      const file = req.file;
      const storageRef = ref(storage, `profile_pic/${uid}.png`);
      const metadate = {
        contentType: file.mimetype,
      };
      const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadate);
      const url = await getDownloadURL(storageRef); // Get the download URL of the uploaded file
      update_profile(uid, "profile_pic", url);
    }
    
    res.status(200).json({success: true});
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
})

router.get("/profile-setting/info", async (req, res) => {
  const { uid } = req.query;
  try {
    const Bio = await getdata(uid, "Bio");
    const Birth = await getdata(uid, "Birthday");
    const Gender = await getdata(uid, "Gender");
    const Phone = await getdata(uid, "Phone");
    const Email = await getdata(uid, "Personal_mail");
    
    res.status(200).json({ success: true, Bio, Birth, Gender, Phone, Email });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/profile-setting/info", async (req, res) => {
  const { uid, Bio, Birth, Gender, Phone } = req.body;
  const dateParts = Birth.split('-');
  const selectedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  try {
    update_profile(uid, "Bio", Bio);
    update_profile(uid, "Birthday", selectedDate);
    update_profile(uid, "Gender", Gender);
    update_profile(uid, "Phone", Phone);
   
    res.status(200).json({success: true});
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
})

router.post('/profile-setting/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    // Handle errors
    console.error('Failed to update password:', error);
    res.status(500).json({ success: false, message: 'Failed to update password', error: error.message });
  }
});


router.get("/home", async (req, res) => {
  const { query, searchQuery } = req.query;
  
  try {
    const results = await createAlgoliaClient(query);
    const { hits } = await results.search(searchQuery); 

    res.status(200).json({ success: true, hits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})
//chat functions
  router.post("/create-new-chat", async (req, res) => {
    const {userId, targetId} = req.body;

    //if (!users || users.length === 0) {
     // return res.status(400).json({ success: false, message: "No users provided." });
    //}
    try {
      const conversationId = await createNewChat(userId, targetId);
      if (conversationId) {
        res.status(200).json({ success: true, value: conversationId });
      }
      else {
        res.status(200).json({ success: true, message: "conversation exist", value: conversationId});
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post("/send-messages", async (req, res) => {
    const {conversationId, message, user} = req.body;

    try {
      const sent = await sendMessage(conversationId, message, user);
      if (sent) {
        res.status(200).json({ success: true, value: sent });
      }
      else {
        res.status(200).json({ success: true, message: "error sending message", value: sent});
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post("/get-conversations", async (req, res) => {
    const {user} = req.body;

    try {
      const conversations = await getConversations(user);
      res.status(200).json({ success: true, message: "Conversations found", value: conversations });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post("/get-messages", async (req, res) => {
    const {conversationId} = req.body;

    try {
      const messages = await getMessages(conversationId);
      res.status(200).json({ success: true, message: "Messages found", value: messages });
    } catch (error) {
      res.status(500).json({ success: false, message: "Not found" });
    }
  });

  router.post("/store-conversation-files",upload.single('file'), async (req, res) => {
    const {conversationId, user} = req.body;
    const file = req.file;
    console.log(file, conversationId, user);
    try {
      const fileStored = await storeFile(conversationId, file, user);
      res.status(200).json({ success: true, message: "error storing files", value: fileStored });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post("/get-user-info", async (req, res) => {
    const {user} = req.body;

    try {
      const userInfo = await getUserInfo(user);
      res.status(200).json({ success: true, message: "error getting messages", value: userInfo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post("/find-user-by-email", async (req, res) => {
    const {email} = req.body;

    try {
      const user = await findUserByEmail(email);
      res.status(200).json({ success: true, message: "user exist", value: user});
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post('/receive-messages', async (req, res) => {
    const { conversationId, lastTimestamp } = req.body;

    try {
        const { newMessages, lastTimestamp: updatedTimestamp } = await receiveMessage(conversationId, lastTimestamp);
        res.status(200).json({ success: true, value: { newMessages, lastTimestamp: updatedTimestamp } });
    } catch (error) {
        console.error("Error receiving messages:", error);
        res.status(500).json({ success: false, message: error.message });
    }

});

router.post("/create-post", upload.single('image'), async(req, res) =>{
  const{uid, title, content, course} = req.body;
  const image = req.file;
  try{
    const postId = await addPost(uid, title, content, image, course)
    res.status(200).json({success: true, value: postId})
  } catch(error) {
    res.status(500).json({success: false, message: error.message})
  }
})


router.post("/add-post-comment", async (req, res) => {
  const {uid, content, fromUid} = req.body;
  try {
    await addPostComment(uid, content, fromUid);
    return res.status(200).json({success: true})
  } catch(error){
    res.status(500).json({success: false, message: error.message});
  }
})


export default router;
