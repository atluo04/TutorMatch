import React, { Component } from "react";
import { Link } from 'react-router-dom'
import "./chatList.css";
import ChatListItems from "./ChatListItems";

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
    this.setState( {targetEmail: targetEmail} );
  }
  handleSearchUser = async() => {
    const info = await this.props.getTargetUser(this.state.targetEmail);
    this.setState({ targetUserInfo: info})
  }
  handleAddChat = async() => {
    console.log('Enter',this.state.currentUser,"1", this.state.targetUserInfo,"2", !this.state.addDisabled )
    if (this.state.currentUser && this.state.targetUserInfo) {
      try {
        const result = await this.props.createChat(this.state.currentUser, this.state.targetUserInfo.id);
        const id = result.id
        const creater = result.creater
        if (creater != this.state.currentUser) {
        this.setState(prevState => ( {
          allChats: [
            ...prevState.allChats,
            {
              image: this.state.targetUserInfo.image,
              id: id,
              name: this.state.targetUserInfo.name,
              active: true,
              isOnline: false,
              unread: true,
            }
          ],
          targetUserInfo: null,
        }));}
      }
      catch(error) {
        console.log("Error creating chat", error.message)
      }
  }
}

  constructor(props) {
    super(props);
    this.state = {
      allChats: props.conversations && props.conversations.length > 0 ? props.conversations : [],
      activeId: null,
      targetUserInfo: null,
      targetEmail: '',
      currentUser: this.props.userId ? this.props.userId : null,
      addDisabled: false
    };
  }
  
  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate', this.props.chatId, prevProps.chatId)
    if (prevProps.conversations != this.props.conversations) {
      console.log("should not update")
      this.setState({
        allChats: this.props.conversations && this.props.conversations.length > 0
          ? this.props.conversations
          : this.state.allChats, 
      });
    }
    if (prevProps.chatId != this.props.chatId) {
      console.log("updated, true")
      this.props.updateLastOpen(prevProps.chatId, prevProps.userId)
      this.props.updateLastOpen(this.props.chatId, this.props.userId)
      this.setActiveChat(this.props.chatId);
    }
  }
  
  render() {
    return (
  
      <div className="main__chatlist">
        <div className="chatlist__heading">
          <h2>Chats</h2>
          <button className="btn-nobg">
            <i className="fa fa-ellipsis-h"></i>
          </button>
          <br /> 
          <Link to="/home" className="home-button" style={{ padding: '6px', backgroundColor: '#3f3aa5', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Home</Link>
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
            <br /> 
            {this.state.targetUserInfo && (
              <div className="targetInfo">
                <br /> 
              <img src={this.state.targetUserInfo.image} alt="User Avatar" className="avatar-img" />
              <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 600, fontSize: '14px', marginLeft: '10px' }}>
                {this.state.targetUserInfo.name}
              </span>
              <br /> 
              <button className="add-chat-btn" onClick={this.handleAddChat} >
                Add Chat
              </button>
              </div>
            )}
          </div>
        </div>
        <div className="chatlist__items">
          {Array.isArray(this.state.allChats) && this.state.allChats.length > 0 && this.state.allChats.map((item, index) => {
        return (
        <ChatListItems
          name={item.name}
          key={item.id}
          animationDelay={index + 1}
          active={this.state.activeId === item.id ? "active" : ""}
          isOnline={item.isOnline ? "active" : ""}
          image={item.image}
          unread={item.unread}

          onClick={() => this.setActiveChat(item.id)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}