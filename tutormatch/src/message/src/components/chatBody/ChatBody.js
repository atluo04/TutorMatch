import React, { Component, useEffect, useState } from "react";
import { httpsCallable } from 'firebase/functions';
//import { getUserByEmail } from "../../../../firebase/corsConfig";
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

  const selectConversation = (conversationId) => {
    setConversationId(conversationId);
  };
  const getUserInfo = async (uid) => {
    try {
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
    console.log("emmm")
    try {
      const userRef = collection(db, "users");
      const querySnapshot = await query(userRef, where('email', '==', email));
      if (querySnapshot.empty) {
        console.log("No such user with email:", email);
        return null;
    }
    else {
      const targetUserInfo = querySnapshot.docs[0].data();
      return {
        id: targetUserInfo.id,
        name: targetUserInfo.Fullname,
        img: targetUserInfo.profile_pic,
        email: targetUserInfo.Personal_mail
      };}
    }
    catch (error) {
      console.log("No such user", error);
      return null;
    }
  }

  const handleCreateChat = async(targetId, userId) => {
    if (targetId && userId) {
      const participants = [userId, targetId];
      createNewChat(participants);
    }
    else {
      console.log("Error creating new chat");
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const fetchConversations = async () => {
          try {
            const conversationsData = await getConversations(user.uid);
            //console.log('Fetching', conversationsData)
            const conversationsWithDetails = await Promise.all(
              conversationsData.map(async (conversation) => {
                const otherParticipantUid = conversation.participants.find(uid => uid !== user.uid);
                setOtherUser(otherParticipantUid)
                //need to be modified if we allow group chat
                const otherParticipantInfo = await getUserInfo(otherParticipantUid);
                return {
                  image: otherParticipantInfo.image,
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
        <ChatList conversations={conversations} selectConversation={selectConversation} createChat={handleCreateChat}
        getTargetUser={findUserByEmail} />
        <ChatContent conversationId={currentConversationId} getUserInfo={getUserInfo} otherUser={otherUser}
        setInfo={setUserInfo}/>
        <UserProfile userInfo={userInfo}/>
      </div>
    );
  }
