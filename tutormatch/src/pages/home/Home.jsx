import React from "react";
import Feed from "../../components/feed/Feed.jsx";
import "./home.css"

const Home = () => {
    return (
      <div>
        <div className="homeContainer">
          <Feed />
        </div>
      </div>
    )
};

export default Home;