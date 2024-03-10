import React from "react";
import Topbar from "../components/forumComponents/topbar/Topbar.js";

import Sidebar from "../components/forumComponents/sidebar/Sidebar.js";
import Feed from "../components/forumComponents/feed/Feed.js";
import "../html/Forum.css";
import { useParams } from "react-router-dom";
import { ForumProvider} from "../components/forumComponents/forumContext.js";

function Forum() {
  const {course} = useParams();
  return (
    <div>
      <ForumProvider>
        <Topbar course={course} />
        <div className="forumContainer">
          <Sidebar course={course} />
          <Feed />
        </div>
      </ForumProvider>
    </div>
  );
}

export default Forum;
