import { auth, db, storage } from "../firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore";

const postCollection = collection(db, "posts");

async function addPost(
  postTitle,
  postContent,
  postImage,
  pCategory,
  sCategory
) {
  console.log(postImage);
  let imageUrl = null;
  if (postImage !== null) {
    const imageRef = ref(storage, "post_images/" + postImage.name); //might want to process the name so that unique names are not required
    try {
      await uploadBytes(imageRef, postImage);
      console.log("uploaded!");
      imageUrl = await getDownloadURL(imageRef);
    } catch (error) {
      console.error(error);
    }
  }

  const docRef = await addDoc(postCollection, {
    userId: auth.currentUser.uid,
    title: postTitle,
    content: postContent,
    image: imageUrl,
    primaryCategory: pCategory,
    secondaryCategory: sCategory,
    date: serverTimestamp(),
  });
  return docRef;
}

export { addPost };
