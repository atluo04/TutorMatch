import React, { Component, useEffect, useState } from "react";
import { sendMessage, receiveMessage, createNewchat, getConversations } from "../../../../user/chat";
import { app, db, auth } from "../../../../firebase/firebaseConfig"
import { collection, addDoc, getDocs, Timestamp, updateDoc, orderBy, doc, query, getDoc, deleteDoc, onSnapshot,setDoc } from "firebase/firestore";
import { data } from "../../../../user/user_doc";
import "./chatBody.css";
import ChatList from "../chatList/ChatList";
import ChatContent from "../chatContent/ChatContent";
import UserProfile from "../userProfile/UserProfile";

export default function ChatBody() {
  const user = auth.currentUser;
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setConversationId] = useState(null)
  const [otherUser, setOtherUser] = useState([])

  const selectConversation = (conversationId) => {
    setConversationId(conversationId);
  };
  const getUserInfo = async (uid) => {
    console.log('enter')
    const userRef = doc(db, `users/${uid}`);
    const docSnap = await getDoc(userRef);
  
    if (docSnap.exists()) {
      const userData = docSnap.data()
      return {
        id: uid,
        name: userData.Fullname,
        image: userData.profile_pic,
        isOnline: false // to be modified 
      };
    } else {
      console.log("No such user!");
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const fetchConversations = async () => {
          try {
            const conversationsData = await getConversations(user.uid);
            const conversationsWithDetails = await Promise.all(
              conversationsData.map(async (conversation) => {
                const otherParticipantUid = conversation.participants.find(uid => uid !== user.uid);
                setOtherUser(otherParticipantUid)
                const otherParticipantInfo = await getUserInfo(otherParticipantUid);
                return {
                  image: otherParticipantInfo.image || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
                  id: conversation.id,
                  name: otherParticipantInfo.name,
                  active: false,
                  isOnline: otherParticipantInfo.isOnline,
                };
              })
            );
            console.log(conversationsWithDetails); 
            setConversations(conversationsWithDetails);
          } catch (error) {
            console.error("Error fetching conversations:", error);
          }
        };
  
        fetchConversations();
      } else {
        console.log('Error login');
      }
    });
  
    return () => unsubscribe();
  }, []);

  console.log(conversations, "what we got");
    return (
      <div className="main__chatbody">
        <ChatList conversations={conversations} selectConversation={selectConversation}/>
        <ChatContent conversationId={currentConversationId} getUserInfo={getUserInfo} otherUser={otherUser}/>
        <UserProfile />
      </div>
    );
  }
