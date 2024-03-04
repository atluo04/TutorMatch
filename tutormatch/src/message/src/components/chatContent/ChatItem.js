import React, { Component } from "react";
import Avatar from "../chatList/Avatar";
import Modal from "react-modal"

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',},
}
Modal.setAppElement('#root')

export default class ChatItem extends Component {
  constructor(props) {
    super(props);
    this.state = {modal: false};
  }

  handleClickImage = () => {
    this.setState({ modal: !this.state.modal });
  }


  renderType() {
     const { type, msg, fileName } = this.props
     if (type === "image") {
      return (
      <>
      <img src={msg} alt="Image" onClick={this.handleClickImage} style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer' }} />;
        <Modal
          isOpen = {this.state.modal}
          contentLabel = "Image Preview"
          onRequestClose= {this.handleClickImage}
          style = {customStyles} >
          <img src={msg} alt="Image" stryle={{ maxWidth: '100%' }}/>
          <br />
          <a href={msg} dowload="Download Image"> Download Image </a>
        </Modal>
      </>
    )
    }
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