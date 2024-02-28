import React, { Component, useState, createRef, useEffect } from "react";
import { app, db, auth } from "../../../../firebase/firebaseConfig"
import "./chatContent.css";
import Avatar from "../chatList/Avatar";
import ChatItem from "./ChatItem";
import { sendMessage, receiveMessage, createNewchat, getConversations, getMessages } from "../../../../user/chat";
import { collection, addDoc, getDocs, Timestamp, updateDoc, orderBy, doc, query, getDoc, deleteDoc, onSnapshot,setDoc } from "firebase/firestore";


const handleTime = (date) => {
  const timestamp = new Date(date);
  const now = new Date();
  //const timepast = (now.getTime() - timestamp.getTime(Time)) / 1000;
}


export default class ChatContent extends Component {
  messagesEndRef = createRef(null);
  constructor(props) {
    super(props);
    this.state = {
      chat: [],
      conversationId: this.props.conversationId,
      msg: "",
      userImage: "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
      otherUserImage: "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg"
    };
  }
  /*handleNewMessage = (newMessage) => {
    if (auth.currentUser) {
    this.setState(prevState => ({
      chat: [...prevState.chat, {
        type: newMessage.sender === auth.currentUser.uid ? "me" : "other",
        msg: newMessage.content,
        image: newMessage.sender === auth.currentUser.uid ? this.state.userImage : this.state.otherUserImage
      }]
    }), () => {
      this.scrollToBottom();
    });
  }
  }; */

  handleSubmit = (e, currentConversationId) => {
    e.preventDefault(); 
    if (currentConversationId && auth.currentUser) {
    const { msg, chat } = this.state;
    if (msg.trim() === "") return;
    const newMessage = {
        type: "me", 
        msg: msg, 
        image: "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
    };
  
    this.setState((prevState) => ({
        chat: Array.isArray(prevState.chat) ? [...prevState.chat, newMessage] : [newMessage],
        msg: "",
    }), () => {
        this.scrollToBottom(); 
    });
    sendMessage(currentConversationId, msg, auth.currentUser.uid)
    console.log("send, msg")
  }};

  update = async() => {
    const { conversationId } = this.state;
    try {
      const messages = await getMessages(conversationId);
      if (auth.currentUser) {
      const user = auth.currentUser
      const formattedMessage = messages.map(message => ({
        type: message.sender === user.uid ? "me" : "other",
        msg: message.content,
        image: message.sender === user.uid ? this.userImage : this.otherUserImage
    }));
      console.log(formattedMessage)
      this.setState({ chat: formattedMessage })
  }

  } catch (error) {
    console.log(error.message)
  }}

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      this.props.getUserInfo(currentUser.uid).then(userInfo => {
        const userImage = userInfo.image || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg";
        console.log(userImage)
        this.setState({ userImage: userImage });
      });
      this.props.getUserInfo(this.props.otherUser).then(otherUserInfo => {
        const otherUserImage = otherUserInfo.image || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg";
        this.setState({ otherUserImage: otherUserImage });
      });
    }
    this.update();
   
    
    window.addEventListener("keydown", this.handleKeyDown);
    this.scrollToBottom();
  }

  onStateChange = (e) => {
    this.setState({ msg: e.target.value });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.conversationId !== this.props.conversationId) {
      if (auth.currentUser) {
        const user = auth.currentUser
        this.props.getUserInfo(user.uid).then(userInfo => {
          const userImage = userInfo.image || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg";
          console.log(userImage)
          this.setState({ userImage: userImage });
        });
        this.props.getUserInfo(this.props.otherUser).then(otherUserInfo => {
          const otherUserImage = otherUserInfo.image || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg";
          this.setState({ otherUserImage: otherUserImage });
        });
      }
      this.setState({ conversationId: this.props.conversationId }, () => {
        this.update();
      });
    }
  }

  render() {
    return (
      <div className="main__chatcontent">
        <div className="content__header">
          <div className="blocks">
            <div className="current-chatting-user">
              <Avatar
                isOnline="active"
                image="https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg"
              />
              <p>Bruin</p>
            </div>
          </div>

          <div className="blocks">
            <div className="settings">
              <button className="btn-nobg">
                <i className="fa fa-cog"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="content__body">
          <div className="chat__items">
            {Array.isArray(this.state.chat) && this.state.chat.map((itm, index) => {
              return (
                //adding chat items, (previous messages i guess)
                <ChatItem
                  animationDelay={index + 2}
                  key={index}
                  user={itm.type ? itm.type : "me"}
                  msg={itm.msg}
                  image={itm.image}
                />
              );
            })}
            <div ref={this.messagesEndRef} />
          </div>
        </div>
        <div className="content__footer">
          <div className="sendNewMessage">
            <button className="addFiles">
              <i className="fa fa-plus"></i>
            </button>
            <input
              type="text"
              placeholder="Type a message here"
              onChange={this.onStateChange}
              value={this.state.msg}
            />
            <button className="btnSendMsg" id="sendMsgBtn" onClick={(e) => this.handleSubmit(e, this.state.conversationId)}>
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
