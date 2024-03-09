import React from "react";
import "./feed.css";
import CreatePost from "../../CreatePost.js"
import { useForum } from "../forumContext.js";

const Feed = () => {
  const {showCreatePost, selectedPost } = useForum();
    return (
      <div className="feed">
        {showCreatePost ? (
          <CreatePost />
        ) : selectedPost ? (
          <div/>  //fill this with post component later
        ) : null}
      </div>
    );
}

export default Feed