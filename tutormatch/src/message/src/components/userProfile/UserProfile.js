import React, { Component } from "react";
import "./userProfile.css";

export default class UserProfile extends Component {
  toggleInfo = (e) => {
    e.target.parentNode.classList.toggle("open");
  };
  render() {
    return (
      <div className="main__userprofile">
        <div className="profile__card user__profile__image">
          <div className="profile__image">
            <img src={this.props.userInfo && this.props.userInfo.userImage ? this.props.userInfo.userImage : "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg"} />
          </div>
          <h4>{this.props.userInfo && this.props.userInfo.userName ?  this.props.userInfo.userName: "Bruin"}</h4>
          {/*<p>CS Student</p>*/}
        </div>
        <div className="profile__card">
          <div className="card__header" onClick={this.toggleInfo}>
            <h4>Information</h4>
            <i className="fa fa-angle-down"></i>
          </div>
          <div className="card__content">
            Hello, World!
          </div>
        </div>
      </div>
    );
  }
}