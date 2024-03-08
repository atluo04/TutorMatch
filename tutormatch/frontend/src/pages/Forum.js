import React from "react";
import Topbar from "../components/forumComponents/topbar/Topbar.js";

import Sidebar from "../components/forumComponents/sidebar/Sidebar.js";
import Feed from "../components/forumComponents/feed/Feed.js";
import "../html/Forum.css";

function Forum() {
  return (
    <div>
      <Topbar />
      <div className="forumContainer">
        <Sidebar />
        <Feed />
      </div>
    </div>
  );
}

export default Forum;
