import React from "react";
import "./feed.css";
import Post from "../partials/feed/post/Post.jsx"
import {Posts} from "../../tempdata.js"

const Feed = () => {
    return (
        <div className="feed">
            <div className="feedWrapper">

             {Posts.map((p)=> (
                 <Post post={p} key={p.id}/>
                
             ))}

            </div>
        </div>
    )
}

export default Feed