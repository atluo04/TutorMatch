import React from "react";
import "./feed.css";
import Post from "../post/Post.jsx"
import "../../html/HomeStyles.css"

const Feed = ({searchResults, look_for, onAvatarClick}) => {
        
    return (
        <div className="feed">
            <div className="feedWrapper">
            {searchResults.map((result, index) => (
                <Post post={result} key={index} look_for={look_for}
                onAvatarClick = {onAvatarClick} />
            ))}
            </div>
        </div>
    )
}

export default Feed