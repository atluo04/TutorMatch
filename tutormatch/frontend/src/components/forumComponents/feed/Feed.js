import React from "react";
import "./feed.css";
import CreatePost from "../../CreatePost.js"
import { useForum } from "../forumContext.js";
import Post from "../../post/Post.js"

const Feed = () => {
  const {showCreatePost, selectedPost } = useForum();
    return (
      <div className="feedWrapper">
        <div className="feed">
          {showCreatePost ? <CreatePost /> : selectedPost ? <Post /> : null}
        </div>
        <hr className="feedHr" />
      </div>
    );
}

export default Feed