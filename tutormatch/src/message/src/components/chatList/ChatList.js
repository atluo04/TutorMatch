import React, { Component } from "react";
import "./chatList.css";
import ChatListItems from "./ChatListItems";

export default class ChatList extends Component {
  allChatUsers = [
    {
      image:
        "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
      id: 1,
      name: "A",
      active: true,
      isOnline: true,
    },
    {
      image:
        "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
      id: 2,
      name: "B",
      active: false,
      isOnline: false,
    },
    {
      image:
        "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
      id: 3,
      name: "C",
      active: false,
      isOnline: false,
    },
    {
      image:
        "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
      id: 4,
      name: "D",
      active: false,
      isOnline: true,
    },
    {
      image:
        "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
      id: 5,
      name: "E",
      active: false,
      isOnline: false,
    },
    {
      image:
        "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
      id: 6,
      name: "F",
      active: false,
      isOnline: true,
    },
    {
      image:
        "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
      id: 7,
      name: "G",
      active: false,
      isOnline: true,
    },
    {
      image:
        "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
      id: 8,
      name: "H",
      active: false,
      isOnline: false,
    },
    {
      image:
        "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
      id: 9,
      name: "I",
      active: false,
      isOnline: true,
    },
    {
      image: "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg",
      id: 10,
      name: "J",
      active: false,
      isOnline: true,
    },
  ];
  constructor(props) {
    super(props);
    this.state = {
      allChats: this.allChatUsers,
    };
  }
  render() {
    return (
      <div className="main__chatlist">
        <button className="btn">
          <i className="fa fa-plus"></i>
          <span>New conversation</span>
        </button>
        <div className="chatlist__heading">
          <h2>Chats</h2>
          <button className="btn-nobg">
            <i className="fa fa-ellipsis-h"></i>
          </button>
        </div>
        <div className="chatList__search">
          <div className="search_wrap">
            <input type="text" placeholder="Search Here" required />
            <button className="search-btn">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>
        <div className="chatlist__items">
          {this.state.allChats.map((item, index) => {
            return (
              <ChatListItems
                name={item.name}
                key={item.id}
                animationDelay={index + 1}
                active={item.active ? "active" : ""}
                isOnline={item.isOnline ? "active" : ""}
                image={item.image}
              />
            );
          })}
        </div>
      </div>
    );
  }
}