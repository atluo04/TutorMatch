import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { doc, addDoc, collection } from "firebase/firestore";

const postCollection = collection(db, "posts");

async function addPost(
  postTitle,
  postContent,
  postImage,
  pCategory,
  sCategory
) {
  const docRef = await addDoc(postCollection, {
    userId: auth.currentUser.uid,
    title: postTitle,
    content: postContent,
    image: postImage,
    primaryCategory: pCategory,
    secondaryCategory: sCategory,
  });
  return docRef;
}

export { addPost };
