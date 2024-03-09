import React from "react";
import Feed from "../../components/feed/Feed.jsx";
import "./home.css"

const Home = ({searchResults, look_for, onAvatarClick}) => {
    return (
      <div>
        <div className="homeContainer">
          <Feed searchResults={searchResults} look_for={look_for} onAvatarClick={onAvatarClick}/>
        </div>
      </div>
    )
};

export default Home;