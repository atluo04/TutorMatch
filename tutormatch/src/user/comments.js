import { db } from "../firebase/firebaseConfig";
import { auth } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, Timestamp, updateDoc, increment, orderBy, doc, query, arrayUnion, getDoc, deleteDoc } from "firebase/firestore";


const addNewComment= async (target, commentContent, fromUser, parentId=null) => {
    try {
        const userRef = doc(db, 'users', target);
        const commentRef = await addDoc(collection(userRef, 'comments'), {
            content: commentContent,
            from: fromUser,
            timestamp: Timestamp.now(),
            likes: 0,
            likedUsers: [],
            parentId: parentId
    });
    return}
    catch(error) {
        console.error(error.message)
    }
}

const increaseLike = async (target, commentId, from) => {
    try {
    const commentRef = doc(db, 'users', target, 'comments', commentId);
    const commentDocSnapshot = await getDoc(commentRef);
    const commentData = commentDocSnapshot.data();
    const isliked = commentData.likedUsers && commentData.likedUsers.includes(from);

    console.log(isliked)
    if (!isliked) {
    await updateDoc(commentRef, {
        likes: increment(1),
        likedUsers: arrayUnion(from)
        });
    }
        }
    catch(error) {
        console.log(error.message)
    }

}

const getCommentsByLikes = async (target) => {
    try {
        const commentRef = collection(db, 'users', target, 'comments');
        const order = query(commentRef, orderBy('likes', 'desc'));
        const querySnapshot = await getDocs(order);
        const orderedComment = [];
        querySnapshot.forEach((doc) => {
            orderedComment.push({id: doc.id, ...doc.data()})
        })
        return orderedComment
    }
    catch(error) {
        console.error(error.message)
    }
}

const deleteComment = async (target, commentId, from) => {
    try {
        const commentRef = doc(db, 'users', target, 'comments', commentId);
        const commentDocSnapshot = await getDoc(commentRef);
        const commentData = commentDocSnapshot.data();
        const isAuthor = (commentData && commentData.from === from) ;
        if (isAuthor) {
            await deleteDoc(commentRef);
            return true
        }
        else {
            return false
        }
    }
    catch(error) {
        console.error(error.message)
    }

}

export { addNewComment, increaseLike, getCommentsByLikes, deleteComment }