import { db } from "../firebase/firebaseConfig";
import { auth } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, Timestamp, updateDoc, increment, orderBy, doc, query, arrayUnion, getDoc, deleteDoc, onSnapshot } from "firebase/firestore";

//not yet been tested
const createNewChat = async (users) => {
    const conversationRef = doc(collection(db, "conversations"));
    const conversationData = {
        participants: users,
        createdAt: Timestamp.now(),
        latestMessage: null,
        status: "active",
        unread: 0
    }
    try {
        await setDoc(conversationRef, conversationData);
        console.log(`"Success with id: ${conversationRef.id}`)
        return conversationRef.id;
    }
    catch(error) {
        console.log(error.message);
        return null;
    }
}
const sendMessage = async (conversationId, content, user) => {
    try {
        const conversationRef = collectioon(db, 'conversations', conversationId)
        const messageRef = collection(db, 'conversations', conversationId, 'messages');
        await addDoc(messageRef, {
            sender: user,
            content: content,
            timestamp: Timestamp.now()
        });
        await updateDoc(conversationRef, {
            latestMessage: {
                sender: user,
                content: message,
                timestamp: Timestamp.now()               
        }});
        console.log("success");
        return true
    }
        catch(error) {
            console.log(error.message)
            return false;
        }   
}

const receiveMessage = async (conversationId) => {
    //will be split and add features for performance optimization (ie page loading)
    const messageRef = collection(db, 'conversations', conversationId, 'messages');
    const order = query(messageRef, orderBy('timestamp'));
    onSnapshot(order, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                //To be updated: update the UI
                console.log(change.doc.data(), "new")
            }
            if (change.type === "modified") {
                //To be updated: update the UI
                console.log(change.doc.data(), "modified")
            }
            if (change.type == "removed") {
                //To be updated: update the UI
                console.log(change.doc.data(), "removed")
            }
        });
    });

}

export { createNewChat, sendMessage }