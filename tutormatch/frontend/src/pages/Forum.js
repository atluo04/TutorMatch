import React from "react";
import Topbar from "../components/forumComponents/topbar/Topbar.js";

import Sidebar from "../components/forumComponents/sidebar/Sidebar.js";
import Feed from "../components/forumComponents/feed/Feed.js";
import "../html/Forum.css";
import { useParams } from "react-router-dom";

function Forum() {
  const {course} = useParams();
  return (
    <div>
      <Topbar course={course}/>
      <div className="forumContainer">
        <Sidebar />
        <Feed />
      </div>
    </div>
  );
}

export default Forum;
