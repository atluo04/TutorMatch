import React from "react";
import Feed from "../../components/feed/Feed.jsx";
import "./home.css"

const Home = ({searchResults, look_for}) => {
    return (
      <div>
        <div className="homeContainer">
          <Feed searchResults={searchResults} look_for={look_for}/>
        </div>
      </div>
    )
};

export default Home;