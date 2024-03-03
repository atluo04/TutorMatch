import React from "react";
import "./feed.css";
import Share from "../../partials/feed/share/Share.jsx";
import Post from "../../partials/feed/post/Post.jsx"
import {Posts} from "../../data.js"

const Feed = () => {
    return (
        <div className="feed">
            <div className="feedWrapper">

             <Share />
             {Posts.map((p)=> (
                 <Post post={p} key={p.id}/>
                
             ))}

            </div>
        </div>
    )
}

export default Feed