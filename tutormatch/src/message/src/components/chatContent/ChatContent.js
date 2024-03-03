import React, { Component, useState, createRef, useEffect } from "react";
import { app, db, auth } from "../../../../firebase/firebaseConfig"
import "./chatContent.css";
import Avatar from "../chatList/Avatar";
import ChatItem from "./ChatItem";
import firebase from "firebase/storage"
import { sendMessage, receiveMessage, createNewchat, getConversations, getMessages, storeFile } from "../../../../user/chat";
import { collection, addDoc, getDocs, Timestamp, updateDoc, orderBy, doc, query, getDoc, deleteDoc, onSnapshot,setDoc } from "firebase/firestore";

const handleTime = (date) => {
  const timestamp = date.toDate();
  const now = new Date();
  const timepast = (now.getTime() - timestamp.getTime(date)) / 1000;
  if (timepast < 60) {
    return `Just now`
  }
  else if (timepast < 3600) {
    return `${Math.floor(timepast / 60)} minutes ago`;
  }
  else if (timepast < 3600*24 ) {
    return `${Math.floor(timepast / 3600)} hours ago`;
  }
  else {
    return `${timestamp.toLocaleString('en-US')}`
  }
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
      otherUserImage: "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
      userName: "ABC",
      otherUserName:"Bruin"
    };
    this.fileInputRef = React.createRef();
  }
  handleNewMessage = (newMessage) => {
    //To be modifeied, we may use update to load the history instead of use the subscribe entirely
    this.setState(prevState => {
      return {
        chat: [...prevState.chat, {
            type: newMessage.sender === auth.currentUser.uid ? "me" : "other",
            msgType: newMessage.type || "text",
            fileName: newMessage.fileName || null,
            msg: newMessage.content,
            image: newMessage.sender === auth.currentUser.uid ? this.state.userImage : this.state.otherUserImage,
            timestamp: newMessage.timestamp,
            id: newMessage.id 
        }]
      };
    }, () => {
        this.scrollToBottom();
    })};

  handleSubmit = (e, currentConversationId) => {
    e.preventDefault(); 
    if (currentConversationId && auth.currentUser) {
    const { msg, chat } = this.state;
  
    this.setState((prevState) => ({
        msg: "",
    }), () => {
        this.scrollToBottom(); 
    }); 
    sendMessage(currentConversationId, msg, auth.currentUser.uid)
    console.log("send, msg")
  }};

  //call storeImage/storeFile to store the data
  handleFileUpload = async(e) => {
    const file = e.target.files[0];
    console.log(file, "file to upload")
    try {
      if (file) {
        const upload = await storeFile(this.state.conversationId, file, auth.currentUser.uid);
        if (upload) {
          console.log("Success in file uploading")
        }
        else {console.log("Fail in file uploading ")}
      }

    }
    catch(error) {
      console.log(error.message)
    } 
  }

  triggerFileInput = () => {
    this.fileInputRef.current.click();
  }
 

  update = async(id) => {
    const { conversationId } = this.state;

    try {
      const messages = await getMessages(conversationId);
      if (auth.currentUser) {
        const user = auth.currentUser
        const formattedMessage = messages.map(message => ({
          type: message.sender === user.uid ? "me" : "other",
          msg: message.content,
          timestamp: message.timestamp,
          image: message.sender === user.uid ? this.userImage : this.otherUserImage,
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

  async componentDidMount() {
    if (auth.currentUser) {
      await this.props.getUserInfo(auth.currentUser.uid).then(userInfo => {
        const userImage = userInfo.image || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg";
        const userName = userInfo.name;
        this.setState({ userImage: userImage, userName: userName });
        this.props.setInfo({userImage: userImage, userName: userName})
      });
    if (this.props.otherUser) {
      await this.props.getUserInfo(this.props.otherUser).then(otherUserInfo => {
        const otherUserImage = otherUserInfo.image || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg";
        const otherUserName = otherUserInfo.name;
        this.setState({ otherUserImage: otherUserImage, otherUserName: otherUserName });
      });}
      //this.update()
      if (this.state.conversationId) {
      this.unsubscribe = receiveMessage(this.state.conversationId, this.handleNewMessage, auth.currentUser);}
    }
    window.addEventListener("keydown", this.handleKeyDown);
    this.scrollToBottom();
  }

  componentWillUnmount() {
    if (typeof this.unsubscribe === 'function') {
        this.unsubscribe();
    }
}

  onStateChange = (e) => {
    this.setState({ msg: e.target.value });
  };

  async componentDidUpdate(prevProps) {
    if (prevProps.conversationId != this.props.conversationId) {
      //this.unsubscribe && this.unsubscribe();
      if (auth.currentUser) {
        await this.props.getUserInfo(auth.currentUser.uid).then(userInfo => {
          const userImage = userInfo.image || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg";
          const userName = userInfo.name;
          this.setState({ userImage: userImage, userName });
          this.props.setInfo({userImage: userImage, userName: userName})
        }); 
      if (this.props.otherUser) {
        await this.props.getUserInfo(this.props.otherUser).then(otherUserInfo => {
          const otherUserImage = otherUserInfo.image || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg";
          const otherUserName = otherUserInfo.name;
          this.setState({ otherUserImage: otherUserImage, otherUserName: otherUserName });
        });}}
      this.setState({ conversationId: this.props.conversationId, chat: [] }, () => {
        console.log("didupdate")
        this.unsubscribe = receiveMessage(this.state.conversationId, this.handleNewMessage, auth.currentUser);
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
                image={this.state.otherUserImage}
              />
              {/*To be modified, should be other user's name and pic*/}
              <p>{this.state.otherUserName}</p>
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
                  type={itm.msgType}
                  msg={itm.msg}
                  image={itm.image}
                  fileName = {itm.fileName}
                  timestamp = {handleTime(itm.timestamp)}
                />
              );
            })}
            <div ref={this.messagesEndRef} />
          </div>
        </div>
        {this.props.conversationId && (
        <div className="content__footer">
          <div className="sendNewMessage">
            <button className="addFiles" onClick={(e) => this.triggerFileInput()}>
              <i className="fa fa-plus"></i>
            </button>
            <input
              type="file"
              ref={this.fileInputRef}
              onChange={this.handleFileUpload}
              style={{ display:'none' }}
            />
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
        )}
        {!this.props.conversationId && (
          <div className="content__footer">
          <span> Select a Conversation to start </span>
          </div>
        )}
      </div>
    );
  }
}
