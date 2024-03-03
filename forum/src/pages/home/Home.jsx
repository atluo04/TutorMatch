import React from "react";
import Topbar from "../../components/topbar/Topbar.jsx";

import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Feed from "../../components/feed/Feed.jsx";
import "./home.css"

const Home = () => {
    return (
      <div>
        <Topbar />
        <div className="homeContainer">
          <Sidebar />
          <Feed />
        </div>
      </div>
    )
};

export default Home;