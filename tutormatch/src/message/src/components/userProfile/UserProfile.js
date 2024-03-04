import React, { Component } from "react";
import "./userProfile.css";

export default class UserProfile extends Component {
  toggleInfo = (e) => {
    e.target.parentNode.classList.toggle("open");
  };

  constructor(props) {
    super(props);
    this.state = {userInfo: null}
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.user != this.props.user && this.props.user) {
      const info = await this.props.getUserInfo(this.props.user);
      this.setState({ userInfo: info})
      this.props.setInfo(info)
    }
  }
  async componentDidMount() {
    if (this.props.user) {
      const info = await this.props.getUserInfo(this.props.user);
      console.log(info.major)
      this.setState({ userInfo: info })
      this.props.setInfo(info)
    }
  }

  render() {
    return (
      <div className="main__userprofile">
        <div className="profile__card user__profile__image">
          <div className="profile__image">
            <img src={this.state.userInfo && this.state.userInfo.image ? this.state.userInfo.image : "https://i.pinimg.com/236x/39/a1/eb/39a1eb1485516800d84981a72840d60e.jpg"} />
          </div>
          <h4>{this.state.userInfo && this.state.userInfo.name ?  this.state.userInfo.name: "Bruin"}</h4>
          <p>{this.state.userInfo && this.state.userInfo.major ? this.state.userInfo.major: "CS Student"}</p>
        </div>
        <div className="profile__card">
          <div className="card__header" onClick={this.toggleInfo}>
            <h4>Information</h4>
            <i className="fa fa-angle-down"></i>
          </div>
          <div className="card__content">
           {this.state.userInfo && this.state.userInfo.bio ? this.state.userInfo.bio: "Hello World!"}
          </div>
        </div>
      </div>
    );
  }
}