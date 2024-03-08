import React, { Component, createRef} from "react";
import "./chatContent.css";
import Avatar from "./Avatar.js";
import ChatItem from "./ChatItem.js";

const handleTime = (date) => {
  const parsedDate = new Date(date)
  const now = new Date();
  const timepast = (now.getTime() - parsedDate.getTime()) / 1000;
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
    return `${new Date(parsedDate).toLocaleString('en-US')}`
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
    if (newMessage.conversationId == this.state.conversationId || !newMessage.conversationId) {
      this.setState(prevState => {
        return {
          chat: [...prevState.chat, {
              type: newMessage.sender === this.props.userId ? "me" : "other",
              msgType: newMessage.type || "text",
              fileName: newMessage.fileName || null,
              msg: newMessage.content,
              image: newMessage.sender === this.props.userId ? this.state.userImage : this.state.otherUserImage,
              timestamp: newMessage.timestamp,
              id: newMessage.id 
          }]
        };
      }, () => {
        this.scrollToBottom();
      })};
    }

    async receiveMessage (conversationId, handleAdd, userId, lastTimestamp) {
      try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/receive-messages`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  conversationId: conversationId,
                  lastTimestamp: lastTimestamp, 
              }),
          });
  
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          const val = data.value;
          let messages = [];
          let newLastTimestamp = null;
          if (data && data.success === true) {
            messages = val.newMessages || []; 
            newLastTimestamp = val.lastTimestamp;
        } else {
            messages = []; 
        }
            messages.forEach(message => {
              handleAdd(message);
            });
  
          this.timer = setTimeout(() => this.receiveMessage(conversationId, handleAdd, userId, newLastTimestamp), 5000);
      } catch (error) {
          console.error("Error receiving messages:", error);
      }
  }
  sendMessage = async (conversationId, message, user) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/send-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: conversationId,
          message: message,
          user: user
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  handleSubmit = (e, currentConversationId) => {
    e.preventDefault(); 
    if (currentConversationId && this.props.userId) {
    const { msg, chat } = this.state;
  
    this.setState((prevState) => ({
        msg: "",
    }), () => {
        this.scrollToBottom(); 
    }); 
    this.sendMessage(currentConversationId, msg, this.props.userId)
    console.log("send, msg")
  }}; 

  //call storeImage/storeFile to store the data
  storeFile = async (conversationId, file, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', conversationId);
    formData.append('user', userId);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/store-conversation-files`, {
        method: 'POST',
        body: formData, 
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Error uploading file:", error);
      return false; 
    }
  }
  handleFileUpload = async(e) => {
    const file = e.target.files[0];
    console.log(file, "file to upload")
    try {
      if (file) {
        const upload = await this.storeFile(this.state.conversationId, file, this.props.userId);
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

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  async componentDidMount() {
    if (this.props.userId) {
      if (this.props.userInfo) {
        const userImage = this.props.userInfo.userImage || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg";
        const userName = this.props.userInfo.userName;
        console.log(this.props.userInfo)
        this.setState({ userImage, userName });
        }
      if (this.props.conversations) {
        const otherUserInfo = this.props.conversations.find(conversation => 
          conversation.conversationId === this.props.conversationId
        );
        if (otherUserInfo) {
        const otherUserImage = otherUserInfo.image || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg";
        const otherUserName = otherUserInfo.name;
        this.setState({ otherUserImage: otherUserImage, otherUserName: otherUserName });
      }}
      if (this.state.conversationId) {
        this.receiveMessage(this.state.conversationId, this.handleNewMessage, this.props.userId, null);}
    }
    window.addEventListener("keydown", this.handleKeyDown);
    this.scrollToBottom();
  }


  onStateChange = (e) => {
    this.setState({ msg: e.target.value });
  };

  async componentDidUpdate(prevProps) {
    if (prevProps.conversationId != this.props.conversationId) {
      clearTimeout(this.timer);
      console.log(this.props.userInfo, '?')
      if (this.props.userId) {
        console.log(this.props.userInfo, '?')
        if (this.props.userInfo) {
          const userImage = this.props.userInfo.image || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg";
          const userName = this.props.userInfo.name;
          this.setState({ userImage:userImage, userName:userName });
          }
        
        if (this.props.conversations) {
          const otherUserInfo = this.props.conversations.find(conversation => 
            conversation.conversationId === this.props.conversationId
          );
          if (otherUserInfo) {
          const otherUserImage = otherUserInfo.image || "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg";
          const otherUserName = otherUserInfo.name;
          this.setState({ otherUserImage: otherUserImage, otherUserName: otherUserName })};
        }
      }
      this.setState({ conversationId: this.props.conversationId, chat: [] }, () => {
        this.receiveMessage(this.props.conversationId, this.handleNewMessage, this.props.userId, null);
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
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
