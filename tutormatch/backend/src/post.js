import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebaseConfig.js";
import { serverTimestamp } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

const addNewComment = async (
  target,
  commentContent,
  fromUser,
  parentId = null
) => {
  try {
    const postRef = doc(db, "posts", target);
    const commentRef = await addDoc(collection(postRef, "comments"), {
      content: commentContent,
      from: fromUser,
      timestamp: Timestamp.now(),
      likes: 0,
      likedUsers: [],
      parentId: parentId,
    });
    return;
  } catch (error) {
    console.error(error.message);
  }
};

export const addPost = async (
  uid,
  postTitle,
  postContent,
  postImage,
  course
) => {
  let imageUrl = null;
  if (postImage) {
    const imageRef = ref(
      storage,
      "post_images/" + Date.now() + postImage.originalname
    );
    const metadata = {
      contentType: postImage.mimetype, // Set the content type based on the original file's MIME type
    };

    try {
      await uploadBytes(imageRef, postImage.buffer, metadata);
      console.log("uploaded!");
      imageUrl = await getDownloadURL(imageRef);
    } catch (error) {
      console.error(error);
    }
  }
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      userId: uid,
      title: postTitle,
      content: postContent,
      image: imageUrl,
      course: course,
      date: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    console.log(error);
  }
};
