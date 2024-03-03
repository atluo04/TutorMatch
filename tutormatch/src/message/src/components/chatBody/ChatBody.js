import React, { Component, useEffect, useState } from "react";
import { httpsCallable } from 'firebase/functions';
import { sendMessage, receiveMessage, createNewChat, getConversations } from "../../../../user/chat";
import { app, db, auth, functions } from "../../../../firebase/firebaseConfig"
import { collection, addDoc, getDocs, Timestamp, updateDoc, orderBy, doc, query, getDoc, deleteDoc, onSnapshot,setDoc, where } from "firebase/firestore";
import "./chatBody.css";
import ChatList from "../chatList/ChatList";
import ChatContent from "../chatContent/ChatContent";
import UserProfile from "../userProfile/UserProfile";



export default function ChatBody() {
  //const user = auth.currentUser;
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setConversationId] = useState(null)
  const [otherUser, setOtherUser] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [userId, setUserId] = useState(null)

  const selectConversation = (conversationId) => {
    setConversationId(conversationId);
  };
  const getUserInfo = async (uid) => {
    try {
    const userRef = doc(db, `users/${uid}`);
    const docSnap = await getDoc(userRef);
  
    if (docSnap.exists()) {
      const userData = docSnap.data()
      return {
        id: uid,
        name: userData.Fullname,
        image: userData.profile_pic,
        isOnline: true // to be modified 
      };
    } else {
      console.log("No such user!");
      return {
        id: uid, 
        name: "Unknown", 
        image: "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg", 
        isOnline: false
      };
    }}
    catch (error) {
      console.log(error.message)
      return {
        id: uid, 
        name: "Please select a conversation", 
        image: "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg", 
        isOnline: false
      };

    }
  };

  const findUserByEmail = async(email) => {
    //const getUserByEmail = httpsCallable(functions, 'getUserByEmail');
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
                major: doc.data().Major,
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

  const handleCreateChat = async(userId, targetId) => {
    if (targetId && userId) {
      const participants = [userId, targetId];
      const id = await createNewChat(participants);
      return id
    }
    else {
      console.log("Error creating new chat");
    }
  }
  const conversationSubscriptions = [];
  let processedMessages = []

  useEffect(() => {
    let componentMounted = true;
    const now = new Date();
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid)
        const conversationsRef = collection(db, "conversations");
        const order = query(conversationsRef, where("participants", "array-contains", user.uid));
        
        const unsubscribeConversations = onSnapshot(order, async (snapshot) => {
          const conversationsWithDetailsPromise = snapshot.docs.map(async doc => {
            const conversation = doc.data();
            const conversationId = doc.id;
            const otherParticipantUid = conversation.participants.find(uid => uid !== user.uid);
            setOtherUser(otherParticipantUid)
            const otherParticipantInfo = await getUserInfo(otherParticipantUid);
            const unsubscribeMessages = onSnapshot(
              query(collection(db, "conversations", conversationId, "messages"), orderBy("timestamp")),
              (messageSnapshot) => {
                if (!componentMounted) return;

                messageSnapshot.docChanges().forEach((change) => {
                  if (change.type === "added") {
                    const messageData = change.doc.data();
                    const messageTimestamp = messageData.timestamp ? messageData.timestamp.toDate() : null;
                    const messageSender = messageData.sender ? messageData.sender : null;
                    const messageId = change.doc.id
                    //console.log('in',messageTimestamp, processedMessages.includes(messageId), messageTimestamp > now, messageId)
                    if (messageTimestamp && messageTimestamp > now && messageSender && messageSender != user.uid && !processedMessages.includes(messageId)) {
                      console.log(processedMessages.includes(messageId), messageId, processedMessages)
                      console.log(`New message in ${conversationId}:`, messageData);
                    }
                    if (messageTimestamp != null && !processedMessages.includes(messageId)) {processedMessages.push(messageId)
                    console.log("updated nb", messageId, processedMessages)}
                  }
                });
              }
            );

            conversationSubscriptions.push(unsubscribeMessages);
  
            return {
              image: otherParticipantInfo.image,
              id: conversationId,
              name: otherParticipantInfo.name,
              active: false, 
              isOnline: otherParticipantInfo.isOnline,
            };
          });
  
          const conversationsWithDetails = await Promise.all(conversationsWithDetailsPromise);
          setConversations(conversationsWithDetails);
        });
  
        return () => {
          unsubscribe();
          unsubscribeConversations();
          if (unsubscribeConversations) {
            unsubscribeConversations();
          }
          conversationSubscriptions.forEach(unsubscribe => unsubscribe()
          );
          componentMounted = false;
        };
      } else {
        //setConversations([]);
      }
    });
  }, []);
  
    return (
      <div className="main__chatbody">
        <ChatList conversations={conversations} selectConversation={selectConversation} createChat={handleCreateChat}
        getTargetUser={findUserByEmail} />
        <ChatContent conversationId={currentConversationId} getUserInfo={getUserInfo} otherUser={otherUser}
        setInfo={setUserInfo} userInfo={userInfo}/>
        <UserProfile getUserInfo={getUserInfo} user={userId} setInfo={setUserInfo}/>
      </div>
    );
  }
