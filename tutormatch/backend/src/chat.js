import { db, storage } from "./firebaseConfig.js";
import { collection, addDoc, getDocs, Timestamp, updateDoc, deleteDoc, orderBy, doc, query, getDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const createNewChat = async (userId, targetId) => {
    console.log(userId, targetId)
    let users = [];
    if (userId && targetId) {
        users = [userId, targetId]
    }
    const conversationsRef = collection(db, 'conversations');
    const conversationsSnapshot = await getDocs(conversationsRef);
    console.log("Enter2")
    if (conversationsSnapshot.empty) {
        const conversationData = {
            participants: users,
            createdAt: Timestamp.now(),
            latestMessage: null,
            status: "active",
            creater: users[0],
            lastOpenTimes: {userId: null, targetId: null}
        };
        const conversationRef = await addDoc(conversationsRef, conversationData);
        console.log(`First conversation created with id: ${conversationRef.id}`);
        return {id: conversationRef.id, creater: conversationData.creater};
    }
    else{
    console.log('Correct Branch', users)
    const order = query(conversationsRef, where("participants", "array-contains", users));
    const querySnapshot = await getDocs(order);
    console.log("Success up to 2", querySnapshot.emoty)
    if (!querySnapshot.empty) {querySnapshot.forEach(doc => {
        console.log(doc.id, " => ", doc.data());
      });
        return null}
        console.log("Success up to 1")
    const conversationData = {
        participants: users,
        createdAt: Timestamp.now(),
        latestMessage: null,
        status: "active",
        creater: users[0],
        lastOpenTimes: {userId: null, targetId: null}
    }
    try {
        const conversationRef = await addDoc(conversationsRef, conversationData);
        console.log(`"Success with id: ${conversationRef.id}`)
        return {id: conversationRef.id, creater: conversationData.creater};
    }
    catch(error) {
        console.log(error.message);
        console.log("Issue here")
        return null;
    }
}
}

const deleteConversation = async (conversationId) => {
    const conversationRef = doc(db, "conversations", conversationId);
    try {
        await deleteDoc(conversationRef);
        return true;
    }
    catch(error) {
        console.log(error.message);
        return false;
    }
}
const sendMessage = async (conversationId, message, user) => {
    try {
        const conversationRef = doc(db, 'conversations', conversationId)
        const messageRef = collection(db, 'conversations', conversationId, 'messages');
        await addDoc(messageRef, {
            type: "text",
            sender: user,
            content: message,
            conversationId: conversationId,
            timestamp: Timestamp.now()
        });
        await updateDoc(conversationRef, {
            latestMessage: {
                type: "text",
                sender: user,
                content: message,
                conversationId: conversationId,
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
const updateLastOpen = async (conversationId, userId) => {
    console.log("opened", conversationId, userId)
    try {
        const conversationRef = doc(db, 'conversations', conversationId);
        const conversationSnapshot = await getDoc(conversationRef);
        if (conversationSnapshot.exists()) {
            const conversationData = conversationSnapshot.data();
            const updatedLastOpenTimes = {
                ...conversationData.lastOpenTimes,
                [userId]: Timestamp.now()
            };
            await updateDoc(conversationRef, {
                lastOpenTimes: updatedLastOpenTimes
            })
            console.log(updatedLastOpenTimes, "updated");
        }
        else {console.log("error updating last unread")};
    }   catch(error) {
            console.log(error.message);
}
}

const receiveMessage = async (conversationId, lastTimestamp) => {
    try {
        //console.log(conversationId,"In receiveMessage")
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');
        let order = query(messagesRef, orderBy('timestamp'));
        if (lastTimestamp) {
            const firebaseTimestamp = Timestamp.fromMillis(lastTimestamp);
            order = query(messagesRef, where('timestamp', '>', firebaseTimestamp), orderBy('timestamp'));
        }
        const querySnapshot = await getDocs(order);
        const newMessages = [];
        querySnapshot.forEach((doc) => {
            const newMessage = doc.data();
            const timestamp = newMessage.timestamp.toDate();
            //console.log(newMessages)
            newMessages.push({ ...newMessage, timestamp: timestamp, id: doc.id });
        });
        let updatedTimestamp = null;
        if (!querySnapshot.empty) {
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            updatedTimestamp = lastDoc.data().timestamp.toMillis();
        }
        else {updatedTimestamp = lastTimestamp}
        console.log(updatedTimestamp)
        return { newMessages, lastTimestamp: updatedTimestamp };
    } catch (error) {
        console.error("Error receiving messages:", error);
        return null;
    }
}

const getConversations = async (user, conversationId) => {
    try {
        const conversations = [];
        const order = query(collection(db, 'conversations'), where('participants', 'array-contains', user));
        const snapshot = await getDocs(order);

        snapshot.forEach((doc) => {
            const conversationData = doc.data();
            const lastMessage = conversationData.latestMessage || null;
            const lastOpenTimes = conversationData.lastOpenTimes || {};
            const userLastOpenTime = lastOpenTimes[user] || 0;
            const hasNewMessages = lastMessage && lastMessage.timestamp > userLastOpenTime && doc.id != conversationId && lastMessage.sender != user;
            conversations.push({ id: doc.id, ...conversationData, hasNewMessages: hasNewMessages });
          });
        return conversations;
      } catch (error) {
        console.error("Error getting conversations: ", error);
        return [];
      }
} 

/* const getConversations = async (user, lastTimeStamp) => {
    try {
        const conversations = [];
        let order;
        if (lastTimeStamp) {
            const firebaseTimestamp = TimefromMillis(lastTimeStamp);
            order = query(collection(db, 'conversations'), where('participants', 'array-contains', user), where('timestamp', '>', firebaseTimestamp), orderBy('timestamp'));
        }
        else {
            order = query(collection(db, 'conversations'), where('participants', 'array-contains', user));
        }
        const querySnapshot = await getDocs(order);
        const newConversations = [];
        querySnapshot.forEach((doc) => {
            const newConversation = doc.data();
            const timestamp = newConversation.timestamp.toDate();
            newConversations.push({ ...newConversations, timestamp: timestamp, id: doc.id});
        });
        let updatedTimestamp = null;
        if (!querySnapshot.empty) {
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            updatedTimestamp = lastDoc.data().timestamp.toMillis();
        }
        else {updatedTimestamp = Date.now()}
        console.log("empty?", snapshot.empty);
        return { newConversations, lastTimeStamp};
      } catch (error) {
        console.error("Error getting conversations: ", error);
        return [];
      }
    }
*/
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
    const timestamp = Timestamp.now();
    let path = `/conversation/${conversationId}`;
    let typeName;
    let extension;
    console.log('type', file.mimetype, file,file.mimetype.startsWith('image/'))

    if (file.mimetype.startsWith('image/')) {
        typeName = "image";
        const lastDotIndex = file.originalname.lastIndexOf('.');
        extension = lastDotIndex !== -1 ? file.originalname.substring(lastDotIndex + 1) : null;
        path += `/pic/${timestamp}.${extension}`
    }
    else {
        typeName = "other"
        const lastDotIndex = file.originalname.lastIndexOf('.');
        extension = lastDotIndex !== -1 ? file.originalname.substring(lastDotIndex + 1) : null;
        console.log(extension);
        path += `/file/${timestamp}.${extension}`;
    }
    const metadata = {
        contentType: file.mimetype,
    };

    try {
        const fileRef = ref(storage, path);
        const conversationRef = doc(db, 'conversations', conversationId);
        const messageRef = collection(db, 'conversations', conversationId, 'messages');
        const snapshot = await uploadBytesResumable(fileRef, file.buffer, metadata);
        const URL = await getDownloadURL(fileRef);
        console.log(URL, snapshot, typeName);
        await addDoc(messageRef, {
            fileName: file.originalname,
            type: typeName,
            sender: user,
            content: URL,
            conversationId: conversationId,
            timestamp: Timestamp.now()
        });
        await updateDoc(conversationRef, {
            latestMessage: {
                type: typeName,
                sender: user,
                content: URL,
                conversationId: conversationId,
                timestamp: Timestamp.now()               
        }});
        return true
    }
    catch(error){
        console.log("Error uploading file")
        return false
    }
}

const getUserInfo = async (user) => {
    try {
    const userRef = doc(db, `users/${user}`);
    const docSnap = await getDoc(userRef);
  
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return {
        id: user,
        name: userData.Fullname,
        image: userData.profile_pic,
        majors: userData.Majors,
        bio: userData.Bio,
        isOnline: true // to be modified 
      };
    } else {
      console.log("No such user!");
      return {
        id: user, 
        name: "Unknown", 
        image: "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg", 
        isOnline: false,
        majors: ["Unknown", "1"],
        bio: "Not available"
      };
    }}
    catch (error) {
      console.log(error.message)
      return {
        id: user, 
        name: "Please select a conversation", 
        image: "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg", 
        isOnline: false
      };
    }
  };

  const findUserByEmail = async(email) => {
    try {
      const userRef = collection(db, "users");
      const querySnapshot = await getDocs(userRef);
      let userId = null;
      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        console.log(email, userData.Personal_mail, userData.Personal_mail === email);
        if (userData.Personal_mail === email) {
            userId = doc.id;
            return {
                id: userId,
                image: doc.data().profile_pic,
                name: doc.data().Fullname,
                majors: doc.data().Majors,
                bio: doc.data().Bio
            };
        }
    }
        return null; 
    }
    catch (error) {
      console.log("No such user", error);
      return null;
    }
  }


export { createNewChat, deleteConversation, sendMessage, receiveMessage, getConversations, getMessages, storeFile,
     getUserInfo, findUserByEmail, updateLastOpen }