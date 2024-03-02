import { db, auth, storage } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, Timestamp, updateDoc, orderBy, doc, query, getDoc, deleteDoc, onSnapshot,setDoc, where } from "firebase/firestore";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";

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
            //If no conversations before, create conversation
            const conversationRef = doc(db, 'conversations', conversationId);
        }

        await addDoc(messageRef, {
            type: "text",
            sender: user,
            content: message,
            timestamp: Timestamp.now()
        });
        await updateDoc(conversationRef, {
            latestMessage: {
                type: "text",
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

const receiveMessage = async (conversationId, handleAdd, user) => {
    const messageRef = collection(db, 'conversations', conversationId, 'messages');
    const order = query(messageRef, orderBy('timestamp'));
    const unsubscribe = onSnapshot(order, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const newMessage = change.doc.data()
                handleAdd(newMessage)
                console.log("成功调用，", newMessage.sender, user.uid)
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

    return unsubscribe;

}

const getConversations = async (user) => {
    try {
        const conversations = [];
        const order = query(collection(db, 'conversations'), where('participants', 'array-contains', user));
        const snapshot = await getDocs(order);
        console.log("empty?", snapshot.empty);

        snapshot.forEach((doc) => {
            console.log(doc.id, doc.data())
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

//store image meta data(URL) in the firestore conversation messages collection, and store the data itself in the firestorage
//add type when storing the data
const storeFile = async(conversationId, file, user) => {
    console.log("进入store")
    const timestamp = Timestamp.now();
    let path = `/conversation/${conversationId}`
    let typeName;
    if (file.type.startsWith('image/')) {
        typeName = "image";
        const extension = file.name.split('.').pop();
        console.log('image part', extension)
        path += `/pic/${timestamp}.${extension}`
    }
    else {
        typeName = "other"
        const extension = file.name.split('.').pop();
        path += `/file/${timestamp}.${extension}`
    }
    try {
        const fileRef = ref(storage, path);
        const conversationRef = doc(db, 'conversations', conversationId)
        const messageRef = collection(db, 'conversations', conversationId, 'messages');
        const snapshot = await uploadBytes(fileRef, file);
        const URL = await getDownloadURL(fileRef)
        console.log(URL, snapshot, typeName)
        await addDoc(messageRef, {
            fileName: file.name,
            type: typeName,
            sender: user,
            content: URL,
            timestamp: Timestamp.now()
        });
        await updateDoc(conversationRef, {
            latestMessage: {
                type: typeName,
                sender: user,
                content: URL,
                timestamp: Timestamp.now()               
        }});
        return true
    }
    catch(error){
        console.log("Error uploading file")
        return false

    }

}
//createNewChat(['LAwp7KFQLZf6QzYwNxOz5LGtsrB2', 'vc3U1WbSF3bguK7k65TMYdoBXCz2'])

export { createNewChat, sendMessage, receiveMessage, getConversations, getMessages, storeFile }