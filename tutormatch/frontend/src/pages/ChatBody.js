import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from '../userContext';
import "../html/chatBody.css";
import ChatList from "../components/chat/chatComponents/ChatList.js"
import ChatContent from "../components/chat/chatComponents/ChatContent.js";
import UserProfile from "../components/chat/chatComponents/UserProfile.js"



export default function ChatBody() {
  //const user = auth.currentUser;
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setConversationId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const { uid, setUid } = useUser();
  const navigate = useNavigate();

  const selectConversation = (conversationId) => {
    setConversationId(conversationId);
  };

  async function fetchConversations(userId, conversationId) {
    try { 
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/get-conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user: userId, conversationId: conversationId}),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      const convs = result.value;
      if (!Array.isArray(result.value)) {
        throw new Error('Expected an array');
      }
      const conversationsWithDetails = await Promise.all(convs.map(async (conversation) => {
        const otherParticipantUid = conversation.participants.find(uid => uid !== userId);
        const result2 = await getUserInfo(otherParticipantUid);
        const otherParticipantInfo = result2.value;
        const hasNewMessages = conversation.hasNewMessages;
        console.log(hasNewMessages, 'ababababababa')
        return {
          image: otherParticipantInfo.image,
          id: conversation.id,
          name: otherParticipantInfo.name,
          active: false,
          isOnline: otherParticipantInfo.isOnline,
          conversationId: conversation.id,
          unread: hasNewMessages,
        };
      }));
      setConversations(conversationsWithDetails);
      
    } catch (error) {
      console.error("Error fetching conversations:", error.message);
    }
  }
  
  async function updateLastOpen(conversationId, userId) {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/update-last-open`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversationId: conversationId, userId: userId }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  }

  async function findUserByEmail(email) {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/find-user-by-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log(result);
  
      if (result.success) {
        console.log("User found:", result.value);
        return result.value;
      } else {
        console.log("User not found:", result.message);
        return null;
      }
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  }

  async function handleCreateChat(userId, targetId){
    try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/create-new-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, targetId }),
        });
    
        const result = await response.json();
    
        if (response.ok && result.value) {
          console.log("New chat created or existing chat found:", result.value);
          return result.value; 
        } else {
          console.error("Failed to create new chat:", result.message);
          return null;
        }
      } catch (error) {
        console.error("Error in creating new chat:", error);
        return null; 
      }
  }

  async function deleteConversation(conversationId) {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/delete-conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ conversationId: conversationId })
    },
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  if (data.value == false) {
    alert("Error deleting the chat!");
  } 

  }

  async function getUserInfo(userId) {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/get-user-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
          body: JSON.stringify({ user: userId })
        },
    );
    if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
    return data;
  }
  useEffect(() => {
    if (!uid) {
      alert('Please log in first');
      navigate("/");
  }
    const handleOutsideChat = async () => {
        await fetchConversations(uid);
        if (location.state && location.state.activeId) {
          setConversationId(location.state.activeId);
          updateLastOpen(location.state.activeId, uid);
        }
      };
      handleOutsideChat();
    const intervalId = setInterval(() => fetchConversations(uid), 3000);
    return () => clearInterval(intervalId);
  }, [uid, location.state?.activeId]);
 
  
    return (
      <div className="main__chatbody">
        <ChatList
          conversations={conversations}
          selectConversation={selectConversation}
          createChat={handleCreateChat}
          getTargetUser={findUserByEmail}
          updateLastOpen={updateLastOpen}
          deleteConversation={deleteConversation}
          userId={uid}
          chatId={currentConversationId}/>
        <ChatContent
          conversationId={currentConversationId}
          conversations={conversations}
          userInfo={userInfo}
          userId={uid}/>
        <UserProfile
          getUserInfo = {getUserInfo}
          user={uid}
          setInfo={setUserInfo}
          userId={uid}/> 
      </div>
    );
  }
