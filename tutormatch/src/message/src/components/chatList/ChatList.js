import React, { Component, useEffect, useState } from "react";
import "./chatList.css";
import ChatListItems from "./ChatListItems";
import { sendMessage, receiveMessage, createNewchat, getConversations } from "../../../../user/chat";
import { app, db, auth } from "../../../../firebase/firebaseConfig"
import { collection, addDoc, getDocs, Timestamp, updateDoc, orderBy, doc, query, getDoc, deleteDoc, onSnapshot,setDoc } from "firebase/firestore";
import { data } from "../../../../user/user_doc";

//This is the chat lists, including all the current active chats, integrate it with the previous things, maybe abandon the whole class
export default class ChatList extends Component {
  handleConversationSelect = (id) => {
    this.props.selectConversation(id);
  };
  setActiveChat = (chatId) => {
    this.setState({ activeId: chatId });
    this.handleConversationSelect(chatId);
  };
  onEmailChange = async(e) => {
    const targetEmail = e.target.value;
    //const info = await this.props.getTargetUser(targetEmail);
    this.setState( {targetEmail: targetEmail} );
  }
  handleSearchUser = async() => {
    const info = await this.props.getTargetUser(this.state.targetEmail);
    this.setState({ targetUserInfo: info})
  }
  handleAddChat = () => {
    if (this.state.currentUser && this.state.targetUserInfo) {
      try {
        this.props.createChat(this.state.currentUser, this.state.targetUserInfo.id);
        this.setState( {targetUserInfo: null} )}
      catch(error) {
        console.log("Error creating chat", error.message)
      }
  }
}


  allChatUsers = [
    {
      image:
        "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
      id: 1,
      name: "A",
      active: true,
      isOnline: true,
    },
    
  ];
  constructor(props) {
    super(props);
    this.state = {
      allChats: props.conversations && props.conversations.length > 0 ? props.conversations : [
        {
          image: "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
          id: 1,
          name: "A",
          active: true,
          isOnline: true,
        }
      ],
      activeId: null,
      targetUserInfo: null,
      targetEmail: '',
      currentUser: auth.currentUser ? auth.currentUser.uid : null
    };
    console.log(props.conversations)}
  
  componentDidUpdate(prevProps) {
    console.log("entered ww")
    if (prevProps.conversations !== this.props.conversations) {
      this.setState({
        allChats: this.props.conversations && this.props.conversations.length > 0
          ? this.props.conversations
          : this.state.allChats, 
      });
    }
  }
  

  render() {
    return (
  
      <div className="main__chatlist">
        {/*<button className="btn">
          <i className="fa fa-plus"></i>
          <span>New conversation</span>
        </button>*/}
        <div className="chatlist__heading">
          <h2>Chats</h2>
          <button className="btn-nobg">
            <i className="fa fa-ellipsis-h"></i>
          </button>
        </div>
        <div className="chatList__search">
          <div className="search_wrap">
            {/*Change this to the area for searching the user by email */}
            <input 
              type="text" 
              placeholder="Enter email to start a new conversation" required 
              onChange={this.onEmailChange}/>
            <button className="search-btn" onClick={this.handleSearchUser}>
              <i className="fa fa-search"></i>
              Search
            </button>
            {/*返回UserInfo，加一个按键问是否添加好友*/}
            {this.state.targetUserInfo && (
              <button className="add-chat-btn" onClick={this.handleAddChat}>
                Add Chat
              </button>
            )}
          </div>
        </div>
        <div className="chatlist__items">
          {Array.isArray(this.state.allChats) && this.state.allChats.map((item, index) => {
        return (
        <ChatListItems
          name={item.name}
          key={item.id}
          animationDelay={index + 1}
          active={this.state.activeId === item.id ? "active" : ""}
          isOnline={item.isOnline ? "active" : ""}
          image={item.image}
          onClick={() => this.setActiveChat(item.id)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}