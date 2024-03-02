import React, { Component } from "react";
import Avatar from "../chatList/Avatar";

export default class ChatItem extends Component {
  constructor(props) {
    super(props);
  }

  renderType() {
     const { type, msg, fileName } = this.props
     if (type === "image") {
      return <img src={msg} alt="Image" style={{ maxWidth: '200px', maxHeight: '200px' }} />;}
     if (type === "other") {
      return <a href={msg} target="_blank" rel="noopener noreferrer">Download {fileName || "File"}</a>;
     }
     else {
      return <div className="chat__msg">{msg}</div>;
     }
  }
  render() {
    return (
      <div
        style={{ animationDelay: `0.8s` }}
        className={`chat__item ${this.props.user ? this.props.user : ""}`}
      >
        <div className="chat__item__content">
          <div className="chat__msg">{this.renderType()}</div>
          <div className="chat__meta">
            <span>{this.props.timestamp}</span>
          </div>
        </div>
        <Avatar isOnline="active" image={this.props.image} />
      </div>
    );
  }
}