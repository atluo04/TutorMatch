import { db } from "../firebase/firebaseConfig";
import { auth } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, Timestamp, updateDoc, orderBy, doc, query, getDoc, deleteDoc, onSnapshot,setDoc, where } from "firebase/firestore";

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
const sendMessage = async (conversationId, message, user) => {
    try {
        const conversationRef = doc(db, 'conversations', conversationId)
        const messageRef = collection(db, 'conversations', conversationId, 'messages');
        const messageSnapShot = await getDocs(messageRef);
        if (messageSnapShot.empty) {
            const conversationRef = doc(db, 'conversations', conversationId);
            await setDoc(conversationRef, { messages: [] });
        }

        await addDoc(messageRef, {
            sender: user,
            content: message,
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

const receiveMessage = async (conversationId,) => {
    //will be split and add features for performance optimization (ie page loading)
    const messageRef = collection(db, 'conversations', conversationId, 'messages');
    const order = query(messageRef, orderBy('timestamp'));
    onSnapshot(order, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const newMessage = change.doc.data()
                //handleAdd(newMessage)
                console.log(change.doc.data(), "new")
            }
            if (change.type === "modified") {
                //To be updated: update the UI
                const newMessage = change.doc.data()
                //handleModified(newMessage)
                console.log(change.doc.data(), "modified")
            }
            if (change.type == "removed") {
                //To be updated: update the UI
                const newMessage = change.doc.data()
                //handleRemove(newMessage)
                console.log(change.doc.data(), "removed")
            }
        });
    });

}

const getConversations = async (user) => {
    try {
        const conversations = [];
        const order = query(collection(db, 'conversations'), where('participants', 'array-contains', user));
        const snapshot = await getDocs(order);
        snapshot.forEach((doc) => {
            conversations.push({ id: doc.id, ...doc.data() });
          });
        return conversations;
      } catch (error) {
        console.error("Error getting conversations: ", error);
        return [];
      }
}

const getMessages = async (conversationId) => {
    try {
        const messages = []
        console.log("enter get", conversationId)
        const order = query(collection(db, 'conversations', conversationId, 'messages'), orderBy('timestamp'));
        const snapshot = await getDocs(order);
        snapshot.forEach((doc) => {
            console.log('here')
            messages.push({ id: doc.id, ...doc.data() });
          });
        return messages
    }
    catch (error) {
        console.log(error.message);
        return []

    }
}
//createNewChat(['LAwp7KFQLZf6QzYwNxOz5LGtsrB2', 'vc3U1WbSF3bguK7k65TMYdoBXCz2'])

export { createNewChat, sendMessage, receiveMessage, getConversations, getMessages }